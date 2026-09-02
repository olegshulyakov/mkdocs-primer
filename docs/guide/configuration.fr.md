#Configuration

## Options de thème

| Options | Par défaut | Descriptif |
|:---|:---|:---|
| `logo` | `null` | Image affichée à côté du nom du site, relative à `docs_dir`. |
| `favicon` | `img/favicon.svg` | Icône du site. |
| `icon` | `octicons` | Jeu d'icônes pour les contrôles de thème : `octicons` ou `lucide`. |
| `font.text` | `null` | Valeur CSS font-family pour l’interface et la prose. |
| `font.code` | `null` | Valeur de la famille de polices CSS pour le code en ligne et en bloc. |
| `font.source` | `null` | Une URL de feuille de style externe ou une feuille de style locale sous `docs_dir`. |
| `direction` | `ltr` | Direction du document : `ltr` ou `rtl`. |
| `include_sidebar` | `true` | Afficher la barre latérale de navigation. |
| `show_footer` | `true` | Afficher le pied de page « Améliorer cette page ». |
| `color_mode` | `auto` | Mode couleur initial : `auto`, `light` ou `dark`. |
| `light_theme` | `light` | Thème Primer utilisé en mode clair. |
| `dark_theme` | `dark` | Thème Primer utilisé en mode sombre. |

`color_mode` définit uniquement le mode *initial*. Les visiteurs peuvent le modifier avec l'en-tête
basculer, et leur choix est stocké dans `localStorage`.

## Icônes

La navigation dans l'en-tête, le contrôle du mode couleur et le bouton de retour en haut utilisent le SVG en ligne.
à partir d’un jeu d’icônes. `octicons` est la valeur par défaut ; choisissez les icônes Lucide
avec :

```yaml
theme:
  name: primer
  icon: lucide
```

Les deux ensembles sont inclus dans le thème, donc aucune des deux options n'ajoute de requête CDN. Icône
la sélection s'applique uniquement aux contrôles HTML du thème. Le sélecteur de langue
utilise toujours un globe Octicon et le traitement `btn-octicon` de Primer pour qu'il corresponde
le reste de l’en-tête Primer. Syntaxe des icônes Markdown et tiers arbitraires
les packs d'icônes ne sont délibérément pas pris en charge.

## Polices

Les polices sont opt-in : le thème ne demande pas de CDN de police par défaut. Définir le texte et
familles de codes indépendamment, puis pointez `source` vers une feuille de style externe
ou un fichier CSS dans `docs_dir` :

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

Pour un site auto-hébergé, mettez les fichiers de polices et une feuille de style dans `docs_dir`, puis
utilisez un chemin source relatif :

```yaml
theme:
  name: primer
  font:
    text: 'Atkinson Hyperlegible, sans-serif'
    code: 'Atkinson Hyperlegible Mono, monospace'
    source: fonts/fonts.css
```

```css title="docs/fonts/fonts.css"
@font-face {
  font-family: "Atkinson Hyperlegible";
  src: url("AtkinsonHyperlegible-Regular.woff2") format("woff2");
  font-display: swap;
}
```

Le navigateur met normalement ces fichiers en cache. L'auto-hébergement évite un tiers
demande et maintient le site utilisable hors ligne une fois ses actifs mis en cache.

## Dispositions de droite à gauche

Définissez `direction: rtl` pour un document s'écrivant de droite à gauche. Le thème met `dir="rtl"`
sur l'élément HTML racine et reflète son en-tête, sa barre latérale, sa navigation mobile,
pagination, pied de page, menus et contrôles avec propriétés CSS logiques. Coder et
les diagrammes restent intentionnellement de gauche à droite.

```yaml
theme:
  name: primer
  direction: rtl
```

La direction est un paramètre à l’échelle du site ; le thème ne le déduit pas d'une page ou
langue locale.

!!! avertissement "`light_theme` et `dark_theme` n'acceptent actuellement que `light` et `dark`"
    Primer publie quatorze thèmes (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia` et ainsi de suite), mais ce thème fournit les jetons de couleur pour seulement deux des
    eux - l'ensemble complet ajouterait bien plus d'un mégaoctet de CSS. Nommer n’importe quel autre thème
    rend une page sans aucune couleur plutôt qu'avec une erreur. Prise en charge de plus de thèmes
    est suivi comme un ajout futur.

## Ancres de titre

Pour obtenir l'ancre de survol de GitHub à côté de chaque en-tête, activez l'extension `toc` avec un
permalien principal qui porte la classe `anchor` de Primer :

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

Le thème dessine l'octicône lui-même, donc `permalink` est défini sur une chaîne vide plutôt
que le `true` habituel. Cela compte bien plus que l'apparence : le plugin de recherche de MkDocs ne le fait pas
supprimez les glyphes de permalien, de sorte qu'un `¶` apparaîtrait autrement dans vos résultats de recherche.

Sans cette configuration, le permalien fonctionne toujours, il s'affiche simplement sous la forme d'un simple glyphe.
que l'octicon.

## Mise en évidence de la syntaxe

Les couleurs des codes proviennent des variables `prettylights` de Primer, elles suivent donc les valeurs actives.
mode couleur automatiquement. Aucun style Pygments ne doit être sélectionné :

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

Les wrappers `.highlight` et `.codehilite` sont stylés, donc `codehilite` fonctionne également.

Le thème ajoute un bouton de copie à chaque bloc Pygments `.highlight`. Il copie le
source visible et annonce si l’opération du presse-papiers a réussi. Blocs
rendus par des plugins, tels que Mermaid et Vega-Lite, sont intentionnellement exclus.

## Commandes de navigation

Après un défilement de 400 pixels, un bouton de retour en haut apparaît en bas à droite
de la page. Il renvoie le visiteur au début du document et se déplace
focus clavier sur le lien du titre du site. Le mouvement est instantané lorsque le visiteur
a demandé une réduction des mouvements.

## Extensions de démarque

Aucun de ces éléments n'est requis, mais le thème propose un style qui ne rapporte qu'une seule fois.
ils sont sur :

```yaml
markdown_extensions:
  - admonition   # !!! note blocks, colored with Primer's alert palette
  - def_list
  - footnotes
  - tables
  - pymdownx.highlight
  - pymdownx.superfences
  - pymdownx.tilde
```

`admonition` est celui qui mérite d'être signalé : l'extension émet du balisage et aucun CSS
qui lui est propre, et `@primer/css` n'a pas non plus de règle pour cela, donc un style sans style
l'avertissement est une surprise courante. Le thème comble cette lacune — voir
[les exemples](nested/deep-page.md#admonitions).

## CSS et JavaScript personnalisés

`extra_css` est chargé après chaque feuille de style expédiée par le thème, afin que vos règles l'emportent
sans avoir besoin de `!important` :

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

`extra_javascript` est émis à la fin de `<body>`, après le thème propre
scripts.

!!! note "Plugins qui injectent leurs propres atouts"
    Un plugin qui écrit les balises `<link>` dans la page HTML plutôt que d'en ajouter
    `extra_css` — mkdocs-glightbox en est un — atterrit *après* vos remplacements. Style
    ceux avec un sélecteur plus spécifique plutôt que de compter sur la commande.

## Modifier les liens

Le pied de page renvoie au fichier source lorsque `repo_url` et `edit_uri` sont définis :

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```