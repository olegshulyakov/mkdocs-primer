# Configuración

## Opciones de tema

| Opción | Predeterminado | Descripción |
|:---|:---|:---|
| `logo` | `null` | Imagen que se muestra junto al nombre del sitio, relativa a `docs_dir`. |
| `favicon` | `img/favicon.svg` | Icono del sitio. |
| `icon` | `octicons` | Conjunto de iconos para controles de tema: `octicons` o `lucide`. |
| `font.text` | `null` | Valor de familia de fuentes CSS para interfaz y prosa. |
| `font.code` | `null` | Valor de familia de fuentes CSS para código en línea y de bloque. |
| `font.source` | `null` | Una URL de hoja de estilo externa o una hoja de estilo local en `docs_dir`. |
| `direction` | `ltr` | Dirección del documento: `ltr` o `rtl`. |
| `include_sidebar` | `true` | Representa la barra lateral de navegación. |
| `show_footer` | `true` | Representa el pie de página "Mejorar esta página". |
| `color_mode` | `auto` | Modo de color inicial: `auto`, `light` o `dark`. |
| `light_theme` | `light` | Tema básico utilizado en modo claro. |
| `dark_theme` | `dark` | Tema básico utilizado en modo oscuro. |

`color_mode` solo establece el modo *inicial*. Los visitantes pueden cambiarlo con el encabezado. alternar y su elección se almacena en `localStorage`.

## Iconos

La navegación del encabezado, el control del modo de color y el botón de volver al principio utilizan SVG en línea de un conjunto de iconos. `octicons` es el valor predeterminado; elige iconos de Lucide con:

```yaml
theme:
  name: primer
  icon: lucide
```

Ambos conjuntos están incluidos en el tema, por lo que ninguna de las opciones agrega una solicitud CDN. Icono La selección se aplica sólo a los controles HTML del tema. El selector de idioma siempre utiliza un globo Octicon y el tratamiento `btn-octicon` de Primer para que coincida el resto del encabezado de Primer. Sintaxis de iconos de Markdown y terceros arbitrarios Los paquetes de iconos no son compatibles deliberadamente.

## Fuentes

Las fuentes son opcionales: el tema no solicita una CDN de fuentes de forma predeterminada. Establecer texto y familias de códigos de forma independiente, luego apunte `source` a una hoja de estilo externa o un archivo CSS en `docs_dir`:

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

Para un sitio autohospedado, coloque los archivos de fuentes y una hoja de estilo en `docs_dir`, luego utilice una ruta de origen relativa:

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

El navegador almacena en caché esos archivos normalmente. El autohospedaje evita a un tercero solicitud y mantiene el sitio utilizable sin conexión una vez que sus activos se almacenan en caché.

## Diseños de derecha a izquierda

Configure `direction: rtl` para un documento de derecha a izquierda. El tema pone `dir="rtl"` en el elemento HTML raíz y refleja su encabezado, barra lateral, navegación móvil, paginación, pie de página, menús y controles con propiedades lógicas CSS. Código y Los diagramas permanecen intencionalmente de izquierda a derecha.

```yaml
theme:
  name: primer
  direction: rtl
```

La dirección es una configuración que abarca todo el sitio; el tema no lo infiere de una página o idioma local.

!!! advertencia "`light_theme` y `dark_theme` actualmente aceptan solo `light` y `dark`"
    Primer publica catorce temas (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia` y así sucesivamente), pero este tema incluye fichas de color solo para dos de
    ellos: el conjunto completo agregaría más de un megabyte de CSS. Nombrar cualquier otro tema
    representa una página sin ningún color en lugar de un error. Soporte para más temas
    se rastrea como una futura incorporación.

## Anclas de rumbo

Para obtener el ancla flotante de GitHub junto a cada encabezado, habilite la extensión `toc` con un enlace permanente principal que lleva la clase `anchor` de Primer:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

El tema dibuja el octicon en sí, por lo que `permalink` se establece en una cadena vacía en lugar de que el `true` habitual. Eso importa más que la apariencia: el complemento de búsqueda de MkDocs no elimine los glifos de enlaces permanentes, por lo que, de lo contrario, aparecerá un `¶` en los resultados de su búsqueda.

Sin esta configuración, el enlace permanente aún funciona, simplemente se representa como un glifo simple en lugar de que el octicon.

## Resaltado de sintaxis

Los colores del código provienen de las variables `prettylights` de Primer, por lo que siguen el código activo. modo de color automáticamente. No es necesario seleccionar ningún estilo de pigmentos:

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

Tanto los contenedores `.highlight` como `.codehilite` tienen estilo, por lo que `codehilite` también funciona.

El tema agrega un botón de copia a cada bloque de Pygments `.highlight`. Copia el fuente visible y anuncia si la operación del portapapeles se realizó correctamente. Bloques renderizados por complementos, como Mermaid y Vega-Lite, se excluyen intencionalmente.

## Controles de navegación

Después de desplazarse 400 píxeles, aparece un botón para volver al principio en la parte inferior derecha de la página. Devuelve al visitante al inicio del documento y se mueve enfoque del teclado en el enlace del título del sitio. El movimiento es instantáneo cuando el visitante ha solicitado la reducción de la moción.

## Extensiones de rebajas

Ninguno de estos es necesario, pero el tema ofrece un estilo que solo vale la pena una vez. estan en:

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

`admonition` es el que vale la pena mencionar: la extensión emite marcado y no CSS propio, y `@primer/css` tampoco tiene ninguna regla para ello, por lo que un sin estilo la amonestación es una sorpresa común. El tema llena ese vacío (ver [los ejemplos](nested/deep-page.md#admonitions).

## CSS y JavaScript personalizados

`extra_css` se carga después de cada hoja de estilo que envía el tema, por lo que tus reglas ganan sin necesidad de `!important`:

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

`extra_javascript` se emite al final de `<body>`, después del propio tema. guiones.

!!! nota "Complementos que inyectan sus propios activos"
    Un complemento que escribe etiquetas `<link>` en el HTML de la página en lugar de agregarlas
    `extra_css`: mkdocs-glightbox es uno: aterriza *después* de tus anulaciones. Estilo
    aquellos con un selector más específico en lugar de depender del orden.

## Editar enlaces

El pie de página enlaza nuevamente con el archivo fuente cuando se configuran `repo_url` y `edit_uri`:

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```