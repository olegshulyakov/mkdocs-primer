"""MkDocs hooks for building this repository's own documentation.

Nothing here ships in the `mkdocs-primer` package; it exists so that
`mkdocs build --strict` stays usable on a site that enables mkdocs-section-index.
"""

import logging

import mkdocs.plugins

_SECTION_INDEX_LOGGER = "mkdocs.plugins.mkdocs_section_index.plugin"
_UNDETECTED_THEME = "couldn't detect a supported theme to adapt"
_MERMAID_LOGGER = "mkdocs.plugins.mermaid2.util"
_MERMAID_OFFLINE_WARNING = "Cannot check URL, no Internet access?"


class _DropUndetectedThemeWarning(logging.Filter):
    """Silence one known-false warning from mkdocs-section-index.

    The plugin decides whether a theme is supported by matching template file
    paths against a hardcoded list of themes it patches (mkdocs-material,
    readthedocs and a couple more). Every third-party theme misses that list, so
    the plugin always warns that it "couldn't detect a supported theme" even when
    the theme handles section index pages natively -- as `primer` does, via the
    `nav_item.url` branch in `partials/nav-item.html`.

    Under `--strict` that one warning aborts the build, so drop it here rather
    than give up strict mode. Anything else the plugin logs still gets through.
    """

    def filter(self, record: logging.LogRecord) -> bool:
        return _UNDETECTED_THEME not in record.getMessage()


logging.getLogger(_SECTION_INDEX_LOGGER).addFilter(_DropUndetectedThemeWarning())


class _DropMermaidOfflineWarning(logging.Filter):
    """Keep a missing optional CDN probe from failing an offline strict build.

    mkdocs-mermaid2-plugin treats an unavailable CDN as non-fatal and continues
    to emit the configured URL, but logs a warning while checking it. The
    warning makes `--strict` abort even though the generated site is valid.
    """

    def filter(self, record: logging.LogRecord) -> bool:
        return _MERMAID_OFFLINE_WARNING not in record.getMessage()


logging.getLogger(_MERMAID_LOGGER).addFilter(_DropMermaidOfflineWarning())


# After mkdocs-static-i18n, which rebuilds the index at priority -100.
@mkdocs.plugins.event_priority(-200)
def on_post_build(config, **kwargs):
    """Drop the default language's second copy of itself from the search index.

    mkdocs-static-i18n builds one language per pass. The first pass is always
    the default language, and the passes after it come from `languages` -- but
    the loop that runs them skips a language by comparing it against the pass
    before it rather than against the default, so the default language is built
    a second time whenever it is not listed first.

    That second build is what puts the theme's own `404.html` and `search.html`
    in English, which is why `mkdocs.yml` lists `en` last on purpose. It also
    hands the search plugin every English page twice, and the plugin indexes
    both: 500 documents for 436 locations, and every English hit listed twice on
    the search page.

    The entries are identical, so the second of each is dropped here, once the
    index has been stacked up and before it reaches the browser.
    """
    search = config.plugins.get("search")
    index = getattr(search, "search_index", None)
    if index is None:
        return

    # The attribute the plugin keeps its entries in, named as the i18n plugin
    # looks for it -- it was `entries` before MkDocs 1.6 and `_entries` after.
    attribute = "_entries" if hasattr(index, "_entries") else "entries"
    entries = getattr(index, attribute, None)
    if entries is None:
        return

    seen = set()
    unique = [
        entry for entry in entries if not (entry["location"] in seen or seen.add(entry["location"]))
    ]
    # Nothing stacked up yet: this is one of the per-language passes, whose
    # index holds that language alone and is overwritten by the pass after it.
    if len(unique) == len(entries):
        return

    entries[:] = unique
    # Rewrite search_index.json from the entries as they now stand.
    search.on_post_build(config=config)
