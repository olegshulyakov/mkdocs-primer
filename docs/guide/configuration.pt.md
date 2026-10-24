# Configuração

<a id="theme-options"></a>

## Opções do tema

| Opção | Padrão | Descrição |
|:---|:---|:---|
| `logo` | `null` | Imagem mostrada ao lado do nome do site, relativa a `docs_dir`. |
| `favicon` | `img/favicon.svg` | Ícone do site. |
| `icon` | `octicons` | Conjunto de ícones dos controles do tema: `octicons` ou `lucide`. |
| `font.text` | `null` | Valor CSS de font-family para a interface e o texto corrido. |
| `font.code` | `null` | Valor CSS de font-family para código embutido e em bloco. |
| `font.source` | `null` | URL de uma folha de estilo externa ou uma folha de estilo local dentro de `docs_dir`. |
| `locale` | `en` | Idioma dos textos do próprio tema. Há catálogos para `en`, `es`, `fr`, `hi`, `pt`, `ru` e `zh`. |
| `direction` | `ltr` | Direção do documento: `ltr` ou `rtl`. |
| `include_sidebar` | `true` | Renderiza a barra lateral de navegação. |
| `nav_expand` | `all` | Seções de navegação renderizadas com suas páginas: `all`, ou `active` para renderizar só a seção da página atual e as seções sem página própria. Use `active` em sites grandes para reduzir o tamanho das páginas e o tempo de build. |
| `show_footer` | `true` | Renderiza a barra do rodapé. |
| `show_footer_generator` | `true` | Mostra "Feito com mkdocs-primer e MkDocs" no rodapé. |
| `social` | `[]` | Links em forma de ícone mostrados no rodapé. |
| `show_metadata` | `true` | Renderiza a linha de metadados sob o título da página. |
| `show_metadata_created` | `true` | Mostra a data de criação. |
| `show_metadata_updated` | `true` | Mostra a data da última atualização. |
| `show_metadata_reading_time` | `true` | Mostra o tempo estimado de leitura. |
| `show_metadata_authors` | `true` | Mostra os autores. |
| `toc` | `auto` | Sumário "Índice": `auto`, `expanded`, `collapsed` ou `hidden`. |
| `offline` | `false` | Registra um service worker, que o build do site precisa gerar por conta própria. |
| `color_mode` | `auto` | Modo de cor inicial: `auto`, `light` ou `dark`. |
| `light_theme` | `light` | Tema do Primer usado no modo claro. |
| `dark_theme` | `dark` | Tema do Primer usado no modo escuro. |

`color_mode` define apenas o modo *inicial*. Os visitantes podem mudá-lo pelo seletor no cabeçalho, e a escolha fica guardada em `localStorage`.

`toc` decide para onde vai o sumário construído a partir dos títulos da página atual. `auto` o coloca na coluna da direita quando a janela é larga o bastante para uma terceira coluna e, caso contrário, sob o título da página, onde ele vira um bloco que o leitor abre, em vez de uma lista parada entre o título e o primeiro parágrafo. `expanded` o mantém no fluxo do texto e fora da coluna, `collapsed` o transforma em um bloco que o leitor abre, e `hidden` — ou `false` — o omite.

<a id="metadata-line"></a>

## Linha de metadados

Logo abaixo do título da página, antes do texto, o tema pode mostrar uma linha com informações sobre a página atual: quando foi criada, quando mudou pela última vez, quanto tempo leva para ler e quem a escreveu. Cada item só aparece quando a sua opção está ativada *e* há dados por trás dele, e a linha inteira é omitida quando nenhum dos quatro teria algo a mostrar.

```yaml
theme:
  name: primer
  show_metadata: true # the line's own switch; false hides all four items
  show_metadata_created: true
  show_metadata_updated: true
  show_metadata_reading_time: true
  show_metadata_authors: true
```

`show_metadata` desliga a linha inteira, independentemente dos campos abaixo dele. Cada campo também pode ser desligado individualmente — por exemplo, em um site que quer as datas, mas não uma estimativa de tempo de leitura.

