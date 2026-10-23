
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
    if (link) link.setAttribute('aria-current', 'location')
    current = link
  }

  function update() {
    var line = (header ? header.getBoundingClientRect().height : 0) + 8
    var reached = null

    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top > line) break
      reached = headings[i]
    }

    activate(linkFor.get(reached || headings[0]))
  }

  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
})()
