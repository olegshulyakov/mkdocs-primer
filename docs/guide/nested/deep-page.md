# A deeply nested page

This page exists so the sidebar has more than one level of nesting to render.

## Diff highlighting

```diff
--- a/mkdocs.yml
+++ b/mkdocs.yml
@@ -1,3 +1,3 @@
 theme:
-  name: mkdocs
+  name: primer
```

## Admonitions

The `admonition` extension emits markup and no CSS, so the colors below come
from the theme. They follow GitHub's alerts: a colored left rule and a colored
title, in both light and dark mode.[^alerts]

!!! note
    `note` takes Primer's accent blue.

!!! tip
    `tip` and `hint` take success green.

!!! important
    `important` takes the purple Primer calls "done".

!!! warning "Heads up"
    `warning`, `attention` and `caution` take attention yellow. Nested content
    renders inside `.markdown-body`, so it picks up Primer's type scale.

!!! danger
    `danger`, `error` and `bug` take danger red.

!!! example
    Any other type keeps a neutral rule and an uncolored title.

[^alerts]: GitHub renders its own alerts with a `.markdown-alert` class that
    `@primer/css` does not publish, so the theme styles the extension's
    `.admonition` markup directly. This footnote is here to exercise the
    `footnotes` extension.

## Definition lists

The `def_list` extension takes a plainer syntax than the raw `<dl>` on the
[home page](../../index.md):

`docs_dir`
:   Directory MkDocs reads Markdown from.

`site_dir`
:   Directory MkDocs writes HTML to.
