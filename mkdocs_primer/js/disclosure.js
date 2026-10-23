
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

      disclosures.forEach(function (other) {
        if (other !== disclosure) close(other)
      })

      var input = panel(disclosure).reduce(function (found, part) {
        return found || part.querySelector('input[type="search"]')
      }, null)
      if (input) input.focus()
    })

    panel(disclosure).forEach(function (part) {
      part.addEventListener('focusout', function (event) {
        var target = event.relatedTarget
        if (disclosure.open && target && !holds(disclosure, target)) close(disclosure)
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
      disclosure.querySelector('summary').focus()
    })
  })
})()
