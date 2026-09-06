// Color-mode toggle. The stored value is applied by an inline blocking script
// in base.html; this file only handles the button and persistence.

;(function () {
  var KEY = 'mkdocs-primer-color-mode'
  var MODES = ['auto', 'light', 'dark']
  var root = document.documentElement

  // Set by base.html from the theme's translation catalog; this file is served
  // verbatim and never rendered through Jinja. The fallbacks keep the control
  // working if the template block was overridden away.
  var strings = window.primer_strings || {}
  var NAMES = {
    auto: strings.color_mode_auto || 'Automatic',
    light: strings.color_mode_light || 'Light',
    dark: strings.color_mode_dark || 'Dark',
  }
  // Mode in parentheses rather than woven into the sentence: the label is built
  // here, out of reach of the catalog, and a language that would rather put it
  // first can move the whole bracket.
  var LABEL = strings.color_mode_label || 'Change color mode (%(mode)s)'

  var buttons = [].slice.call(document.querySelectorAll('[data-primer-color-mode-toggle]'))

  function current() {
    var mode = root.getAttribute('data-color-mode')
    return MODES.indexOf(mode) === -1 ? 'auto' : mode
  }

  /*
   * Three modes cycle through one button, and until this runs the only thing
   * saying which one is showing is the icon — no help to a reader who cannot
   * see it, and no feedback at all on pressing the control. So the mode goes
   * into the accessible name, which is the channel every screen reader reads.
   *
   * Named here rather than in the template because the template does not know
   * the answer: base.html renders the mode the site configured, and the inline
   * script in its <head> may already have replaced it with the visitor's
   * stored choice before this file is fetched.
   */
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

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      apply(MODES[(MODES.indexOf(current()) + 1) % MODES.length])
    })
  })

  // Whatever the mode turned out to be once the head script had had its say.
  name(current())

  // In `auto`, the OS can change under us; re-announce so the same listeners run.
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (current() === 'auto') apply('auto')
    })
  }
})()
