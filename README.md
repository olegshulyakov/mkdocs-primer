# mkdocs-primer

A [MkDocs](https://www.mkdocs.org/) theme built on [GitHub's Primer design
system](https://primer.style/) — documentation that looks like it belongs on GitHub.

Inspired by the [`pages-themes/primer`](https://github.com/pages-themes/primer) Jekyll
theme, but built on current `@primer/css` rather than its 2019-era Sass, which means real
light/dark support.

## Install

```console
$ pip install mkdocs-primer
```

```yaml
# mkdocs.yml
theme:
  name: primer
```

## Features

- GitHub's `.markdown-body` rendering — the same typography, tables and code chrome as a
  README on github.com.
- Light and dark modes via Primer's color primitives, with an auto/light/dark toggle that
  remembers the visitor's choice. Defaults to following the OS.
- Syntax highlighting mapped onto Primer's `prettylights` variables, so code colors follow
  the color mode. Works with both `pymdownx.highlight` and `codehilite`.
- Sidebar navigation with unlimited nesting, prev/next links, a search results page, and a
  404 page.
- "Improve this page" footer, as in the Jekyll theme.

## Configuration

| Option | Default | Description |
|:---|:---|:---|
| `logo` | `null` | Image shown beside the site name, relative to `docs_dir`. |
| `favicon` | `img/favicon.svg` | Site icon. |
| `include_sidebar` | `true` | Render the navigation sidebar. |
| `show_footer` | `true` | Render the "Improve this page" footer. |
| `color_mode` | `auto` | Initial color mode: `auto`, `light` or `dark`. |
| `light_theme` | `light` | Primer theme used in light mode. |
| `dark_theme` | `dark` | Primer theme used in dark mode. |

For GitHub's hover anchors next to headings, enable the `toc` extension with a leading
permalink carrying Primer's `anchor` class:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
```

(The empty `permalink` is deliberate — the theme supplies the octicon, and it keeps a
stray `¶` out of your search results.)

See the [documentation](https://olegshulyakov.github.io/mkdocs-primer/) for the rest.

## Development

The CSS under `mkdocs_primer/css/vendor/` is copied from `@primer/css` and
`@primer/primitives` and **committed**, so installing the theme needs no Node toolchain.
To refresh it after bumping a version in `package.json`:

```console
$ npm install
$ npm run vendor
```

CI fails if those committed files drift from the pinned versions.

To preview the demo site:

```console
$ pip install -e . pymdown-extensions
$ mkdocs serve
```

## License

MIT. Vendored Primer CSS is MIT, Copyright (c) GitHub, Inc. — see
`mkdocs_primer/css/vendor/LICENSE`.
