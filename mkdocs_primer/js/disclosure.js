// Dismissal behaviour for the header popovers. A bare <details> only closes by
// clicking its own summary again: clicking elsewhere, pressing Escape or tabbing
// away all leave the panel floating over the page, and two of them can sit open
// on top of each other.

;(function () {
  var disclosures = [].slice.call(
    document.querySelectorAll(
      '.primer-search-disclosure, .primer-language-selector, .primer-nav-toggle'
    )
  )
  if (!disclosures.length) return

  function close(disclosure) {
    disclosure.open = false
  }

  // The search field sits beside its disclosure rather than inside it, so that a
  // wide header can render it with no script at all (partials/search-box.html
  // says why). The two are still one popover, and every check below has to see
  // them that way: the field is outside the <details>, so a tap on it would
  // otherwise read as a tap on the page and dismiss what it was aimed at. A
  // summary names the panel it owns with aria-controls; the other two header
  // popovers own nothing outside themselves, and this returns just the <details>.
  function panel(disclosure) {
    var summary = disclosure.querySelector('summary')
    var controls = summary && summary.getAttribute('aria-controls')
    var owned = controls && document.getElementById(controls)
    return owned ? [disclosure, owned] : [disclosure]
  }

  function holds(disclosure, node) {
    return panel(disclosure).some(function (part) {
      return part.contains(node)
    })
  }

  function openDisclosures() {
    return disclosures.filter(function (disclosure) {
      return disclosure.open
    })
  }

  disclosures.forEach(function (disclosure) {
    disclosure.addEventListener('toggle', function () {
      if (!disclosure.open) return

      // One popover at a time; they are all anchored to the same header row.
      disclosures.forEach(function (other) {
        if (other !== disclosure) close(other)
      })

      var input = panel(disclosure).reduce(function (found, part) {
        return found || part.querySelector('input[type="search"]')
      }, null)
      if (input) input.focus()
    })

    // Covers tabbing out and clicking on inert page content, both of which move
    // focus off the panel. A null relatedTarget means focus went to the body.
    // One listener per part: an event in the owned panel does not bubble through
    // the <details> it hangs off, because it is not inside it.
    panel(disclosure).forEach(function (part) {
      part.addEventListener('focusout', function (event) {
        if (disclosure.open && !holds(disclosure, event.relatedTarget)) close(disclosure)
      })
    })
  })

  document.addEventListener('pointerdown', function (event) {
    openDisclosures().forEach(function (disclosure) {
      if (!holds(disclosure, event.target)) close(disclosure)
    })
  })

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return
    openDisclosures().forEach(function (disclosure) {
      close(disclosure)
      // Escape should leave focus somewhere predictable, not on the panel that
      // just disappeared.
      disclosure.querySelector('summary').focus()
    })
  })
})()
