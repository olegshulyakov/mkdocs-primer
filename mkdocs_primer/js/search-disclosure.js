(function () {
  var disclosure = document.querySelector('.primer-search-disclosure')
  if (!disclosure) return

  disclosure.addEventListener('toggle', function () {
    if (disclosure.open && matchMedia('(max-width: 767px)').matches) {
      disclosure.querySelector('input[type="search"]').focus()
    }
  })
})()
