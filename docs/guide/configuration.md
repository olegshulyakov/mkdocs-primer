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
| `direction` | `ltr` | Document direction: `ltr` or `rtl`. |
| `include_sidebar` | `true` | Render the navigation sidebar. |
| `show_footer` | `true` | Render the "Improve this page" footer. |
| `color_mode` | `auto` | Initial color mode: `auto`, `light` or `dark`. |
| `light_theme` | `light` | Primer theme used in light mode. |
| `dark_theme` | `dark` | Primer theme used in dark mode. |

`color_mode` only sets the *initial* mode. Visitors can change it with the header
toggle, and their choice is stored in `localStorage`.

## Icons

The header, language selector, color-mode control and back-to-top button use
inline SVG from one icon set. `octicons` is the default; choose Lucide icons
with:

```yaml
theme:
  name: primer
  icon: lucide
```

Both sets are included in the theme, so neither option adds a CDN request. Icon
selection applies only to the theme's HTML controls; Markdown icon syntax and
arbitrary third-party icon packs are deliberately unsupported.

## Fonts

Fonts are opt-in: the theme does not request a font CDN by default. Set text and
code families independently, then point `source` at either an external stylesheet
or a CSS file in `docs_dir`:

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

For a self-hosted site, put the font files and a stylesheet in `docs_dir`, then
use a relative source path:

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

The browser caches those files normally. Self-hosting avoids a third-party
request and keeps the site usable offline once its assets are cached.

## Right-to-left layouts

Set `direction: rtl` for a right-to-left document. The theme puts `dir="rtl"`
on the root HTML element and mirrors its header, sidebar, mobile navigation,
pagination, footer, menus and controls with logical CSS properties. Code and
diagrams intentionally remain left-to-right.

```yaml
theme:
  name: primer
  direction: rtl
```

Direction is a site-wide setting; the theme does not infer it from a page or
language locale.

!!! warning "`light_theme` and `dark_theme` currently accept only `light` and `dark`"
    Primer publishes fourteen themes (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia` and so on), but this theme ships the color tokens for just two of
    them — the full set would add well over a megabyte of CSS. Naming any other theme
    renders a page with no colors at all rather than an error. Support for more themes
    is tracked as a future addition.

## Heading anchors

To get GitHub's hover anchor next to each heading, enable the `toc` extension with a
leading permalink that carries Primer's `anchor` class:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

The theme draws the octicon itself, so `permalink` is set to an empty string rather
than the usual `true`. That matters for more than looks: MkDocs' search plugin does not
strip permalink glyphs, so a `¶` would otherwise show up in your search results.

Without this config the permalink still works, it just renders as a plain glyph rather
than the octicon.

## Syntax highlighting

Code colors come from Primer's `prettylights` variables, so they follow the active
color mode automatically. No Pygments style needs to be selected:

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

Both `.highlight` and `.codehilite` wrappers are styled, so `codehilite` works too.

The theme adds a copy button to each Pygments `.highlight` block. It copies the
visible source and announces whether the clipboard operation succeeded. Blocks
rendered by plugins, such as Mermaid and Vega-Lite, are intentionally excluded.

## Navigation controls

After scrolling 400 pixels, a back-to-top button appears at the bottom-right
of the page. It returns the visitor to the start of the document and moves
keyboard focus to the site-title link. The movement is instant when the visitor
has requested reduced motion.

## Markdown extensions

None of these are required, but the theme ships styling that only pays off once
they are on:

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

`admonition` is the one worth calling out: the extension emits markup and no CSS
of its own, and `@primer/css` has no rule for it either, so an unstyled
admonition is a common surprise. The theme fills that gap — see
[the examples](nested/deep-page.md#admonitions).

## Custom CSS and JavaScript

`extra_css` is loaded after every stylesheet the theme ships, so your rules win
without needing `!important`:

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

`extra_javascript` is emitted at the end of `<body>`, after the theme's own
scripts.

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
