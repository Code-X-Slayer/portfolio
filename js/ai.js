/**
 * ==============================================================================
 * VIJAY KARTHIK AI — INTERACTIVE CHAT CLIENT SCRIPT
 * ==============================================================================
 * Features:
 * - Proper Markdown rendering via marked.js (headings, lists, code blocks, bold, links)
 * - Progressive natural typing effect (ChatGPT-style animation)
 * - Multi-turn session conversation history
 * - Groq LLM API communication via secure backend (/api/chat)
 * - Auto-expanding input & keyboard shortcuts
 * - Suggested question chip interactions
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------------------------
  // 1. CONFIGURE MARKED.JS (If loaded)
  // ----------------------------------------------------------------------------
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      gfm: true,
      breaks: true,
      mangle: false,
      headerIds: false
    });
  }

  // ----------------------------------------------------------------------------
  // 2. DOM REFERENCES & SESSION STATE
  // ----------------------------------------------------------------------------
  const chatViewport = document.getElementById('chat-viewport');
  const messagesList = document.getElementById('messages-list');
  const welcomeState = document.getElementById('welcome-state');
  const typingIndicator = document.getElementById('typing-indicator');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const suggestionChips = document.querySelectorAll('.ai-chip');

  // In-session conversation history: array of { role: 'user' | 'assistant', content: string }
  let conversationHistory = [];
  let isSubmitting = false;

  // Track any active typing animation so it can be completed instantly if needed
  let activeTypingFinisher = null;

  // ----------------------------------------------------------------------------
  // 3. MARKDOWN RENDERING HELPER (with Fallback)
  // ----------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function fallbackMarkdown(rawText) {
    if (!rawText) return '';
    let text = escapeHtml(rawText);

    // Code blocks
    text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headings
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold & Italic
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Links
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 &nearr;</a>');

    // Paragraphs & Lists
    const blocks = text.split(/\n{2,}/);
    return blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<pre>') || trimmed.startsWith('<h')) return trimmed;

      const lines = trimmed.split('\n');
      const isBullet = lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
      if (isBullet) {
        return `<ul>${lines.map(l => `<li>${l.trim().replace(/^[-*]\s+/, '')}</li>`).join('')}</ul>`;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).filter(Boolean).join('');
  }

  function renderMarkdownSafely(text) {
    if (!text) return '';
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
      try {
        return marked.parse(text);
      } catch (err) {
        console.warn('Marked parse error, using fallback:', err);
      }
    }
    return fallbackMarkdown(text);
  }

  // ----------------------------------------------------------------------------
  // 4. SCROLL HELPER
  // ----------------------------------------------------------------------------
  function scrollToBottom(smooth = true) {
    if (!chatViewport) return;
    chatViewport.scrollTo({
      top: chatViewport.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }

  // ----------------------------------------------------------------------------
  // 5. MESSAGE ACTION BAR (Copy Button)
  // ----------------------------------------------------------------------------
  function createMessageActions(textToCopy) {
    const actions = document.createElement('div');
    actions.className = 'msg-actions';

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'copy-msg-btn';
    copyBtn.setAttribute('title', 'Copy response to clipboard');
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy</span>
    `;

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        copyBtn.innerHTML = `<span>✓ Copied!</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          `;
        }, 2000);
      } catch (err) {
        console.warn('Clipboard copy failed:', err);
      }
    });

    actions.appendChild(copyBtn);
    return actions;
  }

  // ----------------------------------------------------------------------------
  // 6. MESSAGE RENDERING (User & Assistant with Typing Effect)
  // ----------------------------------------------------------------------------
  function appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'ai-msg-row user-msg';

    const bubble = document.createElement('div');
    bubble.className = 'user-bubble';
    bubble.textContent = text;

    row.appendChild(bubble);
    messagesList.appendChild(row);
    scrollToBottom();
  }

  /**
   * Appends assistant message with a progressive typing effect and proper Markdown
   */
  function appendAssistantMessage(fullText, isError = false) {
    // If an earlier typing animation is still running, finish it immediately
    if (activeTypingFinisher) {
      activeTypingFinisher();
      activeTypingFinisher = null;
    }

    const row = document.createElement('div');
    row.className = 'ai-msg-row assistant-msg';

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'ai-msg-avatar';
    avatar.textContent = 'VK';

    // Bubble
    const bubble = document.createElement('div');
    bubble.className = 'assistant-bubble';
    if (isError) {
      bubble.style.borderLeftColor = '#EF4444';
      bubble.style.backgroundColor = '#FEF2F2';
    }

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'assistant-content';
    bubble.appendChild(contentDiv);

    row.appendChild(avatar);
    row.appendChild(bubble);
    messagesList.appendChild(row);
    scrollToBottom();

    // Errors render immediately without typing animation
    if (isError) {
      contentDiv.innerHTML = renderMarkdownSafely(fullText);
      isSubmitting = false;
      if (sendBtn) sendBtn.disabled = false;
      if (chatInput) chatInput.focus();
      return;
    }

    // --- Progressive Natural Typing Animation (ChatGPT Style) ---
    const totalLength = fullText.length;
    let currentIndex = 0;

    // Dynamic chunking for a responsive, lively pace:
    // Short texts (<300 chars): 2-3 chars per frame
    // Long texts (>1000 chars): 6-12 chars per frame, finishes in ~1.5 - 2.5s
    const targetFrames = 55;
    const chunkSize = Math.max(2, Math.ceil(totalLength / targetFrames));
    const stepInterval = 18; // 18ms per tick (~55fps)

    let typingTimer = null;
    let isCompleted = false;

    function finishTyping() {
      if (isCompleted) return;
      isCompleted = true;
      if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
      }
      activeTypingFinisher = null;

      // Render full final markdown without cursor
      contentDiv.innerHTML = renderMarkdownSafely(fullText);
      scrollToBottom();

      // Append action bar (Copy button)
      const actions = createMessageActions(fullText);
      bubble.appendChild(actions);

      // Re-enable input
      isSubmitting = false;
      if (sendBtn) sendBtn.disabled = false;
      if (chatInput) chatInput.focus();

      bubble.style.cursor = 'default';
      bubble.removeAttribute('title');
    }

    // Register active finisher
    activeTypingFinisher = finishTyping;

    // Allow user to click the bubble to finish typing instantly
    bubble.style.cursor = 'pointer';
    bubble.title = 'Click to display full message instantly';
    const clickToComplete = () => {
      finishTyping();
      bubble.removeEventListener('click', clickToComplete);
    };
    bubble.addEventListener('click', clickToComplete);

    typingTimer = setInterval(() => {
      currentIndex += chunkSize;

      if (currentIndex >= totalLength) {
        finishTyping();
        bubble.removeEventListener('click', clickToComplete);
        return;
      }

      // Slice partial markdown and parse progressively
      const partialText = fullText.slice(0, currentIndex);
      const parsedHtml = renderMarkdownSafely(partialText);
      contentDiv.innerHTML = parsedHtml + '<span class="typing-cursor" aria-hidden="true"></span>';
      scrollToBottom();
    }, stepInterval);
  }

  // ----------------------------------------------------------------------------
  // 7. SEND MESSAGE & API INTEGRATION
  // ----------------------------------------------------------------------------
  async function sendMessage(rawText) {
    const text = (rawText || '').trim();
    if (!text || isSubmitting) return;

    // If an earlier typing animation is running, finish it now
    if (activeTypingFinisher) {
      activeTypingFinisher();
      activeTypingFinisher = null;
    }

    isSubmitting = true;

    // Hide welcome card upon first message
    if (welcomeState && !welcomeState.classList.contains('is-hidden')) {
      welcomeState.style.display = 'none';
      welcomeState.classList.add('is-hidden');
    }

    // Render user message in UI
    appendUserMessage(text);

    // Save into session conversation history
    conversationHistory.push({ role: 'user', content: text });

    // Reset input field
    chatInput.value = '';
    chatInput.style.height = 'auto';
    if (sendBtn) sendBtn.disabled = true;

    // Show typing loading indicator
    if (typingIndicator) {
      typingIndicator.classList.remove('is-hidden');
      scrollToBottom();
    }

    try {
      // POST to backend Groq LLM endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          // Send conversation history up to previous turn
          history: conversationHistory.slice(0, -1)
        })
      });

      const data = await response.json().catch(() => null);

      // Hide typing indicator
      if (typingIndicator) {
        typingIndicator.classList.add('is-hidden');
      }

      if (response.ok && data && data.success && data.reply) {
        const reply = data.reply;
        // Append assistant message with progressive typing effect
        appendAssistantMessage(reply);
        // Save assistant reply into conversation history
        conversationHistory.push({ role: 'assistant', content: reply });
      } else {
        // Backend error response
        const errorMsg = data?.message || `Server error (HTTP ${response.status})`;
        appendAssistantMessage(`⚠️ **Unable to complete response:** ${errorMsg}`, true);
      }
    } catch (networkError) {
      console.error('Fetch error calling /api/chat:', networkError);
      if (typingIndicator) {
        typingIndicator.classList.add('is-hidden');
      }
      appendAssistantMessage('⚠️ **Connection error:** Could not reach the backend AI service. Please make sure the server is running (`npm start`) and try again.', true);
    }
  }

  // ----------------------------------------------------------------------------
  // 8. EVENT LISTENERS
  // ----------------------------------------------------------------------------

  // Form Submission
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage(chatInput.value);
    });
  }

  // Keyboard shortcut: Enter to send, Shift+Enter for new line
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(chatInput.value);
      }
    });

    // Auto-growing textarea height (supports expanding for large pasted job descriptions)
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 220) + 'px';
    });
  }

  // Suggestion Chips Click
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        sendMessage(prompt);
      }
    });
  });

  // Clear Chat / Start Fresh
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      if (conversationHistory.length === 0) return;

      const confirmClear = confirm('Start a fresh conversation? This will clear current chat history.');
      if (confirmClear) {
        if (activeTypingFinisher) {
          activeTypingFinisher();
          activeTypingFinisher = null;
        }
        conversationHistory = [];
        messagesList.innerHTML = '';
        if (welcomeState) {
          welcomeState.style.display = 'block';
          welcomeState.classList.remove('is-hidden');
        }
        if (chatInput) {
          chatInput.value = '';
          chatInput.focus();
        }
        scrollToBottom(false);
      }
    });
  }

  // Focus input automatically on load
  if (chatInput) {
    chatInput.focus();
  }

});
