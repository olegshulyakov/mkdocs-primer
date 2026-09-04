// The outline lists a page's headings but says nothing about where in the page
// the reader is, so on a long article it sits unchanged from the first
// paragraph to the last. This marks the entry for the heading most recently
// scrolled past, which is what makes the rail a position indicator rather than
// only a jump list.
//
// The headings are found through the outline's own links rather than by
// guessing a selector for the article, so whatever the `toc` extension chose to
// list is exactly what is tracked.

;(function () {
  var links = [].slice.call(document.querySelectorAll('.primer-toc-link'))
  if (!links.length) return

  var headings = []
  var linkFor = new Map()

  links.forEach(function (link) {
    var id = link.hash ? decodeURIComponent(link.hash.slice(1)) : ''
    var heading = id && document.getElementById(id)
    if (!heading || linkFor.has(heading)) return

    headings.push(heading)
    linkFor.set(heading, link)
  })
  if (!headings.length) return

  var header = document.querySelector('.primer-header')
  var current = null

  function activate(link) {
    if (link === current) return

    if (current) current.removeAttribute('aria-current')
    // "location" rather than "page": the reader is somewhere within this page,
    // not on a different one. The sidebar uses "page" for that.
    if (link) link.setAttribute('aria-current', 'location')
    current = link
  }

  function update() {
    // The sticky header covers the top of the viewport, so a heading counts as
    // reached once it passes under it — the same line the browser scrolls
    // fragment targets to, see `scroll-padding-top` in the stylesheet.
    var line = (header ? header.getBoundingClientRect().height : 0) + 8
    var reached = null

    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top > line) break
      reached = headings[i]
    }

    // Nothing above the line yet: the reader is in the text before the first
    // heading, which the outline has no entry of its own for. The first entry
    // is marked there rather than none, so the rail reads as a position from
    // the moment the page opens instead of only once it has been scrolled.
    activate(linkFor.get(reached || headings[0]))
  }

  // Straight off the scroll event, as back-to-top.js does. Browsers already
  // dispatch it once per frame, so throttling it through requestAnimationFrame
  // would buy nothing; the handler only reads geometry, and only for as many
  // headings as the outline lists.
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
})()
