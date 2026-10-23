# Tema MkDocs Primer

Un tema de [MkDocs](https://www.mkdocs.org/) construido sobre el [sistema de
diseño Primer de GitHub](https://primer.style/): documentación que parece hecha
para GitHub.

Este sitio es el propio tema renderizándose a sí mismo. El artículo que estás
leyendo toma su estilo de las reglas `.markdown-body` de GitHub, y todo lo que
lo rodea —el encabezado, el árbol de navegación, la ruta de navegación, el
esquema de la columna derecha— es lo que obtiene tu propio sitio con dos líneas
de configuración.

<a id="install"></a>

## Instalación

```console
$ pip install mkdocs-primer
```

```yaml
# mkdocs.yml
theme:
  name: primer
```

Esa es toda la configuración: cada opción tiene un valor predeterminado que
funciona, y el tema renderiza el `nav` que MkDocs ya ha construido. Consulta
[Instalación](guide/installation.md).

<a id="what-you-get"></a>

## Qué obtienes

- **La forma en que GitHub renderiza un artículo**: la tipografía, las tablas,
  el marco del código y las anclas al pasar el cursor de un README en
  github.com. El CSS de Primer viene incluido en el paquete, así que instalar
  el tema no requiere ninguna cadena de herramientas de Node.
- **Modo claro y oscuro**, a partir de las primitivas de color de Primer. El
  control del encabezado sigue al sistema operativo hasta que el visitante elige
  un modo, y después recuerda su elección. El resaltado de sintaxis también lo
  sigue.
- **Una navegación que escala**: una barra lateral con anidamiento ilimitado,
  plegada hasta la sección en la que está el lector, además de una ruta de
  navegación, enlaces de anterior/siguiente, una página de búsqueda y una página
  404.
- **Advertencias con el estilo de las alertas de GitHub.** La extensión
  `admonition` no incluye CSS y `@primer/css` no tiene ninguna regla para ella,
  así que con la mayoría de los temas `!!! note` se muestra sin decoración.
- **Siete idiomas** para los textos propios del tema —inglés, español, francés,
  hindi, portugués, ruso y chino— y diseños de derecha a izquierda.
- **Compatibilidad con los plugins que necesitan ayuda del tema**: páginas de
  índice de sección, sitios traducidos, fechas de revisión y autores,
  descubrimiento automático de RSS y el selector de versiones de mike.

<a id="where-to-go-next"></a>

## Por dónde seguir

[Guía](guide/index.md)

:   La instalación, todas las opciones del tema y los plugins con los que se ha
    construido este tema.

[Elementos](elements.md)

:   Cada bloque al que el tema da estilo dentro de un artículo, mostrado una
    vez: advertencias, citas, código, tablas, imágenes.

[Estilos](styling.md)

:   Las variables que puedes definir en una hoja de estilos propia, y la única
    sobrescritura de tokens de Primer que no funciona como parece que debería.

[Ejemplos](examples.md)

:   Tres sitios completos que muestran lo que hace el tema con feeds, páginas
    generadas y diagramas.

[Referencia](reference.md)

:   La documentación del propio paquete del tema, renderizada por mkdocstrings.
