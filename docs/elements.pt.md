# Elementos

Cada bloco que o tema estiliza dentro de um artigo, desenhado uma vez. O `@primer/css`
cobre a maior parte do que o Markdown produz; aqui está reunido o resto — o que o
tema acrescenta por cima, e o que é fácil quebrar numa alteração sem perceber.
A moldura ao redor da página aparece em todas as páginas de qualquer forma.

Cada tipo de admonition é um seletor próprio na folha de estilo, então cada alias recebe
abaixo um bloco só seu, e não uma linha de texto: um tipo que ninguém escreve
é um tipo cujo sumiço ninguém nota.

<a id="admonitions"></a>

## Admonitions

A extensão `admonition` emite marcação e nenhum CSS, e o `@primer/css` também não tem
regra para `.admonition`, então tudo o que está abaixo vem do tema. A
forma segue os alertas do GitHub — um fundo tingido, uma barra colorida à esquerda, um
título colorido e o octicon do tipo.[^alerts]

!!! note
    `note` usa o azul de destaque do Primer e o octicon `info`. O código embutido —
    `mkdocs.yml` — mantém seu próprio fundo translúcido, que se sobrepõe ao
    tom em vez de abrir um buraco cinza nele.

!!! tip
    `tip` usa o verde de sucesso e o octicon `light-bulb`.

!!! hint "hint"
    Um alias de `tip`, com um título escrito à mão para que os dois possam ser
    distinguidos aqui.

!!! important
    `important` usa o roxo que o Primer chama de "done" e o octicon `report`.

!!! warning
    `warning` usa o amarelo de atenção e o octicon `alert`.

!!! attention "attention"
    Um alias de `warning`.

!!! caution "caution"
    O segundo alias de `warning`.

!!! danger
    `danger` usa o vermelho de perigo e o octicon `stop`.

!!! error "error"
    Um alias de `danger`.

!!! bug "bug"
    O segundo alias de `danger`.

!!! example
    Um tipo para o qual o GitHub não tem alerta mantém um preenchimento e uma barra neutros, e
    não desenha ícone — nem título colorido, nem um espaço vazio onde estaria o ícone.

!!! note "Um título próprio, com `code` dentro"
    A cor do tipo tinge o título inteiro, e contra o fundo próprio do código embutido
    essa combinação fica abaixo de 4,5:1 — por isso o código num título fica com a
    cor de texto padrão.

!!! warning "Um bloco com título e nada embaixo"

<a id="quotes"></a>

## Citações

> Uma citação usa o preenchimento neutro com metade do espaçamento interno de uma admonition: ela deve
> parecer mais discreta que um alerta, e não outro tipo de alerta.
>
> Dois parágrafos, para mostrar que o preenchimento termina abaixo do último, e não
> abaixo do primeiro.

<a id="code"></a>

## Código

Os blocos delimitados são destacados pelo Pygments e coloridos pelas variáveis
`prettylights` do Primer, então acompanham o modo de cor. Cada um recebe um botão
de cópia no canto.

```python
from mkdocs_primer import __version__


def greet(name: str = "world") -> str:
    """Docstrings, keywords, strings and numbers all take separate colors."""
    return f"hello {name} from {__version__}"
```

Um bloco com linhas mais longas que a coluna rola na horizontal em vez de
quebrar as linhas ou esticar a página:

```console
$ mkdocs build --strict -f examples/rss/mkdocs.yml && mkdocs build --strict -f examples/gen-files/mkdocs.yml && mkdocs build --strict -f examples/diagrams/mkdocs.yml
```

Os diffs têm um tratamento próprio. O cabeçalho do bloco de alterações é a linha a observar: é o
único ponto em que o destaque se afasta da paleta do GitHub, porque a cor
que o GitHub usa ali fica abaixo de 4,5:1 contra o fundo do código no modo escuro.

