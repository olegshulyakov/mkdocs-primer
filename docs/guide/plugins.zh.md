# 插件

大多数 MkDocs 插件从不触及模板，因此适用于任何主题。少数则不然：它们期望主题渲染它们计算出的内容，或者处理它们构造出的导航结构。值得检查的正是这些插件。

本站本身就是这项检查。仓库根目录下的 `mkdocs.yml` 启用了需要主题支持的插件，CI 使用 `--strict` 构建它，因此一旦出现回归，构建就会失败，而不是让某个页面悄无声息地变差。候选插件取自 [MkDocs 目录](https://github.com/mkdocs/catalog)，按受欢迎程度从高到低逐一检查。

<a id="plugins-that-need-something-from-the-theme"></a>

## 需要主题配合的插件

### mkdocs-section-index

[mkdocs-section-index][section-index] 把 `guide/index.md` 并入 **指南** 章节本身，于是一个导航项会同时拥有 `children` 和 `url`。如果主题把“有子项”渲染成普通的章节标签，这个索引页就无法从侧边栏访问。

`partials/nav-item.html` 会检查 `nav_item.url`，有值时就把标签渲染成链接。你可以在侧边栏中看到效果：**指南** 和 **嵌套** 都可以点击。

!!! note "可以忽略的警告"
    该插件通过将模板文件路径与内置列表进行匹配来识别受支持的主题，因此对每个第三方主题（包括本主题），它都会记录

    ```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

    本主题的支持是原生的——无需任何适配——但从主题这一侧无法避免这条消息。

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] 只会为它自带支持的主题重写 `theme.locale`，其中不包括第三方主题。因此，仅读取 `theme.locale` 会把每个翻译页面都标记为默认语言。

`base.html` 优先使用插件放入页面上下文的 `i18n_page_locale` 变量，没有该插件时则回退到 `theme.locale`：

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

`/es/`、`/zh/`、`/hi/`、`/pt/`、`/ru/` 和 `/fr/` 下的翻译页面都带有相应的 `lang` 属性。没有 `*.<locale>.md` 翻译的页面会回退到英文源文件，这是该插件的默认行为。

当至少有两种已配置的语言设置了 `build: true` 时，页眉中还会渲染语言选择器。其标签取自各语言的 `name`，每个条目都会停留在目标语言下的同一页面，包括插件回退到默认语言源文件的页面。没有 `mkdocs-static-i18n`、只构建单一语言，或者在静态 404 页面上时，不会渲染选择器。

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] 读取 git 日志，并把结果存入 `page.meta.git_revision_date_localized`——如果设置了 `enable_creation_date: true`，还会存入 `page.meta.git_creation_date_localized`。除非主题主动读取，否则两者都不会显示，因此缺少这些代码的主题会让插件看起来像是坏了。`partials/metadata.html` 会把两者都打印出来，作为页面标题下方元数据行中的“创建于”和“最后更新”两项。

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] 的情况相同：它把 `git_page_authors` 作为一段 HTML 字符串放入页面上下文，显示则交给主题。元数据行会把它与日期一起打印出来。

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] 会生成 `feed_rss_created.xml` 和 `feed_rss_updated.xml`，但不添加任何标记，因此没有任何地方把读者引向它们。`base.html` 会输出一对 `<link rel="alternate">`，文件名取自插件自身的配置而非硬编码，因为它们是可配置的选项。

本站没有启用该插件——参见[已知的插件冲突](#known-plugin-conflicts)。

### mike

[mike][mike] 让多个文档版本并存，并添加一个版本下拉菜单。它通过 `mike.themes` 入口点组查找主题的下拉菜单资源；对于在其中找不到的主题，它**完全不生成选择器，也不给出任何提示**——站点照常部署，各个版本也都存在，但在它们之间切换的唯一办法就是手动修改 URL。

`pyproject.toml` 在该组下注册了 `mkdocs_primer.mike`，因此 mike 会从本包中取得 `version-select.css` 和 `version-select.js` 并复制进站点。选择器位于页眉中站点名称旁边，并跟随配色模式。别名会解析为其实际版本，因此 `/latest/` 会显示选中的 `2.0`，而不是一个空的控件。

该脚本读取全局变量 `base_url`，`base.html` 会无条件声明它。过去它只在启用 `search` 插件时才声明，这会导致没有搜索功能的站点上选择器失效。

### mkdocs-print-site

[mkdocs-print-site][print-site] 使用当前主题的模板把整个站点渲染成一个页面，这在本主题下可以正常工作。它做不到的是提供打印用的 CSS：它为每个已知主题各提供一份样式表，对其余主题则发出警告 `Theme 'primer' not yet supported`。

这本来就是主题的职责。`theme.css` 包含一个 `@media print` 块，它会去掉页眉、侧边栏和分页，让内容栏扩展到全宽，并防止代码块和表格跨页断开。它还把正文文字固定为 Primer 的*浅色*模式前景色，否则在深色模式下打印的访客会在白纸上得到浅灰色的文字。无论是否使用该插件，这个块都适用于任何页面。

### search

内置的 `search` 插件要求主题提供 `search.html` 模板，并在 `base_url` 可用的作用域中加载 `search/main.js`。这两点主题都已具备；启用该插件时，页眉中的搜索框就会出现，未启用时则会消失。

### mkdocstrings

[mkdocstrings][mkdocstrings] 输出带有 `doc-*` 类的自有标记，样式则交给主题。它在这里能清晰地呈现，因为所有内容都位于 `.markdown-body` 之内，沿用了 Primer 的字号体系；但主题并未提供专门的 `doc-*` 规则——签名和参数表使用的是 Primer 的默认样式。[参考](../reference.md)就是它生成的页面。

<a id="plugins-that-just-work"></a>

## 开箱即用的插件

这些插件除了结构良好的 HTML 之外，不需要主题提供任何东西。第一组已在本站启用，以确保这一点始终成立：

| 插件 | 在本站的作用 |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | 根据 `docs/.nav.yml` 而不是 `nav:` 键构建导航。 |
| [mkdocs-glightbox][glightbox] | 在灯箱中打开[元素](../elements.md)页面上的图片。 |
| [mkdocs-minify-plugin][minify] | 压缩每个页面的 HTML、CSS 和 JS，包括主题的内联配色模式脚本。 |
| [mkdocs-redirects][redirects] | `/options/` 重定向到[配置](configuration.md)。 |
| [mkdocs-macros-plugin][macros] | 在 Markdown 中渲染 Jinja。本站是 **{{ config.site_name }}**，使用主题 `{{ config.theme.name }}` 构建——这句话来自该插件，而不是 Markdown。 |

第二组是在临时构建中针对本主题检查的，而没有接入本站，因为每个插件都需要一些测试用内容，而这些内容不值得放进主题的文档里：

| 插件 | 检查结果 |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | `<swagger-ui>` 标签正常展开，资源已复制。 |
| [mkdocs-include-markdown-plugin][include-markdown] | 片段已内联。 |
| [markdown-exec][markdown-exec] | 代码已执行，输出已内联。 |
| [mkdocs-table-reader-plugin][table-reader] | CSV 渲染为表格。 |
| [mkdocs-markdownextradata-plugin][extradata] | `extra:` 中的值已插入。 |
| [mkdocs-autolinks-plugin][autolinks] | 裸写的 `[file.md](file.md)` 链接已解析。 |
| [mkdocs-encryptcontent-plugin][encryptcontent] | 页面正文已加密，HTML 中不留明文，密码表单正常渲染，周围的主题框架完好无损。 |
| [mkdocs-monorepo-plugin][monorepo] | 子项目通过 `!include` 合并进来。 |
| `material/group` | 启用或禁用一组插件。把内置的 `search` 放入组中时，主题的搜索框会在组开启时正确出现，在组关闭时消失。 |

导航和文件层面的插件——[mkdocs-literate-nav][literate-nav]、[mkdocs-awesome-pages][awesome-pages]、[mkdocs-exclude][exclude]——根本不会触及模板。

<a id="known-plugin-conflicts"></a>

## 已知的插件冲突

并非每个故障都是主题造成的。下面六个值得了解，它们在任何主题下都能复现。

其中三个正是本站并非仓库中唯一构建的原因：涉及的插件无法与本站已启用的插件共用一份配置，因此它们在 `examples/` 下各有自己的站点，由同一个 CI 任务以 `--strict` 构建。

[示例](../examples.md)页面介绍了其中每个站点展示的内容。

- **mkdocs-rss-plugin 与 mkdocs-static-i18n**——RSS 插件会在 `on_config` 期间把自己的 `date_from_meta.default_time` 从字符串改写为 `datetime`。i18n 插件会为每种语言各运行一次 `on_config`，因此第二遍会重新解析一个 `datetime` 并发出警告，导致 `--strict` 构建中止。改为在 [examples/rss/]({{ config.site_url }}examples/rss/) 中演示。
- **mkdocs-gen-files 与 mkdocs-static-i18n**——在 `on_files` 期间创建的文件不会被 i18n 插件归类，它会记录 `Unhandled file case` 并把这些文件从构建中丢弃。改为在 [examples/gen-files/]({{ config.site_url }}examples/gen-files/) 中演示，同时演示 mkdocs-literate-nav，否则它会与 mkdocs-awesome-nav 争夺导航。
- **Mermaid 与 `minify_html`**——Mermaid 逐行解析其源代码，而压缩器会折叠其 `<div>` 内的换行符。图表会渲染成 *Syntax error in text*，构建却没有任何提示。改为在 [examples/diagrams/]({{ config.site_url }}examples/diagrams/) 中演示，那里还介绍了 [mkdocs-charts-plugin][charts]，以及两者如何跟随配色模式。
- **未设置 `repo_url` 的 mkdocs-monorepo**——构建子项目页面时会抛出 `TypeError: join() missing 1 required positional argument`。设置 `repo_url` 和 `edit_uri` 即可避免。在内置的 `mkdocs` 主题下也会完全一样地复现。
- **`search` 与默认语言未列在首位的 mkdocs-static-i18n**——i18n 插件为每种语言运行一遍构建，从默认语言开始，然后遍历 `languages`，跳过刚刚构建过的那一种。它把每个条目与上一遍比较，而不是与默认语言比较，因此只要默认语言没有列在首位，就会被构建两次，它的每个页面都会两次进入搜索插件。索引会把这些重复项一直带到搜索页面，每条结果都会列出两次。把默认语言列在首位可以避免这个问题，但写出站点唯一的 `404.html` 和 `search.html` 的是最后一遍——所以本站仍把 `en` 列在最后，改为在 `hooks.py` 中去掉重复条目。
- **`material/search` 与非 Material 主题**——Material 的搜索插件会通过*当前*主题的 Jinja 环境渲染 `partials/language.html`。在任何没有提供该模板的主题下，它都会抛出 `TemplateNotFound`，构建随之终止。请改用内置的 `search` 插件；本主题正是针对它构建的。

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
