# Estilização

As folhas de estilo chegam a uma página numa ordem fixa: os tokens de design de
`@primer/primitives`, o `@primer/css` do GitHub, as cores do Pygments, o
`theme.css` deste tema e, por último, o que `extra_css` indicar. Vir por último é o que permite
que suas regras vençam sem `!important` — mas só contra regras de mesmo
peso, e é aí que está a única armadilha real desta página.

Recorra às coisas nesta ordem: uma [opção do tema](guide/configuration.md), se houver uma
que resolva, depois uma variável abaixo, depois um token do Primer e, só então, uma regra
própria escrita contra a marcação.

<a id="the-themes-layout-variables"></a>

## As variáveis de layout do tema

Estas cinco são declaradas pelo tema, em `:root`, e foram feitas para ser definidas:

| Variável | Padrão | O que controla |
| --- | --- | --- |
| `--primer-sidebar-width` | `288px` | a coluna de navegação, com o espaçamento interno incluído |
| `--primer-rail-width` | `256px` | a terceira coluna, quando a janela tem espaço para ela |
| `--primer-article-max` | `720px` | a largura máxima que o texto pode ocupar |
| `--primer-gutter` | `var(--base-size-16)` | a distância da borda da janela e da navegação |
| `--primer-header-height` | `56px` | o cabeçalho, e o espaço que as colunas fixas deixam livre |

Um bloco `:root` na sua própria folha de estilo basta, já que nada mais as
declara:

```css
/* docs/css/overrides.css, named in extra_css */
:root {
  --primer-article-max: 880px;
  --primer-sidebar-width: 240px;
}
```

As larguras em que o layout muda de forma não estão entre elas: a barra lateral
vira uma coluna a partir de 1012px e o sumário passa para uma coluna lateral a partir de 1280px, ambos
escritos em media queries, e uma media query não consegue ler uma propriedade personalizada.
Estreitar a barra lateral, portanto, a deixa mais estreita, não faz com que apareça antes.

<a id="primers-tokens"></a>

## Os tokens do Primer

Cores, tamanhos e tipografia vêm todos de `@primer/primitives`, embutido em
`mkdocs_primer/css/vendor/`. Os nomes e o que significam são do Primer, e
[a documentação deles](https://primer.style/product/primitives/) é o lugar para
consultá-los; [Elementos](elements.md) mostra algumas das superfícies deste
site e qual token pinta cada uma.

Substituir um deles é onde a regra da ordem deixa de bastar:

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

Cada token de cor é declarado contra um par de seletores de atributo —
`[data-color-mode="light"][data-light-theme="light"]` e suas variantes, que é
como uma única folha de estilo consegue conter os dois modos de cor. Esse par tem prioridade sobre `:root`
não importa qual arquivo veio por último, então uma substituição em `:root` é descartada em silêncio. Use
os mesmos dois atributos e a ordem volta a decidir, a seu favor.

Tamanhos e tipografia são diferentes: `primitives-base.css` os declara em
`:root`, então `--base-size-16` e companhia aceitam uma substituição simples em `:root`.

Trocar a paleta inteira de uma vez por meio de `light_theme` ou `dark_theme` não é
possível hoje — o tema embute os tokens apenas para `light` e `dark`, como
[Configuração](guide/configuration.md) avisa.

<a id="what-not-to-reach-for"></a>

## O que não usar

Os nomes de classe `primer-*` são a forma como a folha de estilo fala consigo mesma, não uma
interface pública. Eles são renomeados e reaproveitados sempre que o layout muda: versões
recentes moveram `.primer-toc-summary` de um `<summary>` para um botão, mudaram
o que `.primer-nav-section-label` marca e tiraram `.btn-octicon` do controle de
idioma. Uma regra própria contra uma dessas classes justifica fixar uma versão.

Duas outras variáveis do tema são sinalizadores, não configurações.
`--primer-toc-rail` é como a folha de estilo informa aos scripts se a janela
é larga o bastante para uma coluna lateral, e `--primer-nav-depth` é o nível de aninhamento que o
template de navegação coloca em cada linha para que o recuo seja calculado a partir dele.
Definir qualquer uma delas de fora não ativa nada; só engana o código que a
lê.

Para controlar o modo de cor por script em vez de estilizá-lo, o tema dispara um
evento `primer:color-mode-change` em `document`, que o
[exemplo de diagramas](examples.md) usa para redesenhar.
