# Plugins

La plupart des plugins MkDocs ne touchent jamais à un modèle, ils fonctionnent donc avec n'importe quel thème. Un peu ne le font pas : ils s'attendent à ce que le thème restitue quelque chose qu'ils ont calculé, ou à gérer une forme de navigation qu'ils ont créée. Ce sont ceux-là qui valent la peine d’être vérifiés.

Ce site est le chèque. `mkdocs.yml` dans la racine du référentiel active les plugins qui ont besoin d'un support de thème, et CI le construit avec `--strict`, donc une régression brise la construction plutôt que de dégrader tranquillement une page. Les candidats ont été retenus à partir du [catalogue MkDocs](https://github.com/mkdocs/catalog), en travaillant par popularité.

## Plugins qui ont besoin de quelque chose du thème

### mkdocs-section-index

[mkdocs-section-index][section-index] intègre `guide/index.md` dans le **Guide** section elle-même, donc un élément de navigation se termine par à la fois `children` et un `url`. Un thème qui affiche "a des enfants" sous la forme d'une simple étiquette de section qui rend cette page d'index inaccessible depuis la barre latérale.

`partials/nav-item.html` vérifie `nav_item.url` et affiche l'étiquette sous forme de lien quand il y en a un. Vous pouvez le voir dans la barre latérale : **Guide** et **Nested** sont tous deux cliquables.

!!! notez "Un avertissement que vous pouvez ignorer"
    Le plugin reconnaît les thèmes pris en charge en faisant correspondre les chemins des fichiers modèles
    par rapport à une liste intégrée, donc il enregistre

