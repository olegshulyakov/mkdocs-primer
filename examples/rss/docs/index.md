# RSS example

[mkdocs-rss-plugin](https://guts.github.io/mkdocs-rss-plugin/) writes the feeds
but emits no markup, so a theme that stays silent leaves them undiscoverable.
View the source of this page and look in `<head>`:

```html
<link rel="alternate" type="application/rss+xml"
      title="… — recently updated" href="feed_rss_updated.xml">
<link rel="alternate" type="application/rss+xml"
      title="… — recently created" href="feed_rss_created.xml">
```

The filenames are plugin options, so `base.html` reads them back off the plugin
config rather than hardcoding them.

The feeds themselves are written to `feed_rss_updated.xml` and
`feed_rss_created.xml` beside this page. They are build artifacts rather than
documentation files, so they are named here instead of linked — a link would
fail MkDocs' own link validation under `--strict`.

!!! note "Why this is not on the main site"
    The RSS plugin rewrites its own `date_from_meta.default_time` from a string
    to a `datetime` while handling `on_config`. mkdocs-static-i18n runs
    `on_config` once per language, so the second pass re-parses a `datetime`,
    warns, and aborts a `--strict` build. Nothing to do with the theme — it
    reproduces under any of them.

## Also here

[mkdocs-git-authors](https://timvink.github.io/mkdocs-git-authors-plugin/) is
enabled too, which is why the footer names an author under the revision date.

[Back to the documentation](../../).
