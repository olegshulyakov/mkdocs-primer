// Every section of the navigation used to be expanded at once, which on a site
// with many pages is a wall of links with no way to tell which part of it the
// reader is in. A section now opens only when it holds the current page, and a
// toggle lets the reader open the rest.
//
// The button is built here rather than in the template because without this
// script it would be a control that does nothing: the template renders the
// section fully expanded, and the stylesheet only collapses it once the
// document has been marked scriptable. `data-primer-nav-open` on the section
// is the single source of that state — the stylesheet reads it, this moves it.

;(function () {
  var sections = [].slice.call(document.querySelectorAll('.primer-nav-section'))
  if (!sections.length) return

  function toggle(section, button) {
    var open = !section.hasAttribute('data-primer-nav-open')

    if (open) {
      section.setAttribute('data-primer-nav-open', '')
    } else {
      section.removeAttribute('data-primer-nav-open')
    }
    button.setAttribute('aria-expanded', open ? 'true' : 'false')
  }

  sections.forEach(function (section) {
    var header = section.querySelector(':scope > .primer-nav-section-header')
    var label = header && header.querySelector(':scope > .primer-nav-section-label')
    if (!header || !label) return

    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'primer-nav-section-toggle'
    // The section's own name, so the control reads as "Guide, collapsed" rather
    // than needing a phrase of its own in every catalog.
    button.setAttribute('aria-label', label.textContent.trim())
    button.setAttribute('aria-expanded', section.hasAttribute('data-primer-nav-open') ? 'true' : 'false')

    button.addEventListener('click', function () {
      toggle(section, button)
    })

    header.appendChild(button)
  })
})()
