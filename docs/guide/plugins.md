# Plugins

Most MkDocs plugins never touch a template, so they work with any theme. A handful do not: they expect the theme to render something they computed, or to handle a nav shape they created. Those are the ones worth checking.

This site is the check. `mkdocs.yml` in the repository root enables the plugins that need theme support, and CI builds it with `--strict`, so a regression breaks the build rather than quietly degrading a page. The candidates were taken from the [MkDocs catalog](https://github.com/mkdocs/catalog), working down by popularity.

## Plugins that need something from the theme

### mkdocs-section-index

[mkdocs-section-index][section-index] folds `guide/index.md` into the **Guide** section itself, so a nav item ends up with both `children` and a `url`. A theme that renders "has children" as a plain section label makes that index page unreachable from the sidebar.

`partials/nav-item.html` checks `nav_item.url` and renders the label as a link when there is one. You can see it in the sidebar: **Guide** and **Nested** are both clickable.

!!! note "A warning you can ignore"
    The plugin recognises supported themes by matching template file paths
    against a built-in list, so it logs

    ```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

    for every third-party theme, including this one. Support here is native —
    nothing needs adapting — but the message is unavoidable from the theme side.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] rewrites `theme.locale` only for the themes it ships support for, which does not include third-party themes. Reading `theme.locale` alone therefore labels every translated page with the default language.

`base.html` prefers the `i18n_page_locale` variable the plugin puts on the page context, and falls back to `theme.locale` when the plugin is absent:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

The translated pages under `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` and `/fr/` carry the matching `lang` attribute. Pages with no `*.<locale>.md` translation fall back to their English source, which is the plugin's default behaviour.

When at least two configured languages have `build: true`, the header also renders a language selector. Its labels come from each language's `name`, and each entry stays on the same page in the target locale. This includes pages for which the plugin falls back to the default-language source. The selector is not rendered without `mkdocs-static-i18n`, for a single-language build, or on the static 404 page.

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] reads the git log and stores the result in `page.meta.git_revision_date_localized`. Nothing displays it unless the theme asks for it, so a theme without that line makes the plugin look broken. `partials/footer.html` prints it — the "Last updated" line at the bottom of this page.

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] has the same shape: it puts `git_page_authors` on the page context as a string of HTML and leaves the display to the theme. The footer prints it beside the revision date.

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] writes `feed_rss_created.xml` and `feed_rss_updated.xml` but adds no markup, so nothing points a reader at them. `base.html` emits the `<link rel="alternate">` pair, taking the filenames from the plugin's own config rather than hardcoding them, since they are options.

The plugin is not enabled on this site — see [Known plugin conflicts](#known-plugin-conflicts).

### mike

[mike][mike] keeps several documentation versions side by side and adds a version dropdown. It finds a theme's dropdown assets through the `mike.themes` entry point group and, for a theme it cannot find there, builds **no selector at all and says nothing** — the site deploys, the versions exist, and the only way to move between them is to edit the URL.

`pyproject.toml` registers `mkdocs_primer.mike` under that group, so mike picks up `version-select.css` and `version-select.js` from this package and copies them in. The selector lands in the header next to the site name and follows the color mode. Aliases resolve to their real version, so `/latest/` shows `2.0` selected rather than an empty control.

That script reads the global `base_url`, which `base.html` declares unconditionally. It used to be declared only when the `search` plugin was enabled, which would have left the selector broken on a site without search.

### mkdocs-print-site

[mkdocs-print-site][print-site] renders the whole site as one page using the active theme's templates, which works here. What it cannot do is supply print CSS: it ships one stylesheet per theme it knows about and warns `Theme 'primer' not yet supported` for the rest.

That is the theme's job anyway. `theme.css` carries an `@media print` block that drops the header, sidebar and pagination, releases the content column to full width, and keeps code blocks and tables from splitting across pages. It also pins the body text to Primer's *light* foreground color, because a visitor printing while in dark mode would otherwise get light gray text on white paper. That block applies to any page, with or without the plugin.

### search

The built-in `search` plugin needs the theme to ship a `search.html` template and to load `search/main.js` with `base_url` in scope. Both are in the theme; the header search box appears whenever the plugin is enabled and disappears when it is not.

### mkdocstrings

[mkdocstrings][mkdocstrings] emits its own markup with `doc-*` classes and leaves the styling to the theme. It renders legibly here because everything lands inside `.markdown-body` and picks up Primer's type scale, but the theme ships no dedicated `doc-*` rules — signatures and parameter tables use Primer's defaults. [Reference](../reference.md) is the page it generates.

## Plugins that just work

These need nothing from the theme beyond well-formed HTML. The first group is enabled on this site, so that stays true:

| Plugin | What it does on this site |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Builds the nav from `docs/.nav.yml` instead of a `nav:` key. |
| [mkdocs-glightbox][glightbox] | Opens the images on the [home page](../index.md) in a lightbox. |
| [mkdocs-minify-plugin][minify] | Minifies the HTML, CSS and JS of every page, including the theme's inline color-mode script. |
| [mkdocs-redirects][redirects] | `/options/` redirects to [Configuration](configuration.md). |
| [mkdocs-macros-plugin][macros] | Renders Jinja in Markdown. This site is **{{ config.site_name }}**, built with theme `{{ config.theme.name }}` — that sentence comes from the plugin, not from Markdown. |

The second group was checked against the theme in a scratch build rather than wired into this site, because each one wants fixture content that would not earn its place in a theme's documentation:

| Plugin | Checked |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | `<swagger-ui>` tag expands, assets copied. |
| [mkdocs-include-markdown-plugin][include-markdown] | Snippet inlined. |
| [markdown-exec][markdown-exec] | Code executed, output inlined. |
| [mkdocs-table-reader-plugin][table-reader] | CSV rendered as a table. |
| [mkdocs-markdownextradata-plugin][extradata] | `extra:` values interpolated. |
| [mkdocs-autolinks-plugin][autolinks] | Bare `[file.md](file.md)` links resolved. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Page body encrypted with no plaintext left in the HTML, password form rendered, theme shell intact around it. |
| [mkdocs-monorepo-plugin][monorepo] | Sub-project merged in through `!include`. |
| `material/group` | Enables or disables a plugin group. With the built-in `search` inside it, the theme's search box correctly appears when the group is on and disappears when it is off. |

Nav- and file-level plugins — [mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — never reach a template at all.

## Known plugin conflicts

Not every failure is the theme's. Five worth knowing about, all reproducible under any theme.

Three of them are why this site is not the only build in the repository: the plugins involved cannot share a config with the ones already enabled here, so they get a site of their own under `examples/`, built with `--strict` by the same CI job.

The [Examples](../examples.md) page covers what each of them shows.

- **mkdocs-rss-plugin with mkdocs-static-i18n** — the RSS plugin rewrites its
  own `date_from_meta.default_time` from a string to a `datetime` during `on_config`. The i18n plugin runs `on_config` once per language, so the second pass re-parses a `datetime` and warns, aborting a `--strict` build. Demonstrated instead at [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files with mkdocs-static-i18n** — files created during
  `on_files` are not classified by the i18n plugin, which logs `Unhandled file case` and drops them from the build. Demonstrated instead at [examples/gen-files/]({{ config.site_url }}examples/gen-files/), together with mkdocs-literate-nav, which would otherwise compete with mkdocs-awesome-nav for the nav.
- **Mermaid with `minify_html`** — Mermaid parses its source line by line, and
  the minifier collapses the newlines inside its `<div>`. The diagram renders as *Syntax error in text* and the build says nothing. Demonstrated instead at [examples/diagrams/]({{ config.site_url }}examples/diagrams/), which also covers [mkdocs-charts-plugin][charts] and how both pick up the color mode.
- **mkdocs-monorepo without `repo_url`** — building a sub-project page raises
  `TypeError: join() missing 1 required positional argument`. Setting `repo_url` and `edit_uri` avoids it. Reproduces identically under the built-in `mkdocs` theme.
- **`material/search` with a non-Material theme** — Material's search plugin
  renders `partials/language.html` through the *active* theme's Jinja environment. Under any theme that does not ship that template it raises `TemplateNotFound` and the build dies. Use the built-in `search` plugin instead; the theme is built against that one.

[autolinks]: https://github.com/zachhannum/mkdocs-autolinks-plugin
[awesome-nav]: https://lukasgeiter.github.io/mkdocs-awesome-nav/
[awesome-pages]: https://github.com/lukasgeiter/mkdocs-awesome-pages-plugin
[encryptcontent]: https://github.com/unverbuggt/mkdocs-encryptcontent-plugin
[mike]: https://github.com/jimporter/mike
[charts]: https://timvink.github.io/mkdocs-charts-plugin/
[exclude]: https://github.com/apenwarr/mkdocs-exclude
[extradata]: https://github.com/rosscdh/mkdocs-markdownextradata-plugin
[git-authors]: https://timvink.github.io/mkdocs-git-authors-plugin/
[git-date]: https://timvink.github.io/mkdocs-git-revision-date-localized-plugin/
[glightbox]: https://blueswen.github.io/mkdocs-glightbox/
[i18n]: https://ultrabug.github.io/mkdocs-static-i18n/
[include-markdown]: https://github.com/mondeja/mkdocs-include-markdown-plugin
[literate-nav]: https://github.com/oprypin/mkdocs-literate-nav
[macros]: https://mkdocs-macros-plugin.readthedocs.io/
[markdown-exec]: https://pawamoy.github.io/markdown-exec/
[mermaid2]: https://mkdocs-mermaid2.readthedocs.io/
[minify]: https://github.com/byrnereese/mkdocs-minify-plugin
[mkdocstrings]: https://mkdocstrings.github.io/
[monorepo]: https://github.com/backstage/mkdocs-monorepo-plugin
[print-site]: https://timvink.github.io/mkdocs-print-site-plugin/
[redirects]: https://github.com/mkdocs/mkdocs-redirects
[rss]: https://guts.github.io/mkdocs-rss-plugin/
[section-index]: https://github.com/oprypin/mkdocs-section-index
[swagger]: https://blueswen.github.io/mkdocs-swagger-ui-tag/
[table-reader]: https://timvink.github.io/mkdocs-table-reader-plugin/
