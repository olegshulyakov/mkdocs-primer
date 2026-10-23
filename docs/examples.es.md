# Ejemplos

En el directorio `examples/` del repositorio hay tres sitios completos. Cada uno
se construye con `--strict` en el mismo trabajo de CI que este sitio y se
publica junto a él, así que lo que ves es lo que produce la configuración que se
describe a continuación.

Existen porque los plugins implicados no pueden compartir configuración con los
que ya usa este sitio: [Plugins](guide/plugins.md) explica qué falla en cada
caso. Léelos como tres cosas que hace el tema más que como una consecuencia de
eso: un sitio con un feed, un sitio cuyas páginas escribe un script y un sitio
con diagramas.

<a id="a-site-with-a-feed"></a>

## Un sitio con un feed

[**examples/rss/**]({{ config.site_url }}examples/rss/) ejecuta
[mkdocs-rss-plugin](https://guts.github.io/mkdocs-rss-plugin/), que escribe
`feed_rss_created.xml` y `feed_rss_updated.xml` y no hace nada más. El tema
genera el par de `<link rel="alternate">` que dirige a un navegador o a un
lector hacia ellos, y toma los nombres de archivo de la configuración del propio
plugin en lugar de fijarlos en el código: mira el código fuente de la página ahí
y verás ambos en el `<head>`.

El mismo sitio tiene `git-authors` activado, así que el pie de página muestra
quién modificó la página por última vez junto al enlace "Mejorar esta página"
del tema.

<a id="pages-that-do-not-exist-on-disk"></a>

## Páginas que no existen en disco

[**examples/gen-files/**]({{ config.site_url }}examples/gen-files/) construye su
sección `Generated` durante la compilación: `gen_pages.py` escribe el Markdown
mediante [mkdocs-gen-files](https://oprypin.github.io/mkdocs-gen-files/), y
[mkdocs-literate-nav](https://github.com/oprypin/mkdocs-literate-nav) toma la
navegación de un `SUMMARY.md` que la incluye. Nada de lo que hay en
`generated/` está en el repositorio.

Esta es la combinación con la que se suele construir una referencia de API, y
lo que hay que mirar es la barra lateral: se anida, y la etiqueta de su sección
es un enlace, porque `section-index` ha integrado la página de índice generada
en la propia sección.

<a id="diagrams-and-charts"></a>

## Diagramas y gráficos

[**examples/diagrams/**]({{ config.site_url }}examples/diagrams/) renderiza
diagramas de Mermaid mediante
[mkdocs-mermaid2](https://mkdocs-mermaid2.readthedocs.io/) y gráficos de
Vega-Lite mediante
[mkdocs-charts-plugin](https://timvink.github.io/mkdocs-charts-plugin/).

Ambos dibujan en el navegador, así que a ambos hay que decirles en qué modo de
color está la página; de lo contrario, un diagrama es una tarjeta blanca en un
artículo oscuro. Mermaid lee el atributo `data-color-mode` del tema mediante una
expresión de JavaScript en el `mkdocs.yml` de ese sitio; el plugin de gráficos
busca en cambio el atributo de Material, y la página de ese sitio explica qué
consecuencias tiene. Ninguno vuelve a dibujar cuando se usa el selector del
encabezado, y por eso el tema lanza un evento `primer:color-mode-change` para
las páginas que quieran gestionarlo.

<a id="building-them-yourself"></a>

## Construirlos tú mismo

Cada ejemplo tiene su propio `mkdocs.yml` y escribe en `site/examples/<name>/`.
Construye primero el sitio principal: `mkdocs build` limpia `site/` y se
llevaría los ejemplos por delante.

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
$ mkdocs build --strict -f examples/diagrams/mkdocs.yml
```
