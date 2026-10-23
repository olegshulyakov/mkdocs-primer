
;(function () {
  var button = document.querySelector('[data-primer-back-to-top]')
  var headerLink = document.querySelector('.primer-header-title')
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
