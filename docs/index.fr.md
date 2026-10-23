# Thème MkDocs Primer

Un thème [MkDocs](https://www.mkdocs.org/) construit sur le [système de design
Primer de GitHub](https://primer.style/) : une documentation qui semble tout
droit sortie de GitHub.

Ce site, c'est le thème qui s'affiche lui-même. L'article que vous lisez est mis
en forme par les règles `.markdown-body` de GitHub, et tout ce qui l'entoure
— l'en-tête, l'arborescence de navigation, le fil d'Ariane, le sommaire de la
colonne de droite — est ce qu'obtient votre propre site avec deux lignes de configuration.

<a id="install"></a>

## Installation

```console
$ pip install mkdocs-primer
```

```yaml
# mkdocs.yml
theme:
  name: primer
```

C'est toute la configuration : chaque option a une valeur par défaut qui
fonctionne, et le thème affiche la `nav` que MkDocs a déjà construite. Voir [Installation](guide/installation.md).

<a id="what-you-get"></a>

## Ce que vous obtenez

- **Le rendu d'un article sur GitHub** : la typographie, les tableaux, l'habillage
  du code et les ancres au survol d'un README sur github.com. Le CSS de Primer est
  embarqué dans le paquet, l'installation du thème ne demande donc aucune chaîne d'outils Node.
- **Clair et sombre**, à partir des primitives de couleur de Primer. Le contrôle de
  l'en-tête suit le système d'exploitation jusqu'à ce que le visiteur choisisse un mode,
  puis retient ce choix. La coloration syntaxique suit, elle aussi.
- **Une navigation qui passe à l'échelle** : une barre latérale à imbrication illimitée,
  repliée jusqu'à la section où se trouve le lecteur, ainsi qu'un fil d'Ariane, des liens
  précédent/suivant, une page de recherche et une page 404.
- **Des admonitions mises en forme d'après les alertes de GitHub.** L'extension
  `admonition` ne fournit aucun CSS et `@primer/css` n'a aucune règle pour elle, si bien
  qu'avec la plupart des thèmes `!!! note` s'affiche sans aucune décoration.
- **Sept langues** pour les textes propres au thème — anglais, espagnol, français,
  hindi, portugais, russe et chinois — ainsi que les mises en page de droite à gauche.
- **La prise en charge des plugins qui ont besoin de l'aide d'un thème** : pages d'index
  de section, sites traduits, dates de révision et auteurs, découverte automatique des
  flux RSS et sélecteur de version de mike.

<a id="where-to-go-next"></a>

## Pour aller plus loin

[Guide](guide/index.md)

:   L'installation, toutes les options du thème et les plugins avec lesquels ce
    thème est éprouvé.

[Éléments](elements.md)

:   Chaque bloc que le thème met en forme dans un article, présenté une fois :
    admonitions, citations, code, tableaux, images.

[Mise en forme](styling.md)

:   Les variables à définir dans votre propre feuille de style, et la seule
    redéfinition de jeton Primer qui ne fonctionne pas comme on s'y attendrait.

[Exemples](examples.md)

:   Trois sites complets qui montrent ce que fait le thème avec des flux, des pages
    générées et des diagrammes.

[Référence](reference.md)

:   La documentation du paquet du thème lui-même, générée par mkdocstrings.