```diff
--- a/mkdocs.yml
+++ b/mkdocs.yml
@@ -1,3 +1,3 @@
 theme:
-  name: mkdocs
+  name: primer
```

<a id="tables"></a>

## Tabelas

O Primer alterna a cor das linhas e destaca o cabeçalho; a única coisa que o tema
acrescenta é o que acontece quando uma tabela não cabe. Larga demais para a coluna, ela
rola na horizontal em vez de esticar a página — e como uma `table` não
recebe foco, o tema a torna uma parada de tabulação enquanto ela transbordar, para que a
parte que fica para fora possa ser alcançada sem um dispositivo apontador. O comando longo
acima recebe exatamente o mesmo tratamento, e é largo o bastante para mostrá-lo.

As superfícies desta página vêm de `@primer/primitives`, e é também por isso que
acompanham o modo de cor sem que o tema precise de um segundo conjunto de regras:

| Token | Claro | Escuro | Usado em |
| --- | --- | --- | --- |
| `--bgColor-default` | `#ffffff` | `#0d1117` | o artigo e a página atrás dele |
| `--bgColor-inset` | `#f6f8fa` | `#010409` | o cabeçalho e a barra lateral |
| `--bgColor-muted` | `#f6f8fa` | `#151b23` | citações e admonitions sem equivalente no GitHub |
| `--bgColor-attention-muted` | `#fff8c5` | `#bb800926` | o preenchimento atrás de `!!! warning` |
| `--button-default-bgColor-rest` | `#f6f8fa` | `#212830` | os cartões de anterior/próxima abaixo desta página |
| `--underlineNav-borderColor-active` | `#fd8c73` | `#f78166` | a marca da página atual na barra lateral |

<a id="definition-lists"></a>

## Listas de definição

A extensão `def_list` aceita uma sintaxe mais simples que o HTML puro abaixo dela:

`docs_dir`

:   Diretório de onde o MkDocs lê o Markdown.

`site_dir`

:   Diretório onde o MkDocs grava o HTML.

As duas chegam ao Primer como o mesmo `<dl>`, e é por isso que faz sentido desenhá-las
juntas — uma regra escrita para uma vale para a outra:

<dl>
<dt>Nome</dt>
<dd>Godzilla</dd>
<dt>Nascimento</dt>
<dd>1952</dd>
<dt>Local de nascimento</dt>
<dd>Japão</dd>
</dl>

<a id="images"></a>

## Imagens

A largura da coluna é definida pelo tema — `.primer-content` tem o limite
que impede o texto de ocupar linhas de 130 caracteres — então vale a pena ter numa página uma imagem
mais larga que essa coluna. Ela deve ficar contida na coluna em vez de empurrar
o layout para os lados.

Estas são também as únicas imagens de conteúdo do site, o que as torna a única
coisa com que o [mkdocs-glightbox](guide/plugins.md) pode trabalhar — clique numa e ela
abre numa lightbox.

![O Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png)

![Ramificação num repositório do GitHub](https://docs.github.com/assets/images/help/repository/branching.png)

<a id="headings"></a>

## Títulos

Os títulos desta página são a base do sumário na coluna da
direita, e cada um tem um link permanente que aparece ao passar o mouse — um octicon que o
tema desenha sobre a âncora emitida pela extensão `toc`.

<a id="a-third-level"></a>

### Um terceiro nível

Títulos aninhados ficam recuados no sumário, então este aparece sob **Títulos**
ali.

<a id="a-fourth-level"></a>

#### Um quarto nível

Fundo o bastante para mostrar que o sumário continua recuando, e que uma entrada da coluna
tão aninhada ainda tem espaço para o seu texto.

[^alerts]: O GitHub renderiza os próprios alertas com uma classe `.markdown-alert` que
    o `@primer/css` não publica, então o tema estiliza diretamente a marcação
    `.admonition` da extensão. Esta nota de rodapé também é o que testa a
    extensão `footnotes`.
