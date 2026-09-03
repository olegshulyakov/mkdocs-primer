(function () {
  var disclosure = document.querySelector('.primer-search-disclosure')
  if (!disclosure) return

  disclosure.addEventListener('toggle', function () {
    if (disclosure.open) {
      disclosure.querySelector('input[type="search"]').focus()
    }
  })
})()
