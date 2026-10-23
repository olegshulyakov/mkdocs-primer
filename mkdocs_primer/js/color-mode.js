
;(function () {
  var KEY = 'mkdocs-primer-color-mode'
  var MODES = ['auto', 'light', 'dark']
  var root = document.documentElement

  var strings = window.primer_strings || {}
  var NAMES = {
    auto: strings.color_mode_auto || 'Automatic',
    light: strings.color_mode_light || 'Light',
    dark: strings.color_mode_dark || 'Dark',
  }
  var LABEL = strings.color_mode_label || 'Change color mode (%(mode)s)'

  var buttons = [].slice.call(document.querySelectorAll('[data-primer-color-mode-toggle]'))

  function current() {
    var mode = root.getAttribute('data-color-mode')
    return MODES.indexOf(mode) === -1 ? 'auto' : mode
  }

  function name(mode) {
    var text = LABEL.replace('%(mode)s', NAMES[mode] || NAMES.auto)
    buttons.forEach(function (button) {
      button.setAttribute('aria-label', text)
      button.setAttribute('title', text)
    })
  }

  function apply(mode) {
    root.setAttribute('data-color-mode', mode)
    name(mode)
    try {
      localStorage.setItem(KEY, mode)
    } catch (e) {
    }
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

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      apply(MODES[(MODES.indexOf(current()) + 1) % MODES.length])
    })
  })

  name(current())

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (current() === 'auto') apply('auto')
    })
  }
})()
