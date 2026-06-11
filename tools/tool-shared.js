/**
 * ApexTools — Shared Tool Runtime
 * Provides: Theme management, Loading screen, Header/Footer injection,
 *           History panel (localStorage-backed), Header scroll behavior.
 *
 * Usage: <script src="../tool-shared.js"></script>
 *        Call window.ApexTools.init({ toolName: 'My Tool', historyKey: 'apextool_mytool' })
 */

(function (global) {
  'use strict';

  /* ── Config Defaults ────────────────────────── */
  const DEFAULTS = {
    toolName: 'Tool',
    historyKey: 'apextools_history_default',
    maxHistory: 50,
    loadingDuration: 900, // ms
    homeUrl: '../index.html',
  };

  /* ── Theme Manager ──────────────────────────── */
  const ThemeManager = {
    STORAGE_KEY: 'apextools_theme',

    get() {
      return localStorage.getItem(this.STORAGE_KEY) || 'light';
    },

    set(theme) {
      localStorage.setItem(this.STORAGE_KEY, theme);
      this.apply(theme);
    },

    apply(theme) {
      if (theme === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    },

    toggle() {
      const current = this.get();
      const next = current === 'light' ? 'dark' : 'light';
      this.set(next);
      return next;
    },

    init() {
      // Default is light
      const saved = this.get();
      this.apply(saved);
    },
  };

  /* ── History Manager ────────────────────────── */
  const HistoryManager = {
    key: DEFAULTS.historyKey,
    max: DEFAULTS.maxHistory,

    init(key, max) {
      this.key = key || this.key;
      this.max = max || this.max;
    },

    getAll() {
      try {
        return JSON.parse(localStorage.getItem(this.key) || '[]');
      } catch { return []; }
    },

    add(toolName, summary, data) {
      const records = this.getAll();
      records.unshift({
        id: Date.now(),
        tool: toolName,
        summary: summary || 'Entry',
        data: data || {},
        timestamp: new Date().toISOString(),
      });
      if (records.length > this.max) records.pop();
      localStorage.setItem(this.key, JSON.stringify(records));
      // Update badge count
      const badge = document.querySelector('.apex-history-badge');
      if (badge) badge.textContent = records.length;
      return records[0];
    },

    clear() {
      localStorage.removeItem(this.key);
      const badge = document.querySelector('.apex-history-badge');
      if (badge) badge.textContent = '0';
    },
  };

  /* ── DOM Helpers ────────────────────────────── */
  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.forEach(c => {
      if (typeof c === 'string') node.insertAdjacentHTML('beforeend', c);
      else if (c) node.appendChild(c);
    });
    return node;
  }

  /* ── SVG Icons ──────────────────────────────── */
  const Icons = {
    back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
    history: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    emptyHistory: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  };

  /* ── Loading Screen ─────────────────────────── */
  function injectLoader() {
    const loader = el('div', { class: 'apex-loader', id: 'apex-loader' }, [
      `<div class="apex-loader-logo">
        <div class="apex-loader-icon">A</div>
        <span>ApexTools</span>
      </div>
      <div class="apex-loader-bar"><div class="apex-loader-fill"></div></div>
      <div class="apex-loader-text">Loading tool…</div>`,
    ]);
    document.body.prepend(loader);
    return loader;
  }

  function hideLoader(loader, delay) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }, delay);
  }

  /* ── Inject Background Grid ─────────────────── */
  function injectBgGrid() {
    if (!document.querySelector('.apex-bg-grid')) {
      const grid = el('div', { class: 'apex-bg-grid' });
      document.body.prepend(grid);
    }
  }

  /* ── Build Header ───────────────────────────── */
  function buildHeader(config) {
    const histCount = HistoryManager.getAll().length;

    const header = el('header', { class: 'apex-header', id: 'apex-header' }, [
      `<div class="apex-header-inner">
        <a href="${config.homeUrl}" class="apex-back-home" id="apex-back-home">
          ${Icons.back}
          <span>Home</span>
        </a>

        <a href="${config.homeUrl}" class="apex-header-logo">
          <span class="apex-logo-icon">A</span>
          <span>ApexTools</span>
        </a>

        <span class="apex-tool-name">${config.toolName}</span>

        <div class="apex-header-controls">
          <button class="apex-history-btn" id="apex-history-btn" title="View history">
            ${Icons.history}
            History
            <span class="apex-history-badge">${histCount}</span>
          </button>

          <button class="apex-theme-toggle" id="apex-theme-toggle" title="Toggle theme">
            ${ThemeManager.get() === 'light' ? Icons.moon : Icons.sun}
          </button>
        </div>
      </div>`,
    ]);

    return header;
  }

  /* ── Build History Panel ────────────────────── */
  function buildHistoryPanel(config) {
    const backdrop = el('div', { class: 'apex-history-backdrop', id: 'apex-history-backdrop' });
    const panel = el('div', { class: 'apex-history-panel', id: 'apex-history-panel' }, [
      `<div class="apex-history-header">
        <h3>📋 Session History</h3>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="apex-history-clear" id="apex-history-clear">Clear all</button>
          <button class="apex-history-close" id="apex-history-close">${Icons.close}</button>
        </div>
      </div>
      <div class="apex-history-list" id="apex-history-list"></div>`,
    ]);

    document.body.append(backdrop, panel);
    renderHistoryList(config);
    return { backdrop, panel };
  }

  function renderHistoryList(config) {
    const list = document.getElementById('apex-history-list');
    const badge = document.querySelector('.apex-history-badge');
    if (!list) return;

    const records = HistoryManager.getAll();

    if (badge) badge.textContent = records.length;

    if (records.length === 0) {
      list.innerHTML = `<div class="apex-history-empty">
        ${Icons.emptyHistory}
        <p>No history yet.<br>Your activity will appear here.</p>
      </div>`;
      return;
    }

    list.innerHTML = '';
    records.forEach(r => {
      const d = new Date(r.timestamp);
      const timeStr = d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const item = el('div', { class: 'apex-history-item' }, [
        `<div class="apex-history-item-tool">${r.tool}</div>
         <div class="apex-history-item-summary">${r.summary}</div>
         <div class="apex-history-item-time">${timeStr}</div>`,
      ]);
      list.appendChild(item);
    });
  }

  /* ── Build Footer ───────────────────────────── */
  function buildFooter(config) {
    const year = new Date().getFullYear();
    return el('footer', { class: 'apex-footer' }, [
      `<div class="apex-footer-inner">
        <div class="apex-footer-top">
          <div>
            <div class="apex-footer-logo">
              <span class="apex-logo-icon">A</span>
              ApexTools
            </div>
            <p class="apex-footer-tagline">Premium micro-tools. Secure, client-side, and lightning fast.</p>
          </div>
          <div class="apex-footer-links">
            <a href="${config.homeUrl}">Home</a>
            <a href="${config.homeUrl}#directory">All Tools</a>
            <a href="${config.homeUrl}#pricing">Pricing</a>
            <a href="${config.homeUrl.replace('index.html', '')}policies/privacy.html">Privacy</a>
            <a href="${config.homeUrl.replace('index.html', '')}policies/terms.html">Terms</a>
            <a href="${config.homeUrl.replace('index.html', '')}policies/refund.html">Refunds</a>
          </div>
        </div>
        <div class="apex-footer-bottom">
          <p>© ${year} ApexTools Inc. All rights reserved.</p>
          <div class="apex-footer-legal">
            <a href="${config.homeUrl.replace('index.html', '')}policies/privacy.html">Privacy</a>
            <a href="${config.homeUrl.replace('index.html', '')}policies/terms.html">Terms</a>
            <a href="${config.homeUrl.replace('index.html', '')}policies/cookies.html">Cookies</a>
          </div>
        </div>
      </div>`,
    ]);
  }

  /* ── Wire Events ────────────────────────────── */
  function wireEvents(config) {
    // Header scroll class
    const header = document.getElementById('apex-header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    // Theme toggle
    const themeBtn = document.getElementById('apex-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const next = ThemeManager.toggle();
        themeBtn.innerHTML = next === 'light' ? Icons.moon : Icons.sun;
      });
    }

    // History open
    const histBtn = document.getElementById('apex-history-btn');
    const histPanel = document.getElementById('apex-history-panel');
    const histBackdrop = document.getElementById('apex-history-backdrop');

    function openHistory() {
      histPanel && histPanel.classList.add('open');
      histBackdrop && histBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeHistory() {
      histPanel && histPanel.classList.remove('open');
      histBackdrop && histBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (histBtn) histBtn.addEventListener('click', openHistory);
    if (histBackdrop) histBackdrop.addEventListener('click', closeHistory);

    const closeBtn = document.getElementById('apex-history-close');
    if (closeBtn) closeBtn.addEventListener('click', closeHistory);

    const clearBtn = document.getElementById('apex-history-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        HistoryManager.clear();
        renderHistoryList(config);
      });
    }
  }

  /* ── Main Init ──────────────────────────────── */
  function init(userConfig) {
    const config = Object.assign({}, DEFAULTS, userConfig);

    // Ensure homeUrl always points to right place
    // Tool files can be in root or subfolder — detect depth
    const depth = (window.location.pathname.split('/').filter(Boolean).length - 1);
    if (!userConfig || !userConfig.homeUrl || userConfig.homeUrl === 'index.html') {
      config.homeUrl = '../'.repeat(Math.max(depth, 0)) + 'index.html';
      if (depth === 0) config.homeUrl = 'index.html';
    }

    // Init theme first (avoids flash)
    ThemeManager.init();
    HistoryManager.init(config.historyKey, config.maxHistory);

    // Run after DOM is ready
    function run() {
      injectBgGrid();

      const loader = injectLoader();

      const header = buildHeader(config);
      document.body.prepend(header);

      // Wrap body content if not already wrapped
      if (!document.querySelector('.apex-main')) {
        // Find first element after header that isn't our injected ones
        const children = Array.from(document.body.children).filter(c =>
          !c.classList.contains('apex-header') &&
          !c.classList.contains('apex-bg-grid') &&
          !c.classList.contains('apex-loader') &&
          !c.classList.contains('apex-history-panel') &&
          !c.classList.contains('apex-history-backdrop') &&
          c.tagName !== 'FOOTER'
        );
        const wrapper = el('div', { class: 'apex-main' });
        if (children.length) {
          children[0].before(wrapper);
          children.forEach(c => wrapper.appendChild(c));
        }
      }

      buildHistoryPanel(config);

      // Footer - append before closing body or after main
      const existingFooter = document.querySelector('footer:not(.apex-footer)');
      if (!document.querySelector('.apex-footer')) {
        const footer = buildFooter(config);
        if (existingFooter) {
          existingFooter.replaceWith(footer);
        } else {
          document.body.appendChild(footer);
        }
      }

      wireEvents(config);

      // Page entrance animation for main content
      const mainEl = document.querySelector('.apex-main');
      if (mainEl) {
        mainEl.style.opacity = '0';
        mainEl.style.transition = 'opacity 0.5s ease';
      }

      hideLoader(loader, config.loadingDuration);

      setTimeout(() => {
        if (mainEl) {
          mainEl.style.opacity = '1';
        }
      }, config.loadingDuration + 100);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  /* ── Public API ─────────────────────────────── */
  global.ApexTools = {
    init,
    theme: ThemeManager,
    history: {
      add(toolName, summary, data) {
        HistoryManager.add(toolName, summary, data);
        // Re-render if panel is open
        const panel = document.getElementById('apex-history-panel');
        if (panel && panel.classList.contains('open')) {
          renderHistoryList({});
        }
      },
      getAll: () => HistoryManager.getAll(),
      clear: () => HistoryManager.clear(),
    },
  };

})(window);
