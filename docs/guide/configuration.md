# Configuration

## Theme options

| Option | Default | Description |
|:---|:---|:---|
| `logo` | `null` | Image shown beside the site name, relative to `docs_dir`. |
| `favicon` | `img/favicon.svg` | Site icon. |
| `icon` | `octicons` | Icon set for theme controls: `octicons` or `lucide`. |
| `font.text` | `null` | CSS font-family value for interface and prose. |
| `font.code` | `null` | CSS font-family value for inline and block code. |
| `font.source` | `null` | An external stylesheet URL or local stylesheet under `docs_dir`. |
| `locale` | `en` | Language of the theme's own text. Catalogs ship for `en`, `es`, `fr`, `hi`, `pt`, `ru` and `zh`. |
| `direction` | `ltr` | Document direction: `ltr` or `rtl`. |
| `include_sidebar` | `true` | Render the navigation sidebar. |
| `show_footer` | `true` | Render the "Improve this page" footer. |
| `toc` | `auto` | "Table of contents" outline: `auto`, `expanded`, `collapsed` or `hidden`. |
| `offline` | `false` | Register a service worker, which the site build has to generate itself. |
| `color_mode` | `auto` | Initial color mode: `auto`, `light` or `dark`. |
| `light_theme` | `light` | Primer theme used in light mode. |
| `dark_theme` | `dark` | Primer theme used in dark mode. |

`color_mode` only sets the *initial* mode. Visitors can change it with the header toggle, and their choice is stored in `localStorage`.

`toc` chooses where the outline built from the current page's headings goes. `auto` puts it in the right rail on a window wide enough for a third column and under the page title otherwise, where it is a disclosure the reader opens rather than a list standing between the title and the first paragraph. `expanded` keeps it in the flow and out of the rail, `collapsed` makes it a disclosure the reader opens, and `hidden` — or `false` — leaves it out.

## Icons

The header navigation, color-mode control, back-to-top button and the copy button on a code block use inline SVG from one icon set. `octicons` is the default; choose Lucide icons with:

```yaml
theme:
  name: primer
  icon: lucide
```

Both sets are included in the theme, so neither option adds a CDN request. Icon selection applies only to the theme's HTML controls. The language selector always uses an Octicon globe. Markdown icon syntax and arbitrary third-party icon packs are deliberately unsupported.

## Fonts

Fonts are opt-in: the theme does not request a font CDN by default. Set text and code families independently, then point `source` at either an external stylesheet or a CSS file in `docs_dir`:

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

For a self-hosted site, put the font files and a stylesheet in `docs_dir`, then use a relative source path:

```yaml
theme:
  name: primer
  font:
    text: 'Atkinson Hyperlegible, sans-serif'
    code: 'Atkinson Hyperlegible Mono, monospace'
    source: fonts/fonts.css
```

```css title="docs/fonts/fonts.css"
@font-face {
  font-family: "Atkinson Hyperlegible";
  src: url("AtkinsonHyperlegible-Regular.woff2") format("woff2");
  font-display: swap;
}
```

The browser caches those files normally. Self-hosting avoids a third-party request and keeps the site usable offline once its assets are cached.

## Language

The theme's own text — `Search`, `Back to top`, `Previous`/`Next`, the footer labels — comes from a gettext catalog, separately from the language your pages are written in. Pick one with `locale`:

```yaml
theme:
  name: primer
  locale: ru
```

Catalogs ship for `en`, `es`, `fr`, `hi`, `pt`, `ru` and `zh`. An unlisted locale falls back to English rather than failing the build.

!!! note "Multi-language sites need `locale` per language"
    mkdocs-static-i18n sets `theme.locale` automatically only for the themes
    MkDocs itself ships, so a third-party theme has to be told explicitly. Add
    it to each language, or every locale renders English chrome:

    ```yaml
    plugins:
      - i18n:
          languages:
            - locale: en
              default: true
              build: true
              theme:
                locale: en
            - locale: ru
              build: true
              theme:
                locale: ru
    ```

!!! warning "List the default language last"
    The plugin runs one build pass per language, and the pages that exist once
    for the whole site — `404.html` and `search.html` — are rewritten by every
    pass. The language listed **last** is therefore the one those two come out
    in. List the default language last so they land in it. The theme sorts the
    language selector on its own, so this does not change the order visitors
    see.

