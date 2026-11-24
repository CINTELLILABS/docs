/*
  Search dialog: put focus back when it closes (WCAG 2.0 2.4.3) and name its
  results list (4.1.2).

  Mintlify's search dialog removes itself on Escape and leaves focus on <body>,
  so keyboard and screen reader users lose their place and the next Tab starts
  again at the skip link. When the dialog closes, this puts focus back on:
    - the control that opened it: the "Open search" button, or whatever had
      focus when Ctrl+K or Cmd+K was pressed;
    - the page's main heading, if that control is gone or nothing had focus.

  It acts only when the dialog closed without a navigation and focus was left
  on <body>. Choosing a result, opening the assistant, or clicking another
  control behaves exactly as before, and if Mintlify starts restoring focus
  itself, this does nothing.

  Defensive by design. Mintlify loads every .js file in the content directory
  on every page, after the page is interactive, so this:
    - feature-detects everything and wraps every handler in try/catch;
    - makes no network requests;
    - uses a few document-level listeners, plus a short interval that runs only
      while the search dialog is open, instead of a MutationObserver on the
      whole page (Mintlify's own advice for custom scripts).
*/
(function () {
  'use strict';
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined' || !document.addEventListener) return;
    if (window.__blandSearchFocus) return;
    window.__blandSearchFocus = true;
  } catch (e) { return; }

  var INPUT = '#search-input, [data-component-part="search-input"]';
  var DIALOG = '[data-component-part="search-modal"], [role="dialog"]';
  var TRIGGER = '[data-search-item="trigger"]';

  var pendingOpener = null; // what had focus when search was asked for
  var pendingAt = 0;
  var session = null;       // { opener, place, chosen, timer } while the dialog is open

  function guarded(fn) {
    return function () {
      try { return fn.apply(this, arguments); } catch (e) { /* never break the page */ }
    };
  }

  function visible(el) {
    return !!(el && el.isConnected && el.getClientRects && el.getClientRects().length > 0);
  }

  // Where the reader is. The search box may write its query into the URL, so
  // only a change of page or section counts as a navigation.
  function place() {
    return location.pathname + location.hash;
  }

  function openInput() {
    var el = document.querySelector(INPUT);
    return visible(el) ? el : null;
  }

  function inDialog(el) {
    return !!(el && el.closest && el.closest(DIALOG));
  }

  function blocked(el) {
    return !!(el && el.closest && el.closest('[inert], [aria-hidden="true"]'));
  }

  function focusLost() {
    var a = document.activeElement;
    return !a || a === document.body || a === document.documentElement || !a.isConnected;
  }

  function usable(el) {
    return !!(el && el !== document.body && typeof el.focus === 'function' && visible(el) && !el.disabled);
  }

  function mainHeading() {
    var h = document.querySelector('#content-area h1') || document.querySelector('main h1') || document.querySelector('h1');
    return visible(h) ? h : null;
  }

  function nameListbox(input) {
    var id = input.getAttribute('aria-controls');
    var list = id ? document.getElementById(id) : null;
    if (list && list.getAttribute('role') === 'listbox' &&
        !list.hasAttribute('aria-label') && !list.hasAttribute('aria-labelledby')) {
      list.setAttribute('aria-label', 'Search results');
    }
  }

  function restore(s, attempt) {
    if (s.chosen || place() !== s.place) return;      // a result was chosen: the new page owns focus
    if (!focusLost()) return;                         // focus already went somewhere on purpose
    var target = usable(s.opener) ? s.opener : null;
    if (!target) {
      var h = mainHeading();
      if (h) {
        if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
        target = h;
      }
    }
    if (!target) return;
    if (blocked(target) && attempt < 10) {           // the modal may still be hiding the page
      setTimeout(guarded(function () { restore(s, attempt + 1); }), 50);
      return;
    }
    if (!blocked(target)) target.focus({ preventScroll: true });
  }

  function watch() {
    var s = session;
    if (!s) return;
    var input = openInput();
    if (input) { nameListbox(input); return; }
    clearInterval(s.timer);
    session = null;
    // Give Mintlify a moment to move focus itself before deciding.
    setTimeout(guarded(function () { restore(s, 0); }), 60);
  }

  function start(opener) {
    if (session) return;
    session = { opener: opener, place: place(), chosen: false, timer: 0 };
    session.timer = setInterval(guarded(watch), 100);
    watch();
  }

  // Ctrl+K or Cmd+K: remember what had focus.
  window.addEventListener('keydown', guarded(function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K') && !inDialog(document.activeElement)) {
      pendingOpener = document.activeElement;
      pendingAt = Date.now();
    }
    // Enter on a highlighted result chooses it: leave focus to the page it opens.
    if (session && e.key === 'Enter' && e.target && e.target.matches && e.target.matches(INPUT) &&
        e.target.getAttribute('aria-activedescendant')) {
      session.chosen = true;
    }
  }), true);

  // The "Open search" button (a click also fires for Enter and Space on it).
  document.addEventListener('click', guarded(function (e) {
    var t = e.target && e.target.closest ? e.target.closest(TRIGGER) : null;
    if (t) { pendingOpener = t; pendingAt = Date.now(); }
    if (session && e.target && e.target.closest && e.target.closest('[role="option"], a[href]') && inDialog(e.target)) {
      session.chosen = true;
    }
  }), true);

  // The dialog has opened once focus arrives in its search box.
  document.addEventListener('focusin', guarded(function (e) {
    if (session || !e.target || !e.target.matches || !e.target.matches(INPUT)) return;
    var opener = (Date.now() - pendingAt < 3000) ? pendingOpener : null;
    if (!opener && e.relatedTarget && !inDialog(e.relatedTarget)) opener = e.relatedTarget;
    start(opener && opener !== document.body && opener !== document.documentElement ? opener : null);
  }), true);

  // Client-side navigation while the dialog is open: leave focus to the new page.
  window.addEventListener('mintlify:navigate', guarded(function () {
    if (session) session.chosen = true;
  }));
})();
