# mkdocs-primer

A [MkDocs](https://www.mkdocs.org/) theme built on [GitHub's Primer design system](https://primer.style/) — documentation that looks like it belongs on GitHub.

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

- GitHub's `.markdown-body` rendering — the same typography, tables and code chrome as a README on github.com.
- Light and dark modes via Primer's color primitives, with an auto/light/dark toggle that remembers the visitor's choice. Defaults to following the OS.
- Syntax highlighting mapped onto Primer's `prettylights` variables, so code colors follow the color mode. Works with both `pymdownx.highlight` and `codehilite`.
- Admonitions styled after GitHub's alerts. The `admonition` extension ships no CSS and `@primer/css` has no rule for it, so most themes render `!!! note` undecorated.
- Sidebar navigation with unlimited nesting, prev/next links, a search results page, and a 404 page.
- "Improve this page" footer, as in the Jekyll theme, with a "Last updated" line when `mkdocs-git-revision-date-localized` is enabled.
- Native support for the plugins that need it: `mkdocs-section-index` (section labels render as links) and `mkdocs-static-i18n` (translated pages get the right `<html lang>`). See [Plugins](https://olegshulyakov.github.io/mkdocs-primer/guide/plugins/).

## Configuration

| Option | Default | Description |
| --- | --- | --- |
| `logo` | `null` | Image shown beside the site name, relative to `docs_dir`. |
| `favicon` | `img/favicon.svg` | Site icon. |
| `include_sidebar` | `true` | Render the navigation sidebar. |
| `show_footer` | `true` | Render the "Improve this page" footer. |
| `color_mode` | `auto` | Initial color mode: `auto`, `light` or `dark`. |
| `light_theme` | `light` | Primer theme used in light mode. |
| `dark_theme` | `dark` | Primer theme used in dark mode. |

For GitHub's hover anchors next to headings, enable the `toc` extension with a leading permalink carrying Primer's `anchor` class:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
```

(The empty `permalink` is deliberate — the theme supplies the octicon, and it keeps a stray `¶` out of your search results.)

See the [documentation](https://olegshulyakov.github.io/mkdocs-primer/) for the rest.

## Development

For the package release procedure, see [RELEASING.md](RELEASING.md).

The CSS under `mkdocs_primer/css/vendor/` is copied from `@primer/css` and `@primer/primitives` and **committed**, so installing the theme needs no Node toolchain.
To refresh it after bumping a version in `package.json`:

```console
$ npm install
$ npm run vendor
```

CI fails if those committed files drift from the pinned versions.

To preview the demo site:

```console
$ pip install -e . -r requirements-docs.txt
$ mkdocs serve
```

The demo site doubles as the theme's plugin compatibility test: `mkdocs.yml` enables every plugin that needs something from a theme, and CI builds it with `--strict`.
Those plugins need Python 3.10+, so CI checks the theme's own floor of 3.9 against a plugin-free site.

A few plugins cannot share that config — `rss` and `gen-files` both break under `static-i18n` — so they get their own sites under `examples/`, published beside the main one.
Build them after it, since `mkdocs build` cleans `site/`:

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
```

## License

MIT. Vendored Primer CSS is MIT, Copyright (c) GitHub, Inc. — see `mkdocs_primer/css/vendor/LICENSE`.
