import { SYSTEM_PROMPT } from '../lib/systemPrompt.js';
import { callGroqWithRotation, getGroqApiKeys } from '../lib/groqService.js';

// Re-export for server startup reporting or test suites
export { SYSTEM_PROMPT, getGroqApiKeys };

/**
 * ==============================================================================
 * AI MODE CHAT API CONTROLLER (Serverless / Express compatible)
 * ==============================================================================
 * Route: POST /api/chat
 * Payload: { message: string, history: Array<{role: string, content: string}> }
 * ==============================================================================
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Use POST.'
    });
  }

  const { message, history } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message cannot be empty.'
    });
  }

  // Allow user messages up to 4,000 characters (comfortable for pasting full JDs)
  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 4000) {
    return res.status(400).json({
      success: false,
      message: 'Message is too long (maximum 4,000 characters).'
    });
  }

  // Build message history payload with grounded system prompt
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  // Append recent valid conversation history (up to last 12 turns for rich context)
  if (Array.isArray(history)) {
    const recentHistory = history.slice(-12);
    for (const item of recentHistory) {
      if (item && typeof item === 'object') {
        const role = item.role === 'user' ? 'user' : 'assistant';
        const content = typeof item.content === 'string' ? item.content.trim() : '';
        if (content) {
          messages.push({ role, content });
        }
      }
    }
  }

  // Append the current user message
  messages.push({
    role: 'user',
    content: trimmedMessage
  });

  try {
    const result = await callGroqWithRotation(messages);
    return res.status(200).json({
      success: true,
      reply: result.reply,
      model: result.model
    });
  } catch (err) {
    console.error('Error in /api/chat:', err);

    if (err.message === 'NO_GROQ_KEY_CONFIGURED') {
      return res.status(503).json({
        success: false,
        message: 'Groq API key is not configured in .env. Please set GROQ_API_KEY (or GROQ_API_KEYS) in your server configuration.'
      });
    }

    return res.status(500).json({
      success: false,
      message: `AI service error: ${err.message || 'Unable to generate response'}. Please try again.`
    });
  }
}
