window.addEventListener('DOMContentLoaded', function () {
  function expandPath(path) {
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

  var ABS_BASE_URL = expandPath(base_url)
  var versionMatch = ABS_BASE_URL.match(/\/([^\/]+)\/$/)

  if (!versionMatch) return
  var CURRENT_VERSION = versionMatch[1]

  function makeSelect(options) {
    var select = document.createElement('select')
    select.classList.add('form-select', 'form-control', 'select-sm')
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
    })
})
