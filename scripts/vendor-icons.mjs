
import {createRequire} from 'node:module'
import {readFile, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'mkdocs_primer/partials/social-icons.html')

const SERVICES = [
  'github',
  'gitlab',
  'codeberg',
  'forgejo',
  'bitbucket',
  'pypi',
  'npm',
  'docker',
  'mastodon',
  'bluesky',
  'x',
  'youtube',
  'instagram',
  'facebook',
  'twitch',
  'reddit',
  'discord',
  'matrix',
  'telegram',
  'zulip',
  'stackoverflow',
  'medium',
  'devdotto',
  'substack',
  'githubsponsors',
  'opencollective',
  'patreon',
  'kofi',
  'rss',
]

const dataPath = require.resolve('simple-icons/icons.json')
const {version} = JSON.parse(await readFile(resolve(dirname(dataPath), '..', 'package.json'), 'utf8'))

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
