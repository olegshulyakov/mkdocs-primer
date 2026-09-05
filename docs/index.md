# mkdocs-primer

A [MkDocs](https://www.mkdocs.org/) theme built on [GitHub's Primer design
system](https://primer.style/) — documentation that looks like it belongs on
GitHub.

This site is the theme rendering itself. The article you are reading is styled
by GitHub's own `.markdown-body` rules, and everything around it — the header,
the navigation tree, the breadcrumb trail, the outline in the right rail — is
what a site of your own gets from two lines of configuration.

## Install

```console
$ pip install mkdocs-primer
```

```yaml
# mkdocs.yml
theme:
  name: primer
```

That is the whole setup: every option has a working default, and the theme
renders the `nav` MkDocs has already built. See [Installation](guide/installation.md).

## What you get

- **GitHub's rendering of an article** — the typography, tables, code chrome and
  hover anchors of a README on github.com. The Primer CSS is vendored into the
  package, so installing the theme needs no Node toolchain.
- **Light and dark**, from Primer's color primitives. The control in the header
  follows the operating system until the visitor picks a mode, and remembers the
  choice afterwards. Syntax highlighting follows it too.
- **Navigation that scales** — a sidebar with unlimited nesting, collapsed down
  to the section the reader is in, plus a breadcrumb trail, previous/next links,
  a search page and a 404 page.
- **Admonitions styled after GitHub's alerts.** The `admonition` extension ships
  no CSS and `@primer/css` has no rule for it, so under most themes `!!! note`
  renders undecorated.
- **Seven languages** for the theme's own text — English, Spanish, French,
  Hindi, Portuguese, Russian and Chinese — and right-to-left layouts.
- **Support for the plugins that need a theme's help**: section index pages,
  translated sites, revision dates and authors, RSS autodiscovery, and mike's
  version selector.

## Where to go next

[Guide](guide/index.md)

:   Installation, every theme option, and the plugins this theme is built
    against.

[Elements](elements.md)

:   Every block the theme styles inside an article, drawn once — admonitions,
    quotes, code, tables, images.

[Examples](examples.md)

:   Three complete sites showing what the theme does with feeds, generated
    pages, and diagrams.

[Reference](reference.md)

:   The theme package's own documentation, rendered by mkdocstrings.
