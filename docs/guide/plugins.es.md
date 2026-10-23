# Plugins

La mayoría de los plugins de MkDocs nunca tocan una plantilla, así que funcionan con cualquier tema. Unos pocos no: esperan que el tema muestre algo que ellos han calculado, o que sepa manejar una estructura de navegación que ellos han creado. Esos son los que vale la pena comprobar.

Este sitio es la comprobación. El `mkdocs.yml` de la raíz del repositorio activa los plugins que necesitan soporte del tema, y la CI lo compila con `--strict`, de modo que una regresión rompe la compilación en lugar de degradar una página sin que nadie se entere. Los candidatos se tomaron del [catálogo de MkDocs](https://github.com/mkdocs/catalog), de más a menos populares.

<a id="plugins-that-need-something-from-the-theme"></a>

## Plugins que necesitan algo del tema

### mkdocs-section-index

[mkdocs-section-index][section-index] integra `guide/index.md` en la propia sección **Guía**, así que un elemento de la navegación acaba teniendo a la vez `children` y una `url`. Un tema que muestra "tiene hijos" como una simple etiqueta de sección deja esa página índice inalcanzable desde la barra lateral.

`partials/nav-item.html` comprueba `nav_item.url` y, si existe, muestra la etiqueta como un enlace. Puedes verlo en la barra lateral: tanto **Guía** como **Anidado** son clicables.

!!! note "Una advertencia que puedes ignorar"
    El plugin reconoce los temas compatibles comparando rutas de archivos de
    plantilla con una lista integrada, así que registra

    ```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

    con cualquier tema de terceros, incluido este. Aquí el soporte es nativo
    —no hay nada que adaptar—, pero desde el lado del tema no hay forma de
    evitar el mensaje.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] solo reescribe `theme.locale` para los temas a los que da soporte, entre los que no están los de terceros. Por eso, leer solo `theme.locale` etiqueta todas las páginas traducidas con el idioma predeterminado.

`base.html` prefiere la variable `i18n_page_locale` que el plugin pone en el contexto de la página, y recurre a `theme.locale` cuando el plugin no está:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

Las páginas traducidas bajo `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` y `/fr/` llevan el atributo `lang` correspondiente. Las páginas sin traducción `*.<locale>.md` recurren a su original en inglés, que es el comportamiento predeterminado del plugin.

Cuando al menos dos de los idiomas configurados tienen `build: true`, el encabezado muestra además un selector de idioma. Sus etiquetas proceden del `name` de cada idioma, y cada entrada lleva a la misma página en el idioma de destino. Esto incluye las páginas para las que el plugin recurre al original en el idioma predeterminado. El selector no se muestra sin `mkdocs-static-i18n`, en una compilación de un solo idioma ni en la página 404 estática.

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] lee el registro de git y guarda el resultado en `page.meta.git_revision_date_localized` y, con `enable_creation_date: true`, también en `page.meta.git_creation_date_localized`. Nada muestra ninguno de los dos a menos que el tema los pida, así que un tema sin esas líneas hace que el plugin parezca roto. `partials/metadata.html` imprime ambos como los elementos de creación y de última actualización de la línea de metadatos que hay bajo el título de la página.

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] funciona igual: pone `git_page_authors` en el contexto de la página como una cadena de HTML y deja al tema la tarea de mostrarlo. La línea de metadatos lo imprime junto a las fechas.

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] escribe `feed_rss_created.xml` y `feed_rss_updated.xml`, pero no añade ningún marcado, así que nada le indica al lector que existen. `base.html` emite el par de `<link rel="alternate">` y toma los nombres de archivo de la propia configuración del plugin en lugar de fijarlos en el código, ya que son opciones.

El plugin no está activado en este sitio; consulta [Conflictos conocidos entre plugins](#known-plugin-conflicts).

### mike

[mike][mike] mantiene varias versiones de la documentación una junto a otra y añade un desplegable de versiones. Encuentra los recursos del desplegable de cada tema a través del grupo de puntos de entrada `mike.themes` y, con un tema que no encuentra ahí, **no crea ningún selector y no dice nada**: el sitio se despliega, las versiones existen y la única manera de moverse entre ellas es editar la URL.

`pyproject.toml` registra `mkdocs_primer.mike` en ese grupo, así que mike toma `version-select.css` y `version-select.js` de este paquete y los copia. El selector aparece en el encabezado, junto al nombre del sitio, y sigue el modo de color. Los alias se resuelven a su versión real, así que `/latest/` muestra `2.0` seleccionada en lugar de un control vacío.

Ese script lee la variable global `base_url`, que `base.html` declara siempre. Antes solo se declaraba cuando el plugin `search` estaba activado, lo que habría dejado el selector roto en un sitio sin búsqueda.

### mkdocs-print-site

[mkdocs-print-site][print-site] muestra todo el sitio como una sola página usando las plantillas del tema activo, y eso aquí funciona. Lo que no puede hacer es aportar el CSS de impresión: incluye una hoja de estilos por cada tema que conoce y, para el resto, avisa con `Theme 'primer' not yet supported`.

De todas formas, eso es trabajo del tema. `theme.css` lleva un bloque `@media print` que quita el encabezado, la barra lateral y la paginación, deja que la columna de contenido ocupe todo el ancho y evita que los bloques de código y las tablas se partan entre páginas. También fija el texto al color de primer plano *claro* de Primer, porque si no, un visitante que imprimiera en modo oscuro obtendría texto gris claro sobre papel blanco. Ese bloque se aplica a cualquier página, con o sin el plugin.

### search

El plugin integrado `search` necesita que el tema incluya una plantilla `search.html` y que cargue `search/main.js` con `base_url` disponible. Ambas cosas están en el tema: el cuadro de búsqueda del encabezado aparece siempre que el plugin está activado y desaparece cuando no lo está.

### mkdocstrings

[mkdocstrings][mkdocstrings] genera su propio marcado con clases `doc-*` y deja los estilos al tema. Aquí se lee bien porque todo cae dentro de `.markdown-body` y adopta la escala tipográfica de Primer, pero el tema no incluye reglas `doc-*` específicas: las firmas y las tablas de parámetros usan los valores predeterminados de Primer. [Referencia](../reference.md) es la página que genera.

<a id="plugins-that-just-work"></a>

## Plugins que funcionan sin más

Estos no necesitan del tema nada más que HTML bien formado. El primer grupo está activado en este sitio, para que eso siga siendo cierto:

| Plugin | Qué hace en este sitio |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Construye la navegación a partir de `docs/.nav.yml` en lugar de una clave `nav:`. |
| [mkdocs-glightbox][glightbox] | Abre en una caja de luz las imágenes de [Elementos](../elements.md). |
| [mkdocs-minify-plugin][minify] | Minifica el HTML, el CSS y el JS de cada página, incluido el script en línea del modo de color del tema. |
| [mkdocs-redirects][redirects] | `/options/` redirige a [Configuración](configuration.md). |
| [mkdocs-macros-plugin][macros] | Procesa Jinja dentro de Markdown. Este sitio es **{{ config.site_name }}**, construido con el tema `{{ config.theme.name }}`: esa frase la genera el plugin, no Markdown. |

El segundo grupo se probó con el tema en una compilación de prueba en lugar de integrarlo en este sitio, porque cada uno necesita contenido de ejemplo que no justificaría su sitio en la documentación de un tema:

| Plugin | Comprobado |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | La etiqueta `<swagger-ui>` se expande y los recursos se copian. |
| [mkdocs-include-markdown-plugin][include-markdown] | Fragmento incrustado. |
| [markdown-exec][markdown-exec] | Código ejecutado y salida incrustada. |
| [mkdocs-table-reader-plugin][table-reader] | CSV mostrado como tabla. |
| [mkdocs-markdownextradata-plugin][extradata] | Valores de `extra:` interpolados. |
| [mkdocs-autolinks-plugin][autolinks] | Enlaces simples `[file.md](file.md)` resueltos. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Cuerpo de la página cifrado sin texto en claro en el HTML, formulario de contraseña mostrado y estructura del tema intacta a su alrededor. |
| [mkdocs-monorepo-plugin][monorepo] | Subproyecto integrado mediante `!include`. |
| `material/group` | Activa o desactiva un grupo de plugins. Con el `search` integrado dentro, el cuadro de búsqueda del tema aparece correctamente cuando el grupo está activado y desaparece cuando está desactivado. |

Los plugins que actúan sobre la navegación y los archivos —[mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude]— no llegan a tocar ninguna plantilla.

<a id="known-plugin-conflicts"></a>

## Conflictos conocidos entre plugins

No todos los fallos son culpa del tema. Hay seis que conviene conocer, todos reproducibles con cualquier tema.

Tres de ellos son el motivo de que este sitio no sea la única compilación del repositorio: los plugins implicados no pueden compartir configuración con los que ya están activados aquí, así que tienen su propio sitio en `examples/`, compilado con `--strict` por el mismo trabajo de CI.

La página [Ejemplos](../examples.md) explica qué muestra cada uno.

- **mkdocs-rss-plugin con mkdocs-static-i18n**: el plugin de RSS reescribe su
  propio `date_from_meta.default_time`, que pasa de cadena a `datetime` durante `on_config`. El plugin i18n ejecuta `on_config` una vez por idioma, así que la segunda pasada vuelve a analizar un `datetime` y emite un aviso, lo que aborta una compilación con `--strict`. Se muestra en su lugar en [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files con mkdocs-static-i18n**: el plugin i18n no clasifica los
  archivos creados durante `on_files`, así que registra `Unhandled file case` y los deja fuera de la compilación. Se muestra en su lugar en [examples/gen-files/]({{ config.site_url }}examples/gen-files/), junto con mkdocs-literate-nav, que de otro modo competiría con mkdocs-awesome-nav por la navegación.
- **Mermaid con `minify_html`**: Mermaid analiza su código fuente línea a línea,
  y el minificador elimina los saltos de línea dentro de su `<div>`. El diagrama se muestra como *Syntax error in text* y la compilación no dice nada. Se muestra en su lugar en [examples/diagrams/]({{ config.site_url }}examples/diagrams/), que también cubre [mkdocs-charts-plugin][charts] y cómo ambos adoptan el modo de color.
- **mkdocs-monorepo sin `repo_url`**: compilar una página de un subproyecto
  lanza `TypeError: join() missing 1 required positional argument`. Configurar `repo_url` y `edit_uri` lo evita. Se reproduce exactamente igual con el tema integrado `mkdocs`.
- **`search` con un idioma predeterminado que mkdocs-static-i18n no tiene en
  primer lugar**: el plugin i18n hace una pasada de compilación por idioma,
  empezando por el predeterminado, y luego recorre `languages` saltándose el que
  acaba de compilar. Compara cada entrada con la pasada anterior y no con el
  idioma predeterminado, así que un idioma predeterminado que no esté el primero
  se compila dos veces y todas sus páginas llegan dos veces al plugin de
  búsqueda. El índice arrastra los duplicados hasta la página de búsqueda, que
  muestra cada resultado dos veces. Ponerlo el primero lo evita, pero es la
  última pasada la que escribe los únicos `404.html` y `search.html` del sitio,
  así que este sitio mantiene `en` al final y elimina las entradas duplicadas en
  `hooks.py`.
- **`material/search` con un tema que no es Material**: el plugin de búsqueda de
  Material renderiza `partials/language.html` a través del entorno Jinja del tema *activo*. Con cualquier tema que no incluya esa plantilla lanza `TemplateNotFound` y la compilación se detiene. Usa en su lugar el plugin integrado `search`; el tema está construido para ese.

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
