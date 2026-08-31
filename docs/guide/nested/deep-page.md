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

!!! note
    Admonition styling comes from the `admonition` extension.

!!! warning "Heads up"
    Nested content renders inside `.markdown-body`, so it picks up Primer's type scale.
