// The header always names the site, which stops being useful once the reader
// has scrolled past the page's own title -- on a long article it then goes
// stale for the rest of the visit. Swapping it for the heading just scrolled
// past keeps the header a live position marker instead of a fixed label.
//
// The heading is found the same way partials/metadata.html locates it: it
// lives in the Markdown, inside page.content, where a template cannot reach.

;(function () {
  var title = document.querySelector('.primer-header-title-text')
  var heading = document.querySelector('.markdown-body h1')
  if (!title || !heading) return

  var header = document.querySelector('.primer-header')
  var siteName = title.textContent
  var headingText = heading.textContent.trim()
  var showingHeading = false

  function update() {
    // Same line toc-active.js reaches a heading at: once its bottom edge has
    // scrolled up under the sticky header, the title is no longer on screen
    // to say what the reader is looking at, so the header takes over the job.
    var line = header ? header.getBoundingClientRect().height : 0
    var past = heading.getBoundingClientRect().bottom <= line

    if (past === showingHeading) return
    showingHeading = past
    title.textContent = past ? headingText : siteName
  }

  // Straight off the scroll event, as back-to-top.js does. Browsers already
  // dispatch it once per frame, so throttling it through requestAnimationFrame
  // would buy nothing; the handler only reads geometry.
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
})()
