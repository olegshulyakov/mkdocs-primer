// Keep the control out of the tab order until the visitor has scrolled far
// enough for returning to the document start to be useful.

;(function () {
  var button = document.querySelector('[data-primer-back-to-top]')
  var headerLink = document.querySelector('.primer-header-title')
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')

  function updateVisibility() {
    button.hidden = window.scrollY < 400
  }

  button.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion && reducedMotion.matches ? 'auto' : 'smooth',
    })
    headerLink.focus({ preventScroll: true })
  })

  window.addEventListener('scroll', updateVisibility, { passive: true })
  updateVisibility()
})()
