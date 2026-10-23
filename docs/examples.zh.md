# 示例

仓库的 `examples/` 下有三个完整的站点。每个站点都由构建本站的同一个 CI 任务以 `--strict` 构建，并与本站一同发布，因此你看到的正是下面这些配置所产生的结果。

它们之所以存在，是因为其中涉及的插件无法与本站已在使用的插件共用一份配置——[插件](guide/plugins.md)一页说明了每种情况下会出什么问题。不过，请把它们看作主题能做到的三件事，而不是这个问题的副产品：一个带订阅源的站点，一个页面由脚本生成的站点，以及一个带图表的站点。

<a id="a-site-with-a-feed"></a>

## 带订阅源的站点

[**examples/rss/**]({{ config.site_url }}examples/rss/) 运行 [mkdocs-rss-plugin](https://guts.github.io/mkdocs-rss-plugin/)，该插件写出 `feed_rss_created.xml` 和 `feed_rss_updated.xml` 后就不再做别的事。主题会输出一对 `<link rel="alternate">`，让浏览器或阅读器能找到这两个文件，文件名取自插件自己的配置而不是硬编码——在那里查看页面源代码，就能在 `<head>` 中看到它们。

该站点还启用了 `git-authors`，因此页脚会在主题的“改进此页面”链接旁边显示最后修改该页面的人。

<a id="pages-that-do-not-exist-on-disk"></a>

## 磁盘上不存在的页面

[**examples/gen-files/**]({{ config.site_url }}examples/gen-files/) 在构建时生成其 `Generated` 分区：`gen_pages.py` 通过 [mkdocs-gen-files](https://oprypin.github.io/mkdocs-gen-files/) 写出 Markdown，[mkdocs-literate-nav](https://github.com/oprypin/mkdocs-literate-nav) 则从包含这部分内容的 `SUMMARY.md` 中读取导航。`generated/` 下的任何内容都不在仓库里。

API 参考通常就是用这种组合构建的，值得关注的是侧边栏：它是嵌套的，而且分区标签是一个链接，因为 `section-index` 把生成的索引页并入了分区本身。

<a id="diagrams-and-charts"></a>

## 图表与图形

[**examples/diagrams/**]({{ config.site_url }}examples/diagrams/) 通过 [mkdocs-mermaid2](https://mkdocs-mermaid2.readthedocs.io/) 渲染 Mermaid 图表，通过 [mkdocs-charts-plugin](https://timvink.github.io/mkdocs-charts-plugin/) 渲染 Vega-Lite 图形。

两者都在浏览器中绘制，因此都需要被告知页面处于哪种配色模式——否则在深色文章中，图表就会是一张白色卡片。Mermaid 通过该站点 `mkdocs.yml` 中的一个 JavaScript 表达式读取主题的 `data-color-mode` 属性；charts 插件则查找 Material 的属性，那里的页面说明了这会带来什么结果。使用页眉中的切换控件时，两者都不会重新绘制，这正是主题会触发 `primer:color-mode-change` 事件、供需要处理它的页面使用的原因。

<a id="building-them-yourself"></a>

## 自行构建

每个示例都有自己的 `mkdocs.yml`，并输出到 `site/examples/<name>/`。请先构建主站点：`mkdocs build` 会清空 `site/`，示例也会被一并删除。

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
$ mkdocs build --strict -f examples/diagrams/mkdocs.yml
```
