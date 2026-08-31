# Plugins

Most MkDocs plugins never touch a template, so they work with any theme. A
handful do not: they expect the theme to render something they computed, or to
handle a nav shape they created. Those are the ones worth checking.

This site is the check. `mkdocs.yml` in the repository root enables every plugin
listed below, and CI builds it with `--strict`, so a regression in theme support
breaks the build rather than quietly degrading a page.

## Plugins that need something from the theme

### mkdocs-section-index

[mkdocs-section-index][section-index] folds `guide/index.md` into the **Guide**
section itself, so a nav item ends up with both `children` and a `url`. A theme
that renders "has children" as a plain section label makes that index page
unreachable from the sidebar.

`partials/nav-item.html` checks `nav_item.url` and renders the label as a link
when there is one. You can see it in the sidebar: **Guide** and **Nested** are
both clickable.

!!! note "A warning you can ignore"
    The plugin recognises supported themes by matching template file paths
    against a built-in list, so it logs

    ```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

    for every third-party theme, including this one. Support here is native —
    nothing needs adapting — but the message is unavoidable from the theme side.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] rewrites `theme.locale` only for the themes it ships
support for, which does not include third-party themes. Reading `theme.locale`
alone therefore labels every translated page with the default language.

`base.html` prefers the `i18n_page_locale` variable the plugin puts on the page
context, and falls back to `theme.locale` when the plugin is absent:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

The Russian pages under `/ru/` carry `lang="ru"`. Pages with no `*.ru.md`
translation fall back to their English source, which is the plugin's default
behaviour.

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] reads the git log and stores the
result in `page.meta.git_revision_date_localized`. Nothing displays it unless
the theme asks for it, so a theme without that line makes the plugin look
broken. `partials/footer.html` prints it — the "Last updated" line at the bottom
of this page.

### search

The built-in `search` plugin needs the theme to ship a `search.html` template
and to load `search/main.js` with `base_url` in scope. Both are in the theme;
the header search box appears whenever the plugin is enabled and disappears when
it is not.

### mkdocstrings

[mkdocstrings][mkdocstrings] emits its own markup with `doc-*` classes and
leaves the styling to the theme. It renders legibly here because everything
lands inside `.markdown-body` and picks up Primer's type scale, but the theme
ships no dedicated `doc-*` rules — signatures and parameter tables use Primer's
defaults. [Reference](../reference.md) is the page it generates.

## Plugins that just work

These need nothing from the theme beyond well-formed HTML. They are enabled here
so that stays true:

| Plugin | What it does on this site |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Builds the nav from `docs/.nav.yml` instead of a `nav:` key. |
| [mkdocs-glightbox][glightbox] | Opens the images on the [home page](../index.md) in a lightbox. |
| [mkdocs-minify-plugin][minify] | Minifies the HTML, CSS and JS of every page, including the theme's inline color-mode script. |
| [mkdocs-redirects][redirects] | `/options/` redirects to [Configuration](configuration.md). |
| [mkdocs-macros-plugin][macros] | Renders Jinja in Markdown. This site is **{{ config.site_name }}**, built with theme `{{ config.theme.name }}` — that sentence comes from the plugin, not from Markdown. |

## Known plugin conflicts

Not every failure is the theme's. One worth knowing about:

- **mkdocs-gen-files with mkdocs-static-i18n** — files created during
  `on_files` are not classified by the i18n plugin, which logs
  `Unhandled file case` and drops them from the build. This happens under any
  theme; it is a plugin-to-plugin issue.

[awesome-nav]: https://lukasgeiter.github.io/mkdocs-awesome-nav/
[git-date]: https://timvink.github.io/mkdocs-git-revision-date-localized-plugin/
[glightbox]: https://blueswen.github.io/mkdocs-glightbox/
[i18n]: https://ultrabug.github.io/mkdocs-static-i18n/
[macros]: https://mkdocs-macros-plugin.readthedocs.io/
[minify]: https://github.com/byrnereese/mkdocs-minify-plugin
[mkdocstrings]: https://mkdocstrings.github.io/
[redirects]: https://github.com/mkdocs/mkdocs-redirects
[section-index]: https://github.com/oprypin/mkdocs-section-index