```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

pour chaque thème tiers, y compris celui-ci. Le support ici est natif -
    rien n’a besoin d’être adapté – mais le message est inévitable du côté du thème.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] réécrit `theme.locale` uniquement pour les thèmes livrés prise en charge, qui n’inclut pas les thèmes tiers. Lecture de `theme.locale` seul, il étiquette donc chaque page traduite avec la langue par défaut.

`base.html` préfère la variable `i18n_page_locale` que le plugin met sur la page contexte, et revient à `theme.locale` lorsque le plugin est absent :

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

Les pages traduites sous `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` et `/fr/` portent l'attribut `lang` correspondant. Pages sans traduction `*.<locale>.md` revenez à leur source anglaise, qui est le comportement par défaut du plugin.

Lorsqu'au moins deux langues configurées ont `build: true`, l'en-tête affiche un sélecteur de langue. Ses étiquettes proviennent du `name` de chaque langue, et chaque entrée reste sur la même page dans les paramètres régionaux cible. Cela inclut les pages pour lequel le plugin revient à la langue source par défaut. Le sélecteur n'est pas rendu sans `mkdocs-static-i18n`, pour une version monolingue, ou sur la page statique 404.

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] lit le journal git et stocke le résultat dans `page.meta.git_revision_date_localized`. Rien ne l'affiche à moins que le thème le demande, donc un thème sans cette ligne donne l'impression que le plugin cassé. `partials/footer.html` l'imprime — la ligne "Dernière mise à jour" en bas de cette page.

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] a la même forme : il met `git_page_authors` sur le contexte de la page sous forme de chaîne HTML et laisse le afficher au thème. Le pied de page l'imprime à côté de la date de révision.

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] écrit `feed_rss_created.xml` et `feed_rss_updated.xml` mais n'ajoute aucun balisage, donc rien n'oriente le lecteur vers eux. `base.html` émet la paire `<link rel="alternate">`, en prenant les noms de fichiers de la propre configuration du plugin plutôt que de la coder en dur, car ce sont des options.

Le plugin n'est pas activé sur ce site — voir [Conflits de plugins connus](#known-plugin-conflicts).

### mike

[mike][mike] conserve plusieurs versions de documentation côte à côte et ajoute un liste déroulante des versions. Il trouve les ressources déroulantes d'un thème via `mike.themes` groupe de points d'entrée et, pour un thème qu'il ne trouve pas ici, construit **aucun sélecteur à tout et ne dit rien** — le site se déploie, les versions existent et le seul moyen se déplacer entre eux, c'est modifier l'URL.

`pyproject.toml` enregistre `mkdocs_primer.mike` sous ce groupe, donc Mike choisit up `version-select.css` et `version-select.js` à partir de ce package et des copies les entrer. Le sélecteur atterrit dans l'en-tête à côté du nom du site et suit le mode couleur. Les alias sont résolus en leur version réelle, donc `/latest/` affiche `2.0` sélectionné plutôt qu’un contrôle vide.

Ce script lit le `base_url` global, que `base.html` déclare sans condition. Auparavant, il n'était déclaré que lorsque le plugin `search` était activé, ce qui aurait laissé le sélecteur cassé sur un site sans recherche.

### mkdocs-print-site

[mkdocs-print-site][print-site] affiche l'ensemble du site sur une seule page en utilisant le les modèles du thème actif, qui fonctionne ici. Ce qu'il ne peut pas faire, c'est fournir des documents imprimés CSS : il fournit une feuille de style par thème qu'il connaît et prévient `Theme 'primer' not yet supported` pour le reste.

C'est de toute façon le travail du thème. `theme.css` porte un bloc `@media print` qui supprime l'en-tête, la barre latérale et la pagination, libère la colonne de contenu pour pleine largeur et empêche les blocs de code et les tables de se diviser sur les pages. Il épingle également le corps du texte à la couleur de premier plan *clair* de Primer, car un visiteur l’impression en mode sombre obtiendrait autrement un texte gris clair sur du papier blanc. Ce bloc s'applique à n'importe quelle page, avec ou sans le plugin.

### search

Le plugin `search` intégré a besoin du thème pour expédier un modèle `search.html` et pour charger `search/main.js` avec `base_url` dans la portée. Les deux sont dans le thème ; la zone de recherche d'en-tête apparaît chaque fois que le plugin est activé et disparaît lorsque ce n'est pas le cas.

### mkdocstrings

[mkdocstrings][mkdocstrings] émet son propre balisage avec les classes `doc-*` et laisse le style au thème. Cela est rendu lisible ici parce que tout atterrit à l'intérieur de `.markdown-body` et récupère l'échelle de type de Primer, mais le thème ne fournit aucune règle `doc-*` dédiée — les signatures et les tables de paramètres utilisent Primer valeurs par défaut. [Référence](../reference.md) est la page qu'il génère.

## Des plugins qui fonctionnent

Ceux-ci n’ont besoin de rien du thème au-delà du HTML bien formé. Le premier groupe est activé sur ce site, donc cela reste vrai :

| Plugin | Ce qu'il fait sur ce site |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Construit la navigation à partir de `docs/.nav.yml` au lieu d'une clé `nav:`. |
| [mkdocs-glightbox][glightbox] | Ouvre les images sur la [page d'accueil](../index.md) dans une lightbox. |
| [mkdocs-minify-plugin][minify] | Réduit le HTML, CSS et JS de chaque page, y compris le script de mode couleur en ligne du thème. |
| [mkdocs-redirects][redirects] | `/options/` redirige vers [Configuration](configuration.md). |
| [mkdocs-macros-plugin][macros] | Rend Jinja dans Markdown. Ce site est **{{ config.site_name }}**, construit avec le thème `{{ config.theme.name }}` — cette phrase vient du plugin, pas de Markdown. |

Le deuxième groupe a été comparé au thème dans une version préliminaire plutôt que connecté à ce site, car chacun veut du contenu de luminaire qui ne rapporterait pas sa place dans la documentation d'un thème :

| Plugin | Vérifié |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | La balise `<swagger-ui>` se développe et les éléments sont copiés. |
| [mkdocs-include-markdown-plugin][include-markdown] | Extrait en ligne. |
| [markdown-exec][markdown-exec] | Code exécuté, sortie intégrée. |
| [mkdocs-table-reader-plugin][table-reader] | CSV rendu sous forme de tableau. |
| [mkdocs-markdownextradata-plugin][extradata] | Valeurs `extra:` interpolées. |
| [mkdocs-autolinks-plugin][autolinks] | Liens nus `[file.md](file.md)` résolus. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Corps de la page chiffré sans texte brut dans le HTML, formulaire de mot de passe rendu, shell de thème intact autour. |
| [mkdocs-monorepo-plugin][monorepo] | Sous-projet fusionné via `!include`. |
| `material/group` | Active ou désactive un groupe de plugins. Avec le `search` intégré à l'intérieur, la zone de recherche du thème apparaît correctement lorsque le groupe est activé et disparaît lorsqu'il est désactivé. |

Plugins de navigation et au niveau des fichiers — [mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — n'atteignez jamais un modèle du tout.

<a id="known-plugin-conflicts"></a>

## Conflits de plugins connus

Tous les échecs ne sont pas le thème. Cinq à connaître, tous reproductibles sous n’importe quel thème.

Trois d'entre eux expliquent pourquoi ce site n'est pas la seule version du référentiel : le les plugins impliqués ne peuvent pas partager une configuration avec ceux déjà activés ici, donc ils obtiennent leur propre site sous `examples/`, construit avec `--strict` par le même travail CI.

La page [Examples](../examples.md) décrit ce que chacun d'eux montre.

- **mkdocs-rss-plugin avec mkdocs-static-i18n** — le plugin RSS réécrit son
  posséder `date_from_meta.default_time` d'une chaîne à un `datetime` pendant `on_config`. Le plugin i18n exécute `on_config` une fois par langue, donc la seconde pass réanalyse un `datetime` et avertit, abandonnant une build `--strict`. Démontré à la place sur [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files avec mkdocs-static-i18n** — fichiers créés pendant
  Les `on_files` ne sont pas classés par le plugin i18n, qui enregistre `Unhandled file case` et les supprime de la build. Démontré à la place à [examples/gen-files/]({{ config.site_url }}examples/gen-files/), ainsi que mkdocs-literate-nav, qui autrement rivaliserait avec mkdocs-awesome-nav pour la navigation.
- **Mermaid avec `minify_html`** — Mermaid analyse sa source ligne par ligne et
  le minifier réduit les nouvelles lignes à l'intérieur de son `<div>`. Le diagramme rend comme *Erreur de syntaxe dans le texte* et la version ne dit rien. Démontré à la place à [exemples/diagrammes/]({{ config.site_url }}examples/diagrams/), qui également couvre [mkdocs-charts-plugin][charts] et comment les deux sélectionnent le mode couleur.
- **mkdocs-monorepo sans `repo_url`** — la création d'une page de sous-projet augmente
  `TypeError: join() missing 1 required positional argument`. Configuration de `repo_url` et `edit_uri` l'évite. Se reproduit à l'identique sous le `mkdocs` intégré thème.
- **`material/search` avec un thème non-Matériau** — Plugin de recherche de Matériel
  restitue `partials/language.html` via Jinja du thème *actif* environnement. Sous tout thème qui ne propose pas ce modèle, il génère `TemplateNotFound` et la construction meurt. Utilisez le plugin `search` intégré à la place ; le thème est construit contre celui-là.


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
