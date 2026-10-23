# 样式

样式表按固定顺序加载到页面中：来自 `@primer/primitives` 的设计令牌、GitHub 的 `@primer/css`、Pygments 配色、本主题自己的 `theme.css`，最后是 `extra_css` 中列出的文件。排在最后，使你的规则无需 `!important` 就能胜出——但只限于与同等优先级的规则相比，本页唯一真正的陷阱就在这里。

按以下顺序选择手段：先看是否有[主题选项](guide/configuration.md)能满足需求，其次是下面的变量，再次是 Primer 令牌，最后才是针对标记编写你自己的规则。

<a id="the-themes-layout-variables"></a>

## 主题的布局变量

这五个变量由主题在 `:root` 中声明，本来就是供你设置的：

| 变量 | 默认值 | 控制的内容 |
| --- | --- | --- |
| `--primer-sidebar-width` | `288px` | 导航栏，包括其内边距 |
| `--primer-rail-width` | `256px` | 第三栏，在窗口有足够空间时显示 |
| `--primer-article-max` | `720px` | 正文最多能有多宽 |
| `--primer-gutter` | `var(--base-size-16)` | 与窗口边缘以及与导航之间的距离 |
| `--primer-header-height` | `56px` | 页眉高度，也是粘性栏需要让出的距离 |

在你自己的样式表中写一个 `:root` 块就够了，因为没有其他地方声明它们：

```css
/* docs/css/overrides.css, named in extra_css */
:root {
  --primer-article-max: 880px;
  --primer-sidebar-width: 240px;
}
```

布局改变形态的断点宽度不在其中：侧边栏在 1012px 时变为单独一栏，大纲在 1280px 时移入右侧栏，这两个值都写在媒体查询里，而媒体查询无法读取自定义属性。因此，把侧边栏调窄只会让它变窄，并不会让它更早出现。

<a id="primers-tokens"></a>

## Primer 的令牌

颜色、尺寸和字体都来自 `@primer/primitives`，内置在 `mkdocs_primer/css/vendor/` 下。令牌的名称和含义由 Primer 定义，查阅它们应以 [Primer 的文档](https://primer.style/product/primitives/)为准；[元素](elements.md)展示了本站的几种表面颜色，以及各自由哪个令牌绘制。

覆盖令牌时，仅靠加载顺序就不够了：

```css
/* Does nothing. */
:root {
  --fgColor-default: #24292f;
}

/* Works. */
[data-color-mode][data-light-theme] {
  --fgColor-default: #24292f;
}
```

每个颜色令牌都是在一对属性选择器下声明的——`[data-color-mode="light"][data-light-theme="light"]` 及其变体，一个样式表正是借此同时容纳两种配色模式。无论哪个文件后加载，这对选择器的优先级都高于 `:root`，因此 `:root` 中的覆盖会被悄无声息地丢弃。匹配同样的两个属性，顺序就重新起决定作用，而且对你有利。

尺寸和字体排版则不同：`primitives-base.css` 在 `:root` 中声明它们，因此 `--base-size-16` 之类的变量用普通的 `:root` 覆盖即可。

目前无法通过 `light_theme` 或 `dark_theme` 一次性更换整套配色——主题只内置了 `light` 和 `dark` 的令牌，[配置](guide/configuration.md)中对此有所提醒。

<a id="what-not-to-reach-for"></a>

## 不该依赖的东西

`primer-*` 类名是样式表内部互相配合用的，而不是公开接口。每当布局变化，它们就会被重命名或改作他用：最近几个版本把 `.primer-toc-summary` 从 `<summary>` 移到了一个按钮上，改变了 `.primer-nav-section-label` 所标记的对象，并去掉了语言控件上的 `.btn-octicon`。如果你针对其中某个类编写了自己的规则，就值得为此锁定版本。

主题还有两个变量是标志而不是设置项。`--primer-toc-rail` 是样式表告诉脚本窗口是否宽到足以显示右侧栏的方式，`--primer-nav-depth` 是导航模板在每一行上标注的嵌套层级，用于计算缩进。从外部设置其中任何一个都不会开启什么功能，只会误导读取它的代码。

如果要用脚本控制配色模式而不是设置其样式，主题会在 `document` 上触发 `primer:color-mode-change` 事件，[图表示例](examples.md)就利用它来重新绘制。
