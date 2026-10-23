# Elementos

Cada bloque al que el tema da estilo dentro de un artículo, mostrado una vez.
`@primer/css` cubre la mayor parte de lo que produce Markdown; aquí se reúne el
resto: lo que el tema añade por encima, y lo que un cambio en el tema puede
romper fácilmente sin que nadie lo note. El marco que rodea la página aparece
en todas las páginas de todos modos.

Cada tipo de advertencia es su propio selector en la hoja de estilos, así que
cada alias tiene su propio bloque más abajo en lugar de una línea de texto: un
tipo que nadie escribe es un tipo que nadie ve desaparecer.

<a id="admonitions"></a>

## Advertencias

La extensión `admonition` genera marcado pero no CSS, y `@primer/css` tampoco
tiene ninguna regla para `.admonition`, así que todo lo que sigue proviene del
tema. La forma sigue a las alertas de GitHub: un fondo tintado, una línea de
color al inicio, un título de color y el octicon del tipo.[^alerts]

!!! note
    `note` toma el azul de acento de Primer y el octicon `info`. El código en
    línea —`mkdocs.yml`— conserva su propio fondo translúcido, que se superpone
    al tinte en lugar de abrir un hueco gris en él.

!!! tip
    `tip` toma el verde de éxito y el octicon `light-bulb`.

!!! hint "hint"
    Un alias de `tip`, con un título escrito a mano para poder distinguir aquí
    los dos.

!!! important
    `important` toma el morado que Primer llama "done", y el octicon `report`.

!!! warning
    `warning` toma el amarillo de atención y el octicon `alert`.

!!! attention "attention"
    Un alias de `warning`.

!!! caution "caution"
    El segundo alias de `warning`.

!!! danger
    `danger` toma el rojo de peligro y el octicon `stop`.

!!! error "error"
    Un alias de `danger`.

!!! bug "bug"
    El segundo alias de `danger`.

!!! example
    Un tipo para el que GitHub no tiene alerta conserva un relleno neutro y una
    línea neutra, y no dibuja icono: ni título de color, ni un hueco donde iría
    un icono.

!!! note "Un título propio, con `code` dentro"
    El color del tipo tiñe todo el título, y sobre el fondo propio del código en
    línea esa combinación queda por debajo de 4.5:1, así que el código de un
    título mantiene el color de texto predeterminado.

!!! warning "Un bloque con título y nada debajo"

<a id="quotes"></a>

## Citas

> Una cita toma el relleno neutro con la mitad del relleno interior de una
> advertencia: debe leerse como algo más discreto que una alerta, no como otro
> tipo de alerta.
>
> Dos párrafos, para mostrar que el relleno se cierra debajo del último y no
> debajo del primero.

<a id="code"></a>

## Código

Pygments resalta los bloques delimitados, y se colorean mediante las variables
`prettylights` de Primer, así que siguen el modo de color. Cada uno tiene un
botón de copiar en la esquina.

```python
from mkdocs_primer import __version__


def greet(name: str = "world") -> str:
    """Docstrings, keywords, strings and numbers all take separate colors."""
    return f"hello {name} from {__version__}"
```

Un bloque con líneas más largas que la columna se desplaza en horizontal en
lugar de ajustar las líneas o ensanchar la página:

```console
$ mkdocs build --strict -f examples/rss/mkdocs.yml && mkdocs build --strict -f examples/gen-files/mkdocs.yml && mkdocs build --strict -f examples/diagrams/mkdocs.yml
```

Los diffs reciben un trato propio. La cabecera del fragmento es la línea en la
que fijarse: es el único sitio donde el resaltado se aparta de la paleta de
GitHub, porque el color que GitHub usa ahí queda por debajo de 4.5:1 sobre el
fondo del código en modo oscuro.

```diff
--- a/mkdocs.yml
+++ b/mkdocs.yml
@@ -1,3 +1,3 @@
 theme:
-  name: mkdocs
+  name: primer
```

