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

  sections.forEach(function (section, index) {
    var header = section.querySelector(':scope > .primer-nav-section-header')
    var label = header && header.querySelector(':scope > .primer-nav-section-label')
    var items = section.querySelector(':scope > .primer-nav-section-items')
    if (!header || !label) return

    var button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('aria-expanded', section.hasAttribute('data-primer-nav-open') ? 'true' : 'false')

    // Which list the aria-expanded above is about. The nav is rendered twice on
    // a page, so a number taken from a section's position within its own copy
    // would collide with the same position in the other; this one is counted
    // over the whole document, both copies included, so it cannot.
    if (items) {
      if (!items.id) items.id = 'primer-nav-section-' + index
      button.setAttribute('aria-controls', items.id)
    }

    button.addEventListener('click', function () {
      toggle(section, button)
    })

    if (label.tagName === 'A') {
      // mkdocs-section-index folded a page into this section, so the label is a
      // link, and a link cannot be nested inside a button. Opening the section
      // is a second action on the row, and needs a control of its own.
      button.className = 'primer-nav-section-toggle'
      // The section's own name, so the control reads as "Guide, collapsed"
      // rather than needing a phrase of its own in every catalog.
      button.setAttribute('aria-label', label.textContent.trim())
      header.appendChild(button)
    } else {
      // Nothing else in the row does anything, so the row is the button: the
      // label moves inside it, which both names the control and makes the whole
      // of it — the chevron included — the thing the reader clicks.
      button.className = 'primer-nav-section-row'
      header.insertBefore(button, label)
      button.appendChild(label)
    }
  })
})()
