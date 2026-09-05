// In the rail the outline is a column of its own and costs the article nothing.
// In the flow it stands between the title and the first paragraph, and on a
// phone that is most of the first screen — so there it is a disclosure the
// reader opens, which is what GitHub's documentation does at the same width.
//
// Only the `auto` mode is touched. `expanded` and `collapsed` are the author
// asking for one shape at every width, and the template gives them what they
// asked for; `auto` is the one that already changes with the window, and the
// class the template puts on it for the rail is what tells them apart.
//
// The shape is decided once, as the placement in partials/toc.html is: by the
// time this runs, an outline that belongs in the rail is still sitting in the
// column, and one that does not has been moved into the article. Reading the
// rail flag afterwards therefore answers the question either way.

;(function () {
  var toc = document.querySelector('section.primer-toc.primer-toc-in-rail')
  if (!toc) return
  if (getComputedStyle(toc).getPropertyValue('--primer-toc-rail').trim() === '1') return

  var heading = toc.querySelector(':scope > .primer-toc-heading')
  var nav = toc.querySelector(':scope > nav')
  if (!heading || !nav) return

  // The same shape the `collapsed` mode renders, built as a button rather than
  // a <summary> because the outline is a <section>: turning it into a <details>
  // would move the list out of the element the placement script left it in.
  var button = document.createElement('button')
  button.type = 'button'
  button.className = 'primer-toc-summary primer-toc-toggle'
  button.setAttribute('aria-expanded', 'false')
  button.textContent = heading.textContent.trim()

  // The nav is named by this text through aria-labelledby, so the id has to
  // come along with it; aria-controls then says which list the button opens.
  button.id = heading.id
  if (!nav.id) nav.id = 'primer-toc-nav'
  button.setAttribute('aria-controls', nav.id)

  button.addEventListener('click', function () {
    var collapsed = toc.hasAttribute('data-primer-toc-collapsed')

    if (collapsed) {
      toc.removeAttribute('data-primer-toc-collapsed')
    } else {
      toc.setAttribute('data-primer-toc-collapsed', '')
    }
    button.setAttribute('aria-expanded', collapsed ? 'true' : 'false')
  })

  toc.setAttribute('data-primer-toc-collapsed', '')
  heading.replaceWith(button)
})()
