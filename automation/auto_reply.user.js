// ==UserScript==
// @name         RemoteGig X Smart Auto Reply
// @namespace    remotegig
// @version      1.0
// @description  Injects RemoteGig icon into tweet composer toolbar. Click to fill a generic reply with link.
// @match        *://x.com/*
// @match        *://twitter.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const URL = 'https://remotegig.pro/?ref=x';

  // ============ REPLY TEMPLATES ============
  // {num} = random number between 500-2000
  const TEMPLATES = [
    'We just added {num}+ new remote jobs btw, go check them out 👇\n' + URL,
    'Here you go! Browse and apply to remote jobs 👇\n' + URL,
    'Check these out! {num}+ verified remote jobs live right now 👇\n' + URL,
    'We got you! Browse all remote positions and apply here 👇\n' + URL,
    'Nice! Here\'s the full list of remote jobs, go apply 👇\n' + URL,
    'All the remote jobs are live here, updated hourly 👇\n' + URL,
    '{num}+ remote jobs from real companies, all verified. Apply here 👇\n' + URL,
    'Here\'s the link! Every remote job in one place 👇\n' + URL,
    'You\'re gonna love this. {num}+ remote jobs, all verified and updated hourly 👇\n' + URL,
    'Gotchu! Every remote job, one place. Go apply 👇\n' + URL,
    'Stop scrolling job boards. We scan thousands of career pages so you don\'t have to 👇\n' + URL,
    '{num}+ remote positions from top companies. One click apply 👇\n' + URL,
    'Looking for remote work? We aggregate every remote job on the internet 👇\n' + URL,
    'Real remote jobs only. No fake listings, no BS. Browse and apply 👇\n' + URL,
    'Every remote job. One place. Updated hourly 👇\n' + URL,
  ];

  let lastIdx = -1;

  // ============ GENERATE REPLY ============
  function generateReply() {
    let idx;
    do { idx = Math.floor(Math.random() * TEMPLATES.length); }
    while (idx === lastIdx && TEMPLATES.length > 1);
    lastIdx = idx;

    const num = Math.floor(Math.random() * 1501) + 500; // 500-2000
    return TEMPLATES[idx].replace(/\{num\}/g, String(num));
  }

  // ============ FILL REPLY + AUTO SEND ============
  function fillReply() {
    const textBox = document.querySelector('[data-testid="tweetTextarea_0"]');
    if (!textBox) return;

    const reply = generateReply();
    textBox.focus();
    try {
      const dt = new DataTransfer();
      dt.setData('text/plain', reply);
      textBox.dispatchEvent(new ClipboardEvent('paste', {
        clipboardData: dt, bubbles: true, cancelable: true,
      }));
    } catch {
      const lines = reply.split('\n');
      for (const line of lines) {
        document.execCommand('insertText', false, line);
        document.execCommand('insertText', false, '\n');
      }
    }

    // Auto-click Reply button after 500ms
    setTimeout(() => {
      // Try XPath first
      let replyBtn = document.evaluate(
        '//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div/div[3]/div[2]/div[2]/div/div/div/div[2]/div[2]/div/div/div/button',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      ).singleNodeValue;

      // Fallback to data-testid
      if (!replyBtn) {
        replyBtn = document.querySelector('[data-testid="tweetButtonInline"]') ||
                   document.querySelector('[data-testid="tweetButton"]');
      }

      if (replyBtn) {
        replyBtn.click();
        console.log('✅ RemoteGig reply sent!');
      } else {
        console.warn('⚠️ Could not find Reply button');
      }
    }, 500);
  }

  // ============ REMOTEGIG ICON (same star shape, GREEN theme) ============
  const REMOTEGIG_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-z80fyv r-19wmn03" style="color: rgb(34, 197, 94);"><g><path d="M12 1L9.5 8.5 2 12l7.5 3.5L12 23l2.5-7.5L22 12l-7.5-3.5z" fill="currentColor"/></g></svg>`;

  // ============ INJECT INTO TOOLBAR ============
  function injectButton(toolbar) {
    if (toolbar.querySelector('.remotegig-smart-reply')) return;

    const wrapper = document.createElement('div');
    wrapper.setAttribute('role', 'presentation');
    wrapper.className = 'css-175oi2r r-14tvyh0 r-cpa5s6 remotegig-smart-reply';

    const btn = document.createElement('button');
    btn.setAttribute('aria-label', 'RemoteGig Smart Reply');
    btn.setAttribute('role', 'button');
    btn.setAttribute('type', 'button');
    btn.className = 'css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-2yi16 r-1qi8awa r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l';
    btn.style.cssText = 'background-color: rgba(0, 0, 0, 0); border-color: rgba(0, 0, 0, 0); cursor: pointer;';

    const inner = document.createElement('div');
    inner.setAttribute('dir', 'ltr');
    inner.className = 'css-146c3p1 r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-bcqeeo r-1777fci';
    inner.style.color = 'rgb(34, 197, 94)';
    inner.innerHTML = REMOTEGIG_SVG;

    btn.appendChild(inner);
    wrapper.appendChild(btn);

    btn.addEventListener('mouseenter', () => { inner.style.color = '#16a34a'; });
    btn.addEventListener('mouseleave', () => { inner.style.color = 'rgb(34, 197, 94)'; });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fillReply();
    });

    toolbar.appendChild(wrapper);
  }

  // ============ OBSERVER ============
  const observer = new MutationObserver(() => {
    const toolbars = document.querySelectorAll('[data-testid="ScrollSnap-List"]');
    toolbars.forEach(toolbar => injectButton(toolbar));
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => {
    const toolbars = document.querySelectorAll('[data-testid="ScrollSnap-List"]');
    toolbars.forEach(toolbar => injectButton(toolbar));
  }, 2000);

  // Keyboard shortcut: Cmd+Shift+G (G for Gig, different from Reputo's Cmd+Shift+F)
  document.addEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey && e.key === 'g') {
      e.preventDefault();
      fillReply();
    }
  });
})();
