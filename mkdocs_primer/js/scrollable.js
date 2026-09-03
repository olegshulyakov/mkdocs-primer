// A code block or table wider than its column scrolls sideways, but a <pre> is
// not focusable, so without a tab stop the overflowing part is reachable only
// with a pointer. This is what axe-core reports as scrollable-region-focusable.
//
// The tab stop is added only while the element actually overflows, so a narrow
// block does not clutter the tab order, and it is re-checked on resize because
// the same block overflows at one viewport width and not another.

;(function () {
  var regions = [].slice.call(document.querySelectorAll('.markdown-body pre, .markdown-body table'))
  if (!regions.length) return

  function update(region) {
    var scrollable = region.scrollWidth > region.clientWidth
    if (scrollable === region.hasAttribute('tabindex')) return

    if (scrollable) {
      region.setAttribute('tabindex', '0')
    } else {
      region.removeAttribute('tabindex')
    }
  }

  regions.forEach(update)

  if (window.ResizeObserver) {
    var observer = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        update(entry.target)
      })
    })
    regions.forEach(function (region) {
      observer.observe(region)
    })
  } else {
    window.addEventListener('resize', function () {
      regions.forEach(update)
    })
  }
})()
