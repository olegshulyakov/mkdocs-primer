"""MkDocs hooks for building this repository's own documentation.

Nothing here ships in the `mkdocs-primer` package; it exists so that
`mkdocs build --strict` stays usable on a site that enables mkdocs-section-index.
"""

import logging

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
