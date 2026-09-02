// Add copy controls only to the code blocks rendered by Pygments. Plugin
// output such as Mermaid and Vega-Lite uses different containers and is left
// alone deliberately.

;(function () {
  var copyIcon =
    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h8.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 10.25 16h-8.5A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path><path d="M3.5 3.25C3.5 2.56 4.06 2 4.75 2h8.5c.966 0 1.75.784 1.75 1.75v7.5a.75.75 0 0 0 1.5 0v-7.5A3.25 3.25 0 0 0 13.25.5h-8.5A2.75 2.75 0 0 0 2 3.25a.75.75 0 0 0 1.5 0Z"></path></svg>'
  var checkIcon =
    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M13.78 3.72a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 8.78a.75.75 0 0 1 1.06-1.06L6 10.44l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>'

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

    button.className = 'primer-copy-code btn btn-octicon'
    button.type = 'button'
    button.innerHTML = copyIcon
    button.setAttribute('aria-label', 'Copy code')
    button.setAttribute('title', 'Copy code')
    status.className = 'sr-only'
    status.setAttribute('aria-live', 'polite')
    block.appendChild(button)
    block.appendChild(status)

    button.addEventListener('click', function () {
      copy(code.innerText)
        .then(function (copied) {
          if (!copied) throw new Error('Copy command was rejected')
          button.innerHTML = checkIcon
          button.setAttribute('aria-label', 'Code copied')
          button.setAttribute('title', 'Code copied')
          announce(button, 'Code copied to clipboard')
        })
        .catch(function () {
          announce(button, 'Could not copy code to clipboard')
        })
    })
  })
})()
