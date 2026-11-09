/**
 * ==============================================================================
 * GROQ LLM SERVICE (Multi-Key Rotation & Fallback)
 * ==============================================================================
 * Features:
 * - Round-robin rotation across multiple configured Groq API keys.
 * - Automatic fallback if a key encounters HTTP 429 (rate limit) or error.
 * - Supports comma-separated keys, single keys, or numbered keys.
 * ==============================================================================
 */

// Round-robin key pointer
let currentKeyIndex = 0;

/**
 * Collect all configured Groq API keys from environment variables.
 * Supports:
 * - GROQ_API_KEYS="key1,key2,key3" (comma-separated)
 * - GROQ_API_KEY="key1"
 * - GROQ_API_KEY_1, GROQ_API_KEY_2, etc.
 *
 * @returns {string[]}
 */
export function getGroqApiKeys() {
  const keys = [];

  if (process.env.GROQ_API_KEYS) {
    const splitKeys = process.env.GROQ_API_KEYS.split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    keys.push(...splitKeys);
  }

  if (process.env.GROQ_API_KEY) {
    const singleKey = process.env.GROQ_API_KEY.trim();
    if (singleKey && !keys.includes(singleKey)) {
      keys.push(singleKey);
    }
  }

  // Collect any numbered keys GROQ_API_KEY_1, GROQ_API_KEY_2, ...
  for (let i = 1; i <= 20; i++) {
    const k = process.env[`GROQ_API_KEY_${i}`];
    if (k) {
      const trimmed = k.trim();
      if (trimmed && !keys.includes(trimmed)) {
        keys.push(trimmed);
      }
    }
  }

  return keys;
}

/**
 * Execute a Groq completion request with multi-key round-robin rotation and automatic fallback.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} [customModel]
 * @returns {Promise<{reply: string, model: string, keyIndexUsed: number, totalKeys: number}>}
 */
export async function callGroqWithRotation(messages, customModel) {
  const keys = getGroqApiKeys();

  if (keys.length === 0) {
    throw new Error('NO_GROQ_KEY_CONFIGURED');
  }

  const model = customModel || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  let attempts = 0;
  const maxAttempts = keys.length;
  let lastError = null;

  while (attempts < maxAttempts) {
    const keyIndex = (currentKeyIndex + attempts) % keys.length;
    const apiKey = keys[keyIndex];

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.4,
          max_tokens: 1200,
          top_p: 0.95,
          stream: false
        })
      });

      // Handle Rate Limiting (429) -> Rotate to next key immediately
      if (response.status === 429) {
        console.warn(`[Groq Rotation] Key #${keyIndex + 1}/${keys.length} rate-limited (429). Rotating to next key...`);
        attempts++;
        continue;
      }

      // Handle other non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg = errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        console.warn(`[Groq Rotation] Key #${keyIndex + 1}/${keys.length} error (${errorMsg}). Trying next key...`);
        lastError = new Error(errorMsg);
        attempts++;
        continue;
      }

      // Successful call! Rotate currentKeyIndex for fair round-robin distribution
      currentKeyIndex = (keyIndex + 1) % keys.length;
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;

      if (!reply) {
        throw new Error('Empty response received from Groq LLM.');
      }

      return {
        reply: reply.trim(),
        model: model,
        keyIndexUsed: keyIndex + 1,
        totalKeys: keys.length
      };
    } catch (netErr) {
      console.warn(`[Groq Rotation] Network error with key #${keyIndex + 1}: ${netErr.message}`);
      lastError = netErr;
      attempts++;
    }
  }

  throw lastError || new Error('All configured Groq API keys were exhausted, rate-limited, or failed.');
}

