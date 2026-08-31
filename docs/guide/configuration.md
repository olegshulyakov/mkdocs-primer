# Configuration

## Theme options

| Option | Default | Description |
|:---|:---|:---|
| `logo` | `null` | Image shown beside the site name, relative to `docs_dir`. |
| `favicon` | `img/favicon.svg` | Site icon. |
| `include_sidebar` | `true` | Render the navigation sidebar. |
| `show_footer` | `true` | Render the "Improve this page" footer. |
| `color_mode` | `auto` | Initial color mode: `auto`, `light` or `dark`. |
| `light_theme` | `light` | Primer theme used in light mode. |
| `dark_theme` | `dark` | Primer theme used in dark mode. |

`color_mode` only sets the *initial* mode. Visitors can change it with the header
toggle, and their choice is stored in `localStorage`.

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

## Edit links

The footer links back to the source file when `repo_url` and `edit_uri` are set:

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```