To add or correct a language, edit `mkdocs_primer/locales/<locale>/LC_MESSAGES/messages.po` and recompile — see [`RELEASING.md`](https://github.com/olegshulyakov/mkdocs-primer/blob/main/RELEASING.md).

## Right-to-left layouts

Set `direction: rtl` for a right-to-left document. The theme puts `dir="rtl"` on the root HTML element and mirrors its header, sidebar, mobile navigation, pagination, footer, menus and controls with logical CSS properties. Code and diagrams intentionally remain left-to-right.

```yaml
theme:
  name: primer
  direction: rtl
```

Direction is a site-wide setting; the theme does not infer it from a page or language locale.

!!! warning "`light_theme` and `dark_theme` currently accept only `light` and `dark`"
    Primer publishes fourteen themes (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia` and so on), but this theme ships the color tokens for just two of
    them — the full set would add well over a megabyte of CSS. Naming any other theme
    renders a page with no colors at all rather than an error. Support for more themes
    is tracked as a future addition.

## Heading anchors

To get GitHub's hover anchor next to each heading, enable the `toc` extension with a leading permalink that carries Primer's `anchor` class:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

The theme draws the octicon itself, so `permalink` is set to an empty string rather than the usual `true`. That matters for more than looks: MkDocs' search plugin does not strip permalink glyphs, so a `¶` would otherwise show up in your search results.

Without this config the permalink still works, it just renders as a plain glyph rather than the octicon.

## Syntax highlighting

Code colors come from Primer's `prettylights` variables, so they follow the active color mode automatically. No Pygments style needs to be selected:

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

Both `.highlight` and `.codehilite` wrappers are styled, so `codehilite` works too.

The theme adds a copy button to each Pygments `.highlight` block. It copies the visible source and announces whether the clipboard operation succeeded. Blocks rendered by plugins, such as Mermaid and Vega-Lite, are intentionally excluded.

## Navigation controls

After scrolling 400 pixels, a back-to-top button appears at the bottom-right of the page. It returns the visitor to the start of the document and moves keyboard focus to the site-title link. The movement is instant when the visitor has requested reduced motion.

## Offline support

`offline: true` adds one thing to every page: a script that registers `service-worker.js` from the site root. The theme does not write that file, and MkDocs has nothing that would — generating it is a step your own build has to run after `mkdocs build`:

```yaml
theme:
  name: primer
  offline: true
```

```console
$ mkdocs build
$ npx workbox generateSW workbox-config.cjs
```

The service worker is what precaches the built site, so a visitor who has been to it once can read it again with no network. Leave `offline` at `false` and no registration is emitted, which is what a site without that build step wants — a page asking for a `service-worker.js` nobody generated logs a 404 on every visit.

Two things it cannot do. Service workers are refused outside a secure context, so the site has to be served over HTTPS or from `localhost`; a folder opened over `file://` is not made offline-capable by any of this. And precaching starts on the *second* visit — the first one is what fills the cache.

This repository's own `workbox-config.cjs` and its `npm run build:offline` are a complete working example.

## Markdown extensions

None of these are required, but the theme ships styling that only pays off once they are on:

```yaml
markdown_extensions:
  - admonition   # !!! note blocks, colored with Primer's alert palette
  - def_list
  - footnotes
  - tables
  - pymdownx.highlight
  - pymdownx.superfences
  - pymdownx.tilde
```

`admonition` is the one worth calling out: the extension emits markup and no CSS of its own, and `@primer/css` has no rule for it either, so an unstyled admonition is a common surprise. The theme fills that gap — see [the examples](../elements.md#admonitions).

## Custom CSS and JavaScript

`extra_css` is loaded after every stylesheet the theme ships, so your rules win without needing `!important`:

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

[Styling](../styling.md) covers what to put in it: the theme's own layout variables, and why a `:root` override of a Primer color token is discarded while the same rule under two attribute selectors applies.

`extra_javascript` is emitted at the end of `<body>`, after the theme's own scripts.

!!! note "Plugins that inject their own assets"
    A plugin that writes `<link>` tags into the page HTML rather than adding to
    `extra_css` — mkdocs-glightbox is one — lands *after* your overrides. Style
    those with a more specific selector rather than relying on order.

## Edit links

The footer links back to the source file when `repo_url` and `edit_uri` are set:

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```
