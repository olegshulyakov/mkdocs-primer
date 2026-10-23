
import {createRequire} from 'node:module'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, relative, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'mkdocs_primer/css/vendor')

const SOURCES = [
  {pkg: '@primer/css', file: 'dist/core.css', out: 'primer-core.css'},
  {pkg: '@primer/css', file: 'dist/markdown.css', out: 'primer-markdown.css'},
  {pkg: '@primer/primitives', file: 'dist/css/functional/themes/light.css', out: 'primitives-light.css'},
  {pkg: '@primer/primitives', file: 'dist/css/functional/themes/dark.css', out: 'primitives-dark.css'},
]

const PRIMITIVES_INDEX = {
  pkg: '@primer/primitives',
  file: 'dist/css/primitives.css',
  out: 'primitives-base.css',
}

const PRINT_OVERRIDES = {
  out: 'primitives-print.css',
  selector: ':root[data-color-mode][data-dark-theme]',
}

function firstRuleDeclarations(css) {
  const open = css.indexOf('{')
  let depth = 0
  let close = open

  while (close < css.length) {
    if (css[close] === '{') depth++
    else if (css[close] === '}' && --depth === 0) break
    close++
  }

  const body = css.slice(open + 1, close)
  return new Map([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]))
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

async function vendorPrintOverrides({out, selector}) {
  const read = async name => firstRuleDeclarations(await readFile(resolve(outDir, name), 'utf8'))
  const [light, dark] = await Promise.all([read('primitives-light.css'), read('primitives-dark.css')])

  const overrides = [...light].filter(([token, value]) => dark.get(token) !== value)
  if (overrides.length === 0) throw new Error('The two themes state the same palette; nothing to override')

  const body = overrides.map(([token, value]) => `    ${token}: ${value};`).join('\n')
  const header =
    `/*!\n` +
    ` * Generated from primitives-light.css and primitives-dark.css beside this file:\n` +
    ` * every token the two themes disagree on, at its light value, for print.\n` +
    ` * Copyright (c) GitHub, Inc. — MIT. See LICENSE in this directory.\n` +
    ` * Do not edit: regenerate with \`npm run vendor\`.\n` +
    ` */\n`

  await writeFile(resolve(outDir, out), `${header}@media print {\n  ${selector} {\n${body}\n  }\n}\n`)
  return `${out} ← primitives-light.css over primitives-dark.css (${overrides.length} tokens)`
}

await mkdir(outDir, {recursive: true})
for (const source of SOURCES) console.log(await vendor(source))
console.log(await vendorIndex(PRIMITIVES_INDEX))
console.log(await vendorPrintOverrides(PRINT_OVERRIDES))
await writeFile(resolve(outDir, 'LICENSE'), LICENSE)
console.log('LICENSE')