<a id="tables"></a>

## Tablas

Primer alterna el fondo de las filas y resalta el encabezado; lo único que
añade el tema es qué ocurre cuando una tabla no cabe. Si es demasiado ancha
para la columna, se desplaza en horizontal en lugar de ensanchar la página, y
como una `table` no puede recibir el foco, el tema la convierte en una parada
de tabulación mientras se desborde, para que la parte que sobresale sea
accesible sin un dispositivo señalador. El comando largo de más arriba recibe
exactamente el mismo trato, y es lo bastante ancho para demostrarlo.

Las superficies de esta página proceden de `@primer/primitives`, y por eso
también siguen el modo de color sin que el tema tenga que llevar un segundo
conjunto de reglas:

| Token | Claro | Oscuro | Se usa para |
| --- | --- | --- | --- |
| `--bgColor-default` | `#ffffff` | `#0d1117` | el artículo y la página que hay detrás |
| `--bgColor-inset` | `#f6f8fa` | `#010409` | el encabezado y la barra lateral |
| `--bgColor-muted` | `#f6f8fa` | `#151b23` | las citas y una advertencia sin equivalente en GitHub |
| `--bgColor-attention-muted` | `#fff8c5` | `#bb800926` | el relleno detrás de `!!! warning` |
| `--button-default-bgColor-rest` | `#f6f8fa` | `#212830` | las tarjetas de anterior/siguiente bajo esta página |
| `--underlineNav-borderColor-active` | `#fd8c73` | `#f78166` | la marca de la página actual en la barra lateral |

<a id="definition-lists"></a>

## Listas de definiciones

La extensión `def_list` admite una sintaxis más sencilla que el HTML en bruto
que aparece debajo:

`docs_dir`

:   Directorio del que MkDocs lee el Markdown.

`site_dir`

:   Directorio en el que MkDocs escribe el HTML.

Ambas llegan a Primer como el mismo `<dl>`, y por eso se muestran juntas: una
regla escrita para una se aplica a la otra.

<dl>
<dt>Nombre</dt>
<dd>Godzilla</dd>
<dt>Nacimiento</dt>
<dd>1952</dd>
<dt>Lugar de nacimiento</dt>
<dd>Japón</dd>
</dl>

<a id="images"></a>

## Imágenes

El ancho de la columna lo fija el tema —`.primer-content` lleva el límite que
evita líneas de texto de 130 caracteres—, así que conviene tener en una página
una imagen más ancha que esa columna. Debe quedar contenida en la columna en
lugar de empujar el diseño hacia un lado.

Además, son las únicas imágenes de contenido del sitio, lo que las convierte en
lo único con lo que puede trabajar [mkdocs-glightbox](guide/plugins.md): haz
clic en una y se abrirá en una caja de luz.

![El Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png)

![Ramas en un repositorio de GitHub](https://docs.github.com/assets/images/help/repository/branching.png)

<a id="headings"></a>

## Encabezados

Con los encabezados de esta página se construye el esquema de la columna
derecha, y cada uno lleva un enlace permanente que aparece al pasar el cursor:
un octicon que el tema dibuja sobre el ancla que genera la extensión `toc`.

<a id="a-third-level"></a>

### Un tercer nivel

Los encabezados anidados se sangran en el esquema, así que este aparece ahí
bajo **Encabezados**.

<a id="a-fourth-level"></a>

#### Un cuarto nivel

Lo bastante profundo para mostrar que el esquema sigue sangrando, y que una
entrada de la columna a esta profundidad todavía tiene espacio para su texto.

[^alerts]: GitHub renderiza sus propias alertas con una clase `.markdown-alert`
    que `@primer/css` no publica, así que el tema da estilo directamente al
    marcado `.admonition` de la extensión. Esta nota al pie es también la que
    pone a prueba la extensión `footnotes`.
