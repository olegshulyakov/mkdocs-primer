// Keep the control out of the tab order until the visitor has scrolled far
// enough for returning to the document start to be useful, and only while
// they are scrolling back up -- scrolling down means they are still reading,
// not looking for the exit.

;(function () {
  var button = document.querySelector('[data-primer-back-to-top]')
  var headerLink = document.querySelector('.primer-header-title')
  // Both come from blocks a site may override, and this runs on every page.
  if (!button || !headerLink) return

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
  var lastScrollY = window.scrollY

  function updateVisibility() {
    var scrollY = window.scrollY
    button.hidden = scrollY < 400 || scrollY >= lastScrollY
    lastScrollY = scrollY
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
