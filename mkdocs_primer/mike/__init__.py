"""Version-selector assets for [mike](https://github.com/jimporter/mike).

mike looks its per-theme assets up through the `mike.themes` entry point group,
falling back to *silently building nothing* for a theme it does not find there —
no warning, just a missing version dropdown. `pyproject.toml` registers this
package under that group so `css/` and `js/` beside this file get copied into
the site and appended to `extra_css`/`extra_javascript`.

Nothing here is imported at runtime; mike only needs `__file__` to locate the
directory.
"""
