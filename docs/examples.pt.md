# Exemplos

Três sites completos ficam em `examples/` no repositório. Cada um é
construído com `--strict` pelo mesmo job de CI que este site e publicado ao lado dele,
então o que você vê é o que a configuração abaixo produz.

Eles existem porque os plugins envolvidos não podem compartilhar uma configuração com os que
este site já usa — [Plugins](guide/plugins.md) explica o que quebra em cada
caso. Leia-os como três coisas que o tema faz, e não como consequência
disso: um site com feed, um site cujas páginas são escritas por um script e um
site com diagramas.

<a id="a-site-with-a-feed"></a>

## Um site com feed

[**examples/rss/**]({{ config.site_url }}examples/rss/) usa o
[mkdocs-rss-plugin](https://guts.github.io/mkdocs-rss-plugin/), que grava
`feed_rss_created.xml` e `feed_rss_updated.xml` e para por aí. O tema
emite o par `<link rel="alternate">` que aponta um navegador ou leitor de feeds para
eles, pegando os nomes dos arquivos da configuração do próprio plugin em vez de
fixá-los no código — veja o código-fonte da página lá e os dois estão no `<head>`.

O mesmo site tem o `git-authors` ativado, então o rodapé mostra quem alterou
a página por último ao lado do link "Melhorar esta página" do tema.

<a id="pages-that-do-not-exist-on-disk"></a>

## Páginas que não existem no disco

[**examples/gen-files/**]({{ config.site_url }}examples/gen-files/) constrói sua
seção `Generated` durante o build: `gen_pages.py` escreve o Markdown por meio do
[mkdocs-gen-files](https://oprypin.github.io/mkdocs-gen-files/), e o
[mkdocs-literate-nav](https://github.com/oprypin/mkdocs-literate-nav) monta a
navegação a partir de um `SUMMARY.md` que a inclui. Nada em `generated/` está
no repositório.

Esta é a combinação a partir da qual uma referência de API costuma ser construída, e o que
vale observar é a barra lateral: ela tem aninhamento, e o rótulo da seção é um link, porque
o `section-index` incorporou a página de índice gerada à própria seção.

<a id="diagrams-and-charts"></a>

## Diagramas e gráficos

[**examples/diagrams/**]({{ config.site_url }}examples/diagrams/) renderiza
diagramas Mermaid por meio do
[mkdocs-mermaid2](https://mkdocs-mermaid2.readthedocs.io/) e gráficos Vega-Lite
por meio do [mkdocs-charts-plugin](https://timvink.github.io/mkdocs-charts-plugin/).

Os dois desenham no navegador, então os dois precisam saber em que modo de cor a página
está — senão um diagrama vira um cartão branco num artigo escuro. O Mermaid lê o
atributo `data-color-mode` do tema por meio de uma expressão JavaScript no
`mkdocs.yml` daquele site; o plugin de gráficos procura o atributo do Material,
e a página de lá explica o que isso deixa para você. Nenhum dos dois redesenha quando o
controle do cabeçalho é usado, e é por isso que o tema dispara um evento
`primer:color-mode-change` para a página que quiser tratá-lo.

<a id="building-them-yourself"></a>

## Construindo-os você mesmo

Cada exemplo tem seu próprio `mkdocs.yml` e grava em `site/examples/<name>/`.
Construa primeiro o site principal: `mkdocs build` limpa `site/` e levaria
os exemplos junto.

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
$ mkdocs build --strict -f examples/diagrams/mkdocs.yml
```
