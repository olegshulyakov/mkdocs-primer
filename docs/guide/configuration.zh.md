# 配置

<a id="theme-options"></a>

## 主题选项

| 选项 | 默认值 | 描述 |
|:---|:---|:---|
| `logo` | `null` | 显示在站点名称旁边的图像，路径相对于 `docs_dir`。 |
| `favicon` | `img/favicon.svg` | 站点图标。 |
| `icon` | `octicons` | 主题控件使用的图标集：`octicons` 或 `lucide`。 |
| `font.text` | `null` | 界面和正文使用的 CSS font-family 值。 |
| `font.code` | `null` | 行内代码和代码块使用的 CSS font-family 值。 |
| `font.source` | `null` | 外部样式表 URL，或 `docs_dir` 下的本地样式表。 |
| `locale` | `en` | 主题自身文字的语言。随附 `en`、`es`、`fr`、`hi`、`pt`、`ru` 和 `zh` 的语言目录。 |
| `direction` | `ltr` | 文档方向：`ltr` 或 `rtl`。 |
| `include_sidebar` | `true` | 渲染导航侧边栏。 |
| `nav_expand` | `all` | 哪些导航分区连同其页面一起渲染：`all`，或 `active`，只渲染当前页面所在的分区和没有自身页面的分区。大型站点使用 `active` 可减小页面体积并缩短构建时间。 |
| `show_footer` | `true` | 渲染页脚栏。 |
| `show_footer_generator` | `true` | 在页脚中显示“使用 mkdocs-primer 和 MkDocs 构建”。 |
| `social` | `[]` | 显示在页脚中的图标链接。 |
| `show_metadata` | `true` | 在页面标题下方渲染元数据行。 |
| `show_metadata_created` | `true` | 显示创建日期。 |
| `show_metadata_updated` | `true` | 显示最后更新日期。 |
| `show_metadata_reading_time` | `true` | 显示预计阅读时间。 |
| `show_metadata_authors` | `true` | 显示作者。 |
| `toc` | `auto` | “目录”大纲：`auto`、`expanded`、`collapsed` 或 `hidden`。 |
| `offline` | `false` | 注册一个 service worker，该文件需要由站点构建流程自行生成。 |
| `color_mode` | `auto` | 初始配色模式：`auto`、`light` 或 `dark`。 |
| `light_theme` | `light` | 浅色模式下使用的 Primer 主题。 |
| `dark_theme` | `dark` | 深色模式下使用的 Primer 主题。 |

`color_mode` 只设置*初始*模式。访客可以通过页眉中的切换控件更改它，他们的选择会保存在 `localStorage` 中。

`toc` 决定由当前页面标题生成的大纲放在哪里。窗口宽到能容下第三栏时，`auto` 把它放进右侧栏，否则置于页面标题之下——在那里它是读者自行展开的折叠块，而不是横在标题与首段之间的列表。`expanded` 让它留在正文流里、不进右侧栏，`collapsed` 把它变成读者自行展开的折叠块，`hidden`（或 `false`）则完全不显示它。

<a id="metadata-line"></a>

## 元数据行

在页面标题正下方、正文之上，主题可以显示一行关于当前页面的信息：何时创建、何时最后修改、需要读多久，以及由谁撰写。每一项只有在其对应选项开启*并且*确有数据时才会出现；四项都无内容可显示时，整行都会省略。

```yaml
theme:
  name: primer
  show_metadata: true # the line's own switch; false hides all four items
  show_metadata_created: true
  show_metadata_updated: true
  show_metadata_reading_time: true
  show_metadata_authors: true
```

`show_metadata` 会关闭整行，无论其下各字段如何设置。每个字段也可以单独关闭——比如某个站点想要显示日期，但不想要阅读时间估算。

`show_metadata_reading_time` 根据页面渲染后的字数、按每分钟 265 词（成年人的平均阅读速度）估算阅读所需的分钟数；对于没有自身内容的页面（例如章节索引页），则不显示此项。

两个日期来自 [mkdocs-git-revision-date-localized](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin)：

```yaml
plugins:
  - git-revision-date-localized:
      enable_creation_date: true # also required for the "created" date
```

除非启用该插件，否则两个日期都不会出现；而创建日期还特别需要 `enable_creation_date: true`——插件自身的默认设置是关闭它的。

