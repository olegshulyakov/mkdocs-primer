# Exemples

Trois sites complets se trouvent sous `examples/` dans le dépôt. Chacun est construit
avec `--strict` par la même tâche de CI que ce site et publié à côté de lui : ce que vous
voyez est donc bien ce que produit la configuration ci-dessous.

Ils existent parce que les plugins concernés ne peuvent pas partager une configuration
avec ceux que ce site utilise déjà — [Plugins](guide/plugins.md) explique ce qui casse
dans chaque cas. Voyez-les plutôt comme trois choses que fait le thème que comme une
conséquence de ce problème : un site avec un flux, un site dont les pages sont écrites
par un script, et un site avec des diagrammes.

<a id="a-site-with-a-feed"></a>

## Un site avec un flux

[**examples/rss/**]({{ config.site_url }}examples/rss/) utilise
[mkdocs-rss-plugin](https://guts.github.io/mkdocs-rss-plugin/), qui écrit
`feed_rss_created.xml` et `feed_rss_updated.xml` et s'arrête là. Le thème émet la
paire `<link rel="alternate">` qui indique ces fichiers à un navigateur ou à un lecteur
de flux, en prenant les noms de fichiers dans la configuration du plugin lui-même plutôt
que de les coder en dur — affichez le code source de la page sur ce site, les deux sont dans le `<head>`.

Le même site active `git-authors` : le pied de page indique donc qui a modifié la page en
dernier, à côté du lien « Améliorer cette page » du thème.

<a id="pages-that-do-not-exist-on-disk"></a>

## Des pages qui n'existent pas sur le disque

[**examples/gen-files/**]({{ config.site_url }}examples/gen-files/) construit sa
section `Generated` au moment du build : `gen_pages.py` écrit le Markdown au moyen de
[mkdocs-gen-files](https://oprypin.github.io/mkdocs-gen-files/), et
[mkdocs-literate-nav](https://github.com/oprypin/mkdocs-literate-nav) tire la
navigation d'un `SUMMARY.md` qui l'inclut. Rien sous `generated/` ne se trouve
dans le dépôt.

C'est la combinaison à partir de laquelle on construit d'ordinaire une référence d'API,
et c'est la barre latérale qu'il faut regarder : elle s'imbrique, et le libellé de sa
section est un lien, parce que `section-index` a intégré la page d'index générée à la section elle-même.

<a id="diagrams-and-charts"></a>

## Diagrammes et graphiques

[**examples/diagrams/**]({{ config.site_url }}examples/diagrams/) affiche des
diagrammes Mermaid avec
[mkdocs-mermaid2](https://mkdocs-mermaid2.readthedocs.io/) et des graphiques Vega-Lite
avec [mkdocs-charts-plugin](https://timvink.github.io/mkdocs-charts-plugin/).

Les deux dessinent dans le navigateur, il faut donc indiquer à chacun le mode de couleur
de la page — sinon un diagramme devient une carte blanche au milieu d'un article sombre.
Mermaid lit l'attribut `data-color-mode` du thème au moyen d'une expression JavaScript
dans le `mkdocs.yml` de ce site ; le plugin de graphiques cherche plutôt l'attribut de
Material, et la page de ce site explique ce qui en résulte. Aucun des deux ne redessine
quand on utilise le bouton de l'en-tête, et c'est pourquoi le thème émet un événement
`primer:color-mode-change` pour les pages qui veulent le gérer.

<a id="building-them-yourself"></a>

## Les construire vous-même

Chaque exemple a son propre `mkdocs.yml` et écrit dans `site/examples/<name>/`.
Construisez d'abord le site principal : `mkdocs build` vide `site/`, et emporterait
les exemples avec lui.

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
$ mkdocs build --strict -f examples/diagrams/mkdocs.yml
```
