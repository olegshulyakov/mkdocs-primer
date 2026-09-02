// Add copy controls only to the code blocks rendered by Pygments. Plugin
// output such as Mermaid and Vega-Lite uses different containers and is left
// alone deliberately.

;(function () {
  function announce(button, message) {
    button.nextElementSibling.textContent = message
  }

  function fallbackCopy(text) {
    var input = document.createElement('textarea')
    input.value = text
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()

    try {
      return document.execCommand('copy')
    } finally {
      input.remove()
    }
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
    }
    return Promise.resolve(fallbackCopy(text))
  }

  document.querySelectorAll('.markdown-body .highlight > pre > code').forEach(function (code) {
    var block = code.parentElement.parentElement
    var button = document.createElement('button')
    var status = document.createElement('span')

    button.className = 'primer-copy-code btn btn-sm'
    button.type = 'button'
    button.textContent = 'Copy'
    button.setAttribute('aria-label', 'Copy code')
    status.className = 'sr-only'
    status.setAttribute('aria-live', 'polite')
    block.appendChild(button)
    block.appendChild(status)

    button.addEventListener('click', function () {
      copy(code.innerText)
        .then(function (copied) {
          if (!copied) throw new Error('Copy command was rejected')
          button.textContent = 'Copied'
          announce(button, 'Code copied to clipboard')
        })
        .catch(function () {
          announce(button, 'Could not copy code to clipboard')
        })
    })
  })
})()
