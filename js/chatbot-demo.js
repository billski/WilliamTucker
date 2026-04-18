// Inline William Tucker Solutions chatbot for small-business.html.
// Same backend as the floating widget (js/chatbot.js) — rendered inline for
// prominence so visitors can try the chatbot without opening the floating panel.
(() => {
  const root = document.getElementById('wts-smb-demo-root');
  if (!root) return;

  const NAVY = '#1a2332';
  const GOLD = '#d4a843';
  const SESSION_LIMIT = 12;
  const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const API_URL = IS_LOCAL ? '/api/chat' : 'https://williamtucker-production.up.railway.app/api/chat';

  const css = `
    #wts-demo-wrap {
      background: #0f1824; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; overflow: hidden;
      display: flex; flex-direction: column;
      font-family: Inter, system-ui, sans-serif;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    #wts-demo-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 18px; background: #1a2332;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    #wts-demo-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: ${GOLD}; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
      font-weight: 700; color: ${NAVY}; font-size: 14px;
    }
    #wts-demo-title { color: #fff; font-size: 14px; font-weight: 600; line-height: 1.2; }
    #wts-demo-sub { color: #4ade80; font-size: 11px; margin-top: 2px; }
    #wts-demo-tag {
      margin-left: auto; background: rgba(212,168,67,0.15); color: ${GOLD};
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; padding: 4px 8px; border-radius: 10px;
    }
    #wts-demo-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      font-size: 13.5px; line-height: 1.55;
      min-height: 260px; max-height: 360px;
      background: #0f1824;
    }
    .wts-demo-msg { max-width: 85%; padding: 9px 13px; border-radius: 12px; }
    .wts-demo-msg-user {
      align-self: flex-end; background: rgba(255,255,255,0.08);
      color: #e5e7eb; border-bottom-right-radius: 3px;
    }
    .wts-demo-msg-assistant {
      align-self: flex-start; background: rgba(212,168,67,0.18);
      color: #f3f4f6; border-bottom-left-radius: 3px;
    }
    .wts-demo-msg-assistant p { margin: 0 0 6px 0; }
    .wts-demo-msg-assistant p:last-child { margin-bottom: 0; }
    .wts-demo-msg-assistant strong { font-weight: 600; color: #fff; }
    .wts-demo-msg-assistant ul { margin: 4px 0 6px 0; padding-left: 16px; }
    .wts-demo-msg-assistant ul:last-child { margin-bottom: 0; }
    .wts-demo-msg-assistant li { margin-bottom: 3px; }
    .wts-demo-msg-assistant code { background: rgba(0,0,0,0.3); border-radius: 3px; padding: 1px 4px; font-size: 12px; }
    .wts-demo-msg-error { align-self: flex-start; background: rgba(239,68,68,0.2); color: #fecaca; }
    .wts-demo-msg-limit {
      align-self: stretch; background: rgba(212,168,67,0.1);
      border: 1px solid rgba(212,168,67,0.3); color: #e5e7eb;
      border-radius: 8px; padding: 10px 13px; font-size: 12.5px; text-align: center;
    }
    .wts-demo-msg-limit a { color: ${GOLD}; font-weight: 600; text-decoration: underline; }
    .wts-demo-typing {
      align-self: flex-start; padding: 10px 14px;
      background: rgba(212,168,67,0.18); border-radius: 12px;
      border-bottom-left-radius: 3px;
    }
    .wts-demo-typing span {
      display: inline-block; width: 7px; height: 7px;
      background: #d4a843; border-radius: 50%; margin: 0 2px;
      animation: wts-demo-bounce 1.2s infinite;
    }
    .wts-demo-typing span:nth-child(2) { animation-delay: 0.2s; }
    .wts-demo-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes wts-demo-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
    #wts-demo-suggest {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 0 16px 8px 16px; background: #0f1824;
    }
    .wts-demo-chip {
      font-size: 11.5px; color: ${GOLD};
      background: rgba(212,168,67,0.08);
      border: 1px solid rgba(212,168,67,0.3);
      border-radius: 999px; padding: 5px 10px;
      cursor: pointer; font-family: inherit;
    }
    .wts-demo-chip:hover { background: rgba(212,168,67,0.18); }
    #wts-demo-input-row {
      display: flex; gap: 8px; padding: 12px;
      border-top: 1px solid rgba(255,255,255,0.1);
      background: #141f2e;
    }
    #wts-demo-input {
      flex: 1; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px; padding: 9px 12px;
      color: #f3f4f6; font-family: inherit; font-size: 13.5px;
      outline: none; resize: none; line-height: 1.4; max-height: 80px;
    }
    #wts-demo-input::placeholder { color: #6b7280; }
    #wts-demo-input:focus {
      border-color: ${GOLD};
      box-shadow: 0 0 0 2px rgba(212,168,67,0.2);
    }
    #wts-demo-input:disabled { opacity: 0.5; cursor: not-allowed; }
    #wts-demo-send {
      background: ${GOLD}; border: none; border-radius: 8px;
      width: 38px; height: 38px; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    #wts-demo-send:hover { background: #e0be6a; }
    #wts-demo-send:disabled { opacity: 0.5; cursor: not-allowed; }
    #wts-demo-footer {
      padding: 8px 14px; background: #141f2e;
      border-top: 1px solid rgba(255,255,255,0.06);
      color: #9ca3af; font-size: 10.5px; text-align: center;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  root.innerHTML = `
    <div id="wts-demo-wrap">
      <div id="wts-demo-header">
        <div id="wts-demo-avatar">WT</div>
        <div>
          <div id="wts-demo-title">William Tucker Solutions</div>
          <div id="wts-demo-sub">&#9679; Online &middot; usually replies instantly</div>
        </div>
        <div id="wts-demo-tag">Live Chatbot</div>
      </div>
      <div id="wts-demo-messages" role="log" aria-live="polite"></div>
      <div id="wts-demo-suggest">
        <button class="wts-demo-chip" data-q="What services do you offer for small businesses?">Services for small business</button>
        <button class="wts-demo-chip" data-q="How does the Quick Win package work?">Quick Win package</button>
        <button class="wts-demo-chip" data-q="Can you build a chatbot like this for my business?">Build one for my business</button>
        <button class="wts-demo-chip" data-q="What's your background and experience?">Background &amp; experience</button>
      </div>
      <div id="wts-demo-input-row">
        <textarea id="wts-demo-input" rows="1" placeholder="Ask about services, pricing, process, experience..." aria-label="Message"></textarea>
        <button id="wts-demo-send" aria-label="Send">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="${NAVY}" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div id="wts-demo-footer">Powered by Claude &middot; Built by William Tucker Solutions</div>
    </div>
  `;

  const messagesEl = document.getElementById('wts-demo-messages');
  const input = document.getElementById('wts-demo-input');
  const sendBtn = document.getElementById('wts-demo-send');
  const suggestEl = document.getElementById('wts-demo-suggest');
  let history = [];
  let userMessageCount = 0;
  let cooldown = false;

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
      if (/^[-*] /.test(line)) {
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

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `wts-demo-msg wts-demo-msg-${role}`;
    if (role === 'assistant') div.innerHTML = renderMarkdown(text);
    else div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'wts-demo-typing';
    div.id = 'wts-demo-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('wts-demo-typing-indicator')?.remove();
  }

  function showLimitMessage() {
    input.disabled = true;
    sendBtn.disabled = true;
    input.placeholder = 'Demo limit reached';
    suggestEl.style.display = 'none';
    const div = document.createElement('div');
    div.className = 'wts-demo-msg-limit';
    div.innerHTML = `Chat limit reached. Want one like this on your site? <a href="/contact.html">Book a free call &rarr;</a>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage(text) {
    const content = (text || input.value).trim();
    if (!content || cooldown) return;

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    cooldown = true;

    if (userMessageCount === 0) suggestEl.style.display = 'none';
    appendMessage('user', content);
    history.push({ role: 'user', content });
    userMessageCount++;
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      removeTyping();
      if (!res.ok || data.error) {
        const err = document.createElement('div');
        err.className = 'wts-demo-msg wts-demo-msg-error';
        err.textContent = data.error || 'Something went wrong. Please try again.';
        messagesEl.appendChild(err);
      } else {
        appendMessage('assistant', data.content);
        history.push({ role: 'assistant', content: data.content });
      }
    } catch {
      removeTyping();
      const err = document.createElement('div');
      err.className = 'wts-demo-msg wts-demo-msg-error';
      err.textContent = 'Could not connect. Try again in a moment.';
      messagesEl.appendChild(err);
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;

    if (userMessageCount >= SESSION_LIMIT) {
      showLimitMessage();
    } else {
      setTimeout(() => { cooldown = false; sendBtn.disabled = false; input.focus(); }, 1500);
    }
  }

  // Greeting
  appendMessage('assistant', "Hi! I'm the assistant for William Tucker Solutions. Ask me about services, pricing, process, or William's background — I'm happy to help.");

  sendBtn.addEventListener('click', () => sendMessage());
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });
  suggestEl.addEventListener('click', e => {
    const btn = e.target.closest('.wts-demo-chip');
    if (btn) sendMessage(btn.dataset.q);
  });
})();
