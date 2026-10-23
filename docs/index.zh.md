# MkDocs Primer 主题

一个基于 [GitHub 的 Primer 设计系统](https://primer.style/)构建的 [MkDocs](https://www.mkdocs.org/) 主题——让文档看起来就像本来就在 GitHub 上一样。

本站就是这个主题在渲染它自己。你正在阅读的文章由 GitHub 自己的 `.markdown-body` 规则设置样式，而它周围的一切——页眉、导航树、面包屑导航、右侧栏中的大纲——都是你自己的站点只需两行配置就能得到的。

<a id="install"></a>

## 安装

```console
$ pip install mkdocs-primer
```

```yaml
# mkdocs.yml
theme:
  name: primer
```

这就是全部设置：每个选项都有可用的默认值，主题直接渲染 MkDocs 已经构建好的 `nav`。参见[安装](guide/installation.md)。

<a id="what-you-get"></a>

## 你会得到什么

- **GitHub 式的文章渲染**——github.com 上 README 的排版、表格、代码块外观和悬停锚点。Primer CSS 已内置在软件包中，因此安装主题不需要 Node 工具链。
- **浅色与深色**，基于 Primer 的颜色基础值。页眉中的控件在访客选择模式之前跟随操作系统，选择之后则记住这一选择。语法高亮也随之切换。
- **可扩展的导航**——侧边栏支持任意层级嵌套，并折叠到读者所在的分区；另有面包屑导航、上一页/下一页链接、搜索页和 404 页面。
- **仿照 GitHub 提示框（alert）样式的提示块。** `admonition` 扩展不附带任何 CSS，`@primer/css` 也没有针对它的规则，因此在大多数主题下 `!!! note` 渲染出来没有任何修饰。
- **七种语言**的主题自身文本——英语、西班牙语、法语、印地语、葡萄牙语、俄语和中文——以及从右到左的布局。
- **支持需要主题配合的插件**：分区索引页、多语言站点、修订日期与作者、RSS 自动发现，以及 mike 的版本选择器。

<a id="where-to-go-next"></a>

## 接下来去哪里

[指南](guide/index.md)

:   安装、每一个主题选项，以及本主题针对其构建的插件。

[元素](elements.md)

:   主题在文章内设置样式的每一种块，各展示一次——提示块、引用、代码、表格、图片。

[样式](styling.md)

:   可以在你自己的样式表中设置的变量，以及唯一一种看似可行、实则不按预期生效的 Primer 令牌覆盖写法。

[示例](examples.md)

:   三个完整的站点，展示主题如何处理订阅源、生成的页面和图表。

[参考](reference.md)

:   主题软件包自身的文档，由 mkdocstrings 渲染。
