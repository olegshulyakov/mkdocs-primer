# Configuration

<a id="theme-options"></a>

## Options du thème

| Option | Par défaut | Description |
|:---|:---|:---|
| `logo` | `null` | Image affichée à côté du nom du site, relative à `docs_dir`. |
| `favicon` | `img/favicon.svg` | Icône du site. |
| `icon` | `octicons` | Jeu d'icônes des contrôles du thème : `octicons` ou `lucide`. |
| `font.text` | `null` | Valeur CSS `font-family` pour l'interface et le texte courant. |
| `font.code` | `null` | Valeur CSS `font-family` pour le code en ligne et les blocs de code. |
| `font.source` | `null` | URL d'une feuille de style externe ou feuille de style locale sous `docs_dir`. |
| `locale` | `en` | Langue des textes propres au thème. Des catalogues sont fournis pour `en`, `es`, `fr`, `hi`, `pt`, `ru` et `zh`. |
| `direction` | `ltr` | Sens du document : `ltr` ou `rtl`. |
| `include_sidebar` | `true` | Afficher la barre latérale de navigation. |
| `show_footer` | `true` | Afficher la barre de pied de page. |
| `show_footer_generator` | `true` | Afficher « Réalisé avec mkdocs-primer et MkDocs » dans le pied de page. |
| `social` | `[]` | Liens sous forme d'icônes affichés dans le pied de page. |
| `show_metadata` | `true` | Afficher la ligne de métadonnées sous le titre de la page. |
| `show_metadata_created` | `true` | Afficher la date de création. |
| `show_metadata_updated` | `true` | Afficher la date de dernière mise à jour. |
| `show_metadata_reading_time` | `true` | Afficher le temps de lecture estimé. |
| `show_metadata_authors` | `true` | Afficher les auteurs. |
| `toc` | `auto` | Sommaire « Table des matières » : `auto`, `expanded`, `collapsed` ou `hidden`. |
| `offline` | `false` | Enregistrer un service worker, que la construction du site doit générer elle-même. |
| `color_mode` | `auto` | Mode de couleur initial : `auto`, `light` ou `dark`. |
| `light_theme` | `light` | Thème Primer utilisé en mode clair. |
| `dark_theme` | `dark` | Thème Primer utilisé en mode sombre. |

`color_mode` ne fixe que le mode *initial*. Les visiteurs peuvent le changer avec le sélecteur de l'en-tête, et leur choix est enregistré dans `localStorage`.

`toc` détermine où va le sommaire construit à partir des titres de la page courante. `auto` le place dans la colonne de droite quand la fenêtre est assez large pour une troisième colonne, et sous le titre de la page sinon, où il devient un bloc dépliable que le lecteur ouvre plutôt qu'une liste posée entre le titre et le premier paragraphe. `expanded` le garde dans le flux et hors de la colonne, `collapsed` en fait un bloc dépliable que le lecteur ouvre, et `hidden` — ou `false` — le supprime.

<a id="metadata-line"></a>

## Ligne de métadonnées

Juste sous le titre de la page, au-dessus du texte, le thème peut afficher une ligne d'informations sur la page courante : sa date de création, sa dernière modification, son temps de lecture et ses auteurs. Chaque élément n'apparaît que si son option est activée *et* que des données existent pour lui, et la ligne entière est omise quand aucun des quatre n'aurait rien à afficher.

```yaml
theme:
  name: primer
  show_metadata: true # the line's own switch; false hides all four items
  show_metadata_created: true
  show_metadata_updated: true
  show_metadata_reading_time: true
  show_metadata_authors: true
```

`show_metadata` désactive toute la ligne, quelle que soit la valeur des champs qui suivent. Chaque champ peut aussi être désactivé séparément — pour un site qui veut les dates mais pas d'estimation du temps de lecture, par exemple.

`show_metadata_reading_time` estime le nombre de minutes de lecture à partir du nombre de mots de la page rendue, à raison de 265 mots par minute, la vitesse de lecture moyenne d'un adulte. Il est omis pour une page sans contenu propre, comme l'index d'une section.

Les deux dates proviennent de [mkdocs-git-revision-date-localized](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin) :

```yaml
plugins:
  - git-revision-date-localized:
      enable_creation_date: true # also required for the "created" date
```

