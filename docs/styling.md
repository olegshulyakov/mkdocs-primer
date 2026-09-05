# Styling

The stylesheets reach a page in a fixed order: the design tokens from
`@primer/primitives`, GitHub's `@primer/css`, the Pygments colors, this theme's
own `theme.css`, and last whatever `extra_css` names. Being last is what lets
your rules win without `!important` — but only against rules of the same
weight, which is where the one real trap on this page lives.

Reach for things in this order: a [theme option](guide/configuration.md) if one
covers it, then a variable below, then a Primer token, and only then a rule of
your own against the markup.

## The theme's layout variables

These five are declared by the theme, in `:root`, and are meant to be set:

| Variable | Default | What it controls |
| --- | --- | --- |
| `--primer-sidebar-width` | `288px` | the navigation column, its padding included |
| `--primer-rail-width` | `256px` | the third column, where the window has room for one |
| `--primer-article-max` | `720px` | how wide the prose is allowed to get |
| `--primer-gutter` | `var(--base-size-16)` | distance from the window edge, and from the navigation |
| `--primer-header-height` | `56px` | the header, and what the sticky columns clear |

A `:root` block in your own stylesheet is enough, since nothing else declares
them:

```css
/* docs/css/overrides.css, named in extra_css */
:root {
  --primer-article-max: 880px;
  --primer-sidebar-width: 240px;
}
```

The widths at which the layout changes shape are not among them: the sidebar
becomes a column at 1012px and the outline moves into a rail at 1280px, both
written into media queries, and a media query cannot read a custom property.
Narrowing the sidebar therefore makes it narrower, not earlier.

## Primer's tokens

Colors, sizes and type all come from `@primer/primitives`, vendored under
`mkdocs_primer/css/vendor/`. The names and what they mean are Primer's, and
[their documentation](https://primer.style/product/primitives/) is the place to
look them up; [Elements](elements.md) shows a handful of the surfaces on this
site and which token paints each.

Overriding one is where the ordering rule stops being enough:

```css
/* Does nothing. */
:root {
  --fgColor-default: #24292f;
}

/* Works. */
[data-color-mode][data-light-theme] {
  --fgColor-default: #24292f;
}
```

Every color token is declared against a pair of attribute selectors —
`[data-color-mode="light"][data-light-theme="light"]` and its variants, which
is how one stylesheet can hold both color modes. That pair outranks `:root` no
matter which file came last, so a `:root` override is discarded in silence. Match
the same two attributes and order decides again, in your favor.

Sizes and typography are different: `primitives-base.css` declares those in
`:root`, so `--base-size-16` and friends take a plain `:root` override.

Changing the whole palette at once through `light_theme` or `dark_theme` is not
an option today — the theme vendors the tokens for `light` and `dark` only, as
[Configuration](guide/configuration.md) warns.

## What not to reach for

The `primer-*` class names are how the stylesheet talks to itself, not a public
interface. They are renamed and repurposed whenever the layout changes: recent
releases moved `.primer-toc-summary` from a `<summary>` onto a button, changed
what `.primer-nav-section-label` marks, and took `.btn-octicon` off the language
control. A rule of your own against one of these is worth pinning a version for.

Two more of the theme's variables are flags rather than settings.
`--primer-toc-rail` is how the stylesheet tells the scripts whether the window
is wide enough for a rail, and `--primer-nav-depth` is the nesting level the
navigation template puts on each row for the indent to be calculated from.
Setting either from outside turns nothing on; it misleads the code that reads
it.

For scripting the color mode rather than styling it, the theme fires a
`primer:color-mode-change` event on `document`, which the
[diagrams example](examples.md) uses to redraw.
