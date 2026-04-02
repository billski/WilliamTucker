(() => {
  const NAVY = '#1a2332';
  const GOLD = '#d4a843';
  const GOLD_LIGHT = '#e0be6a';
  const SESSION_LIMIT = 15; // max user messages per session

  const css = `
    #wts-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: ${NAVY}; border: 2px solid ${GOLD};
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      transition: transform 0.2s, background 0.2s;
    }
    #wts-chat-btn:hover { background: #243044; transform: scale(1.07); }
    #wts-chat-panel {
      position: fixed; bottom: 92px; right: 24px; z-index: 9999;
      width: 360px; max-width: calc(100vw - 48px);
      background: #fff; border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      display: flex; flex-direction: column;
      overflow: hidden; border: 1px solid #e5e7eb;
      transition: opacity 0.2s, transform 0.2s;
      max-height: 520px;
    }
    #wts-chat-panel.wts-hidden { opacity: 0; pointer-events: none; transform: translateY(12px); }
    #wts-chat-header {
      background: ${NAVY}; color: #fff;
      padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;
    }
    #wts-chat-header-text { font-family: Inter, sans-serif; font-size: 14px; font-weight: 600; }
    #wts-chat-header-sub { font-family: Inter, sans-serif; font-size: 11px; color: #9ca3af; margin-top: 2px; }
    #wts-close-btn {
      background: none; border: none; cursor: pointer; color: #9ca3af;
      padding: 4px; line-height: 1; font-size: 18px;
    }
    #wts-close-btn:hover { color: #fff; }
    #wts-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      font-family: Inter, sans-serif; font-size: 13.5px; line-height: 1.55;
      min-height: 240px;
    }
    .wts-msg { max-width: 88%; padding: 9px 13px; border-radius: 10px; }
    .wts-msg-user {
      align-self: flex-end; background: ${NAVY}; color: #fff;
      border-bottom-right-radius: 3px;
    }
    .wts-msg-assistant {
      align-self: flex-start; background: #f3f4f6; color: #1a2332;
      border-bottom-left-radius: 3px;
    }
    .wts-msg-assistant p { margin: 0 0 6px 0; }
    .wts-msg-assistant p:last-child { margin-bottom: 0; }
    .wts-msg-assistant strong { font-weight: 600; color: #1a2332; }
    .wts-msg-assistant em { font-style: italic; }
    .wts-msg-assistant .wts-h2 {
      font-weight: 700; font-size: 13px; color: #1a2332;
      margin: 10px 0 4px 0; display: block;
      border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;
    }
    .wts-msg-assistant .wts-h2:first-child { margin-top: 0; }
    .wts-msg-assistant .wts-h3 {
      font-weight: 600; font-size: 13px; color: #1a2332;
      margin: 8px 0 2px 0; display: block;
    }
    .wts-msg-assistant ul { margin: 4px 0 6px 0; padding-left: 16px; }
    .wts-msg-assistant ul:last-child { margin-bottom: 0; }
    .wts-msg-assistant li { margin-bottom: 3px; }
    .wts-msg-assistant code {
      background: #e5e7eb; border-radius: 3px;
      padding: 1px 4px; font-size: 12px; font-family: monospace;
    }
    .wts-msg-error { align-self: flex-start; background: #fee2e2; color: #991b1b; border-bottom-left-radius: 3px; }
    .wts-msg-limit {
      align-self: stretch; background: #fefce8; color: #713f12;
      border: 1px solid #fde68a; border-radius: 8px;
      padding: 10px 13px; font-size: 13px; text-align: center;
    }
    .wts-msg-limit a { color: #d4a843; font-weight: 600; text-decoration: underline; }
    .wts-typing { align-self: flex-start; padding: 10px 14px; background: #f3f4f6; border-radius: 10px; border-bottom-left-radius: 3px; }
    .wts-typing span { display: inline-block; width: 7px; height: 7px; background: #9ca3af; border-radius: 50%; margin: 0 2px; animation: wts-bounce 1.2s infinite; }
    .wts-typing span:nth-child(2) { animation-delay: 0.2s; }
    .wts-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes wts-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
    #wts-input-row {
      display: flex; gap: 8px; padding: 12px; border-top: 1px solid #e5e7eb; background: #fff;
    }
    #wts-input {
      flex: 1; border: 1px solid #d1d5db; border-radius: 8px;
      padding: 8px 12px; font-family: Inter, sans-serif; font-size: 13.5px;
      outline: none; resize: none; line-height: 1.4; max-height: 80px;
    }
    #wts-input:focus { border-color: ${GOLD}; box-shadow: 0 0 0 2px ${GOLD}33; }
    #wts-input:disabled { background: #f9fafb; color: #9ca3af; }
    #wts-send-btn {
      background: ${GOLD}; border: none; border-radius: 8px;
      width: 38px; height: 38px; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s;
    }
    #wts-send-btn:hover { background: ${GOLD_LIGHT}; }
    #wts-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    #wts-branding {
      text-align: center; font-family: Inter, sans-serif; font-size: 11px;
      color: #9ca3af; padding: 6px; background: #fff; border-top: 1px solid #f3f4f6;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Button
  const btn = document.createElement('button');
  btn.id = 'wts-chat-btn';
  btn.setAttribute('aria-label', 'Open chat');
  btn.innerHTML = `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="${GOLD}" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`;

  // Panel
  const panel = document.createElement('div');
  panel.id = 'wts-chat-panel';
  panel.classList.add('wts-hidden');
  panel.innerHTML = `
    <div id="wts-chat-header">
      <div>
        <div id="wts-chat-header-text">William Tucker Solutions</div>
        <div id="wts-chat-header-sub">Ask me anything — I usually reply instantly</div>
      </div>
      <button id="wts-close-btn" aria-label="Close chat">&times;</button>
    </div>
    <div id="wts-messages"></div>
    <div id="wts-input-row">
      <textarea id="wts-input" rows="1" placeholder="Ask about services, process, pricing..." aria-label="Chat message"></textarea>
      <button id="wts-send-btn" aria-label="Send message">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="${NAVY}" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
    <div id="wts-branding">Powered by Claude AI</div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  const messagesEl = document.getElementById('wts-messages');
  const input = document.getElementById('wts-input');
  const sendBtn = document.getElementById('wts-send-btn');
  let history = [];
  let isOpen = false;
  let userMessageCount = 0;
  let cooldown = false;

  // ── Markdown renderer ──────────────────────────────────────────
  function inlineMd(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  }

  function renderMarkdown(text) {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (const line of lines) {
      if (line.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<span class="wts-h3">${inlineMd(line.slice(4))}</span>`;
      } else if (line.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<span class="wts-h2">${inlineMd(line.slice(3))}</span>`;
      } else if (/^[-*] /.test(line)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${inlineMd(line.slice(2))}</li>`;
      } else if (line.trim() === '') {
        if (inList) { html += '</ul>'; inList = false; }
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p>${inlineMd(line)}</p>`;
      }
    }

    if (inList) html += '</ul>';
    return html;
  }
  // ──────────────────────────────────────────────────────────────

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('wts-hidden', !isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && history.length === 0) addGreeting();
    if (isOpen) setTimeout(() => input.focus(), 50);
  }

  function addGreeting() {
    appendMessage('assistant', "Hi! I'm here to answer questions about William Tucker Solutions — services, process, or anything else. What can I help you with?");
  }

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `wts-msg wts-msg-${role}`;
    if (role === 'assistant') {
      div.innerHTML = renderMarkdown(text);
    } else {
      div.textContent = text;
    }
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'wts-typing';
    div.id = 'wts-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('wts-typing-indicator')?.remove();
  }

  function showLimitMessage() {
    input.disabled = true;
    sendBtn.disabled = true;
    input.placeholder = 'Chat limit reached';
    const div = document.createElement('div');
    div.className = 'wts-msg-limit';
    div.innerHTML = `You've reached the limit for this session. Ready to talk? <a href="/contact.html">Book a free discovery call →</a>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || cooldown) return;

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    cooldown = true;

    appendMessage('user', text);
    history.push({ role: 'user', content: text });
    userMessageCount++;
    showTyping();

    try {
      const res = await fetch('https://williamtucker-production.up.railway.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      removeTyping();

      if (!res.ok || data.error) {
        const errDiv = document.createElement('div');
        errDiv.className = 'wts-msg wts-msg-error';
        errDiv.textContent = data.error || 'Something went wrong. Please try again.';
        messagesEl.appendChild(errDiv);
      } else {
        appendMessage('assistant', data.content);
        history.push({ role: 'assistant', content: data.content });
      }
    } catch {
      removeTyping();
      const errDiv = document.createElement('div');
      errDiv.className = 'wts-msg wts-msg-error';
      errDiv.textContent = 'Could not connect. Please email william@williamtucker.ca.';
      messagesEl.appendChild(errDiv);
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;

    if (userMessageCount >= SESSION_LIMIT) {
      showLimitMessage();
    } else {
      // 2-second cooldown between messages
      setTimeout(() => {
        cooldown = false;
        sendBtn.disabled = false;
        input.focus();
      }, 2000);
    }
  }

  btn.addEventListener('click', togglePanel);
  document.getElementById('wts-close-btn').addEventListener('click', togglePanel);
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });
})();
