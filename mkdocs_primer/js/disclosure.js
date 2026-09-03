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

      var input = disclosure.querySelector('input[type="search"]')
      if (input) input.focus()
    })

    // Covers tabbing out and clicking on inert page content, both of which move
    // focus off the panel. A null relatedTarget means focus went to the body.
    disclosure.addEventListener('focusout', function (event) {
      if (disclosure.open && !disclosure.contains(event.relatedTarget)) close(disclosure)
    })
  })

  document.addEventListener('pointerdown', function (event) {
    openDisclosures().forEach(function (disclosure) {
      if (!disclosure.contains(event.target)) close(disclosure)
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
