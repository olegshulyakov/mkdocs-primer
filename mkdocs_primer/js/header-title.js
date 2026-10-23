
;(function () {
  var title = document.querySelector('.primer-header-title-text')
  var heading = document.querySelector('.markdown-body h1')
  if (!title || !heading) return

  var header = document.querySelector('.primer-header')
  var siteName = title.textContent
  var headingText = heading.textContent.trim()
  var showingHeading = false

  function update() {
    var line = header ? header.getBoundingClientRect().height : 0
    var past = heading.getBoundingClientRect().bottom <= line

    if (past === showingHeading) return
    showingHeading = past
    title.textContent = past ? headingText : siteName
  }

  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
})()
