# 元素

主题在文章内设置样式的每一种块，各展示一次。Markdown 生成的大部分内容已由 `@primer/css` 覆盖；这里收集的是其余部分——主题在其之上添加的东西，以及修改主题时容易在不知不觉中弄坏的东西。页面周围的界面元素本来就出现在每个页面上。

每种提示块类型在样式表中都有自己的选择器，因此下面每个别名都单独展示为一个块，而不是用一行文字带过：没人写出来的类型，丢了也没人看得见。

<a id="admonitions"></a>

## 提示块

`admonition` 扩展只输出标记、不带 CSS，`@primer/css` 也没有针对 `.admonition` 的规则，因此下面的一切都来自本主题。外形仿照 GitHub 的提示框（alert）——带色调的背景、彩色的左侧竖线、彩色的标题，以及对应类型的 octicon 图标。[^alerts]

!!! note
    `note` 使用 Primer 的强调蓝色和 `info` octicon。行内代码——`mkdocs.yml`——保留自己的半透明背景，它叠加在色调之上，而不是在其中打出一个灰色的洞。

!!! tip
    `tip` 使用成功绿色和 `light-bulb` octicon。

!!! hint "hint"
    `tip` 的别名，这里手动写了标题，以便区分两者。

!!! important
    `important` 使用 Primer 称为“done”的紫色，以及 `report` octicon。

!!! warning
    `warning` 使用注意黄色和 `alert` octicon。

!!! attention "attention"
    `warning` 的别名。

!!! caution "caution"
    `warning` 的第二个别名。

!!! danger
    `danger` 使用危险红色和 `stop` octicon。

!!! error "error"
    `danger` 的别名。

!!! bug "bug"
    `danger` 的第二个别名。

!!! example
    GitHub 没有对应提示框的类型使用中性的填充色和中性的竖线，并且不绘制图标——标题不着色，也不会在图标的位置留出空隙。

!!! note "自定义标题，其中含有 `code`"
    类型的颜色会给整个标题着色，而与行内代码自身的背景搭配时，对比度会低于 4.5:1——因此标题中的代码保留默认文本颜色。

!!! warning "只有标题、下方没有内容的块"

<a id="quotes"></a>

## 引用

> 引用使用中性的填充色，内边距是提示块的一半：它应当读起来比提示框更安静，而不是另一种提示框。
>
> 这里写两段，是为了表明填充色在最后一段之下才结束，而不是在第一段之下。

<a id="code"></a>

## 代码

围栏代码块由 Pygments 高亮，并通过 Primer 的 `prettylights` 变量着色，因此会跟随配色模式。每个代码块的角落都有一个复制按钮。

```python
from mkdocs_primer import __version__


def greet(name: str = "world") -> str:
    """Docstrings, keywords, strings and numbers all take separate colors."""
    return f"hello {name} from {__version__}"
```

行长超过栏宽的代码块会横向滚动，而不是换行或把页面撑宽：

```console
$ mkdocs build --strict -f examples/rss/mkdocs.yml && mkdocs build --strict -f examples/gen-files/mkdocs.yml && mkdocs build --strict -f examples/diagrams/mkdocs.yml
```

差异（diff）有专门的处理。需要留意的是 hunk 头那一行：这是高亮唯一偏离 GitHub 配色的地方，因为 GitHub 在那里使用的颜色在深色模式下与代码背景的对比度低于 4.5:1。

```diff
--- a/mkdocs.yml
+++ b/mkdocs.yml
@@ -1,3 +1,3 @@
 theme:
-  name: mkdocs
+  name: primer
```

<a id="tables"></a>

## 表格

Primer 会给表格隔行加条纹并加粗表头；主题唯一添加的是表格放不下时的处理。表格比栏宽时会横向滚动，而不是把页面撑宽——由于 `table` 本身无法获得焦点，主题会在它溢出期间把它设为一个 Tab 键停靠点，这样不用指针设备也能访问超出边缘的部分。上面那条长命令也得到完全相同的处理，而且它足够宽，能展示这一点。

本页上的各种表面颜色来自 `@primer/primitives`，这也是它们无需主题再维护一套规则就能跟随配色模式的原因：

| 令牌 | 浅色 | 深色 | 用于 |
| --- | --- | --- | --- |
| `--bgColor-default` | `#ffffff` | `#0d1117` | 文章，以及文章后面的页面 |
| `--bgColor-inset` | `#f6f8fa` | `#010409` | 页眉和侧边栏 |
| `--bgColor-muted` | `#f6f8fa` | `#151b23` | 引用，以及在 GitHub 中没有对应项的提示块 |
| `--bgColor-attention-muted` | `#fff8c5` | `#bb800926` | `!!! warning` 后面的填充色 |
| `--button-default-bgColor-rest` | `#f6f8fa` | `#212830` | 本页下方的上一页/下一页卡片 |
| `--underlineNav-borderColor-active` | `#fd8c73` | `#f78166` | 侧边栏中当前页面的标记 |

<a id="definition-lists"></a>

## 定义列表

`def_list` 扩展采用的语法比下面的原始 HTML 更简洁：

`docs_dir`

:   MkDocs 从中读取 Markdown 的目录。

`site_dir`

:   MkDocs 向其中写入 HTML 的目录。

两者到达 Primer 时都是同样的 `<dl>`，这正是把它们放在一起展示的意义——针对其中一种写的规则同样适用于另一种：

<dl>
<dt>名称</dt>
<dd>Godzilla</dd>
<dt>诞生</dt>
<dd>1952</dd>
<dt>诞生地</dt>
<dd>日本</dd>
</dl>

<a id="images"></a>

## 图片

栏宽由主题决定——`.primer-content` 设有上限，防止正文排成 130 个字符一行——因此比这一栏更宽的图片值得放在页面上。它应当被限制在栏宽之内，而不是把布局向旁边撑开。

这些也是本站仅有的内容图片，因此它们是 [mkdocs-glightbox](guide/plugins.md) 唯一能处理的东西——点击其中一张，它就会在灯箱中打开。

![Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png)

![在 GitHub 仓库中创建分支](https://docs.github.com/assets/images/help/repository/branching.png)

<a id="headings"></a>

## 标题

本页的标题就是右侧栏中大纲的来源，每个标题都带有一个悬停时出现的永久链接——这是主题在 `toc` 扩展输出的锚点之上绘制的 octicon。

<a id="a-third-level"></a>

### 第三级

嵌套的标题在大纲中会缩进，因此这一级在那里位于 **标题** 之下。

<a id="a-fourth-level"></a>

#### 第四级

层级足够深，可以表明大纲会继续缩进，而且这么靠里的侧栏条目仍有空间容纳其文字。

[^alerts]: GitHub 用一个 `.markdown-alert` 类来渲染自己的提示框，而 `@primer/css` 并未发布该类，因此主题直接为扩展输出的 `.admonition` 标记设置样式。这条脚注同时也用来检验 `footnotes` 扩展。
