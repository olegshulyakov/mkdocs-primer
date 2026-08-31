# examples/

Each directory here is a complete MkDocs site that builds into
`site/examples/<name>/`, alongside the main documentation.

They exist for one reason: a few plugins the theme supports cannot share a
config with the ones the main site already uses, so the only way to keep their
theme integration under a `--strict` build is to give them a site of their own.

| Example | Why it is separate |
|:---|:---|
| `rss/` | mkdocs-rss-plugin rewrites its own `date_from_meta.default_time` during `on_config`. mkdocs-static-i18n runs `on_config` once per language, so the second pass warns and aborts `--strict`. |
| `gen-files/` | Files that mkdocs-gen-files creates during `on_files` are not classified by mkdocs-static-i18n, which logs `Unhandled file case` and drops them. Its companion, mkdocs-literate-nav, also competes with mkdocs-awesome-nav for the nav. |

Build them the same way CI does, from the repository root and *after* the main
site, since that build cleans `site/`:

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
```