Aucune des deux dates n'apparaît si ce plugin n'est pas activé, et la date de création exige précisément `enable_creation_date: true` — par défaut, le plugin la désactive.

Les auteurs proviennent de [mkdocs-git-authors](https://github.com/timvink/mkdocs-git-authors-plugin) et n'apparaissent pas non plus si ce plugin n'est pas activé.

<a id="footer"></a>

## Pied de page

Une barre au bas de chaque page, sous l'ensemble de la mise en page. Elle porte deux lignes de texte d'un côté et une rangée de liens sous forme d'icônes de l'autre, et elle est entièrement omise quand il n'y a rien à y mettre. `show_footer: false` la supprime, quel que soit le reste de la configuration.

Chaque lien de la barre sort de la documentation : tous s'ouvrent donc dans un nouvel onglet.

La première ligne contient le copyright et l'endroit où trouver la source de la page — voir [Liens d'édition](#edit-links) pour ce second point. Le copyright est la clé `copyright` de MkDocs lui-même, une clé de premier niveau et non une option du thème :

```yaml
copyright: Copyright &copy; 2026 Your Name
```

La seconde ligne indique avec quoi le site a été construit. Désactivez-la avec `show_footer_generator: false` :

```yaml
theme:
  name: primer
  show_footer_generator: false
```

<a id="social-links"></a>

### Liens sociaux

`social` est une liste de liens affichés sous forme d'icônes, à l'opposé du copyright :

```yaml
theme:
  name: primer
  social:
    - service: github
      link: https://github.com/you/your-project
    - service: mastodon
      link: https://fosstodon.org/@you
      name: Follow the project on Mastodon
```

`service` désigne l'un des logos fournis avec le thème. `name` est facultatif : c'est le nom accessible du lien — ce qu'annonce un lecteur d'écran — et il vaut par défaut le nom du service lui-même. Renseignez-le donc dès que « GitHub » seul ne dirait pas où mène le lien.

Voici les services disponibles :

`bitbucket`, `bluesky`, `codeberg`, `devdotto`, `discord`, `docker`, `facebook`, `forgejo`, `github`, `githubsponsors`, `gitlab`, `instagram`, `kofi`, `mastodon`, `matrix`, `medium`, `npm`, `opencollective`, `patreon`, `pypi`, `reddit`, `rss`, `stackoverflow`, `substack`, `telegram`, `twitch`, `x`, `youtube`, `zulip`.

Pour tout autre service, faites pointer `icon` vers un SVG sous `docs_dir` au lieu de nommer un `service` :

```yaml
theme:
  name: primer
  social:
    - icon: img/linkedin.svg
      link: https://www.linkedin.com/company/your-company
      name: Your Company on LinkedIn
```

Un tel logo est affiché dans un `<img>` : contrairement aux logos intégrés, il garde donc ses propres couleurs au lieu de suivre celle du texte qui l'entoure. LinkedIn et Slack doivent passer par là : tous deux ont demandé à être retirés du jeu d'icônes dont le thème se sert, si bien qu'aucun des deux n'est fourni.

Les logos viennent de [Simple Icons](https://github.com/simple-icons/simple-icons), publiés sous licence CC0-1.0. Ce n'est pas le cas des marques qu'ils représentent : chacune reste la propriété de son détenteur, et en placer une dans votre pied de page ne revendique aucune affiliation avec lui ni aucun soutien de sa part.

<a id="icons"></a>

## Icônes

La navigation de l'en-tête, le contrôle du mode de couleur, le bouton « Haut de page » et le bouton de copie des blocs de code utilisent des SVG en ligne issus d'un même jeu d'icônes. `octicons` est la valeur par défaut ; choisissez les icônes Lucide avec :

```yaml
theme:
  name: primer
  icon: lucide
```

Les deux jeux sont inclus dans le thème : aucune des deux options n'ajoute donc de requête vers un CDN. Le choix des icônes ne s'applique qu'aux contrôles HTML du thème. Le sélecteur de langue utilise toujours le globe d'Octicons. La syntaxe d'icônes en Markdown et les packs d'icônes tiers arbitraires ne sont délibérément pas pris en charge.

<a id="fonts"></a>

## Polices

Les polices sont facultatives : par défaut, le thème ne sollicite aucun CDN de polices. Définissez indépendamment les familles du texte et du code, puis faites pointer `source` soit vers une feuille de style externe, soit vers un fichier CSS dans `docs_dir` :

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

Pour un site auto-hébergé, placez les fichiers de polices et une feuille de style dans `docs_dir`, puis utilisez un chemin source relatif :

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

Le navigateur met ces fichiers en cache normalement. L'auto-hébergement évite une requête vers un tiers et garde le site utilisable hors ligne une fois ses ressources en cache.

<a id="language"></a>

## Langue

Les textes propres au thème — `Search`, `Back to top`, `Previous`/`Next`, les libellés du pied de page — viennent d'un catalogue gettext, indépendamment de la langue dans laquelle vos pages sont écrites. Choisissez-en un avec `locale` :

```yaml
theme:
  name: primer
  locale: ru
```

Des catalogues sont fournis pour `en`, `es`, `fr`, `hi`, `pt`, `ru` et `zh`. Une locale absente de cette liste se rabat sur l'anglais au lieu de faire échouer la construction.

!!! note "Un site multilingue a besoin de `locale` pour chaque langue"
    mkdocs-static-i18n ne définit `theme.locale` automatiquement que pour les thèmes
    fournis avec MkDocs lui-même : un thème tiers doit donc recevoir la valeur
    explicitement. Ajoutez-la à chaque langue, sinon toutes les locales affichent
    l'interface en anglais :

    ```yaml
    plugins:
      - i18n:
          languages:
            - locale: en
              default: true
              build: true
              theme:
                locale: en
            - locale: ru
              build: true
              theme:
                locale: ru
    ```

!!! warning "Placez la langue par défaut en dernier"
    Le plugin effectue une passe de construction par langue, et les pages qui
    n'existent qu'une fois pour tout le site — `404.html` et `search.html` — sont
    réécrites à chaque passe. C'est donc la langue listée en **dernier** qui
    l'emporte pour ces deux pages. Placez la langue par défaut en dernier pour
    qu'elles soient dans cette langue. Le thème trie lui-même le sélecteur de
    langue, si bien que cela ne change pas l'ordre que voient les visiteurs.

Pour ajouter ou corriger une langue, modifiez `mkdocs_primer/locales/<locale>/LC_MESSAGES/messages.po` puis recompilez — voir [`RELEASING.md`](https://github.com/olegshulyakov/mkdocs-primer/blob/main/RELEASING.md).

<a id="right-to-left-layouts"></a>

## Mises en page de droite à gauche

Définissez `direction: rtl` pour un document qui s'écrit de droite à gauche. Le thème pose `dir="rtl"` sur l'élément HTML racine et inverse son en-tête, sa barre latérale, sa navigation mobile, sa pagination, son pied de page, ses menus et ses contrôles grâce aux propriétés CSS logiques. Le code et les diagrammes restent volontairement de gauche à droite.

```yaml
theme:
  name: primer
  direction: rtl
```

Le sens d'écriture est un réglage global au site ; le thème ne le déduit ni d'une page ni de la locale d'une langue.

!!! warning "`light_theme` et `dark_theme` n'acceptent pour l'instant que `light` et `dark`"
    Primer publie quatorze thèmes (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia`, etc.), mais ce thème ne fournit les jetons de couleur que
    pour deux d'entre eux — l'ensemble complet ajouterait bien plus d'un mégaoctet
    de CSS. Indiquer un autre thème produit une page sans aucune couleur plutôt
    qu'une erreur. La prise en charge d'autres thèmes est prévue pour plus tard.

<a id="heading-anchors"></a>

## Ancres de titre

Pour obtenir l'ancre qui apparaît au survol à côté de chaque titre, comme sur GitHub, activez l'extension `toc` avec un permalien placé en tête et portant la classe `anchor` de Primer :

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

Le thème dessine l'octicon lui-même : `permalink` vaut donc une chaîne vide plutôt que l'habituel `true`. Ce n'est pas qu'une question d'apparence : le plugin de recherche de MkDocs ne retire pas les glyphes de permalien, si bien qu'un `¶` apparaîtrait sinon dans vos résultats de recherche.

Sans cette configuration, le permalien fonctionne quand même ; il s'affiche simplement comme un glyphe ordinaire au lieu de l'octicon.

<a id="syntax-highlighting"></a>

## Coloration syntaxique

Les couleurs du code viennent des variables `prettylights` de Primer : elles suivent donc automatiquement le mode de couleur actif. Il n'y a aucun style Pygments à choisir :

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

Les conteneurs `.highlight` et `.codehilite` sont tous deux mis en forme : `codehilite` fonctionne donc aussi.

Le thème ajoute un bouton de copie à chaque bloc Pygments `.highlight`. Il copie le code source visible et annonce si l'opération dans le presse-papiers a réussi. Les blocs rendus par des plugins, comme Mermaid et Vega-Lite, sont volontairement exclus.

<a id="navigation-controls"></a>

## Contrôles de navigation

Après 400 pixels de défilement, un bouton « Haut de page » apparaît en bas à droite de la page. Il ramène le visiteur au début du document et place le focus clavier sur le lien du titre du site. Le déplacement est instantané quand le visiteur a demandé à réduire les animations.

<a id="offline-support"></a>

## Fonctionnement hors ligne

`offline: true` ajoute une seule chose à chaque page : un script qui enregistre `service-worker.js` depuis la racine du site. Le thème n'écrit pas ce fichier, et MkDocs n'a rien qui le ferait — le générer est une étape que votre propre construction doit exécuter après `mkdocs build` :

```yaml
theme:
  name: primer
  offline: true
```

```console
$ mkdocs build
$ npx workbox generateSW workbox-config.cjs
```

C'est le service worker qui met en cache le site construit, si bien qu'un visiteur qui l'a consulté une fois peut le relire sans réseau. Laissez `offline` à `false` et aucun enregistrement n'est émis, ce qui convient à un site sans cette étape de construction — une page qui réclame un `service-worker.js` que personne n'a généré inscrit une erreur 404 dans la console à chaque visite.

Il y a deux choses qu'il ne peut pas faire. Les service workers sont refusés hors d'un contexte sécurisé : le site doit donc être servi en HTTPS ou depuis `localhost`, et un dossier ouvert via `file://` ne devient pas utilisable hors ligne pour autant. Et la mise en cache commence à la *deuxième* visite — c'est la première qui remplit le cache.

Le `workbox-config.cjs` de ce dépôt et son `npm run build:offline` forment un exemple complet et fonctionnel.

<a id="markdown-extensions"></a>

## Extensions Markdown

Aucune n'est obligatoire, mais le thème fournit des styles qui ne servent qu'une fois qu'elles sont activées :

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

`admonition` mérite d'être signalée : l'extension produit du balisage sans aucun CSS, et `@primer/css` n'a pas non plus de règle pour elle, si bien qu'une admonition sans style est une surprise courante. Le thème comble ce manque — voir [les exemples](../elements.md#admonitions).

<a id="custom-css-and-javascript"></a>

## CSS et JavaScript personnalisés

`extra_css` est chargé après toutes les feuilles de style fournies par le thème : vos règles l'emportent donc sans avoir besoin de `!important` :

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

[Mise en forme](../styling.md) explique quoi y mettre : les variables de mise en page propres au thème, et pourquoi une redéfinition d'un jeton de couleur Primer dans `:root` est ignorée alors que la même règle sous deux sélecteurs d'attribut s'applique.

`extra_javascript` est émis à la fin de `<body>`, après les scripts du thème.

!!! note "Les plugins qui injectent leurs propres ressources"
    Un plugin qui écrit des balises `<link>` dans le HTML de la page au lieu
    d'ajouter à `extra_css` — mkdocs-glightbox en fait partie — arrive *après*
    vos surcharges. Ciblez ces éléments avec un sélecteur plus spécifique plutôt
    que de compter sur l'ordre de chargement.

<a id="edit-links"></a>

## Liens d'édition

Le [pied de page](#footer) renvoie au fichier source de la page quand `repo_url` et `edit_uri` sont définis :

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```

Avec `repo_url` mais sans `edit_uri`, il n'y a pas de lien par page à construire, et le pied de page indique le dépôt à la place — un lecteur peut ainsi retrouver la source depuis n'importe quelle page du site.
