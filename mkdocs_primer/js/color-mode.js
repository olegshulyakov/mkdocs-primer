// Color-mode toggle. The stored value is applied by an inline blocking script
// in base.html; this file only handles the button and persistence.

;(function () {
  var KEY = 'mkdocs-primer-color-mode'
  var MODES = ['auto', 'light', 'dark']
  var root = document.documentElement

  function current() {
    var mode = root.getAttribute('data-color-mode')
    return MODES.indexOf(mode) === -1 ? 'auto' : mode
  }

  function apply(mode) {
    root.setAttribute('data-color-mode', mode)
    try {
      localStorage.setItem(KEY, mode)
    } catch (e) {
      // Private browsing, or storage disabled — the mode still applies for this page.
    }
    // CSS follows the attribute on its own. Anything that paints its own colors
    // from JavaScript — a rendered diagram, a chart — cannot, so announce the
    // change for those to pick up.
    document.dispatchEvent(
      new CustomEvent('primer:color-mode-change', {
        detail: { mode: mode, resolved: resolve(mode) },
      })
    )
  }

  function resolve(mode) {
    if (mode !== 'auto') return mode
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  document.querySelectorAll('[data-primer-color-mode-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      apply(MODES[(MODES.indexOf(current()) + 1) % MODES.length])
    })
  })

  // In `auto`, the OS can change under us; re-announce so the same listeners run.
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (current() === 'auto') apply('auto')
    })
  }
})()
