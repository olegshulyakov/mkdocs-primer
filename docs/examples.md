# Examples

Three complete sites live under `examples/` in the repository. Each one is
built with `--strict` by the same CI job as this site and published beside it,
so what you see is what the configuration below produces.

They exist because the plugins involved cannot share a config with the ones
this site already uses — [Plugins](guide/plugins.md) says what breaks in each
case. Read them as three things the theme does rather than as fallout from
that: a site with a feed, a site whose pages are written by a script, and a
site with diagrams.

## A site with a feed

[**examples/rss/**]({{ config.site_url }}examples/rss/) runs
[mkdocs-rss-plugin](https://guts.github.io/mkdocs-rss-plugin/), which writes
`feed_rss_created.xml` and `feed_rss_updated.xml` and stops there. The theme
emits the `<link rel="alternate">` pair that points a browser or a reader at
them, taking the filenames from the plugin's own configuration rather than
hardcoding them — view the page source there and both are in the `<head>`.

The same site has `git-authors` enabled, so the footer prints who last touched
the page alongside the theme's "Improve this page" link.

## Pages that do not exist on disk

[**examples/gen-files/**]({{ config.site_url }}examples/gen-files/) builds its
`Generated` section at build time: `gen_pages.py` writes the Markdown through
[mkdocs-gen-files](https://oprypin.github.io/mkdocs-gen-files/), and
[mkdocs-literate-nav](https://github.com/oprypin/mkdocs-literate-nav) takes the
navigation from a `SUMMARY.md` that includes it. Nothing under `generated/` is
in the repository.

This is the combination an API reference is usually built from, and the thing
to look at is the sidebar: it nests, and its section label is a link, because
`section-index` folded the generated index page into the section itself.

## Diagrams and charts

[**examples/diagrams/**]({{ config.site_url }}examples/diagrams/) renders
Mermaid diagrams through
[mkdocs-mermaid2](https://mkdocs-mermaid2.readthedocs.io/) and Vega-Lite charts
through [mkdocs-charts-plugin](https://timvink.github.io/mkdocs-charts-plugin/).

Both draw in the browser, so both have to be told which color mode the page is
in — otherwise a diagram is a white card in a dark article. Mermaid reads the
theme's `data-color-mode` attribute through a JavaScript expression in that
site's `mkdocs.yml`; the charts plugin looks for Material's attribute instead,
and the page there says what that leaves you with. Neither redraws when the
header toggle is used, which is why the theme fires a
`primer:color-mode-change` event for a page that wants to handle it.

## Building them yourself

Each example has its own `mkdocs.yml` and writes into `site/examples/<name>/`.
Build the main site first: `mkdocs build` cleans `site/`, and would take the
examples with it.

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
$ mkdocs build --strict -f examples/diagrams/mkdocs.yml
```
