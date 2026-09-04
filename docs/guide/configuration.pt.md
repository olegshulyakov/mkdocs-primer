# Configuração

## Opções de tema

| Opção | Padrão | Descrição |
|:---|:---|:---|
| `logo` | `null` | Imagem mostrada ao lado do nome do site, relativa a `docs_dir`. |
| `favicon` | `img/favicon.svg` | Ícone do site. |
| `icon` | `octicons` | Conjunto de ícones para controles de tema: `octicons` ou `lucide`. |
| `font.text` | `null` | Valor da família de fontes CSS para interface e prosa. |
| `font.code` | `null` | Valor da família de fontes CSS para código embutido e de bloco. |
| `font.source` | `null` | Um URL de folha de estilo externa ou folha de estilo local em `docs_dir`. |
| `direction` | `ltr` | Direção do documento: `ltr` ou `rtl`. |
| `include_sidebar` | `true` | Renderize a barra lateral de navegação. |
| `show_footer` | `true` | Renderize o rodapé "Melhorar esta página". |
| `toc` | `auto` | Sumário "Nesta página": `auto`, `expanded`, `collapsed` ou `hidden`. |
| `color_mode` | `auto` | Modo de cor inicial: `auto`, `light` ou `dark`. |
| `light_theme` | `light` | Tema Primer usado no modo claro. |
| `dark_theme` | `dark` | Tema Primer usado no modo escuro. |

`color_mode` define apenas o modo *inicial*. Os visitantes podem alterá-lo com o cabeçalho alternam e sua escolha é armazenada em `localStorage`.

`toc` decide para onde vai o sumário construído a partir dos títulos da página. `auto` o coloca na coluna da direita quando a janela comporta uma terceira coluna, e no fluxo sob o título da página caso contrário, expandido nos dois casos. `expanded` o mantém no fluxo e fora da coluna, `collapsed` o transforma num bloco que o leitor abre, e `hidden` — ou `false` — o omite.

## Ícones

A navegação do cabeçalho, o controle do modo de cor e o botão voltar ao topo usam SVG embutido de um conjunto de ícones. `octicons` é o padrão; escolha ícones Lucide com:

```yaml
theme:
  name: primer
  icon: lucide
```

Ambos os conjuntos estão incluídos no tema, portanto nenhuma opção adiciona uma solicitação CDN. Ícone a seleção se aplica apenas aos controles HTML do tema. O seletor de idioma sempre usa um globo Octicon e tratamento `btn-octicon` do Primer para combinar o resto do cabeçalho do Primer. Sintaxe do ícone Markdown e terceiros arbitrários pacotes de ícones não são deliberadamente suportados.

## Fontes

As fontes são opcionais: o tema não solicita um CDN de fonte por padrão. Definir texto e codifique famílias de forma independente e aponte `source` para uma folha de estilo externa ou um arquivo CSS em `docs_dir`:

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

Para um site auto-hospedado, coloque os arquivos de fonte e uma folha de estilo em `docs_dir` e, em seguida, use um caminho de origem relativo:

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

O navegador armazena esses arquivos em cache normalmente. A auto-hospedagem evita terceiros solicitação e mantém o site utilizável off-line depois que seus ativos são armazenados em cache.

## Layouts da direita para a esquerda

Defina `direction: rtl` para um documento da direita para a esquerda. O tema coloca `dir="rtl"` no elemento HTML raiz e espelha seu cabeçalho, barra lateral, navegação móvel, paginação, rodapé, menus e controles com propriedades CSS lógicas. Código e os diagramas permanecem intencionalmente da esquerda para a direita.

```yaml
theme:
  name: primer
  direction: rtl
```

A direção é uma configuração que abrange todo o site; o tema não o infere de uma página ou localidade do idioma.

!!! aviso "`light_theme` e `dark_theme` atualmente aceitam apenas `light` e `dark`"
    Primer publica quatorze temas (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia` e assim por diante), mas este tema envia os tokens de cores para apenas dois dos
    eles - o conjunto completo adicionaria bem mais de um megabyte de CSS. Nomeando qualquer outro tema
    renderiza uma página sem nenhuma cor, em vez de um erro. Suporte para mais temas
    é rastreado como uma adição futura.

## Âncoras de direção

Para obter a âncora flutuante do GitHub ao lado de cada título, habilite a extensão `toc` com um link permanente principal que carrega a classe `anchor` do Primer:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

O tema desenha o próprio octicon, então `permalink` é definido como uma string vazia em vez do que o `true` habitual. Isso importa mais do que a aparência: o plugin de pesquisa do MkDocs não remova os glifos do link permanente, para que um `¶` apareça nos resultados da pesquisa.

Sem esta configuração, o link permanente ainda funciona, apenas é renderizado como um glifo simples, em vez do que o octicon.

## Destaque de sintaxe

As cores do código vêm das variáveis `prettylights` do Primer, portanto seguem o ativo modo de cor automaticamente. Nenhum estilo Pigmentos precisa ser selecionado:

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

Os wrappers `.highlight` e `.codehilite` são estilizados, portanto `codehilite` também funciona.

O tema adiciona um botão de cópia a cada bloco Pygments `.highlight`. Ele copia o fonte visível e anuncia se a operação da área de transferência foi bem-sucedida. Blocos renderizados por plugins, como Mermaid e Vega-Lite, são excluídos intencionalmente.

## Controles de navegação

Depois de rolar 400 pixels, um botão voltar ao topo aparece no canto inferior direito da página. Ele retorna o visitante ao início do documento e move foco do teclado no link do título do site. O movimento é instantâneo quando o visitante solicitou movimento reduzido.

## Extensões de redução

Nada disso é obrigatório, mas o tema traz um estilo que só compensa uma vez eles estão ligados:

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

`admonition` é quem vale a pena destacar: a extensão emite marcação e nenhum CSS por si só, e `@primer/css` também não tem regras para isso, então um estilo sem estilo a advertência é uma surpresa comum. O tema preenche essa lacuna — veja [os exemplos](../elements.md#admonitions).

## CSS e JavaScript personalizados

`extra_css` é carregado após cada folha de estilo enviada pelo tema, então suas regras vencem sem precisar de `!important`:

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

`extra_javascript` é emitido no final de `<body>`, após o próprio tema roteiros.

!!! note "Plugins que injetam seus próprios ativos"
    Um plug-in que grava tags `<link>` na página HTML em vez de adicioná-las
    `extra_css` — mkdocs-glightbox é um deles — chega *após* suas substituições. Estilo
    aqueles com um seletor mais específico em vez de depender da ordem.

## Editar links

O rodapé é vinculado ao arquivo de origem quando `repo_url` e `edit_uri` são definidos:

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```