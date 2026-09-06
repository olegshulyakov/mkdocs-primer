// Add copy controls only to the code blocks rendered by Pygments. Plugin
// output such as Mermaid and Vega-Lite uses different containers and is left
// alone deliberately.

;(function () {
  // Set by base.html from the theme's translation catalog; this file is served
  // verbatim and never rendered through Jinja. The fallbacks keep the control
  // working if the template block was overridden away.
  var strings = window.primer_strings || {}
  var COPY = strings.copy || 'Copy code'
  var COPIED = strings.copied || 'Code copied'
  var COPIED_ANNOUNCEMENT = strings.copied_announcement || 'Code copied to clipboard'
  var COPY_FAILED = strings.copy_failed || 'Could not copy code to clipboard'
  // Both sets, the way the templates carry both: this control is built here
  // rather than in a template, so the choice base.html makes in Jinja for every
  // other control has to be made here at runtime. Anything unrecognised falls
  // back to octicons, which is what `theme.icon` itself defaults to.
  var ICONS = {
    octicons: {
      copy: '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h8.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 10.25 16h-8.5A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path><path d="M3.5 3.25C3.5 2.56 4.06 2 4.75 2h8.5c.966 0 1.75.784 1.75 1.75v7.5a.75.75 0 0 0 1.5 0v-7.5A3.25 3.25 0 0 0 13.25.5h-8.5A2.75 2.75 0 0 0 2 3.25a.75.75 0 0 0 1.5 0Z"></path></svg>',
      check:
        '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M13.78 3.72a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 8.78a.75.75 0 0 1 1.06-1.06L6 10.44l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>',
    },
    lucide: {
      copy: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
      check:
        '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    },
  }
  // Set by base.html beside the strings above, and for the same reason.
  var icons = ICONS[window.primer_icon_set] || ICONS.octicons
  var copyIcon = icons.copy
  var checkIcon = icons.check

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
      // writeText resolves with undefined; report success explicitly so the
      // caller can treat a falsy value as the failure it is.
      return navigator.clipboard.writeText(text).then(function () {
        return true
      })
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
    button.setAttribute('aria-label', COPY)
    button.setAttribute('title', COPY)
    status.className = 'sr-only'
    status.setAttribute('aria-live', 'polite')
    block.appendChild(button)
    block.appendChild(status)

    var reset

    button.addEventListener('click', function () {
      copy(code.innerText)
        .then(function (copied) {
          if (!copied) throw new Error('Copy command was rejected')
          button.innerHTML = checkIcon
          button.setAttribute('aria-label', COPIED)
          button.setAttribute('title', COPIED)
          announce(button, COPIED_ANNOUNCEMENT)
          // Back to the idle icon, so a second copy of the same block still
          // reads as an action rather than an already-finished one.
          clearTimeout(reset)
          reset = setTimeout(function () {
            button.innerHTML = copyIcon
            button.setAttribute('aria-label', COPY)
            button.setAttribute('title', COPY)
            announce(button, '')
          }, 2000)
        })
        .catch(function () {
          announce(button, COPY_FAILED)
        })
    })
  })
})()
