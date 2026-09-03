# 配置

## 主题选项

|选项|默认 |描述 |
|:---|:---|:---|
| `logo` | `null` |站点名称旁边显示的图像，相对于 `docs_dir`。 |
| `favicon` | `img/favicon.svg` |网站图标。 |
| `icon` | `octicons` |主题控件的图标集：`octicons` 或 `lucide`。 |
| `font.text` | `null` |界面和散文的 CSS 字体系列值。 |
| `font.code` | `null` |内联和块代码的 CSS font-family 值。 |
| `font.source` | `null` | `docs_dir` 下的外部样式表 URL 或本地样式表。 |
| `direction` | `ltr` |文件方向：`ltr` 或 `rtl`。 |
| `include_sidebar` | `true` |渲染导航侧边栏。 |
| `show_footer` | `true` |渲染“改进此页面”页脚。 |
| `color_mode` | `auto` |初始颜色模式：`auto`、`light` 或 `dark`。 |
| `light_theme` | `light` |浅色模式下使用的底漆主题。 |
| `dark_theme` | `dark_theme` | `dark` |深色模式下使用的入门主题。 |

`color_mode` 仅设置*初始*模式。访客可以通过标题更改它 切换，他们的选择存储在 `localStorage` 中。

## 图标

标题导航、颜色模式控制和返回顶部按钮使用内联 SVG 来自一个图标集。默认为`octicons`；选择 Lucide 图标 与：

```yaml
theme:
  name: primer
  icon: lucide
```

这两套都包含在主题中，因此这两个选项都不会添加 CDN 请求。图标 选择仅适用于主题的 HTML 控件。语言选择器 始终使用 Octicon 地球仪和 Primer 的 `btn-octicon` 处理，因此它匹配 底漆标题的其余部分。 Markdown 图标语法和任意第三方 故意不支持图标包。

## 字体

字体是可选的：默认情况下，主题不请求字体 CDN。设置文本和 独立的代码系列，然后将 `source` 指向外部样式表 或 `docs_dir` 中的 CSS 文件：

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

对于自托管站点，将字体文件和样式表放在 `docs_dir` 中，然后 使用相对源路径：

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

浏览器通常会缓存这些文件。自托管避免第三方 请求并在其资源被缓存后保持站点可离线使用。

## 从右到左的布局

为从右到左的文档设置 `direction: rtl`。主题放`dir="rtl"` 在根 HTML 元素上并镜像其标题、侧边栏、移动导航， 具有逻辑 CSS 属性的分页、页脚、菜单和控件。代码和 图表有意保持从左到右。

```yaml
theme:
  name: primer
  direction: rtl
```

方向是站点范围内的设置；主题不是从页面或 语言环境。

!!!警告“`light_theme` 和 `dark_theme` 目前仅接受 `light` 和 `dark`”
    Primer 发布了十四个主题（`dark_dimmed`、`light_high_contrast`、
    `dark_tritanopia` 等），但此主题仅提供其中两个的颜色标记
    它们——全套将增加超过一兆字节的 CSS。命名任何其他主题
    呈现一个完全没有颜色的页面而不是错误。支持更多主题
    被跟踪为未来的添加。

## 标题锚点

要在每个标题旁边获取 GitHub 的悬停锚点，请使用以下命令启用 `toc` 扩展 带有 Primer 的 `anchor` 类的主要永久链接：

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

主题绘制八角形本身，因此 `permalink` 设置为空字符串而不是 比通常的`true`。这比外观更重要：MkDocs 的搜索插件不 去除永久链接字形，这样 `¶` 就会出现在您的搜索结果中。

如果没有此配置，永久链接仍然有效，它只是呈现为普通字形而不是 比八角形。

## 语法高亮

代码颜色来自 Primer 的 `prettylights` 变量，因此它们遵循活动的颜色 自动色彩模式。无需选择 Pygments 样式：

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

`.highlight` 和 `.codehilite` 包装器都有样式，因此 `codehilite` 也可以。

该主题向每个 Pygments `.highlight` 块添加了一个复制按钮。它复制了 可见源并宣布剪贴板操作是否成功。积木 由插件渲染的，例如 Mermaid 和 Vega-Lite，被有意排除。

## 导航控件

滚动400像素后，右下角会出现返回顶部按钮 页面的。它将访问者返回到文档的开头并移动 键盘焦点指向站点标题链接。当访客来访时，动作是即时的 已要求减少动作。

## Markdown 扩展

这些都不是必需的，但主题所提供的样式只能带来一次回报 他们在：

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

`admonition` 是值得一提的：该扩展发出标记并且没有 CSS 它自己的，`@primer/css` 也没有规则，所以一个无样式的 警告是一种常见的惊喜。该主题填补了这一空白 - 请参阅 [示例](nested/deep-page.md#admonitions)。

## 自定义 CSS 和 JavaScript

`extra_css` 在主题发布的每个样式表后加载，因此您的规则获胜 无需 `!important`：

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

`extra_javascript` 在 `<body>` 的末尾发出，在主题自己的之后 脚本。

!!!注意“注入自己资产的插件”
    一个将 `<link>` 标签写入页面 HTML 而不是添加到的插件
    `extra_css` — mkdocs-glightbox 就是其中之一 — 在您的覆盖*之后*落地。风格
    那些具有更具体的选择器而不是依赖顺序的选择器。

## 编辑链接

设置 `repo_url` 和 `edit_uri` 时，页脚链接回源文件：

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```