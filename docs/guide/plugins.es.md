# Complementos

La mayoría de los complementos de MkDocs nunca tocan una plantilla, por lo que funcionan con cualquier tema. un
Un puñado no lo hace: esperan que el tema represente algo que ellos calcularon, o que
manejar una forma de navegación que crearon. Esos son los que vale la pena comprobar.

Este sitio es el cheque. `mkdocs.yml` en la raíz del repositorio habilita los complementos
que necesitan soporte de tema, y CI lo construye con `--strict`, por lo que una regresión
rompe la construcción en lugar de degradar silenciosamente una página. Los candidatos fueron elegidos
del [catálogo MkDocs](https://github.com/mkdocs/catalog), trabajando hacia abajo por
popularidad.

## Complementos que necesitan algo del tema

### mkdocs-section-index

[mkdocs-section-index][section-index] incluye `guide/index.md` en la **Guía**
sección en sí, por lo que un elemento de navegación termina con `children` y `url`. un tema
que muestra "tiene hijos" como una etiqueta de sección simple hace que la página de índice
inalcanzable desde la barra lateral.

`partials/nav-item.html` comprueba `nav_item.url` y representa la etiqueta como un enlace
cuando hay uno. Puedes verlo en la barra lateral: **Guía** y **Anidados** son
ambos en los que se puede hacer clic.

!!! nota "Una advertencia que puedes ignorar"
    El complemento reconoce los temas compatibles al hacer coincidir las rutas de los archivos de plantilla
    contra una lista incorporada, por lo que registra

```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

para cada tema de terceros, incluido este. El soporte aquí es nativo:
    no es necesario adaptar nada, pero el mensaje es inevitable desde el punto de vista temático.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] reescribe `theme.locale` solo para los temas que incluye
soporte para, que no incluye temas de terceros. Leyendo `theme.locale`
Por lo tanto, solo etiqueta cada página traducida con el idioma predeterminado.

`base.html` prefiere la variable `i18n_page_locale` que el complemento coloca en la página
contexto y recurre a `theme.locale` cuando el complemento está ausente:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

Las páginas traducidas en `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` y `/fr/`
lleva el atributo `lang` correspondiente. Páginas sin traducción `*.<locale>.md`
recurra a su fuente en inglés, que es el comportamiento predeterminado del complemento.

Cuando al menos dos idiomas configurados tienen `build: true`, el encabezado también
representa un selector de idioma. Sus etiquetas provienen del `name` de cada idioma, y
cada entrada permanece en la misma página en la configuración regional de destino. Esto incluye páginas
para lo cual el complemento recurre a la fuente del idioma predeterminado. el seleccionador
no se representa sin `mkdocs-static-i18n`, para una compilación en un solo idioma, o
en la página 404 estática.

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] lee el registro de git y almacena el
resultado en `page.meta.git_revision_date_localized`. Nada lo muestra a menos que
el tema lo solicita, por lo que un tema sin esa línea hace que el complemento parezca
roto. `partials/footer.html` lo imprime: la línea "Última actualización" en la parte inferior
de esta página.

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] tiene la misma forma: pone
`git_page_authors` en el contexto de la página como una cadena de HTML y deja el
mostrar al tema. El pie de página lo imprime junto a la fecha de revisión.

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] escribe `feed_rss_created.xml` y
`feed_rss_updated.xml` pero no agrega ningún marcado, por lo que nada señala al lector hacia ellos.
`base.html` emite el par `<link rel="alternate">`, tomando los nombres de archivo de
la propia configuración del complemento en lugar de codificarlas, ya que son opciones.

El complemento no está habilitado en este sitio; consulte [Conflictos de complementos conocidos] (#conflictos-de-complementos-conocidos).

### mike

[mike][mike] mantiene varias versiones de documentación una al lado de la otra y agrega una
menú desplegable de versiones. Encuentra los recursos desplegables de un tema a través de `mike.themes`
grupo de puntos de entrada y, para un tema que no puede encontrar allí, crea **sin selector en
todo y no dice nada**: el sitio se implementa, las versiones existen y la única manera
moverse entre ellos es editar la URL.

`pyproject.toml` registra `mkdocs_primer.mike` en ese grupo, por lo que Mike elige
up `version-select.css` y `version-select.js` de este paquete y copias
ellos. El selector aterriza en el encabezado al lado del nombre del sitio y sigue el
modo de color. Los alias se resuelven en su versión real, por lo que `/latest/` muestra `2.0`.
seleccionado en lugar de un control vacío.

Ese script lee el `base_url` global, que declara `base.html`
incondicionalmente. Solía declararse solo cuando el complemento `search` estaba
habilitado, lo que habría dejado el selector roto en un sitio sin búsqueda.

### mkdocs-print-site

[mkdocs-print-site][print-site] representa todo el sitio como una sola página usando el
plantillas del tema activo, que funciona aquí. Lo que no puede hacer es suministrar impresiones.
CSS: envía una hoja de estilo por tema que conoce y advierte
`Theme 'primer' not yet supported` para el resto.

Ese es el trabajo del tema de todos modos. `theme.css` lleva un bloque `@media print`
que elimina el encabezado, la barra lateral y la paginación, libera la columna de contenido para
ancho completo y evita que los bloques de código y las tablas se divida entre páginas. eso
también fija el texto del cuerpo en el color de primer plano *claro* de Primer, porque un visitante
Al imprimir en modo oscuro, de lo contrario se obtendría texto gris claro en papel blanco.
Ese bloqueo se aplica a cualquier página, con o sin el complemento.

### search

El complemento `search` integrado necesita el tema para enviar una plantilla `search.html`
y cargar `search/main.js` con `base_url` en el alcance. Ambos están en el tema;
El cuadro de búsqueda del encabezado aparece cada vez que el complemento está habilitado y desaparece cuando
no lo es.

### mkdocstrings

[mkdocstrings][mkdocstrings] emite su propio marcado con clases `doc-*` y
deja el estilo al tema. Aquí se muestra legible porque todo
aterriza dentro de `.markdown-body` y retoma la escala de tipos de Primer, pero el tema
no incluye reglas `doc-*` dedicadas: las firmas y tablas de parámetros utilizan Primer's
valores predeterminados. [Referencia](../reference.md) es la página que genera.

## Complementos que simplemente funcionan

Estos no necesitan nada del tema más allá de HTML bien formado. El primer grupo es
habilitado en este sitio, por lo que sigue siendo cierto:

| Complemento | Qué hace en este sitio |
|:---|:---|
| [mkdocs-navegación-increíble][awesome-nav] | Crea la navegación desde `docs/.nav.yml` en lugar de una clave `nav:`. |
| [mkdocs-glightbox][glightbox] | Abre las imágenes en la [página de inicio](../index.md) en una caja de luz. |
| [mkdocs-minify-plugin][minify] | Minimiza el HTML, CSS y JS de cada página, incluido el script de modo de color en línea del tema. |
| [mkdocs-redirects][redirects] | `/options/` redirige a [Configuración](configuration.md). |
| [mkdocs-macros-plugin][macros] | Representa a Jinja en Markdown. Este sitio es **{{ config.site_name }}**, creado con el tema `{{ config.theme.name }}`; esa oración proviene del complemento, no de Markdown. |

El segundo grupo se comparó con el tema en una versión preliminar en lugar de
conectado a este sitio, porque cada uno quiere contenido fijo que no ganaría
su lugar en la documentación de un tema:

| Complemento | Comprobado |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | La etiqueta `<swagger-ui>` se expande y los recursos se copian. |
| [mkdocs-include-markdown-plugin][include-markdown] | Fragmento en línea. |
| [markdown-exec][markdown-exec] | Código ejecutado, salida incorporada. |
| [mkdocs-table-reader-plugin][table-reader] | CSV representado como una tabla. |
| [mkdocs-markdownextradata-plugin][extradata] | Valores `extra:` interpolados. |
| [mkdocs-autolinks-plugin][autolinks] | Se resolvieron los enlaces desnudos de `[file.md](file.md)`. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Cuerpo de la página cifrado sin texto sin formato en el HTML, formulario de contraseña representado, shell del tema intacto a su alrededor. |
| [mkdocs-monorepo-plugin][monorepo] | Subproyecto fusionado a través de `!include`. |
| `material/group` | Habilita o deshabilita un grupo de complementos. Con el `search` integrado en su interior, el cuadro de búsqueda del tema aparece correctamente cuando el grupo está activado y desaparece cuando está desactivado. |

Complementos de navegación y a nivel de archivos: [mkdocs-literate-nav][literate-nav],
[mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — nunca llegue a un
plantilla en absoluto.

## Conflictos de complementos conocidos

No todos los fracasos son del tema. Cuatro que vale la pena conocer, todos reproducibles.
bajo cualquier tema.

Dos de ellos explican por qué este sitio no es la única compilación en el repositorio: el
Los complementos involucrados no pueden compartir una configuración con los que ya están habilitados aquí, por lo que
obtienen un sitio propio bajo `examples/`, creado con `--strict` por el
mismo trabajo de CI.

- **mkdocs-rss-plugin con mkdocs-static-i18n** — el complemento RSS reescribe su
  propio `date_from_meta.default_time` de una cadena a un `datetime` durante
  `on_config`. El complemento i18n ejecuta `on_config` una vez por idioma, por lo que el segundo
  pass vuelve a analizar un `datetime` y advierte, abortando una compilación de `--strict`. demostrado
  en su lugar en [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files con mkdocs-static-i18n** — archivos creados durante
  `on_files` no están clasificados por el complemento i18n, que registra
  `Unhandled file case` y los elimina de la compilación. Demostrado en cambio en
  [examples/gen-files/]({{ config.site_url }}examples/gen-files/), junto con
  mkdocs-literate-nav, que de otro modo competiría con mkdocs-awesome-nav por
  la navegación.
- **Mermaid con `minify_html`** — Mermaid analiza su fuente línea por línea y
  el minificador colapsa las nuevas líneas dentro de su `<div>`. El diagrama se representa como
  *Error de sintaxis en el texto* y la compilación no dice nada. Demostrado en cambio en
  [ejemplos/diagramas/]({{ config.site_url }}ejemplos/diagramas/), que también
  cubre [mkdocs-charts-plugin][charts] y cómo ambos seleccionan el modo de color.
- **mkdocs-monorepo sin `repo_url`**: aumenta la creación de una página de subproyecto
  `TypeError: join() missing 1 required positional argument`. Configuración de `repo_url`
  y `edit_uri` lo evita. Se reproduce de forma idéntica bajo el `mkdocs` integrado.
  tema.
- **`material/search` con un tema que no es Material** — Complemento de búsqueda de Material
  renderiza `partials/language.html` a través de Jinja del tema *activo*
  ambiente. Bajo cualquier tema que no lleve esa plantilla plantea
  `TemplateNotFound` y la compilación muere. Utilice el complemento `search` integrado
  en cambio; el tema se construye en contra de ese.


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
