# Configuración

<a id="theme-options"></a>

## Opciones del tema

| Opción | Predeterminado | Descripción |
|:---|:---|:---|
| `logo` | `null` | Imagen que se muestra junto al nombre del sitio, relativa a `docs_dir`. |
| `favicon` | `img/favicon.svg` | Icono del sitio. |
| `icon` | `octicons` | Conjunto de iconos para los controles del tema: `octicons` o `lucide`. |
| `font.text` | `null` | Valor CSS de `font-family` para la interfaz y el texto. |
| `font.code` | `null` | Valor CSS de `font-family` para el código en línea y en bloque. |
| `font.source` | `null` | URL de una hoja de estilos externa o una hoja de estilos local dentro de `docs_dir`. |
| `locale` | `en` | Idioma de los textos propios del tema. Se incluyen catálogos para `en`, `es`, `fr`, `hi`, `pt`, `ru` y `zh`. |
| `direction` | `ltr` | Dirección del documento: `ltr` o `rtl`. |
| `include_sidebar` | `true` | Muestra la barra lateral de navegación. |
| `show_footer` | `true` | Muestra la barra del pie de página. |
| `show_footer_generator` | `true` | Muestra "Hecho con mkdocs-primer y MkDocs" en el pie de página. |
| `social` | `[]` | Enlaces con icono que se muestran en el pie de página. |
| `show_metadata` | `true` | Muestra la línea de metadatos bajo el título de la página. |
| `show_metadata_created` | `true` | Muestra la fecha de creación. |
| `show_metadata_updated` | `true` | Muestra la fecha de la última actualización. |
| `show_metadata_reading_time` | `true` | Muestra el tiempo de lectura estimado. |
| `show_metadata_authors` | `true` | Muestra los autores. |
| `toc` | `auto` | Esquema del "Índice": `auto`, `expanded`, `collapsed` o `hidden`. |
| `offline` | `false` | Registra un service worker, que la compilación del sitio tiene que generar por su cuenta. |
| `color_mode` | `auto` | Modo de color inicial: `auto`, `light` o `dark`. |
| `light_theme` | `light` | Tema de Primer que se usa en modo claro. |
| `dark_theme` | `dark` | Tema de Primer que se usa en modo oscuro. |

`color_mode` solo fija el modo *inicial*. Los visitantes pueden cambiarlo con el selector del encabezado, y su elección se guarda en `localStorage`.

`toc` decide dónde va el esquema construido a partir de los encabezados de la página actual. `auto` lo coloca en la columna derecha cuando la ventana es lo bastante ancha para una tercera columna y, si no, bajo el título de la página, donde es un desplegable que el lector abre en lugar de una lista plantada entre el título y el primer párrafo. `expanded` lo mantiene en el flujo y fuera de la columna, `collapsed` lo convierte en un desplegable que el lector abre, y `hidden` —o `false`— lo omite.

<a id="metadata-line"></a>

## Línea de metadatos

Justo bajo el título de la página, encima del texto, el tema puede mostrar una línea de datos sobre la página actual: cuándo se creó, cuándo cambió por última vez, cuánto se tarda en leerla y quién la escribió. Cada elemento aparece solo cuando su propia opción está activada *y* hay datos que mostrar, y la línea entera se omite cuando ninguno de los cuatro mostraría nada.

```yaml
theme:
  name: primer
  show_metadata: true # the line's own switch; false hides all four items
  show_metadata_created: true
  show_metadata_updated: true
  show_metadata_reading_time: true
  show_metadata_authors: true
```

`show_metadata` desactiva la línea entera, independientemente de los campos que hay debajo. Cada campo también se puede desactivar por separado; por ejemplo, en un sitio que quiere las fechas pero no una estimación del tiempo de lectura.

`show_metadata_reading_time` estima los minutos de lectura a partir del número de palabras de la página renderizada, a 265 palabras por minuto, la velocidad media de lectura de un adulto, y se omite en las páginas sin contenido propio, como el índice de una sección.