作者来自 [mkdocs-git-authors](https://github.com/timvink/mkdocs-git-authors-plugin)，同样只有在启用该插件后才会出现。

<a id="footer"></a>

## 页脚

横贯每个页面底部的一栏，位于整个布局之下。它一侧显示两行文字，另一侧显示一排图标链接；没有任何内容可放时，整个页脚都会省略。无论其他配置如何，`show_footer: false` 都会将其移除。

页脚中的每个链接都通向文档之外，因此每个链接都会在新标签页中打开。

第一行是版权信息以及页面源文件的位置——后者参见[编辑链接](#edit-links)。版权信息取自 MkDocs 自己的 `copyright`，它是顶层键，而不是主题选项：

```yaml
copyright: Copyright &copy; 2026 Your Name
```

第二行说明站点由什么构建。用 `show_footer_generator: false` 关闭它：

```yaml
theme:
  name: primer
  show_footer_generator: false
```

<a id="social-links"></a>

### 社交链接

`social` 是一组以图标形式绘制的链接，位于版权信息的另一侧：

```yaml
theme:
  name: primer
  social:
    - service: github
      link: https://github.com/you/your-project
    - service: mastodon
      link: https://fosstodon.org/@you
      name: Follow the project on Mastodon
```

`service` 指定主题自带的某个标志。`name` 是可选的：它是链接的无障碍名称——即屏幕阅读器朗读的内容——默认为该服务自身的名称；如果单单一个“GitHub”说不清链接指向哪里，就请提供一个。

可用的服务如下：

`bitbucket`、`bluesky`、`codeberg`、`devdotto`、`discord`、`docker`、`facebook`、`forgejo`、`github`、`githubsponsors`、`gitlab`、`instagram`、`kofi`、`mastodon`、`matrix`、`medium`、`npm`、`opencollective`、`patreon`、`pypi`、`reddit`、`rss`、`stackoverflow`、`substack`、`telegram`、`twitch`、`x`、`youtube`、`zulip`。

其他服务则不要指定 `service`，而是将 `icon` 指向 `docs_dir` 下的一个 SVG：

```yaml
theme:
  name: primer
  social:
    - icon: img/linkedin.svg
      link: https://www.linkedin.com/company/your-company
      name: Your Company on LinkedIn
```

这样的标志以 `<img>` 绘制，因此与内置标志不同，它保留自身的颜色，而不是跟随周围文字的颜色。LinkedIn 和 Slack 需要走这条路：两者都要求从主题所依据的图标集中移除，因此都不随主题提供。

这些标志来自 [Simple Icons](https://github.com/simple-icons/simple-icons)，以 CC0-1.0 发布。但它们所描绘的品牌并非如此：每个品牌仍是其所有者的商标，把它放进你的页脚，并不表示与其存在任何关联或获得其认可。

<a id="icons"></a>

## 图标

页眉导航、配色模式控件、返回顶部按钮以及代码块上的复制按钮，都使用来自同一图标集的内联 SVG。默认为 `octicons`；选择 Lucide 图标的方法如下：

```yaml
theme:
  name: primer
  icon: lucide
```

两套图标都包含在主题中，因此无论选哪个都不会增加 CDN 请求。图标选择只作用于主题的 HTML 控件。语言选择器始终使用 Octicon 的地球图标。我们有意不支持 Markdown 图标语法和任意第三方图标包。

<a id="fonts"></a>

## 字体

字体需要主动启用：默认情况下，主题不会请求任何字体 CDN。分别设置正文和代码的字体族，然后将 `source` 指向外部样式表或 `docs_dir` 中的 CSS 文件：

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

对于自托管的站点，将字体文件和样式表放在 `docs_dir` 中，然后使用相对的源路径：

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

浏览器会像平常一样缓存这些文件。自托管避免了第三方请求，并且资源被缓存后，站点在离线时也能使用。

<a id="language"></a>

## 语言

主题自身的文字——`Search`、`Back to top`、`Previous`/`Next`、页脚中的标签——来自 gettext 语言目录，与页面内容所用的语言相互独立。用 `locale` 选择一种：

```yaml
theme:
  name: primer
  locale: ru
```

随附 `en`、`es`、`fr`、`hi`、`pt`、`ru` 和 `zh` 的语言目录。未列出的语言会回退到英语，而不会导致构建失败。

!!! note "多语言站点需要为每种语言设置 `locale`"
    mkdocs-static-i18n 只会为 MkDocs 自带的主题自动设置 `theme.locale`，因此第三方主题必须显式告知。把它添加到每种语言中，否则每个语言版本的界面都会显示英语：

    ```yaml
    plugins:
      - i18n:
          languages:
            - locale: en
              default: true
              build: true
              theme:
                locale: en
            - locale: ru
              build: true
              theme:
                locale: ru
    ```

!!! warning "把默认语言列在最后"
    该插件为每种语言运行一遍构建，而整个站点只有一份的页面——`404.html` 和 `search.html`——每一遍都会被重写。因此，这两个页面最终使用的是**最后**列出的那种语言。把默认语言列在最后，它们就会使用默认语言。主题会自行对语言选择器排序，所以这不会改变访客看到的顺序。

要添加或修正某种语言，请编辑 `mkdocs_primer/locales/<locale>/LC_MESSAGES/messages.po` 并重新编译——参见 [`RELEASING.md`](https://github.com/olegshulyakov/mkdocs-primer/blob/main/RELEASING.md)。

<a id="right-to-left-layouts"></a>

## 从右到左的布局

对于从右到左的文档，设置 `direction: rtl`。主题会在根 HTML 元素上加上 `dir="rtl"`，并通过 CSS 逻辑属性镜像其页眉、侧边栏、移动端导航、分页、页脚、菜单和控件。代码和图表有意保持从左到右。

```yaml
theme:
  name: primer
  direction: rtl
```

方向是全站范围的设置；主题不会根据页面或语言区域推断它。

!!! warning "`light_theme` 和 `dark_theme` 目前只接受 `light` 和 `dark`"
    Primer 发布了十四个主题（`dark_dimmed`、`light_high_contrast`、`dark_tritanopia` 等），但本主题只提供其中两个的颜色令牌——全套会增加远超 1 MB 的 CSS。指定其他任何主题都不会报错，而是渲染出一个完全没有颜色的页面。对更多主题的支持已列为未来的新增功能。

<a id="heading-anchors"></a>

## 标题锚点

要在每个标题旁边获得 GitHub 那样的悬停锚点，请启用 `toc` 扩展，并使用带有 Primer `anchor` 类的前置永久链接：

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

主题会自己绘制 octicon，因此 `permalink` 设置为空字符串，而不是通常的 `true`。这不只关乎外观：MkDocs 的搜索插件不会去除永久链接符号，否则 `¶` 就会出现在你的搜索结果中。

没有这项配置，永久链接依然可用，只是显示为普通符号，而不是 octicon。

<a id="syntax-highlighting"></a>

## 语法高亮

代码颜色来自 Primer 的 `prettylights` 变量，因此会自动跟随当前的配色模式。无需选择 Pygments 样式：

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

`.highlight` 和 `.codehilite` 两种包装器都有样式，因此 `codehilite` 同样可用。

主题会为每个 Pygments `.highlight` 代码块添加一个复制按钮。它复制可见的源代码，并播报剪贴板操作是否成功。由插件渲染的代码块（例如 Mermaid 和 Vega-Lite）被有意排除在外。

<a id="navigation-controls"></a>

## 导航控件

滚动 400 像素后，页面右下角会出现返回顶部按钮。它让访客回到文档开头，并将键盘焦点移到站点标题链接上。如果访客要求减少动态效果，则直接跳转、不做滚动动画。

<a id="offline-support"></a>

## 离线支持

`offline: true` 只会给每个页面添加一样东西：一段从站点根目录注册 `service-worker.js` 的脚本。主题不会生成这个文件，MkDocs 也没有任何能生成它的功能——生成它是你自己的构建流程需要在 `mkdocs build` 之后执行的一步：

```yaml
theme:
  name: primer
  offline: true
```

```console
$ mkdocs build
$ npx workbox generateSW workbox-config.cjs
```

预缓存已构建站点的正是这个 service worker，因此访问过一次的访客无需网络也能再次阅读。将 `offline` 保持为 `false`，就不会输出注册代码，这正是没有该构建步骤的站点所需要的——页面请求一个没人生成的 `service-worker.js`，每次访问都会记录一个 404。

有两件事它做不到。在安全上下文之外，service worker 会被拒绝，因此站点必须通过 HTTPS 或从 `localhost` 提供；通过 `file://` 打开的文件夹，无论如何都无法借此获得离线能力。另外，预缓存从*第二次*访问才开始——第一次访问正是用来填充缓存的。

本仓库自己的 `workbox-config.cjs` 及其 `npm run build:offline` 就是一个完整可用的示例。

<a id="markdown-extensions"></a>

## Markdown 扩展

这些扩展都不是必需的，但主题自带的样式只有在启用它们之后才能发挥作用：

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

`admonition` 值得特别一提：该扩展只输出标记，自身不带 CSS，`@primer/css` 也没有针对它的规则，所以没有样式的提示块是常见的意外。主题填补了这一空白——参见[示例](../elements.md#admonitions)。

<a id="custom-css-and-javascript"></a>

## 自定义 CSS 和 JavaScript

`extra_css` 在主题自带的所有样式表之后加载，因此你的规则无需 `!important` 就能胜出：

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

[样式](../styling.md)一页说明该在其中写什么：主题自己的布局变量，以及为什么在 `:root` 中覆盖 Primer 的颜色令牌会被丢弃，而同一条规则放在两个属性选择器下就会生效。

`extra_javascript` 输出在 `<body>` 的末尾，位于主题自己的脚本之后。

!!! note "注入自己资源的插件"
    有些插件把 `<link>` 标签直接写入页面 HTML，而不是添加到 `extra_css`——mkdocs-glightbox 就是其中之一——它们会落在你的覆盖样式*之后*。为这些内容设置样式时，请使用更具体的选择器，而不要依赖加载顺序。

<a id="edit-links"></a>

## 编辑链接

设置了 `repo_url` 和 `edit_uri` 时，[页脚](#footer)会链接回页面自己的源文件：

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```

只有 `repo_url` 而没有 `edit_uri` 时，无法生成逐页的链接，页脚会改为指向仓库本身——这样读者在站点的任何位置仍能找到源代码。
