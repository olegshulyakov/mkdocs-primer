// Copies the brand marks the footer's social row draws out of node_modules and
// into the Python package, so that `pip install mkdocs-primer` needs no Node
// toolchain — the same bargain scripts/vendor-css.mjs makes for the stylesheets.
//
// Run `npm run vendor` after bumping a version in package.json, then commit the
// resulting diff. CI re-runs this and fails if the committed file drifts.
//
// Curated rather than complete. simple-icons carries 3461 marks, ~4.8 MB of
// path data; the wheel is 163 KB today. The list below is the services a
// documentation site actually links to, and a site that needs one that is not
// here points `icon:` at an SVG of its own under docs_dir — so the registry
// being finite is a default, not a wall.
//
// These are the brands, not the theme's own chrome: `theme.icon` chooses
// between octicons and lucide for the chrome, and neither set ships brand
// marks at all. The social row is therefore one set whatever that option says,
// which is also what keeps a row of a dozen logos looking like one row.

import {createRequire} from 'node:module'
import {readFile, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'mkdocs_primer/partials/social-icons.html')

// Grouped by what a reader would use the link for, which is also the order the
// generated file lists them in. Slugs are simple-icons' own; the display names
// come from the package, so a rebrand arrives with a version bump rather than
// being frozen here.
//
// Absent on purpose because simple-icons does not carry them: LinkedIn and
// Slack, both withdrawn at the trademark holder's request. Reach them through
// `icon:` with a mark of your own.
const SERVICES = [
  // Source and packages
  'github',
  'gitlab',
  'codeberg',
  'forgejo',
  'bitbucket',
  'pypi',
  'npm',
  'docker',
  // Social
  'mastodon',
  'bluesky',
  'x',
  'youtube',
  'instagram',
  'facebook',
  'twitch',
  'reddit',
  // Chat
  'discord',
  'matrix',
  'telegram',
  'zulip',
  // Writing and questions
  'stackoverflow',
  'medium',
  'devdotto',
  'substack',
  // Funding
  'githubsponsors',
  'opencollective',
  'patreon',
  'kofi',
  // Feeds
  'rss',
]

// `exports` in simple-icons/package.json does not list the manifest itself, so
// the version is read off disk rather than required, from the package root the
// icon data resolves inside of.
const dataPath = require.resolve('simple-icons/icons.json')
const {version} = JSON.parse(await readFile(resolve(dirname(dataPath), '..', 'package.json'), 'utf8'))

// simple-icons ships one <svg role="img"><title>…</title><path d="…"/></svg>
// per slug. Only the path survives: the accessible name belongs on the <a> that
// wraps the mark, where it can say where the link goes rather than merely name
// a company, and a <title> inside the icon would compete with it. `fill` and
// the 16px box match the octicons the rest of the chrome inlines, so an icon
// takes the colour of the text around it and has a sane size with no CSS.
//
// Every mark in the list above is a single <path> today. Rebuilding the element
// around one is only lossless while that holds, so an icon that ever arrives as
// two paths, or with a <circle> beside them, stops the build rather than
// shipping half a logo.
function svgOf(source, slug) {
  const drawn = source.match(/<(path|circle|rect|polygon|polyline|ellipse|line|g|use)\b/g) ?? []
  if (drawn.length !== 1 || drawn[0] !== '<path') {
    throw new Error(`simple-icons/icons/${slug}.svg is no longer a lone <path>: drew ${drawn.join(', ') || 'nothing'}`)
  }

  const path = source.match(/\sd="([^"]+)"/)
  if (!path) throw new Error(`No path data in simple-icons/icons/${slug}.svg`)

  return (
    '<svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" fill="currentColor">' +
    `<path d="${path[1]}"/>` +
    '</svg>'
  )
}

// Jinja string literals, single-quoted: simple-icons' path data is digits,
// letters and punctuation that never includes a quote, and the attributes above
// are double-quoted, but a title could carry an apostrophe.
const quote = value => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

const data = JSON.parse(await readFile(dataPath, 'utf8'))
const titles = new Map((Array.isArray(data) ? data : data.icons).map(icon => [icon.slug, icon.title]))

const entries = []
for (const slug of SERVICES) {
  const title = titles.get(slug)
  if (!title) throw new Error(`simple-icons@${version} has no icon with the slug "${slug}"`)

  const source = await readFile(require.resolve(`simple-icons/icons/${slug}.svg`), 'utf8')
  entries.push(`  ${quote(slug)}: {'name': ${quote(title)}, 'svg': ${quote(svgOf(source, slug))}},`)
}

const header = `{#
  The brand marks partials/footer.html draws for theme.social, keyed by the
  \`service\` an entry names. Each value carries the service's display name, used
  as the link's accessible name when an entry does not give its own.

  Generated from simple-icons@${version} — do not edit. Regenerate with
  \`npm run vendor\`; CI fails if this file drifts from the pinned version.

  The icons are CC0-1.0, dedicated to the public domain by the Simple Icons
  contributors (https://github.com/simple-icons/simple-icons). The brands they
  depict are not: each mark remains the trademark of its owner, and showing one
  claims no affiliation with or endorsement by them.
#}
`

await writeFile(out, `${header}{% set SOCIAL_ICONS = {\n${entries.join('\n')}\n} %}\n`)
console.log(`partials/social-icons.html ← simple-icons@${version} (${entries.length} marks)`)