Las dos fechas proceden de [mkdocs-git-revision-date-localized](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin):

```yaml
plugins:
  - git-revision-date-localized:
      enable_creation_date: true # also required for the "created" date
```

Ninguna de las dos fechas aparece si ese plugin no está activado, y la fecha de creación necesita en concreto `enable_creation_date: true`: el valor predeterminado del propio plugin la deja desactivada.

Los autores proceden de [mkdocs-git-authors](https://github.com/timvink/mkdocs-git-authors-plugin) y tampoco aparecen si ese plugin no está activado.

<a id="footer"></a>

## Pie de página

Una barra a lo ancho del pie de cada página, por debajo de todo el diseño. Lleva dos líneas de texto a un lado y una fila de enlaces con icono al otro, y se omite por completo cuando no hay nada que poner en ella. `show_footer: false` la elimina, se configure lo que se configure.

Todos los enlaces de la barra salen de la documentación, así que todos se abren en una pestaña propia.

La primera línea contiene el copyright y dónde encontrar el código fuente de la página; para esto último, consulta [Enlaces de edición](#edit-links). El copyright es la opción `copyright` del propio MkDocs, una clave de nivel superior y no una opción del tema:

```yaml
copyright: Copyright &copy; 2026 Your Name
```

La segunda línea indica con qué se ha construido el sitio. Se desactiva con `show_footer_generator: false`:

```yaml
theme:
  name: primer
  show_footer_generator: false
```

<a id="social-links"></a>

### Enlaces sociales

`social` es una lista de enlaces que se dibujan como iconos, en el lado opuesto al copyright:

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

`service` nombra uno de los logotipos que incluye el tema. `name` es opcional: es el nombre accesible del enlace —lo que anuncia un lector de pantalla— y, por defecto, es el nombre del propio servicio, así que indica uno siempre que "GitHub" a secas no deje claro adónde lleva el enlace.

Estos son los servicios:

`bitbucket`, `bluesky`, `codeberg`, `devdotto`, `discord`, `docker`, `facebook`, `forgejo`, `github`, `githubsponsors`, `gitlab`, `instagram`, `kofi`, `mastodon`, `matrix`, `medium`, `npm`, `opencollective`, `patreon`, `pypi`, `reddit`, `rss`, `stackoverflow`, `substack`, `telegram`, `twitch`, `x`, `youtube`, `zulip`.

Para cualquier otro, apunta `icon` a un SVG dentro de `docs_dir` en lugar de nombrar un `service`:

```yaml
theme:
  name: primer
  social:
    - icon: img/linkedin.svg
      link: https://www.linkedin.com/company/your-company
      name: Your Company on LinkedIn
```

Un logotipo así se dibuja como un `<img>`, de modo que, a diferencia de los integrados, conserva sus propios colores en lugar de seguir los del texto que lo rodea. LinkedIn y Slack necesitan esta vía: ambos pidieron que se los retirara del conjunto de iconos del que se nutre el tema, así que ninguno de los dos viene incluido.

Los logotipos son de [Simple Icons](https://github.com/simple-icons/simple-icons), publicados bajo CC0-1.0. Las marcas que representan no lo están: cada una sigue siendo marca registrada de su titular, y ponerla en tu pie de página no implica ninguna afiliación con su titular ni ningún respaldo por su parte.

<a id="icons"></a>

## Iconos

La navegación del encabezado, el control del modo de color, el botón "Volver arriba" y el botón de copiar de los bloques de código usan SVG en línea de un único conjunto de iconos. `octicons` es el predeterminado; para elegir los iconos de Lucide:

```yaml
theme:
  name: primer
  icon: lucide
```

Ambos conjuntos vienen incluidos en el tema, así que ninguna de las dos opciones añade una petición a un CDN. La elección de iconos solo afecta a los controles HTML del tema. El selector de idioma siempre usa el globo de Octicons. La sintaxis de iconos en Markdown y los paquetes de iconos arbitrarios de terceros no se admiten de forma deliberada.

<a id="fonts"></a>

## Fuentes

Las fuentes son opcionales: por defecto, el tema no pide nada a ningún CDN de fuentes. Define por separado las familias del texto y del código y apunta `source` a una hoja de estilos externa o a un archivo CSS dentro de `docs_dir`:

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

Para un sitio que aloja sus propias fuentes, coloca los archivos de fuente y una hoja de estilos en `docs_dir` y usa una ruta relativa en `source`:

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

El navegador guarda esos archivos en caché como cualquier otro. Alojar las fuentes uno mismo evita una petición a terceros y mantiene el sitio usable sin conexión una vez que sus recursos están en caché.

<a id="language"></a>

## Idioma

Los textos propios del tema —`Search`, `Back to top`, `Previous`/`Next`, las etiquetas del pie de página— proceden de un catálogo de gettext, con independencia del idioma en que estén escritas tus páginas. Elige uno con `locale`:

```yaml
theme:
  name: primer
  locale: ru
```

Se incluyen catálogos para `en`, `es`, `fr`, `hi`, `pt`, `ru` y `zh`. Un idioma que no está en la lista recurre al inglés en lugar de hacer fallar la compilación.

!!! note "Los sitios multilingües necesitan `locale` en cada idioma"
    mkdocs-static-i18n solo fija `theme.locale` automáticamente para los temas
    que incluye el propio MkDocs, así que a un tema de terceros hay que
    indicárselo de forma explícita. Añádelo a cada idioma o todos mostrarán la
    interfaz en inglés:

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

!!! warning "Pon el idioma predeterminado al final de la lista"
    El plugin hace una pasada de compilación por idioma, y las páginas que
    existen una sola vez para todo el sitio —`404.html` y `search.html`— se
    reescriben en cada pasada. Por tanto, esas dos salen en el idioma que
    aparece **el último**. Pon el idioma predeterminado al final para que
    queden en él. El tema ordena el selector de idioma por su cuenta, así que
    esto no cambia el orden que ven los visitantes.

Para añadir o corregir un idioma, edita `mkdocs_primer/locales/<locale>/LC_MESSAGES/messages.po` y vuelve a compilarlo; consulta [`RELEASING.md`](https://github.com/olegshulyakov/mkdocs-primer/blob/main/RELEASING.md).

<a id="right-to-left-layouts"></a>

## Diseños de derecha a izquierda

Configura `direction: rtl` para un documento de derecha a izquierda. El tema pone `dir="rtl"` en el elemento HTML raíz y refleja el encabezado, la barra lateral, la navegación móvil, la paginación, el pie de página, los menús y los controles mediante propiedades lógicas de CSS. El código y los diagramas se mantienen de izquierda a derecha de forma intencionada.

```yaml
theme:
  name: primer
  direction: rtl
```

La dirección es un ajuste de todo el sitio; el tema no la deduce de la página ni del idioma.

!!! warning "Por ahora, `light_theme` y `dark_theme` solo aceptan `light` y `dark`"
    Primer publica catorce temas (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia`, etc.), pero este tema solo incluye los tokens de color de
    dos de ellos: el conjunto completo añadiría bastante más de un megabyte de
    CSS. Si se indica cualquier otro tema, la página se muestra sin ningún color
    en lugar de producir un error. La compatibilidad con más temas está prevista
    como una incorporación futura.

<a id="heading-anchors"></a>

## Anclas de encabezado

Para tener el ancla que GitHub muestra al pasar el cursor junto a cada encabezado, activa la extensión `toc` con un enlace permanente al inicio que lleve la clase `anchor` de Primer:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

El tema dibuja el octicon por su cuenta, así que `permalink` se fija en una cadena vacía en lugar del habitual `true`. Eso importa por algo más que la apariencia: el plugin de búsqueda de MkDocs no elimina los glifos de los enlaces permanentes, así que, de lo contrario, aparecería un `¶` en tus resultados de búsqueda.

Sin esta configuración el enlace permanente sigue funcionando; simplemente se muestra como un glifo sin más en lugar del octicon.

<a id="syntax-highlighting"></a>

## Resaltado de sintaxis

Los colores del código proceden de las variables `prettylights` de Primer, así que siguen automáticamente el modo de color activo. No hace falta elegir ningún estilo de Pygments:

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

Tanto el contenedor `.highlight` como el `.codehilite` tienen estilos, así que `codehilite` también funciona.

El tema añade un botón de copiar a cada bloque `.highlight` de Pygments. Copia el código visible y anuncia si la operación con el portapapeles ha tenido éxito. Los bloques que generan los plugins, como Mermaid y Vega-Lite, quedan excluidos de forma intencionada.

<a id="navigation-controls"></a>

## Controles de navegación

Tras desplazarse 400 píxeles, aparece un botón "Volver arriba" en la esquina inferior derecha de la página. Lleva al visitante al principio del documento y mueve el foco del teclado al enlace del título del sitio. El movimiento es instantáneo cuando el visitante ha pedido reducir el movimiento.

<a id="offline-support"></a>

## Uso sin conexión

`offline: true` añade una sola cosa a cada página: un script que registra `service-worker.js` desde la raíz del sitio. El tema no escribe ese archivo, y MkDocs no tiene nada que lo haga: generarlo es un paso que tu propia compilación tiene que ejecutar después de `mkdocs build`:

```yaml
theme:
  name: primer
  offline: true
```

```console
$ mkdocs build
$ npx workbox generateSW workbox-config.cjs
```

El service worker es lo que precachea el sitio compilado, de modo que un visitante que ya lo ha visitado una vez puede volver a leerlo sin red. Si dejas `offline` en `false`, no se emite ningún registro, que es lo que quiere un sitio sin ese paso de compilación: una página que pide un `service-worker.js` que nadie ha generado registra un 404 en cada visita.

Hay dos cosas que no puede hacer. Los service workers se rechazan fuera de un contexto seguro, así que el sitio tiene que servirse por HTTPS o desde `localhost`; nada de esto hace que una carpeta abierta mediante `file://` funcione sin conexión. Y el precacheo empieza en la *segunda* visita: la primera es la que llena la caché.

El propio `workbox-config.cjs` de este repositorio y su `npm run build:offline` son un ejemplo completo y funcional.

<a id="markdown-extensions"></a>

## Extensiones de Markdown

Ninguna es obligatoria, pero el tema incluye estilos que solo se aprovechan cuando están activadas:

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

`admonition` es la que merece mención aparte: la extensión genera marcado pero ningún CSS propio, y `@primer/css` tampoco tiene ninguna regla para ella, así que una advertencia sin estilos es una sorpresa habitual. El tema cubre ese hueco; consulta [los ejemplos](../elements.md#admonitions).

<a id="custom-css-and-javascript"></a>

## CSS y JavaScript personalizados

`extra_css` se carga después de todas las hojas de estilos que incluye el tema, así que tus reglas ganan sin necesidad de `!important`:

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

[Estilos](../styling.md) explica qué poner ahí: las variables de diseño propias del tema, y por qué se descarta una sobrescritura en `:root` de un token de color de Primer mientras que la misma regla bajo dos selectores de atributo sí se aplica.

`extra_javascript` se emite al final de `<body>`, después de los scripts propios del tema.

!!! note "Plugins que inyectan sus propios recursos"
    Un plugin que escribe etiquetas `<link>` en el HTML de la página en lugar de
    añadirlas a `extra_css` —mkdocs-glightbox es uno— queda *después* de tus
    sobrescrituras. Dale estilo a eso con un selector más específico en lugar de
    confiar en el orden.

<a id="edit-links"></a>

## Enlaces de edición

El [pie de página](#footer) enlaza al archivo fuente de la propia página cuando están configurados `repo_url` y `edit_uri`:

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```

Con `repo_url` pero sin `edit_uri` no hay enlace por página que construir, y el pie de página nombra el repositorio en su lugar, de modo que el lector pueda seguir encontrando el código fuente desde cualquier parte del sitio.
