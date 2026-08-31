// Copies the CSS this theme depends on out of node_modules and into the Python
// package, so that `pip install mkdocs-primer` needs no Node toolchain.
//
// Run `npm run vendor` after bumping a version in package.json, then commit the
// resulting diff. CI re-runs this and fails if the committed files drift.
//
// Deliberately not vendored:
//   @primer/css/dist/primer.css       (~1 MB, every component)
//   @primer/css/dist/color-modes.css  (~800 KB, all 14 themes)

import {createRequire} from 'node:module'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, relative, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'mkdocs_primer/css/vendor')

const SOURCES = [
  // Base, layout, utilities and the components we use: .btn, .btn-octicon,
  // .form-control, .SideNav-item, .Box-, .container-lg.
  {pkg: '@primer/css', file: 'dist/core.css', out: 'primer-core.css'},
  // .markdown-body — not part of core.css. Carries heading anchors, tables,
  // code chrome and footnotes, all driven by custom properties.
  {pkg: '@primer/css', file: 'dist/markdown.css', out: 'primer-markdown.css'},
  // One file per color theme. Each is scoped to [data-color-mode][data-*-theme],
  // so base.html must set all three attributes on <html>.
  {pkg: '@primer/primitives', file: 'dist/css/functional/themes/light.css', out: 'primitives-light.css'},
  {pkg: '@primer/primitives', file: 'dist/css/functional/themes/dark.css', out: 'primitives-dark.css'},
]

// Size, spacing, typography and motion tokens. These are NOT in the theme files
// and are not optional: Primer writes `margin-bottom: var(--base-size-16)` with
// no fallback, so without them every margin in .markdown-body collapses to 0.
//
// Upstream splits them across 15 files stitched together by dist/css/primitives.css.
// Rather than ship 16 files with relative @imports, inline them in that same
// order — the list is parsed from primitives.css so it tracks upstream changes.
const PRIMITIVES_INDEX = {
  pkg: '@primer/primitives',
  file: 'dist/css/primitives.css',
  out: 'primitives-base.css',
}

const LICENSE = `The MIT License (MIT)

Copyright (c) GitHub, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`

const version = pkg => require(`${pkg}/package.json`).version

const banner = (pkg, file) =>
  `/*!\n` +
  ` * Vendored from ${pkg}@${version(pkg)} (${file})\n` +
  ` * Copyright (c) GitHub, Inc. — MIT. See LICENSE in this directory.\n` +
  ` * Do not edit: regenerate with \`npm run vendor\`.\n` +
  ` */\n`

async function vendor({pkg, file, out}) {
  const css = await readFile(require.resolve(`${pkg}/${file}`), 'utf8')
  await writeFile(resolve(outDir, out), banner(pkg, file) + css)
  return `${out} ← ${pkg}@${version(pkg)}/${file}`
}

// Follows the @import list in an index stylesheet and concatenates the targets,
// preserving order so the cascade is unchanged.
async function vendorIndex({pkg, file, out}) {
  const indexPath = require.resolve(`${pkg}/${file}`)
  const index = await readFile(indexPath, 'utf8')
  const imports = [...index.matchAll(/@import\s+['"]([^'"]+)['"]/g)].map(m => m[1])
  if (imports.length === 0) throw new Error(`No @import rules found in ${pkg}/${file}`)

  const parts = []
  for (const spec of imports) {
    const partPath = resolve(dirname(indexPath), spec)
    const rel = relative(dirname(require.resolve(`${pkg}/package.json`)), partPath)
    parts.push(`/* ${rel} */\n${await readFile(partPath, 'utf8')}`)
  }

  await writeFile(resolve(outDir, out), banner(pkg, file) + parts.join('\n'))
  return `${out} ← ${pkg}@${version(pkg)}/${file} (${imports.length} files inlined)`
}

await mkdir(outDir, {recursive: true})
for (const source of SOURCES) console.log(await vendor(source))
console.log(await vendorIndex(PRIMITIVES_INDEX))
await writeFile(resolve(outDir, 'LICENSE'), LICENSE)
console.log('LICENSE')
