# Плагины

Большинство плагинов MkDocs вообще не касаются шаблонов, поэтому работают с любой темой. Но есть несколько исключений: они ждут, что тема выведет что-то вычисленное ими или справится с навигацией той формы, которую они создали. Именно их и стоит проверять.

Этот сайт и есть такая проверка. `mkdocs.yml` в корне репозитория включает плагины, которым нужна поддержка темы, а CI собирает его с `--strict`, так что регрессия ломает сборку, а не тихо портит страницу. Кандидатов брали из [каталога MkDocs](https://github.com/mkdocs/catalog), двигаясь сверху вниз по популярности.

<a id="plugins-that-need-something-from-the-theme"></a>

## Плагины, которым что-то нужно от темы

### mkdocs-section-index

[mkdocs-section-index][section-index] встраивает `guide/index.md` в сам раздел **Руководство**, так что у пункта навигации оказываются и `children`, и `url`. Тема, которая показывает «есть дочерние пункты» как простую подпись раздела, делает такую индексную страницу недоступной из боковой панели.

`partials/nav-item.html` проверяет `nav_item.url` и, если он есть, выводит подпись ссылкой. Это видно в боковой панели: и **Руководство**, и **Вложенный раздел** кликабельны.

!!! note "Предупреждение, на которое можно не обращать внимания"
    Плагин распознаёт поддерживаемые темы, сравнивая пути файлов шаблонов со
    встроенным списком, поэтому пишет в лог

    ```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

    для каждой сторонней темы, включая эту. Здесь поддержка встроенная —
    адаптировать ничего не нужно, — но со стороны темы это сообщение не убрать.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] переписывает `theme.locale` только для тех тем, поддержку которых поставляет сам, а сторонние темы в их число не входят. Поэтому если читать только `theme.locale`, каждая переведённая страница будет помечена языком по умолчанию.

`base.html` в первую очередь берёт переменную `i18n_page_locale`, которую плагин кладёт в контекст страницы, а если плагина нет, возвращается к `theme.locale`:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

У переведённых страниц в `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` и `/fr/` стоит соответствующий атрибут `lang`. Страницы без перевода `*.<locale>.md` показывают свой английский исходник — так плагин ведёт себя по умолчанию.

Когда `build: true` стоит хотя бы у двух настроенных языков, в шапке появляется ещё и переключатель языка. Подписи в нём берутся из `name` каждого языка, а каждый пункт ведёт на ту же страницу в выбранной локали — в том числе на страницы, для которых плагин подставляет исходник на языке по умолчанию. Переключатель не выводится без `mkdocs-static-i18n`, при сборке на одном языке и на статической странице 404.

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] читает журнал git и сохраняет результат в `page.meta.git_revision_date_localized`, а при `enable_creation_date: true` — ещё и в `page.meta.git_creation_date_localized`. Ни то ни другое не показывается, пока тема об этом не попросит, так что в теме без этих строк плагин выглядит сломанным. `partials/metadata.html` выводит обе даты как пункты «создано» и «последнее обновление» в строке метаданных под заголовком страницы.

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] устроен так же: он кладёт в контекст страницы `git_page_authors` в виде строки HTML и оставляет показ теме. Строка метаданных выводит его рядом с датами.

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] создаёт `feed_rss_created.xml` и `feed_rss_updated.xml`, но не добавляет никакой разметки, так что ничто не указывает на них читателю. `base.html` выводит пару `<link rel="alternate">` и берёт имена файлов из собственной конфигурации плагина, а не прописывает их жёстко, ведь это настраиваемые параметры.

На этом сайте плагин не включён — см. [Известные конфликты плагинов](#known-plugin-conflicts).

### mike

[mike][mike] хранит несколько версий документации рядом и добавляет выпадающий список версий. Ресурсы для этого списка он ищет у темы через группу точек входа `mike.themes`, и для темы, которую там не нашёл, **не строит переключатель вовсе и ничего об этом не сообщает**: сайт разворачивается, версии существуют, но переходить между ними можно только правкой URL.

`pyproject.toml` регистрирует `mkdocs_primer_mike` в этой группе, поэтому mike берёт `version-select.css` и `version-select.js` из этого пакета и копирует их на сайт. Переключатель появляется в шапке рядом с названием сайта и следует цветовой схеме. Псевдонимы разрешаются в настоящую версию, поэтому на `/latest/` выбранной показывается `2.0`, а не пустой элемент.

Этот скрипт читает глобальную переменную `base_url`, которую `base.html` объявляет всегда. Раньше она объявлялась только при включённом плагине `search`, и на сайте без поиска переключатель оказался бы сломан.

### mkdocs-print-site

[mkdocs-print-site][print-site] выводит весь сайт одной страницей с помощью шаблонов активной темы, и здесь это работает. Чего он не умеет, так это поставлять CSS для печати: у него есть по таблице стилей на каждую известную ему тему, а для остальных он предупреждает `Theme 'primer' not yet supported`.

Это и так задача темы. В `theme.css` есть блок `@media print`, который убирает шапку, боковую панель и постраничную навигацию, растягивает колонку с содержимым на всю ширину и не даёт блокам кода и таблицам разрываться между страницами. Он также закрепляет цвет основного текста за *светлым* цветом переднего плана Primer, потому что посетитель, печатающий страницу в тёмной схеме, иначе получил бы светло-серый текст на белой бумаге. Этот блок действует на любой странице — с плагином или без.

### search

Встроенному плагину `search` нужно, чтобы тема поставляла шаблон `search.html` и загружала `search/main.js` с `base_url` в области видимости. И то и другое в теме есть: поле поиска в шапке появляется, когда плагин включён, и исчезает, когда нет.

### mkdocstrings

[mkdocstrings][mkdocstrings] выдаёт собственную разметку с классами `doc-*` и оставляет оформление теме. Здесь она читается хорошо, потому что всё попадает внутрь `.markdown-body` и получает типографическую шкалу Primer, но отдельных правил для `doc-*` тема не поставляет — сигнатуры и таблицы параметров выглядят так, как Primer оформляет их по умолчанию. [Справочник](../reference.md) — страница, которую он генерирует.

<a id="plugins-that-just-work"></a>

## Плагины, которые просто работают

Им от темы ничего не нужно, кроме корректного HTML. Первая группа включена на этом сайте, чтобы так оно и оставалось:

| Плагин | Что он делает на этом сайте |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Строит навигацию из `docs/.nav.yml` вместо ключа `nav:`. |
| [mkdocs-glightbox][glightbox] | Открывает изображения на странице [Элементы](../elements.md) в лайтбоксе. |
| [mkdocs-minify-plugin][minify] | Минифицирует HTML, CSS и JS каждой страницы, включая встроенный скрипт цветовой схемы темы. |
| [mkdocs-redirects][redirects] | Перенаправляет `/options/` на страницу [Конфигурация](configuration.md). |
| [mkdocs-macros-plugin][macros] | Обрабатывает Jinja в Markdown. Этот сайт — **{{ config.site_name }}**, собранный с темой `{{ config.theme.name }}`; это предложение сформировал плагин, а не Markdown. |

Вторую группу проверяли с темой в отдельной тестовой сборке, а не подключали к этому сайту, потому что каждому из этих плагинов нужно тестовое содержимое, которому не место в документации темы:

| Плагин | Результат проверки |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | Тег `<swagger-ui>` раскрывается, ресурсы копируются. |
| [mkdocs-include-markdown-plugin][include-markdown] | Фрагмент встраивается. |
| [markdown-exec][markdown-exec] | Код выполняется, вывод встраивается. |
| [mkdocs-table-reader-plugin][table-reader] | CSV выводится таблицей. |
| [mkdocs-markdownextradata-plugin][extradata] | Значения из `extra:` подставляются. |
| [mkdocs-autolinks-plugin][autolinks] | Голые ссылки `[file.md](file.md)` разрешаются. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Тело страницы зашифровано, открытого текста в HTML не осталось, форма ввода пароля выводится, оболочка темы вокруг неё цела. |
| [mkdocs-monorepo-plugin][monorepo] | Подпроект подключается через `!include`. |
| `material/group` | Включает или отключает группу плагинов. Если поместить в неё встроенный `search`, поле поиска темы, как и положено, появляется при включённой группе и исчезает при отключённой. |

Плагины уровня навигации и файлов — [mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — до шаблонов вообще не добираются.

<a id="known-plugin-conflicts"></a>

## Известные конфликты плагинов

Не каждый сбой — вина темы. Вот шесть случаев, о которых стоит знать; все воспроизводятся с любой темой.

Из-за трёх из них этот сайт — не единственная сборка в репозитории: задействованные плагины не уживаются в одной конфигурации с уже включёнными здесь, поэтому для них есть отдельные сайты в `examples/`, которые та же задача CI собирает с `--strict`.

Что показывает каждый из них, описано на странице [Примеры](../examples.md).

- **mkdocs-rss-plugin с mkdocs-static-i18n** — во время `on_config` плагин RSS
  заменяет собственный `date_from_meta.default_time` со строки на `datetime`. Плагин i18n запускает `on_config` по разу на каждый язык, поэтому второй проход снова разбирает `datetime`, выдаёт предупреждение и обрывает сборку с `--strict`. Вместо этого показано на [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files с mkdocs-static-i18n** — файлы, созданные во время
  `on_files`, плагин i18n не классифицирует: он пишет в лог `Unhandled file case` и выбрасывает их из сборки. Вместо этого показано на [examples/gen-files/]({{ config.site_url }}examples/gen-files/) вместе с mkdocs-literate-nav, который иначе соперничал бы с mkdocs-awesome-nav за навигацию.
- **Mermaid с `minify_html`** — Mermaid разбирает исходник построчно, а
  минификатор схлопывает переводы строк внутри его `<div>`. Диаграмма выводится как *Syntax error in text*, а сборка молчит. Вместо этого показано на [examples/diagrams/]({{ config.site_url }}examples/diagrams/), где заодно разобраны [mkdocs-charts-plugin][charts] и то, как оба подхватывают цветовую схему.
- **mkdocs-monorepo без `repo_url`** — сборка страницы подпроекта падает с
  `TypeError: join() missing 1 required positional argument`. Это обходится заданием `repo_url` и `edit_uri`. Точно так же воспроизводится со встроенной темой `mkdocs`.
- **`search` с языком по умолчанию, который в mkdocs-static-i18n указан не
  первым** — плагин i18n выполняет по одному проходу сборки на язык, начиная с
  языка по умолчанию, а затем идёт по `languages`, пропуская тот, который
  только что собрал. Каждый пункт он сравнивает с предыдущим проходом, а не с
  языком по умолчанию, поэтому язык по умолчанию, указанный где угодно, кроме
  первого места, собирается дважды, и каждая его страница дважды попадает в
  плагин поиска. Индекс доносит эти дубликаты до страницы поиска, где каждое
  совпадение показано дважды. Если поставить язык по умолчанию первым, этого
  не будет, но единственные на весь сайт `404.html` и `search.html` записывает
  последний проход — поэтому этот сайт оставляет `en` последним, а дубликаты
  убирает в `hooks.py`.
- **`material/search` с темой, отличной от Material** — плагин поиска Material
  отрисовывает `partials/language.html` через окружение Jinja *активной* темы. С любой темой, в которой нет этого шаблона, он выбрасывает `TemplateNotFound`, и сборка падает. Используйте вместо него встроенный плагин `search` — тема рассчитана именно на него.

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