`show_metadata_reading_time` estima os minutos de leitura a partir da contagem de palavras da página renderizada, a 265 palavras por minuto, a velocidade média de leitura de um adulto, e é omitido em páginas sem conteúdo próprio, como o índice de uma seção.

As duas datas vêm do [mkdocs-git-revision-date-localized](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin):

```yaml
plugins:
  - git-revision-date-localized:
      enable_creation_date: true # also required for the "created" date
```

Nenhuma das datas aparece se esse plugin não estiver habilitado, e a data de criação exige especificamente `enable_creation_date: true` — o padrão do próprio plugin a deixa desligada.

Os autores vêm do [mkdocs-git-authors](https://github.com/timvink/mkdocs-git-authors-plugin) e também não aparecem se esse plugin não estiver habilitado.

<a id="footer"></a>

## Rodapé

Uma barra ao pé de cada página, abaixo de todo o layout. Ela traz duas linhas de texto de um lado e uma fileira de links em forma de ícone do outro, e é omitida por completo quando não há nada para colocar nela. `show_footer: false` a remove, não importa o que mais esteja configurado.

Todos os links da barra levam para fora da documentação, então cada um deles abre em uma aba própria.

A primeira linha traz o copyright e onde encontrar o código-fonte da página — veja [Links de edição](#edit-links) para esta segunda parte. O copyright é a chave `copyright` do próprio MkDocs, uma chave de nível superior e não uma opção do tema:

```yaml
copyright: Copyright &copy; 2026 Your Name
```

A segunda linha diz com o que o site foi gerado. Desligue-a com `show_footer_generator: false`:

```yaml
theme:
  name: primer
  show_footer_generator: false
```

<a id="social-links"></a>

### Links sociais

`social` é uma lista de links desenhados como ícones, do lado oposto ao copyright:

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

`service` indica uma das marcas que acompanham o tema. `name` é opcional: é o nome acessível do link — o que um leitor de tela anuncia — e, por padrão, é o nome do próprio serviço; então informe um sempre que "GitHub" sozinho não disser para onde o link leva.

Estes são os serviços:

`bitbucket`, `bluesky`, `codeberg`, `devdotto`, `discord`, `docker`, `facebook`, `forgejo`, `github`, `githubsponsors`, `gitlab`, `instagram`, `kofi`, `mastodon`, `matrix`, `medium`, `npm`, `opencollective`, `patreon`, `pypi`, `reddit`, `rss`, `stackoverflow`, `substack`, `telegram`, `twitch`, `x`, `youtube`, `zulip`.

Para qualquer outro, aponte `icon` para um SVG dentro de `docs_dir` em vez de indicar um `service`:

```yaml
theme:
  name: primer
  social:
    - icon: img/linkedin.svg
      link: https://www.linkedin.com/company/your-company
      name: Your Company on LinkedIn
```

Uma marca assim é desenhada como `<img>`, então, ao contrário das embutidas, ela mantém as próprias cores em vez de acompanhar a cor do texto ao redor. LinkedIn e Slack precisam desse caminho: ambos pediram para ser removidos do conjunto de ícones de onde o tema tira as suas marcas, então nenhum dos dois vem com ele.

As marcas são do [Simple Icons](https://github.com/simple-icons/simple-icons), publicadas sob CC0-1.0. As marcas comerciais que elas representam não são: cada uma continua sendo marca registrada do seu dono, e colocá-la no seu rodapé não indica nenhuma afiliação com ele nem endosso dele.

<a id="icons"></a>

## Ícones

A navegação do cabeçalho, o controle do modo de cor, o botão "Voltar ao topo" e o botão de copiar dos blocos de código usam SVG embutido de um único conjunto de ícones. `octicons` é o padrão; para usar os ícones Lucide:

```yaml
theme:
  name: primer
  icon: lucide
```

Os dois conjuntos vêm incluídos no tema, então nenhuma das opções acrescenta uma requisição a um CDN. A escolha de ícones vale apenas para os controles HTML do próprio tema. O seletor de idioma sempre usa o globo do Octicons. A sintaxe de ícones no Markdown e pacotes de ícones arbitrários de terceiros não são suportados, de propósito.

<a id="fonts"></a>

## Fontes

As fontes são opcionais: por padrão, o tema não faz requisições a nenhum CDN de fontes. Defina as famílias de texto e de código de forma independente e aponte `source` para uma folha de estilo externa ou para um arquivo CSS em `docs_dir`:

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

Para um site auto-hospedado, coloque os arquivos de fonte e uma folha de estilo em `docs_dir` e use um caminho relativo em `source`:

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

O navegador guarda esses arquivos em cache normalmente. Hospedar as fontes você mesmo evita uma requisição a terceiros e mantém o site utilizável offline depois que os arquivos estiverem em cache.

<a id="language"></a>

## Idioma

Os textos do próprio tema — `Search`, `Back to top`, `Previous`/`Next`, os rótulos do rodapé — vêm de um catálogo gettext, independentemente do idioma em que as suas páginas estão escritas. Escolha um com `locale`:

```yaml
theme:
  name: primer
  locale: ru
```

Há catálogos para `en`, `es`, `fr`, `hi`, `pt`, `ru` e `zh`. Um locale fora da lista recai no inglês, em vez de fazer o build falhar.

!!! note "Sites multilíngues precisam de `locale` em cada idioma"
    O mkdocs-static-i18n só define `theme.locale` automaticamente para os temas
    que vêm com o próprio MkDocs, então um tema de terceiros precisa receber o valor
    explicitamente. Adicione-o a cada idioma, ou todos os locales vão renderizar a
    interface em inglês:

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

!!! warning "Coloque o idioma padrão por último"
    O plugin faz uma passada de build por idioma, e as páginas que existem uma
    única vez no site inteiro — `404.html` e `search.html` — são reescritas a cada
    passada. Por isso, o idioma listado **por último** é aquele em que essas duas
    acabam saindo. Coloque o idioma padrão por último para que elas fiquem nele. O
    tema ordena o seletor de idioma por conta própria, então isso não muda a ordem
    que os visitantes veem.

Para adicionar ou corrigir um idioma, edite `mkdocs_primer/locales/<locale>/LC_MESSAGES/messages.po` e recompile — veja [`RELEASING.md`](https://github.com/olegshulyakov/mkdocs-primer/blob/main/RELEASING.md).

<a id="right-to-left-layouts"></a>

## Layouts da direita para a esquerda

Defina `direction: rtl` para um documento da direita para a esquerda. O tema coloca `dir="rtl"` no elemento HTML raiz e espelha o cabeçalho, a barra lateral, a navegação móvel, a paginação, o rodapé, os menus e os controles com propriedades lógicas de CSS. Código e diagramas continuam da esquerda para a direita, de propósito.

```yaml
theme:
  name: primer
  direction: rtl
```

A direção é uma configuração do site inteiro; o tema não a deduz de uma página nem do locale de um idioma.

!!! warning "`light_theme` e `dark_theme` atualmente aceitam apenas `light` e `dark`"
    O Primer publica quatorze temas (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia` e assim por diante), mas este tema traz os tokens de cor de apenas
    dois deles — o conjunto completo acrescentaria bem mais de um megabyte de CSS. Indicar
    qualquer outro tema renderiza uma página sem cor nenhuma, em vez de dar erro. O suporte
    a mais temas está registrado como uma adição futura.

<a id="heading-anchors"></a>

## Âncoras de títulos

Para ter a âncora do GitHub que aparece ao passar o mouse ao lado de cada título, habilite a extensão `toc` com um permalink no início que leve a classe `anchor` do Primer:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

O próprio tema desenha o octicon, então `permalink` recebe uma string vazia em vez do `true` habitual. Isso importa para mais do que a aparência: o plugin de pesquisa do MkDocs não remove os glifos de permalink, então um `¶` acabaria aparecendo nos seus resultados de pesquisa.

Sem essa configuração o permalink continua funcionando; ele só é renderizado como um glifo simples em vez do octicon.

<a id="syntax-highlighting"></a>

## Realce de sintaxe

As cores do código vêm das variáveis `prettylights` do Primer, então acompanham automaticamente o modo de cor ativo. Não é preciso escolher nenhum estilo do Pygments:

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

Tanto o contêiner `.highlight` quanto o `.codehilite` são estilizados, então `codehilite` também funciona.

O tema adiciona um botão de copiar a cada bloco `.highlight` do Pygments. Ele copia o código visível e anuncia se a operação na área de transferência deu certo. Blocos renderizados por plugins, como Mermaid e Vega-Lite, ficam de fora de propósito.

<a id="navigation-controls"></a>

## Controles de navegação

Depois de rolar 400 pixels, um botão "Voltar ao topo" aparece no canto inferior direito da página. Ele leva o visitante de volta ao início do documento e move o foco do teclado para o link do título do site. O movimento é instantâneo quando o visitante pediu movimento reduzido.

<a id="offline-support"></a>

## Suporte offline

`offline: true` acrescenta uma única coisa a cada página: um script que registra `service-worker.js` a partir da raiz do site. O tema não escreve esse arquivo, e o MkDocs não tem nada que o escreva — gerá-lo é uma etapa que o seu próprio build precisa executar depois de `mkdocs build`:

```yaml
theme:
  name: primer
  offline: true
```

```console
$ mkdocs build
$ npx workbox generateSW workbox-config.cjs
```

É o service worker que faz o precache do site gerado, de modo que um visitante que já passou por ele uma vez pode lê-lo de novo sem rede. Deixe `offline` em `false` e nenhum registro é emitido, que é o que um site sem essa etapa de build quer — uma página pedindo um `service-worker.js` que ninguém gerou registra um 404 a cada visita.

Há duas coisas que ele não consegue fazer. Service workers são recusados fora de um contexto seguro, então o site precisa ser servido por HTTPS ou a partir de `localhost`; uma pasta aberta via `file://` não passa a funcionar offline com nada disso. E o precache começa na *segunda* visita — a primeira é a que enche o cache.

O `workbox-config.cjs` deste repositório e o seu `npm run build:offline` são um exemplo completo e funcional.

<a id="markdown-extensions"></a>

## Extensões de Markdown

Nenhuma delas é obrigatória, mas o tema traz estilos que só fazem diferença quando elas estão ativadas:

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

`admonition` é a que merece destaque: a extensão emite marcação e nenhum CSS próprio, e o `@primer/css` também não tem regra para ela, então uma admonition sem estilo é uma surpresa comum. O tema preenche essa lacuna — veja [os exemplos](../elements.md#admonitions).

<a id="custom-css-and-javascript"></a>

## CSS e JavaScript personalizados

`extra_css` é carregado depois de todas as folhas de estilo que o tema traz, então as suas regras prevalecem sem precisar de `!important`:

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

[Estilização](../styling.md) explica o que colocar nele: as variáveis de layout do próprio tema e por que uma sobrescrita de um token de cor do Primer em `:root` é descartada, enquanto a mesma regra sob dois seletores de atributo é aplicada.

`extra_javascript` é emitido no final de `<body>`, depois dos scripts do próprio tema.

!!! note "Plugins que injetam os próprios arquivos"
    Um plugin que escreve tags `<link>` no HTML da página em vez de adicionar a
    `extra_css` — o mkdocs-glightbox é um deles — fica *depois* das suas sobrescritas.
    Estilize esses elementos com um seletor mais específico em vez de depender da ordem.

<a id="edit-links"></a>

## Links de edição

O [rodapé](#footer) aponta para o arquivo-fonte da própria página quando `repo_url` e `edit_uri` estão definidos:

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```

Com `repo_url` mas sem `edit_uri` não há link por página para montar, e o rodapé indica o repositório no lugar — assim o leitor ainda consegue encontrar o código-fonte de qualquer ponto do site.
