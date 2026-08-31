"""Version-selector assets for [mike](https://github.com/jimporter/mike).

mike looks a theme's assets up through the `mike.themes` entry point group and,
for a theme it does not find there, returns early and builds no version dropdown
at all — no warning, just a missing control. `pyproject.toml` registers this
package under that group, so mike copies the `css/` and `js/` beside this file
into the site and appends them to `extra_css`/`extra_javascript`.

This is a package of its own rather than `mkdocs_primer.mike` because MkDocs
copies every non-template file it finds under a theme's directory into the built
site. Living there would put an unused `mike/` directory in the output of every
site using the theme, whether or not mike is involved.

Nothing here is imported at runtime; mike only needs `__file__` to locate the
directory.
"""
