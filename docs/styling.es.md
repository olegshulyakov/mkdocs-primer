# Estilos

Las hojas de estilos llegan a una página en un orden fijo: los tokens de diseño
de `@primer/primitives`, el `@primer/css` de GitHub, los colores de Pygments, el
`theme.css` propio de este tema y, por último, lo que indique `extra_css`. Ir
en último lugar es lo que permite que tus reglas ganen sin `!important`, pero
solo frente a reglas de la misma especificidad, y ahí está la única trampa real
de esta página.

Recurre a las cosas en este orden: una [opción del tema](guide/configuration.md)
si alguna lo cubre, después una variable de las de abajo, después un token de
Primer y, solo entonces, una regla propia contra el marcado.

<a id="the-themes-layout-variables"></a>

## Las variables de diseño del tema

Estas cinco las declara el tema, en `:root`, y están pensadas para que las
definas tú:

| Variable | Predeterminado | Qué controla |
| --- | --- | --- |
| `--primer-sidebar-width` | `288px` | la columna de navegación, con su relleno incluido |
| `--primer-rail-width` | `256px` | la tercera columna, cuando la ventana tiene sitio para ella |
| `--primer-article-max` | `720px` | hasta qué ancho puede llegar el texto |
| `--primer-gutter` | `var(--base-size-16)` | la distancia al borde de la ventana y a la navegación |
| `--primer-header-height` | `56px` | el encabezado, y el espacio que dejan libre las columnas fijas |

Basta con un bloque `:root` en tu propia hoja de estilos, ya que nada más las
declara:

```css
/* docs/css/overrides.css, named in extra_css */
:root {
  --primer-article-max: 880px;
  --primer-sidebar-width: 240px;
}
```

Los anchos a los que el diseño cambia de forma no están entre ellas: la barra
lateral pasa a ser una columna a 1012px y el esquema pasa a una columna lateral
a 1280px, ambos valores escritos en media queries, y una media query no puede
leer una propiedad personalizada. Por eso, estrechar la barra lateral la hace
más estrecha, no hace que aparezca antes.

<a id="primers-tokens"></a>

## Los tokens de Primer

Los colores, los tamaños y la tipografía proceden de `@primer/primitives`,
incluido en `mkdocs_primer/css/vendor/`. Los nombres y su significado son de
Primer, y [su documentación](https://primer.style/product/primitives/) es el
lugar donde consultarlos; [Elementos](elements.md) muestra algunas de las
superficies de este sitio y qué token pinta cada una.

Sobrescribir uno es donde la regla del orden deja de bastar:

```css
/* Does nothing. */
:root {
  --fgColor-default: #24292f;
}

/* Works. */
[data-color-mode][data-light-theme] {
  --fgColor-default: #24292f;
}
```

Cada token de color se declara sobre un par de selectores de atributo
—`[data-color-mode="light"][data-light-theme="light"]` y sus variantes—, que es
como una sola hoja de estilos puede contener ambos modos de color. Ese par
supera a `:root` sin importar qué archivo se cargó el último, así que una
sobrescritura en `:root` se descarta sin aviso. Usa los mismos dos atributos y
el orden vuelve a decidir, a tu favor.

Los tamaños y la tipografía son distintos: `primitives-base.css` los declara en
`:root`, así que `--base-size-16` y compañía admiten una sobrescritura simple
en `:root`.

Cambiar toda la paleta de una vez mediante `light_theme` o `dark_theme` no es
posible hoy: el tema solo incluye los tokens de `light` y `dark`, como advierte
[Configuración](guide/configuration.md).

<a id="what-not-to-reach-for"></a>

## A qué no recurrir

Los nombres de clase `primer-*` son la forma en que la hoja de estilos se
comunica consigo misma, no una interfaz pública. Se renombran y cambian de
función cada vez que cambia el diseño: versiones recientes movieron
`.primer-toc-summary` de un `<summary>` a un botón, cambiaron lo que marca
`.primer-nav-section-label` y quitaron `.btn-octicon` del control de idioma. Si
escribes una regla propia contra una de ellas, merece la pena fijar una versión.

Otras dos variables del tema son indicadores, no ajustes. `--primer-toc-rail`
es la forma en que la hoja de estilos indica a los scripts si la ventana es lo
bastante ancha para una columna lateral, y `--primer-nav-depth` es el nivel de
anidamiento que la plantilla de navegación pone en cada fila para calcular la
sangría. Definir cualquiera de las dos desde fuera no activa nada; solo engaña
al código que la lee.

Para controlar el modo de color con scripts en lugar de con estilos, el tema
lanza un evento `primer:color-mode-change` en `document`, que el
[ejemplo de diagramas](examples.md) usa para volver a dibujar.
