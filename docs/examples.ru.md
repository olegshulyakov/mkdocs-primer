# Примеры

В каталоге `examples/` репозитория лежат три полноценных сайта. Каждый
собирается с `--strict` той же задачей CI, что и этот сайт, и публикуется рядом
с ним, так что вы видите ровно то, что даёт приведённая ниже конфигурация.

Они существуют потому, что используемые в них плагины не могут работать в одной
конфигурации с плагинами, которые уже подключены на этом сайте, — на странице
[Плагины](guide/plugins.md) сказано, что ломается в каждом случае. Но читайте их
как три вещи, которые умеет тема, а не как последствия этого: сайт с лентой,
сайт, страницы которого пишет скрипт, и сайт с диаграммами.

<a id="a-site-with-a-feed"></a>

## Сайт с лентой

[**examples/rss/**]({{ config.site_url }}examples/rss/) использует
[mkdocs-rss-plugin](https://guts.github.io/mkdocs-rss-plugin/), который
записывает `feed_rss_created.xml` и `feed_rss_updated.xml` и на этом
останавливается. Тема выводит пару `<link rel="alternate">`, которая указывает
на них браузеру или программе для чтения лент, и берёт имена файлов из
конфигурации самого плагина, а не прописывает их жёстко, — откройте там
исходный код страницы, и вы найдёте обе ссылки в `<head>`.

На том же сайте включён `git-authors`, поэтому нижний колонтитул показывает,
кто последним правил страницу, рядом со ссылкой темы «Улучшить эту страницу».

<a id="pages-that-do-not-exist-on-disk"></a>

## Страницы, которых нет на диске

[**examples/gen-files/**]({{ config.site_url }}examples/gen-files/) создаёт
раздел `Generated` во время сборки: `gen_pages.py` пишет Markdown через
[mkdocs-gen-files](https://oprypin.github.io/mkdocs-gen-files/), а
[mkdocs-literate-nav](https://github.com/oprypin/mkdocs-literate-nav) берёт
навигацию из `SUMMARY.md`, который его включает. Ничего из `generated/` в
репозитории нет.

Из такого сочетания обычно собирают справочник API, и смотреть здесь стоит на
боковую панель: она вложенная, а заголовок раздела — ссылка, потому что
`section-index` встроил сгенерированную индексную страницу в сам раздел.

<a id="diagrams-and-charts"></a>

## Диаграммы и графики

[**examples/diagrams/**]({{ config.site_url }}examples/diagrams/) отображает
диаграммы Mermaid через
[mkdocs-mermaid2](https://mkdocs-mermaid2.readthedocs.io/) и графики Vega-Lite
через [mkdocs-charts-plugin](https://timvink.github.io/mkdocs-charts-plugin/).

Оба рисуют в браузере, поэтому обоим нужно сообщить, в каком цветовом режиме
находится страница, — иначе диаграмма окажется белой карточкой в тёмной статье.
Mermaid читает атрибут темы `data-color-mode` через выражение JavaScript в
`mkdocs.yml` того сайта; плагин графиков вместо этого ищет атрибут Material, и
страница там объясняет, к чему это приводит. Ни один из них не перерисовывается
при нажатии переключателя в шапке, поэтому тема и отправляет событие
`primer:color-mode-change` для страниц, которые хотят его обработать.

<a id="building-them-yourself"></a>

## Как собрать их самостоятельно

У каждого примера свой `mkdocs.yml`, и каждый пишет в `site/examples/<name>/`.
Сначала соберите основной сайт: `mkdocs build` очищает `site/` и удалил бы
вместе с ним и примеры.

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
$ mkdocs build --strict -f examples/diagrams/mkdocs.yml
```
