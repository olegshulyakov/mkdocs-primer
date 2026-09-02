# Generated pages example

Three plugins that build the site's own structure, running against the theme:

- [mkdocs-gen-files](https://oprypin.github.io/mkdocs-gen-files/) writes
  everything under **Generated** in the sidebar. None of it exists in `docs/`.
- [mkdocs-literate-nav](https://oprypin.github.io/mkdocs-literate-nav/) takes
  the nav from `SUMMARY.md` rather than a `nav:` key.
- [mkdocs-section-index](https://github.com/oprypin/mkdocs-section-index) folds
  the generated `generated/index.md` into the **Generated** section, so that
  label is a link rather than dead text. That is the one of the three that needs
  theme support.

!!! note "Why this is not on the main site"
    Files created during `on_files` are not classified by mkdocs-static-i18n,
    which logs `Unhandled file case` and drops them from the build; the main
    site is bilingual. `literate-nav` would also compete with
    `awesome-nav` for the nav there. Both are plugin-to-plugin issues that
    reproduce under any theme.

[Back to the documentation](https://olegshulyakov.github.io/mkdocs-primer/).
