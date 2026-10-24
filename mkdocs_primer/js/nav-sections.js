
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
    if (!header || !label || !items) return

    var button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('aria-expanded', section.hasAttribute('data-primer-nav-open') ? 'true' : 'false')

    if (!items.id) items.id = 'primer-nav-section-' + index
    button.setAttribute('aria-controls', items.id)

    button.addEventListener('click', function () {
      toggle(section, button)
    })

    if (label.tagName === 'A') {
      button.className = 'primer-nav-section-toggle'
      button.setAttribute('aria-label', label.textContent.trim())
      header.appendChild(button)
    } else {
      button.className = 'primer-nav-section-row'
      header.insertBefore(button, label)
      button.appendChild(label)
    }
  })
})()
