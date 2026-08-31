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
  }

  document.querySelectorAll('[data-primer-color-mode-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      apply(MODES[(MODES.indexOf(current()) + 1) % MODES.length])
    })
  })
})()
