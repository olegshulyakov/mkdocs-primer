"""The `primer` MkDocs theme.

This package is templates, CSS and one small script — there is no Python API to
call. It exists so that MkDocs can find the theme through the
`mkdocs.themes` entry point declared in `pyproject.toml`:

```toml
[project.entry-points."mkdocs.themes"]
primer = "mkdocs_primer"
```

MkDocs resolves that entry point to this package's directory and loads
`mkdocs_theme.yml` from it for the theme's default options. Selecting the theme
is therefore all the wiring a site needs:

```yaml
theme:
  name: primer
```
"""
