# Éléments

Chaque bloc que le thème met en forme dans un article, présenté une fois. `@primer/css`
couvre l'essentiel de ce que produit le Markdown ; le reste est rassemblé ici — ce que
le thème ajoute par-dessus, et ce qu'une modification du thème peut facilement casser
sans qu'on s'en aperçoive. L'habillage autour de la page, lui, figure de toute façon sur chaque page.

Chaque type d'admonition a son propre sélecteur dans la feuille de style, si bien que
chaque alias a droit ci-dessous à son propre bloc plutôt qu'à une ligne de texte : un
type que personne n'écrit est un type dont personne ne remarque la disparition.

<a id="admonitions"></a>

## Admonitions

L'extension `admonition` produit du balisage sans aucun CSS, et `@primer/css` n'a pas
non plus de règle pour `.admonition` : tout ce qui suit vient donc du thème. La forme
reprend celle des alertes de GitHub — un fond teinté, un filet coloré en tête, un
titre coloré et l'octicon du type.[^alerts]

!!! note
    `note` prend le bleu d'accentuation de Primer et l'octicon `info`. Le code en
    ligne — `mkdocs.yml` — garde son propre fond translucide, qui se superpose à la
    teinte au lieu d'y percer un trou gris.

!!! tip
    `tip` prend le vert de succès et l'octicon `light-bulb`.

!!! hint "hint"
    Un alias de `tip`, avec un titre écrit à la main pour qu'on puisse distinguer
    les deux ici.

!!! important
    `important` prend le violet que Primer appelle « done », et l'octicon `report`.

!!! warning
    `warning` prend le jaune d'attention et l'octicon `alert`.

!!! attention "attention"
    Un alias de `warning`.

!!! caution "caution"
    Le second alias de `warning`.

!!! danger
    `danger` prend le rouge de danger et l'octicon `stop`.

!!! error "error"
    Un alias de `danger`.

!!! bug "bug"
    Le second alias de `danger`.

!!! example
    Un type pour lequel GitHub n'a pas d'alerte garde un fond neutre et un filet
    neutre, et n'affiche aucune icône — pas de titre coloré, ni d'espace vide à la place de l'icône.

!!! note "Un titre bien à vous, avec du `code` dedans"
    La couleur du type teinte tout le titre, et sur le fond propre au code en ligne
    ce mélange passe sous un contraste de 4,5:1 — le code d'un titre garde donc la
    couleur de texte par défaut.

!!! warning "Un bloc avec un titre et rien en dessous"

<a id="quotes"></a>

## Citations

> Une citation prend le fond neutre avec la moitié du remplissage d'une admonition :
> elle doit paraître plus discrète qu'une alerte, et non comme une alerte d'un autre genre.
>
> Deux paragraphes, pour montrer que le fond se referme sous le dernier et non
> sous le premier.

<a id="code"></a>

## Code

Les blocs délimités sont colorés par Pygments au moyen des variables `prettylights`
de Primer, ils suivent donc le mode de couleur. Chacun reçoit un bouton de copie
dans son coin.

```python
from mkdocs_primer import __version__


def greet(name: str = "world") -> str:
    """Docstrings, keywords, strings and numbers all take separate colors."""
    return f"hello {name} from {__version__}"
```

Un bloc dont les lignes sont plus longues que la colonne défile horizontalement au
lieu de revenir à la ligne ou d'élargir la page :

```console
$ mkdocs build --strict -f examples/rss/mkdocs.yml && mkdocs build --strict -f examples/gen-files/mkdocs.yml && mkdocs build --strict -f examples/diagrams/mkdocs.yml
```

Les diffs ont droit à un traitement particulier. La ligne à surveiller est l'en-tête
de bloc : c'est le seul endroit où la coloration s'écarte de la palette de GitHub, car
la couleur qu'utilise GitHub à cet endroit passe sous 4,5:1 sur le fond du code en mode sombre.

```diff
--- a/mkdocs.yml
+++ b/mkdocs.yml
@@ -1,3 +1,3 @@
 theme:
-  name: mkdocs
+  name: primer
```

