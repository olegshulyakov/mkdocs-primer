# Плагины

Большинство плагинов MkDocs никогда не затрагивают шаблон, поэтому работают с любой темой. А
некоторые этого не делают: они ожидают, что тема отобразит то, что они вычислили, или
обрабатывать созданную ими навигационную форму. Это те, которые стоит проверить.

Этот сайт является проверочным. `mkdocs.yml` в корне репозитория включает плагины.
которым нужна поддержка тем, и CI создает их с помощью `--strict`, поэтому регрессия
нарушает сборку, а не незаметно ухудшает качество страницы. Кандидаты были приняты.
из [каталога MkDocs](https://github.com/mkdocs/catalog), работая вниз
популярность.

## Плагины, которым нужно что-то из темы

### mkdocs-section-index

[mkdocs-section-index][section-index] сворачивает `guide/index.md` в **Руководство**
сам раздел, поэтому элемент навигации заканчивается как `children`, так и `url`. Тема
который отображает «имеет дочерние элементы» как обычную метку раздела, делает эту индексную страницу
недоступен с боковой панели.

`partials/nav-item.html` проверяет `nav_item.url` и отображает метку как ссылку.
когда он есть. Вы можете увидеть это на боковой панели: **Guide** и **Nested**
оба кликабельны.

!!! note «Предупреждение, которое вы можете игнорировать»
    Плагин распознает поддерживаемые темы, сопоставляя пути к файлам шаблонов.
    против встроенного списка, поэтому он регистрирует

```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

для каждой сторонней темы, включая эту. Поддержка здесь родная —
    ничего не нужно адаптировать — но посыл неизбежен со стороны темы.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] перезаписывает `theme.locale` только для тем, которые он поставляет.
поддержка, не включающая сторонние темы. Чтение `theme.locale`
поэтому сам по себе помечает каждую переведенную страницу языком по умолчанию.

`base.html` предпочитает переменную `i18n_page_locale`, которую плагин помещает на страницу.
контексте и возвращается к `theme.locale`, когда плагин отсутствует:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

Переведенные страницы `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` и `/fr/`.
содержат соответствующий атрибут `lang`. Страницы без перевода `*.<locale>.md`
вернуться к их английскому исходному коду, что является поведением плагина по умолчанию.

Если хотя бы два настроенных языка имеют `build: true`, заголовок также
отображает селектор языка. Его метки взяты из `name` каждого языка, а
каждая запись остается на той же странице в целевой локали. Сюда входят страницы
для чего плагин возвращается к исходному языку по умолчанию. Селектор
не отображается без `mkdocs-static-i18n` для одноязычной сборки или
на статической странице 404.

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] читает журнал git и сохраняет
результат `page.meta.git_revision_date_localized`. Ничто не отображает это, если только
тема требует этого, поэтому тема без этой строки придает плагину вид
сломан. `partials/footer.html` распечатывает его — строку «Последнее обновление» внизу.
этой страницы.

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] имеет ту же форму: помещает
`git_page_authors` в контексте страницы в виде строки HTML и оставляет
отображение в теме. В нижнем колонтитуле он печатается рядом с датой редакции.

### mkdocs-rss-плагин

[mkdocs-rss-plugin][rss] записывает `feed_rss_created.xml` и
`feed_rss_updated.xml`, но не добавляет разметки, поэтому ничто не указывает на них читателю.
`base.html` генерирует пару `<link rel="alternate">`, беря имена файлов из
собственную конфигурацию плагина, а не жестко запрограммировать их, поскольку они являются опциями.

Плагин не включен на этом сайте — см. [Известные конфликты плагинов](#known-plugin-conflicts).

### Майк

[mike][mike] хранит несколько версий документации рядом и добавляет
раскрывающийся список версий. Он находит раскрывающиеся ресурсы темы через `mike.themes`.
группу точек входа и для темы, которую она там не может найти, создает **no selector at
всё и ничего** — сайт разворачивается, версии существуют, и только так
перемещение между ними означает редактирование URL-адреса.

`pyproject.toml` регистрирует `mkdocs_primer.mike` в этой группе, поэтому Майк выбирает
скачайте `version-select.css` и `version-select.js` из этого пакета и копируйте
их. Селектор попадает в заголовок рядом с названием сайта и следует за
цветовой режим. Псевдонимы разрешаются в свою реальную версию, поэтому `/latest/` отображает `2.0`.
выбран, а не пустой элемент управления.

Этот скрипт считывает глобальный `base_url`, который `base.html` объявляет
безоговорочно. Раньше он объявлялся только тогда, когда был установлен плагин `search`.
включено, что привело бы к неработоспособности селектора на сайте без поиска.

### mkdocs-print-site

[mkdocs-print-site][print-site] отображает весь сайт как одну страницу, используя
шаблоны активной темы, которая работает здесь. Чего он не может сделать, так это поставить печать
CSS: он отправляет одну таблицу стилей для каждой темы, о которой он знает и предупреждает
`Theme 'primer' not yet supported` для остального.

В любом случае это задача темы. `theme.css` содержит блок `@media print`.
который удаляет заголовок, боковую панель и нумерацию страниц, освобождает столбец содержимого для
полную ширину и предотвращает разделение блоков кода и таблиц на страницы. Это
также закрепляет основной текст *светлым* цветом переднего плана Primer, поскольку посетитель
в противном случае при печати в темном режиме на белой бумаге будет отображаться светло-серый текст.
Этот блок применяется к любой странице, с плагином или без него.

### поиск

Встроенному плагину `search` нужна тема для отправки шаблона `search.html`.
и загрузить `search/main.js` с `base_url` в области видимости. Оба есть в теме;
поле поиска в заголовке появляется всякий раз, когда плагин включен, и исчезает, когда
это не так.

### mkdocstrings

[mkdocstrings][mkdocstrings] создает собственную разметку с классами `doc-*` и
оставляет стиль теме. Здесь это отображается разборчиво, потому что все
приземляется внутри `.markdown-body` и принимает масштаб шрифта Primer, но тема
не поставляется никаких специальных правил `doc-*` — сигнатуры и таблицы параметров используют Primer
по умолчанию. [Ссылка](../reference.md) — это страница, которую он генерирует.

## Плагины, которые просто работают

Им ничего не нужно от темы, кроме правильно сформированного HTML. Первая группа
включен на этом сайте, так что это остается верным:

| Плагин | Что он делает на этом сайте |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Создает навигацию из `docs/.nav.yml` вместо ключа `nav:`. |
| [mkdocs-glightbox][glightbox] | Открывает изображения на [домашней странице](../index.md) в лайтбоксе. |
| [mkdocs-minify-plugin][minify] | Минимизирует HTML, CSS и JS каждой страницы, включая встроенный скрипт цветового режима темы. |
| [mkdocs-redirects][redirects] | `/options/` перенаправляет на [Конфигурация](configuration.md). |
| [mkdocs-macros-plugin][macros] | Рендерит Jinja в Markdown. Этот сайт **{{ config.site_name }}** ​​создан с использованием темы `{{ config.theme.name }}` — это предложение взято из плагина, а не из Markdown. |

Вторая группа была проверена на соответствие теме в «чистой» сборке, а не
подключен к этому сайту, потому что каждому нужен контент, который не принесет дохода
его место в документации темы:

| Плагин | Проверено |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | Тег `<swagger-ui>` разворачивается, ресурсы копируются. |
| [mkdocs-include-markdown-plugin][include-markdown] | Фрагмент встроен. |
| [уценка-exec][markdown-exec] | Код выполнен, вывод встроен. |
| [mkdocs-table-reader-plugin][table-reader] | CSV отображается в виде таблицы. |
| [mkdocs-markdownextradata-plugin][extradata] | Значения `extra:` интерполированы. |
| [mkdocs-autolinks-plugin][autolinks] | Устранены пустые ссылки `[file.md](file.md)`. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Тело страницы зашифровано, в HTML не осталось открытого текста, отображается форма пароля, оболочка темы вокруг нее не повреждена. |
| [mkdocs-monorepo-plugin][monorepo] | Подпроект объединен через `!include`. |
| `material/group` | Включает или отключает группу плагинов. Благодаря встроенному `search` окно поиска темы корректно отображается, когда группа включена, и исчезает, когда она выключена. |

Плагины на уровне навигации и файла — [mkdocs-literate-nav][literate-nav],
[mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — никогда не достигать
шаблон вообще.

<a id="known-plugin-conflicts"></a>

## Известные конфликты плагинов

Не каждая неудача связана с темой. Четыре, о которых стоит знать, и все они воспроизводимы
под любую тему.

Два из них объясняют, почему этот сайт — не единственная сборка в репозитории:
задействованные плагины не могут использовать одну и ту же конфигурацию с уже включенными здесь, поэтому
они получают собственный сайт под `examples/`, созданный с помощью `--strict` компанией
та же самая работа CI.

- **mkdocs-rss-plugin с mkdocs-static-i18n** — плагин RSS переписывает свой
  собственный `date_from_meta.default_time` из строки в `datetime` во время
  `on_config`. Плагин i18n запускает `on_config` один раз для каждого языка, поэтому второй
  pass повторно анализирует `datetime` и выдает предупреждение, прерывая сборку `--strict`. Продемонстрировано
  вместо этого в [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files с mkdocs-static-i18n** — файлы, созданные во время
  `on_files` не классифицируются плагином i18n, который регистрирует
  `Unhandled file case` и удаляет их из сборки. Вместо этого продемонстрировано на
  [examples/gen-files/]({{ config.site_url }}examples/gen-files/) вместе с
  mkdocs-literate-nav, который в противном случае конкурировал бы с mkdocs-awesome-nav за
  навигация.
- **Mermaid с `minify_html`** — Mermaid анализирует исходный код построчно и
  минификатор сворачивает символы новой строки внутри `<div>`. Диаграмма отображается как
  *Синтаксическая ошибка в тексте* и сборка ничего не говорит. Вместо этого продемонстрировано на
  [examples/diagrams/]({{ config.site_url }}examples/diagrams/), которые также
  описывает [mkdocs-charts-plugin][charts] и то, как оба выбирают цветовой режим.
- **mkdocs-monorepo без `repo_url`** — создание страницы подпроекта поднимает вопрос.
  `TypeError: join() missing 1 required positional argument`. Настройка `repo_url`
  и `edit_uri` избегает этого. Идентично воспроизводится под встроенным `mkdocs`
  тема.
- **`material/search` с темой, отличной от Material** — Плагин поиска материалов
  визуализирует `partials/language.html` через Jinja *активной* темы
  окружающая среда. В любой теме, которая не поставляется с этим шаблоном, возникает
  `TemplateNotFound` и сборка прекращается. Используйте встроенный плагин `search`.
  вместо этого; тема построена на этом.

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
