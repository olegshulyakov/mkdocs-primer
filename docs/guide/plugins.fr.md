# Plugins

La plupart des plugins MkDocs ne touchent jamais à un modèle : ils fonctionnent donc avec n'importe quel thème. Quelques-uns font exception : ils attendent du thème qu'il affiche quelque chose qu'ils ont calculé, ou qu'il gère une structure de navigation qu'ils ont créée. Ce sont ceux-là qu'il vaut la peine de vérifier.

Ce site sert de vérification. Le `mkdocs.yml` à la racine du dépôt active les plugins qui ont besoin du thème, et la CI le construit avec `--strict` : une régression casse donc la construction au lieu de dégrader discrètement une page. Les candidats ont été pris dans le [catalogue MkDocs](https://github.com/mkdocs/catalog), par ordre de popularité décroissante.

<a id="plugins-that-need-something-from-the-theme"></a>

## Plugins qui ont besoin du thème

### mkdocs-section-index

[mkdocs-section-index][section-index] fusionne `guide/index.md` avec la section **Guide** elle-même, si bien qu'un élément de navigation se retrouve avec à la fois des `children` et une `url`. Un thème qui affiche « a des enfants » comme un simple libellé de section rend cette page d'index inaccessible depuis la barre latérale.

`partials/nav-item.html` vérifie `nav_item.url` et affiche le libellé sous forme de lien quand il y en a une. Vous pouvez le constater dans la barre latérale : **Guide** et **Imbrication** sont tous deux cliquables.

!!! note "Un avertissement que vous pouvez ignorer"
    Le plugin reconnaît les thèmes pris en charge en comparant les chemins de leurs
    fichiers de modèles à une liste intégrée, si bien qu'il affiche

    ```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

    pour tout thème tiers, y compris celui-ci. La prise en charge est ici native —
    il n'y a rien à adapter — mais le thème ne peut pas empêcher ce message.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] ne réécrit `theme.locale` que pour les thèmes qu'il prend explicitement en charge, ce qui exclut les thèmes tiers. Lire uniquement `theme.locale` reviendrait donc à étiqueter chaque page traduite avec la langue par défaut.

`base.html` utilise de préférence la variable `i18n_page_locale` que le plugin place dans le contexte de la page, et se rabat sur `theme.locale` quand le plugin est absent :

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

Les pages traduites sous `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` et `/fr/` portent l'attribut `lang` correspondant. Les pages sans traduction `*.<locale>.md` se rabattent sur leur source anglaise, ce qui est le comportement par défaut du plugin.

Quand au moins deux langues configurées ont `build: true`, l'en-tête affiche aussi un sélecteur de langue. Ses libellés viennent du `name` de chaque langue, et chaque entrée mène à la même page dans la locale cible, y compris pour les pages où le plugin se rabat sur la source dans la langue par défaut. Le sélecteur n'est pas affiché sans `mkdocs-static-i18n`, pour une construction monolingue, ni sur la page 404 statique.

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] lit l'historique git et stocke le résultat dans `page.meta.git_revision_date_localized` — et aussi, avec `enable_creation_date: true`, dans `page.meta.git_creation_date_localized`. Rien n'affiche ces valeurs si le thème ne les demande pas : un thème dépourvu de ces lignes donne l'impression que le plugin ne fonctionne pas. `partials/metadata.html` affiche les deux, comme éléments « Créé le » et « Dernière mise à jour » de la ligne de métadonnées sous le titre de la page.

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] fonctionne de la même manière : il place `git_page_authors` dans le contexte de la page sous forme de chaîne HTML et laisse l'affichage au thème. La ligne de métadonnées l'affiche à côté des dates.

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] écrit `feed_rss_created.xml` et `feed_rss_updated.xml` mais n'ajoute aucun balisage, si bien que rien n'oriente le lecteur vers ces fichiers. `base.html` émet la paire de `<link rel="alternate">`, en prenant les noms de fichiers dans la configuration du plugin plutôt qu'en les codant en dur, puisque ce sont des options.

Le plugin n'est pas activé sur ce site — voir [Conflits de plugins connus](#known-plugin-conflicts).

### mike

[mike][mike] conserve plusieurs versions de la documentation côte à côte et ajoute une liste déroulante de versions. Il trouve les ressources de cette liste pour un thème donné via le groupe de points d'entrée `mike.themes` et, pour un thème qu'il n'y trouve pas, ne construit **aucun sélecteur, sans rien signaler** — le site se déploie, les versions existent, et le seul moyen de passer de l'une à l'autre est de modifier l'URL.

`pyproject.toml` enregistre `mkdocs_primer.mike` dans ce groupe : mike récupère donc `version-select.css` et `version-select.js` dans ce paquet et les copie dans le site. Le sélecteur prend place dans l'en-tête, à côté du nom du site, et suit le mode de couleur. Les alias sont résolus vers leur version réelle : `/latest/` affiche donc `2.0` sélectionné plutôt qu'un contrôle vide.

Ce script lit la variable globale `base_url`, que `base.html` déclare sans condition. Auparavant, elle n'était déclarée que lorsque le plugin `search` était activé, ce qui aurait laissé le sélecteur hors service sur un site sans recherche.

### mkdocs-print-site

[mkdocs-print-site][print-site] affiche tout le site sur une seule page à l'aide des modèles du thème actif, ce qui fonctionne ici. Ce qu'il ne peut pas faire, c'est fournir le CSS d'impression : il livre une feuille de style pour chaque thème qu'il connaît et affiche `Theme 'primer' not yet supported` pour les autres.

C'est de toute façon le rôle du thème. `theme.css` contient un bloc `@media print` qui masque l'en-tête, la barre latérale et la pagination, étend la colonne de contenu à toute la largeur et évite que les blocs de code et les tableaux soient coupés entre deux pages. Il force aussi le texte à la couleur de premier plan du thème *clair* de Primer, car un visiteur qui imprime en mode sombre obtiendrait sinon un texte gris clair sur papier blanc. Ce bloc s'applique à toutes les pages, avec ou sans le plugin.

### search

Le plugin intégré `search` a besoin que le thème fournisse un modèle `search.html` et charge `search/main.js` avec `base_url` accessible. Le thème fait les deux : le champ de recherche de l'en-tête apparaît dès que le plugin est activé et disparaît quand il ne l'est pas.

### mkdocstrings

[mkdocstrings][mkdocstrings] produit son propre balisage avec des classes `doc-*` et laisse la mise en forme au thème. Le rendu est lisible ici, car tout se trouve dans `.markdown-body` et reprend l'échelle typographique de Primer, mais le thème ne fournit aucune règle dédiée aux classes `doc-*` — les signatures et les tableaux de paramètres utilisent les styles par défaut de Primer. La page [Référence](../reference.md) est celle qu'il génère.

<a id="plugins-that-just-work"></a>

## Plugins qui fonctionnent tels quels

Ceux-ci n'ont besoin de rien d'autre de la part du thème qu'un HTML bien formé. Le premier groupe est activé sur ce site, pour que cela reste vrai :

| Plugin | Ce qu'il fait sur ce site |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Construit la navigation à partir de `docs/.nav.yml` au lieu d'une clé `nav:`. |
| [mkdocs-glightbox][glightbox] | Ouvre les images de la page [Éléments](../elements.md) dans une visionneuse (lightbox). |
| [mkdocs-minify-plugin][minify] | Minifie le HTML, le CSS et le JS de chaque page, y compris le script en ligne du thème qui gère le mode de couleur. |
| [mkdocs-redirects][redirects] | `/options/` redirige vers [Configuration](configuration.md). |
| [mkdocs-macros-plugin][macros] | Interprète le Jinja dans le Markdown. Ce site s'appelle **{{ config.site_name }}** et est construit avec le thème `{{ config.theme.name }}` — cette phrase vient du plugin, pas du Markdown. |

Le second groupe a été testé avec le thème dans une construction de test plutôt qu'intégré à ce site, car chacun exige du contenu de démonstration qui n'aurait pas sa place dans la documentation d'un thème :

| Plugin | Vérifié |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | La balise `<swagger-ui>` est développée, les ressources sont copiées. |
| [mkdocs-include-markdown-plugin][include-markdown] | Extrait inséré. |
| [markdown-exec][markdown-exec] | Code exécuté, sortie insérée. |
| [mkdocs-table-reader-plugin][table-reader] | CSV affiché sous forme de tableau. |
| [mkdocs-markdownextradata-plugin][extradata] | Valeurs `extra:` interpolées. |
| [mkdocs-autolinks-plugin][autolinks] | Liens bruts `[file.md](file.md)` résolus. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Corps de la page chiffré sans aucun texte en clair dans le HTML, formulaire de mot de passe affiché, habillage du thème intact autour. |
| [mkdocs-monorepo-plugin][monorepo] | Sous-projet fusionné via `!include`. |
| `material/group` | Active ou désactive un groupe de plugins. Avec le plugin intégré `search` dans le groupe, le champ de recherche du thème apparaît bien quand le groupe est activé et disparaît quand il est désactivé. |

Les plugins qui agissent sur la navigation ou sur les fichiers — [mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — n'atteignent jamais les modèles.

<a id="known-plugin-conflicts"></a>

## Conflits de plugins connus

Tous les échecs ne viennent pas du thème. En voici six à connaître, tous reproductibles avec n'importe quel thème.

Trois d'entre eux expliquent pourquoi ce site n'est pas la seule construction du dépôt : les plugins concernés ne peuvent pas partager une configuration avec ceux déjà activés ici, ils ont donc chacun leur propre site sous `examples/`, construit avec `--strict` par la même tâche de CI.

La page [Exemples](../examples.md) décrit ce que montre chacun d'eux.

- **mkdocs-rss-plugin avec mkdocs-static-i18n** — le plugin RSS réécrit sa
  propre option `date_from_meta.default_time`, d'une chaîne en `datetime`, pendant `on_config`. Le plugin i18n exécute `on_config` une fois par langue : la deuxième passe réanalyse donc un `datetime` et émet un avertissement, ce qui interrompt une construction `--strict`. Démontré à la place sur [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files avec mkdocs-static-i18n** — les fichiers créés pendant
  `on_files` ne sont pas classés par le plugin i18n, qui affiche `Unhandled file case` et les retire de la construction. Démontré à la place sur [examples/gen-files/]({{ config.site_url }}examples/gen-files/), avec mkdocs-literate-nav, qui sinon entrerait en concurrence avec mkdocs-awesome-nav pour la navigation.
- **Mermaid avec `minify_html`** — Mermaid analyse sa source ligne par ligne, et
  le minificateur supprime les retours à la ligne à l'intérieur de son `<div>`. Le diagramme s'affiche comme *Syntax error in text* et la construction ne signale rien. Démontré à la place sur [examples/diagrams/]({{ config.site_url }}examples/diagrams/), qui couvre aussi [mkdocs-charts-plugin][charts] et la façon dont les deux suivent le mode de couleur.
- **mkdocs-monorepo sans `repo_url`** — la construction d'une page de sous-projet lève
  `TypeError: join() missing 1 required positional argument`. Définir `repo_url` et `edit_uri` l'évite. Se reproduit à l'identique avec le thème intégré `mkdocs`.
- **`search` avec une langue par défaut que mkdocs-static-i18n ne liste pas
  en premier** — le plugin i18n effectue une passe de construction par langue, en
  commençant par la langue par défaut, puis parcourt `languages` en sautant celle
  qu'il vient de construire. Il compare chaque entrée à la passe précédente et non
  à la langue par défaut : une langue par défaut listée ailleurs qu'en premier est
  donc construite deux fois, et chacune de ses pages parvient deux fois au plugin
  de recherche. L'index transmet ces doublons jusqu'à la page de recherche, qui
  affiche chaque résultat deux fois. Lister la langue par défaut en premier évite
  le problème, mais c'est la dernière passe qui écrit les fichiers uniques
  `404.html` et `search.html` du site — ce site garde donc `en` en dernier et
  supprime les entrées en double dans `hooks.py`.
- **`material/search` avec un thème autre que Material** — le plugin de recherche de Material
  rend `partials/language.html` via l'environnement Jinja du thème *actif*. Avec tout thème qui ne fournit pas ce modèle, il lève `TemplateNotFound` et la construction échoue. Utilisez plutôt le plugin intégré `search` ; c'est avec lui que le thème est conçu.

[autolinks]: https://github.com/zachhannum/mkdocs-autolinks-plugin
[awesome-nav]: https://lukasgeiter.github.io/mkdocs-awesome-nav/
[awesome-pages]: https://github.com/lukasgeiter/mkdocs-awesome-pages-plugin
[encryptcontent]: https://github.com/unverbuggt/mkdocs-encryptcontent-plugin
[mike]: https://github.com/jimporter/mike
[charts]: https://timvink.github.io/mkdocs-charts-plugin/
[exclude]: https://github.com/apenwarr/mkdocs-exclude
[extradata]: https://github.com/rosscdh/mkdocs-markdownextradata-plugin
[git-authors]: https://timvink.github.io/mkdocs-git-authors-plugin/
[git-date]: https://timvink.github.io/mkdocs-git-revision-date-localized-plugin/
[glightbox]: https://blueswen.github.io/mkdocs-glightbox/
[i18n]: https://ultrabug.github.io/mkdocs-static-i18n/
[include-markdown]: https://github.com/mondeja/mkdocs-include-markdown-plugin
[literate-nav]: https://github.com/oprypin/mkdocs-literate-nav
[macros]: https://mkdocs-macros-plugin.readthedocs.io/
[markdown-exec]: https://pawamoy.github.io/markdown-exec/
[mermaid2]: https://mkdocs-mermaid2.readthedocs.io/
[minify]: https://github.com/byrnereese/mkdocs-minify-plugin
[mkdocstrings]: https://mkdocstrings.github.io/
[monorepo]: https://github.com/backstage/mkdocs-monorepo-plugin
[print-site]: https://timvink.github.io/mkdocs-print-site-plugin/
[redirects]: https://github.com/mkdocs/mkdocs-redirects
[rss]: https://guts.github.io/mkdocs-rss-plugin/
[section-index]: https://github.com/oprypin/mkdocs-section-index
[swagger]: https://blueswen.github.io/mkdocs-swagger-ui-tag/
[table-reader]: https://timvink.github.io/mkdocs-table-reader-plugin/