<a id="tables"></a>

## Tableaux

Primer alterne la couleur des lignes et met l'en-tête en gras ; la seule chose que le
thème ajoute, c'est ce qui se passe quand un tableau ne tient pas. Trop large pour la
colonne, il défile horizontalement au lieu d'élargir la page — et comme un `table` ne
peut pas recevoir le focus, le thème en fait un arrêt de tabulation tant qu'il déborde,
pour que la partie qui dépasse reste accessible sans dispositif de pointage. La longue
commande ci-dessus reçoit exactement le même traitement, et elle est assez large pour le montrer.

Les surfaces de cette page viennent de `@primer/primitives`, ce qui explique aussi
qu'elles suivent le mode de couleur sans que le thème porte un second jeu de règles :

| Jeton | Clair | Sombre | Utilisé pour |
| --- | --- | --- | --- |
| `--bgColor-default` | `#ffffff` | `#0d1117` | l'article, et la page derrière lui |
| `--bgColor-inset` | `#f6f8fa` | `#010409` | l'en-tête et la barre latérale |
| `--bgColor-muted` | `#f6f8fa` | `#151b23` | les citations, et une admonition sans équivalent sur GitHub |
| `--bgColor-attention-muted` | `#fff8c5` | `#bb800926` | le fond derrière `!!! warning` |
| `--button-default-bgColor-rest` | `#f6f8fa` | `#212830` | les cartes précédent/suivant sous cette page |
| `--underlineNav-borderColor-active` | `#fd8c73` | `#f78166` | la marque de la page courante dans la barre latérale |

<a id="definition-lists"></a>

## Listes de définitions

L'extension `def_list` accepte une syntaxe plus simple que le HTML brut plus bas :

`docs_dir`

:   Répertoire où MkDocs lit le Markdown.

`site_dir`

:   Répertoire où MkDocs écrit le HTML.

Les deux arrivent chez Primer sous la forme du même `<dl>`, et c'est justement pour
cela qu'on les présente ensemble : une règle écrite pour l'une s'applique à l'autre.

<dl>
<dt>Nom</dt>
<dd>Godzilla</dd>
<dt>Naissance</dt>
<dd>1952</dd>
<dt>Lieu de naissance</dt>
<dd>Japon</dd>
</dl>

<a id="images"></a>

## Images

La largeur de la colonne est celle du thème — `.primer-content` porte le plafond qui
empêche le texte de s'étaler sur des lignes de 130 caractères — et une image plus large
que cette colonne mérite donc de figurer sur une page. Elle doit être contenue dans la
colonne plutôt que de pousser la mise en page sur le côté.

Ce sont aussi les seules images de contenu du site, et donc les seules sur lesquelles
[mkdocs-glightbox](guide/plugins.md) peut agir : cliquez sur l'une d'elles et elle
s'ouvre dans une lightbox.

![L'Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png)

![Création de branches dans un dépôt GitHub](https://docs.github.com/assets/images/help/repository/branching.png)

<a id="headings"></a>

## Titres

Les titres de cette page servent à construire le sommaire de la colonne de droite, et
chacun porte un permalien qui apparaît au survol — une octicon que le thème dessine
par-dessus l'ancre produite par l'extension `toc`.

<a id="a-third-level"></a>

### Un troisième niveau

Les titres imbriqués sont décalés dans le sommaire : celui-ci y apparaît donc sous
**Titres**.

<a id="a-fourth-level"></a>

#### Un quatrième niveau

Assez profond pour montrer que le sommaire continue de décaler les entrées, et qu'une
entrée de la colonne aussi profonde a encore la place d'afficher son texte.

[^alerts]: GitHub affiche ses propres alertes avec une classe `.markdown-alert` que
    `@primer/css` ne publie pas ; le thème met donc directement en forme le balisage
    `.admonition` de l'extension. C'est aussi cette note de bas de page qui met à
    l'épreuve l'extension `footnotes`.
