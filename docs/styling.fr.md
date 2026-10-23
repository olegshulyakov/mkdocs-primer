# Mise en forme

Les feuilles de style arrivent sur une page dans un ordre fixe : les jetons de design de
`@primer/primitives`, le `@primer/css` de GitHub, les couleurs de Pygments, le `theme.css`
propre à ce thème, et en dernier ce que nomme `extra_css`. C'est parce qu'elles passent en
dernier que vos règles l'emportent sans `!important` — mais seulement face à des règles de
même spécificité, et c'est là que se trouve le seul vrai piège de cette page.

Procédez dans cet ordre : une [option du thème](guide/configuration.md) si elle couvre
le besoin, puis une variable ci-dessous, puis un jeton Primer, et seulement ensuite une
règle à vous qui cible le balisage.

<a id="the-themes-layout-variables"></a>

## Les variables de mise en page du thème

Ces cinq variables sont déclarées par le thème, dans `:root`, et sont faites pour être redéfinies :

| Variable | Par défaut | Ce qu'elle contrôle |
| --- | --- | --- |
| `--primer-sidebar-width` | `288px` | la colonne de navigation, marges intérieures comprises |
| `--primer-rail-width` | `256px` | la troisième colonne, quand la fenêtre a la place d'en afficher une |
| `--primer-article-max` | `720px` | la largeur maximale du texte |
| `--primer-gutter` | `var(--base-size-16)` | la distance au bord de la fenêtre et à la navigation |
| `--primer-header-height` | `56px` | l'en-tête, et l'espace que les colonnes fixes laissent au-dessus d'elles |

Un bloc `:root` dans votre propre feuille de style suffit, puisque rien d'autre ne les
déclare :

```css
/* docs/css/overrides.css, named in extra_css */
:root {
  --primer-article-max: 880px;
  --primer-sidebar-width: 240px;
}
```

Les largeurs auxquelles la mise en page change de forme n'en font pas partie : la barre
latérale devient une colonne à 1012px et le sommaire passe dans la colonne de droite à
1280px, deux valeurs écrites dans des media queries, et une media query ne peut pas lire
une propriété personnalisée. Réduire la barre latérale la rend donc plus étroite, sans la faire apparaître plus tôt.

<a id="primers-tokens"></a>

## Les jetons de Primer

Les couleurs, les tailles et la typographie viennent toutes de `@primer/primitives`,
embarqué dans `mkdocs_primer/css/vendor/`. Les noms et leur signification sont ceux de
Primer, et c'est dans [sa documentation](https://primer.style/product/primitives/) qu'il
faut les chercher ; [Éléments](elements.md) montre quelques-unes des surfaces de ce site
et le jeton qui colore chacune d'elles.

C'est en redéfinissant l'un d'eux que la règle de l'ordre ne suffit plus :

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

Chaque jeton de couleur est déclaré sous une paire de sélecteurs d'attribut —
`[data-color-mode="light"][data-light-theme="light"]` et ses variantes, ce qui permet à
une seule feuille de style de contenir les deux modes de couleur. Cette paire l'emporte sur
`:root` quel que soit le fichier chargé en dernier, si bien qu'une redéfinition dans `:root`
est ignorée sans le moindre message. Ciblez les deux mêmes attributs, et l'ordre redevient
décisif, en votre faveur.

Les tailles et la typographie sont un cas à part : `primitives-base.css` les déclare dans
`:root`, donc `--base-size-16` et ses semblables se redéfinissent par un simple `:root`.

Changer toute la palette d'un coup avec `light_theme` ou `dark_theme` n'est pas possible
aujourd'hui — le thème n'embarque les jetons que pour `light` et `dark`, comme le signale
[Configuration](guide/configuration.md).

<a id="what-not-to-reach-for"></a>

## Ce qu'il vaut mieux éviter

Les noms de classes `primer-*` servent à la feuille de style à communiquer avec elle-même ;
ce n'est pas une interface publique. Ils sont renommés et réaffectés chaque fois que la mise
en page change : des versions récentes ont déplacé `.primer-toc-summary` d'un `<summary>` vers
un bouton, changé ce que désigne `.primer-nav-section-label`, et retiré `.btn-octicon` du
contrôle de langue. Une règle à vous qui cible l'une de ces classes justifie de figer une version.

Deux autres variables du thème sont des indicateurs plutôt que des réglages.
`--primer-toc-rail` permet à la feuille de style d'indiquer aux scripts si la fenêtre est
assez large pour la colonne de droite, et `--primer-nav-depth` est le niveau d'imbrication
que le modèle de navigation place sur chaque ligne pour calculer le retrait. Les définir de
l'extérieur n'active rien ; cela induit en erreur le code qui les lit.

Pour piloter le mode de couleur par script plutôt que par la mise en forme, le thème émet
un événement `primer:color-mode-change` sur `document`, que
l'[exemple de diagrammes](examples.md) utilise pour redessiner.
