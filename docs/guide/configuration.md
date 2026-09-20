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
| `show_footer` | `true` | Render the footer bar. |
| `show_footer_generator` | `true` | Show "Made with mkdocs-primer and MkDocs" in the footer. |
| `social` | `[]` | Icon links shown in the footer. |
| `show_metadata` | `true` | Render the metadata line under the page title. |
| `show_metadata_created` | `true` | Show the created date. |
| `show_metadata_updated` | `true` | Show the last-updated date. |
| `show_metadata_reading_time` | `true` | Show the estimated reading time. |
| `show_metadata_authors` | `true` | Show the authors. |
| `toc` | `auto` | "Table of contents" outline: `auto`, `expanded`, `collapsed` or `hidden`. |
| `offline` | `false` | Register a service worker, which the site build has to generate itself. |
| `color_mode` | `auto` | Initial color mode: `auto`, `light` or `dark`. |
| `light_theme` | `light` | Primer theme used in light mode. |
| `dark_theme` | `dark` | Primer theme used in dark mode. |

`color_mode` only sets the *initial* mode. Visitors can change it with the header toggle, and their choice is stored in `localStorage`.

`toc` chooses where the outline built from the current page's headings goes. `auto` puts it in the right rail on a window wide enough for a third column and under the page title otherwise, where it is a disclosure the reader opens rather than a list standing between the title and the first paragraph. `expanded` keeps it in the flow and out of the rail, `collapsed` makes it a disclosure the reader opens, and `hidden` — or `false` — leaves it out.

## Metadata line

Directly under the page title, above the prose, the theme can show a byline of facts about the current page: when it was created, when it last changed, how long it takes to read, and who wrote it. Each item appears only when its own option is on *and* there is data behind it, and the whole line is left out when none of the four would show anything.

```yaml
theme:
  name: primer
  show_metadata: true # the line's own switch; false hides all four items
  show_metadata_created: true
  show_metadata_updated: true
  show_metadata_reading_time: true
  show_metadata_authors: true
```

`show_metadata` turns the whole line off regardless of the fields below it. Each field can also be turned off on its own — for a site that wants the dates but not a reading-time estimate, say.

`show_metadata_reading_time` estimates minutes to read from the page's rendered word count at 265 words per minute, the average adult reading speed, and is left out for a page with no content of its own, such as a section index.

The two dates come from [mkdocs-git-revision-date-localized](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin):

```yaml
plugins:
  - git-revision-date-localized:
      enable_creation_date: true # also required for the "created" date
```

Neither date appears unless that plugin is enabled, and the created date needs `enable_creation_date: true` specifically — the plugin's own default leaves it off.

The authors come from [mkdocs-git-authors](https://github.com/timvink/mkdocs-git-authors-plugin) and do not appear unless that plugin is enabled either.

## Footer

A bar across the foot of every page, under the whole layout. It carries two lines of text on one side and a row of icon links on the other, and is left out entirely when there is nothing to put in it. `show_footer: false` removes it whatever else is configured.

Every link in the bar leaves the documentation, so every one of them opens in a tab of its own.

The first line is the copyright and where to find the page's source — see [Edit links](#edit-links) for the latter. The copyright is MkDocs' own `copyright`, a top-level key rather than a theme option:

```yaml
copyright: Copyright &copy; 2026 Your Name
```

The second line says what built the site. Turn it off with `show_footer_generator: false`:

```yaml
theme:
  name: primer
  show_footer_generator: false
```

### Social links

`social` is a list of links drawn as icons, opposite the copyright:

```yaml
theme:
  name: primer
  social:
    - service: github
      link: https://github.com/you/your-project
    - service: mastodon
      link: https://fosstodon.org/@you
      name: Follow the project on Mastodon
```

`service` names one of the marks the theme ships. `name` is optional: it is the link's accessible name — what a screen reader announces — and defaults to the service's own name, so give one whenever "GitHub" alone would not say where the link goes.

These are the services:

`bitbucket`, `bluesky`, `codeberg`, `devdotto`, `discord`, `docker`, `facebook`, `forgejo`, `github`, `githubsponsors`, `gitlab`, `instagram`, `kofi`, `mastodon`, `matrix`, `medium`, `npm`, `opencollective`, `patreon`, `pypi`, `reddit`, `rss`, `stackoverflow`, `substack`, `telegram`, `twitch`, `x`, `youtube`, `zulip`.

For anything else, point `icon` at an SVG under `docs_dir` instead of naming a `service`:

```yaml
theme:
  name: primer
  social:
    - icon: img/linkedin.svg
      link: https://www.linkedin.com/company/your-company
      name: Your Company on LinkedIn
```

Such a mark is drawn as an `<img>`, so unlike the built-in ones it keeps its own colours instead of following the text around it. LinkedIn and Slack need this route: both asked to be removed from the icon set the theme draws from, so neither ships with it.

The marks are [Simple Icons](https://github.com/simple-icons/simple-icons), released under CC0-1.0. The brands they depict are not: each remains the trademark of its owner, and putting one in your footer claims no affiliation with or endorsement by them.

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

The [footer](#footer) links back to the page's own source file when `repo_url` and `edit_uri` are set:

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```

With `repo_url` but no `edit_uri` there is no per-page link to make, and the footer names the repository instead — so a reader can still find the source from anywhere on the site.
