/*
 * Version selector for mike, adapted from the one mike ships for the built-in
 * mkdocs theme. The path arithmetic is mike's; what differs here is where the
 * control gets inserted (the Primer header, beside the site title) and the fact
 * that a missing versions.json is tolerated rather than thrown.
 */
window.addEventListener('DOMContentLoaded', function () {
  function expandPath(path) {
    // Get the base directory components.
    var expanded = window.location.pathname.split('/')
    expanded.pop()
    var isSubdir = false

    path.split('/').forEach(function (bit, i) {
      if (bit === '' && i === 0) {
        isSubdir = false
        expanded = ['']
      } else if (bit === '.' || bit === '') {
        isSubdir = true
      } else if (bit === '..') {
        if (expanded.length === 1) {
          // We must be trying to .. past the root!
          throw new Error('invalid path')
        } else {
          isSubdir = true
          expanded.pop()
        }
      } else {
        isSubdir = false
        expanded.push(bit)
      }
    })

    if (isSubdir) expanded.push('')
    return expanded.join('/')
  }

  // `base_url` comes from base.html.
  var ABS_BASE_URL = expandPath(base_url)
  var versionMatch = ABS_BASE_URL.match(/\/([^\/]+)\/$/)

  /*
   * mike only copies this file in when its plugin is enabled, but the plugin
   * can be enabled for a plain `mkdocs build` too. That site is not deployed
   * under a version directory and has no versions.json, so leave the header
   * alone instead of failing.
   */
  if (!versionMatch) return
  var CURRENT_VERSION = versionMatch[1]

  function makeSelect(options) {
    var select = document.createElement('select')
    select.classList.add('form-select', 'form-control', 'select-sm')
    // Set by base.html from the theme's translation catalog, as the copy
    // button's labels are: this file is served verbatim and never rendered
    // through Jinja. The control shows a version number and nothing else, so
    // this is the only name it has. The fallback covers a page whose scripts
    // block a site has overridden away.
    var strings = window.primer_strings || {}
    select.setAttribute('aria-label', strings.version_select || 'Select documentation version')

    options.forEach(function (i) {
      select.add(new Option(i.text, i.value, undefined, i.selected))
    })

    return select
  }

  fetch(ABS_BASE_URL + '../versions.json')
    .then(function (response) {
      if (!response.ok) throw new Error('no versions.json')
      return response.json()
    })
    .then(function (versions) {
      var current = versions.find(function (i) {
        return i.version === CURRENT_VERSION || i.aliases.includes(CURRENT_VERSION)
      })
      if (!current) return
      var realVersion = current.version

      var select = makeSelect(
        versions
          .filter(function (i) {
            return i.version === realVersion || !i.properties || !i.properties.hidden
          })
          .map(function (i) {
            return { text: i.title, value: i.version, selected: i.version === realVersion }
          })
      )
      select.addEventListener('change', function () {
        window.location.href = ABS_BASE_URL + '../' + this.value + '/'
      })

      var container = document.createElement('div')
      container.id = 'version-selector'
      container.appendChild(select)

      var title = document.querySelector('.primer-header-title')
      if (title) title.parentNode.insertBefore(container, title.nextSibling)
    })
    .catch(function () {
      /* No versions.json: not a mike deployment. Nothing to select. */
    })
})
