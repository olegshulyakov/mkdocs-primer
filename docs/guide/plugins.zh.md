# 插件

大多数 MkDocs 插件从不接触模板，因此它们适用于任何主题。一个 少数人不这样做：他们希望主题能够渲染他们计算的东西，或者 处理他们创建的导航形状。这些是值得检查的。

这个网站就是检查。存储库根目录中的 `mkdocs.yml` 启用插件 需要主题支持，CI 使用 `--strict` 构建它，所以回归 破坏构建而不是悄悄降级页面。候选人已被录取 来自 [MkDocs 目录](https://github.com/mkdocs/catalog)，由 受欢迎程度。

## 需要主题中某些内容的插件

### mkdocs-section-index

[mkdocs-section-index][section-index] 将 `guide/index.md` 折叠到 **指南** 部分本身，因此导航项以 `children` 和 `url` 结尾。一个主题 将“有子项”呈现为普通部分标签使得该索引页 从侧边栏无法访问。

`partials/nav-item.html` 检查 `nav_item.url` 并将标签呈现为链接 当有一个时。您可以在侧边栏中看到它：**Guide** 和 **Nested** 是 两者均可点击。

!!!注意“您可以忽略的警告”
    该插件通过匹配模板文件路径来识别支持的主题
    针对内置列表，因此它会记录

```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

对于每个第三方主题，包括这个。这里的支持是原生的——
    没有什么需要调整——但从主题方面来看，这个信息是不可避免的。

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] 仅针对其附带的主题重写 `theme.locale` 支持，其中不包括第三方主题。读取`theme.locale` 因此，单独使用默认语言标记每个翻译页面。

`base.html` 更喜欢插件放在页面上的 `i18n_page_locale` 变量 上下文，并在插件不存在时回退到 `theme.locale`：

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

`/es/`、`/zh/`、`/hi/`、`/pt/`、`/ru/` 和 `/fr/` 下的翻译页面 携带匹配的 `lang` 属性。没有 `*.<locale>.md` 翻译的页面 回到他们的英文源，这是插件的默认行为。

当至少两种配置语言具有 `build: true` 时，标头还 呈现语言选择器。其标签来自各语言的`name`，并且 每个条目都保留在目标区域设置的同一页面上。这包括页面 插件会回退到默认语言源。选择器 对于单语言构建，如果没有 `mkdocs-static-i18n`，则不会呈现，或者 在静态 404 页面上。

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] 读取 git 日志并存储 结果是 `page.meta.git_revision_date_localized`。没有任何东西显示它，除非 主题要求它，所以没有该行的主题会使插件看起来 坏了。 `partials/footer.html` 打印它 — 底部的“最后更新”行 此页面的。

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] 具有相同的形状：它放置 `git_page_authors` 在页面上下文中作为 HTML 字符串并留下 显示到主题。页脚将其打印在修订日期旁边。

### mkdocs-rss-插件

[mkdocs-rss-plugin][rss] 写入 `feed_rss_created.xml` 和 `feed_rss_updated.xml` 但没有添加标记，因此没有任何内容向读者指出它们。 `base.html` 发出 `<link rel="alternate">` 对，从以下位置获取文件名 插件自己的配置而不是硬编码它们，因为它们是选项。

该网站未启用该插件 - 请参阅[已知插件冲突](#known-plugin-conflicts)。

### 迈克

[mike][mike] 并排保留多个文档版本并添加 版本下拉列表。它通过 `mike.themes` 查找主题的下拉资源 入口点组，对于在那里找不到的主题，构建**没有选择器 一切都没有说** - 站点部署，版本存在，并且是唯一的方法 要在它们之间移动，只需编辑 URL。

`pyproject.toml` 在该组下注册 `mkdocs_primer.mike`，因此 mike 选择 从此包中获取 `version-select.css` 和 `version-select.js` 并复制 选择器位于站点名称旁边的标题中，并遵循 色彩模式。别名解析为其真实版本，因此 `/latest/` 显示 `2.0` 选择而不是空控件。

该脚本读取全局 `base_url`，`base.html` 声明了该全局 `base_url` 无条件地。过去仅在 `search` 插件启用时才声明 启用，这会使选择器在没有搜索的情况下在网站上损坏。

### mkdocs-打印站点

[mkdocs-print-site][print-site] 使用以下命令将整个站点呈现为一页 活动主题的模板，可在此处使用。它不能做的是提供打印 CSS：它为每个它知道并发出警告的主题提供一个样式表 其余的为 `Theme 'primer' not yet supported`。

无论如何，这就是主题的工作。 `theme.css` 携带 `@media print` 块 删除标题、侧边栏和分页，将内容列释放到 全宽，并防止代码块和表格跨页拆分。它 还将正文文本固定到 Primer 的*浅*前景色，因为访问者 否则，在深色模式下打印会在白纸上显示浅灰色文本。 该块适用于任何页面，无论有没有插件。

### 搜索

内置 `search` 插件需要主题来发送 `search.html` 模板 并在范围内加载 `base_url` 和 `search/main.js`。两者都在主题中； 每当插件启用时，标题搜索框就会出现，并且在插件启用时消失 事实并非如此。

### mkdocstrings

[mkdocstrings][mkdocstrings] 使用 `doc-*` 类发出自己的标记，并且 将样式留给主题。它在这里清晰地呈现，因为一切 落在 `.markdown-body` 内并拾取 Primer 的字体比例，但主题 没有提供专用的 `doc-*` 规则 - 签名和参数表使用 Primer 的 默认值。 [Reference](../reference.md) 是它生成的页面。

## 可以使用的插件

除了格式良好的 HTML 之外，这些不需要主题的任何内容。第一组是 在此网站上启用，因此保持不变：

|插件 |它在这个网站上做什么 |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav]|从 `docs/.nav.yml` 而不是 `nav:` 键构建导航。 |
| [mkdocs-glightbox][glightbox] |在灯箱中打开[主页](../index.md) 上的图像。 |
| [mkdocs-minify-插件][minify] |缩小每个页面的 HTML、CSS 和 JS，包括主题的内联颜色模式脚本。 |
| [mkdocs-重定向][redirects] | `/options/` 重定向到[配置](configuration.md)。 |
| [mkdocs-macros-plugin][macros] |在 Markdown 中渲染 Jinja。这个网站是 **{{ config.site_name }}**，以主题 `{{ config.theme.name }}` 构建 - 这句话来自插件，而不是来自 Markdown。 |

第二组是在临时构建中针对主题进行检查，而不是 连接到这个网站，因为每个人都想要无法赚取的固定内容 它在主题文档中的位置：

|插件 |已检查 |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | `<swagger-ui>` 标签扩展，资产复制。 |
| [mkdocs-include-markdown-plugin][include-markdown] |内嵌片段。 |
| [markdown-exec][markdown-exec] |执行代码，内联输出。 |
| [mkdocs-table-reader-plugin][table-reader] | CSV 呈现为表格。 |
| [mkdocs-markdownextradata-插件][extradata] | `extra:` 值已插值。 |
| [mkdocs-autolinks-plugin][autolinks] |裸 `[file.md](file.md)` 链接已解决。 |
| [mkdocs-加密内容-插件][encryptcontent] |页面主体经过加密，HTML 中不留明文，密码形式呈现，主题外壳完好无损。 |
| [mkdocs-monorepo-插件][monorepo] |子项目通过`!include`合并。 |
| `material/group` |启用或禁用插件组。凭借内置的 `search`，主题的搜索框在群组打开时正确显示，在群组关闭时消失。 |

导航和文件级插件 — [mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — 永远不会达到 根本没有模板。

<a id="known-plugin-conflicts"></a>

## 已知插件冲突

并非所有的失败都是主题的。四个值得了解的内容，全部可复制 在任何主题下。

其中两个原因是该站点不是存储库中唯一构建的原因： 涉及的插件无法与此处已启用的插件共享配置，因此 他们在 `examples/` 下获得了自己的网站，该网站由 `--strict` 构建 同样的 CI 工作。

- **mkdocs-rss-plugin 和 mkdocs-static-i18n** — RSS 插件重写了它的
  期间将自己的 `date_from_meta.default_time` 从字符串转换为 `datetime` `on_config`。 i18n 插件每种语言运行 `on_config` 一次，因此第二个 pass 重新解析 `datetime` 并发出警告，中止 `--strict` 构建。展示了 而是在 [examples/rss/]({{ config.site_url }}examples/rss/)。
- **mkdocs-gen-files 和 mkdocs-static-i18n** — 期间创建的文件
  `on_files` 不被 i18n 插件分类，它记录 `Unhandled file case` 并将它们从构建中删除。改为展示于 [examples/gen-files/]({{ config.site_url }}examples/gen-files/)，以及 mkdocs-literate-nav，否则它将与 mkdocs-awesome-nav 竞争 导航。
- **Mermaid with `minify_html`** — Mermaid 逐行解析其源代码，并且
  缩小器会折叠其 `<div>` 内的换行符。该图呈现为 *文本中的语法错误*并且构建什么也没说。改为展示于 [示例/图表/]({{ config.site_url }}examples/diagrams/)，其中还 涵盖 [mkdocs-charts-plugin][charts] 以及两者如何选择颜色模式。
- **mkdocs-monorepo 没有 `repo_url`** — 构建子项目页面引发
  `TypeError: join() missing 1 required positional argument`。设置 `repo_url` 而 `edit_uri` 则避免了这种情况。在内置 `mkdocs` 下进行相同的再现 主题。
- **`material/search` 具有非 Material 主题** — Material 的搜索插件
  通过*活动*主题的 Jinja 渲染 `partials/language.html` 环境。在任何不提供该模板的主题下 `TemplateNotFound` 和构建模具。使用内置的`search`插件 相反；主题就是针对这一主题而建立的。

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
