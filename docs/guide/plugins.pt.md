# Plugins

A maioria dos plugins do MkDocs nunca toca em um template, então funciona com qualquer tema. Alguns não: esperam que o tema renderize algo que eles calcularam, ou que dê conta de uma estrutura de navegação que eles criaram. São esses que vale a pena verificar.

Este site é a verificação. O `mkdocs.yml` na raiz do repositório habilita os plugins que precisam de suporte do tema, e a CI faz o build com `--strict`, então uma regressão quebra o build em vez de degradar uma página em silêncio. Os candidatos foram tirados do [catálogo do MkDocs](https://github.com/mkdocs/catalog), descendo pela lista de popularidade.

<a id="plugins-that-need-something-from-the-theme"></a>

## Plugins que precisam de algo do tema

### mkdocs-section-index

O [mkdocs-section-index][section-index] incorpora `guide/index.md` à própria seção **Guia**, então um item de navegação acaba tendo ao mesmo tempo `children` e uma `url`. Um tema que renderiza "tem filhos" como um simples rótulo de seção torna essa página de índice inalcançável pela barra lateral.

`partials/nav-item.html` verifica `nav_item.url` e renderiza o rótulo como link quando ela existe. Dá para ver na barra lateral: **Guia** e **Aninhado** são ambos clicáveis.

!!! note "Um aviso que você pode ignorar"
    O plugin reconhece os temas suportados comparando caminhos de arquivos de template
    com uma lista interna, então ele registra

    ```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

    para todo tema de terceiros, inclusive este. O suporte aqui é nativo —
    não há nada a adaptar —, mas a mensagem não pode ser evitada pelo lado do tema.

### mkdocs-static-i18n

O [mkdocs-static-i18n][i18n] reescreve `theme.locale` apenas para os temas que ele suporta, o que não inclui temas de terceiros. Ler apenas `theme.locale` faz, portanto, com que toda página traduzida seja marcada com o idioma padrão.

`base.html` dá preferência à variável `i18n_page_locale` que o plugin coloca no contexto da página e recorre a `theme.locale` quando o plugin não está presente:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

As páginas traduzidas em `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` e `/fr/` trazem o atributo `lang` correspondente. Páginas sem uma tradução `*.<locale>.md` recaem no original em inglês, que é o comportamento padrão do plugin.

Quando pelo menos dois idiomas configurados têm `build: true`, o cabeçalho também renderiza um seletor de idioma. Os rótulos vêm do `name` de cada idioma, e cada entrada leva à mesma página no locale de destino. Isso vale também para as páginas em que o plugin recai no original do idioma padrão. O seletor não é renderizado sem o `mkdocs-static-i18n`, em um build de um único idioma nem na página 404 estática.

### mkdocs-git-revision-date-localized

O [mkdocs-git-revision-date-localized][git-date] lê o log do git e guarda o resultado em `page.meta.git_revision_date_localized` — e, com `enable_creation_date: true`, também em `page.meta.git_creation_date_localized`. Nada exibe nenhum dos dois a menos que o tema peça, então um tema sem essas linhas faz o plugin parecer quebrado. `partials/metadata.html` imprime os dois, como os itens "Criado" e "Última atualização" da linha de metadados sob o título da página.

### mkdocs-git-authors

O [mkdocs-git-authors][git-authors] segue o mesmo modelo: coloca `git_page_authors` no contexto da página como uma string de HTML e deixa a exibição a cargo do tema. A linha de metadados o imprime ao lado das datas.

### mkdocs-rss-plugin

O [mkdocs-rss-plugin][rss] escreve `feed_rss_created.xml` e `feed_rss_updated.xml`, mas não adiciona nenhuma marcação, então nada indica ao leitor que eles existem. `base.html` emite o par de `<link rel="alternate">`, tirando os nomes dos arquivos da própria configuração do plugin em vez de fixá-los no código, já que são opções.

O plugin não está habilitado neste site — veja [Conflitos conhecidos entre plugins](#known-plugin-conflicts).

### mike

O [mike][mike] mantém várias versões da documentação lado a lado e adiciona um menu de versões. Ele encontra os arquivos do menu de um tema pelo grupo de entry points `mike.themes` e, para um tema que não encontra ali, **não cria seletor nenhum e não avisa nada** — o site é publicado, as versões existem, e a única forma de passar de uma para outra é editar a URL.

O `pyproject.toml` registra `mkdocs_primer_mike` nesse grupo, então o mike pega `version-select.css` e `version-select.js` deste pacote e os copia para o site. O seletor fica no cabeçalho, ao lado do nome do site, e acompanha o modo de cor. Os aliases são resolvidos para a versão real, então `/latest/` mostra `2.0` selecionado em vez de um controle vazio.

Esse script lê a variável global `base_url`, que `base.html` declara incondicionalmente. Antes ela só era declarada quando o plugin `search` estava habilitado, o que teria deixado o seletor quebrado em um site sem pesquisa.

### mkdocs-print-site

O [mkdocs-print-site][print-site] renderiza o site inteiro como uma única página usando os templates do tema ativo, o que funciona aqui. O que ele não consegue é fornecer o CSS de impressão: traz uma folha de estilo para cada tema que conhece e avisa `Theme 'primer' not yet supported` para os demais.

De qualquer forma, isso é trabalho do tema. `theme.css` tem um bloco `@media print` que remove o cabeçalho, a barra lateral e a paginação, libera a coluna de conteúdo para a largura total e impede que blocos de código e tabelas se dividam entre páginas. Ele também fixa o texto na cor de primeiro plano do tema *claro* do Primer, porque um visitante que imprimisse no modo escuro receberia, caso contrário, texto cinza-claro em papel branco. Esse bloco vale para qualquer página, com ou sem o plugin.

### search

O plugin `search` embutido precisa que o tema traga um template `search.html` e carregue `search/main.js` com `base_url` no escopo. As duas coisas estão no tema; a caixa de pesquisa do cabeçalho aparece sempre que o plugin está habilitado e some quando não está.

### mkdocstrings

O [mkdocstrings][mkdocstrings] emite a própria marcação com classes `doc-*` e deixa o estilo a cargo do tema. Aqui ele é renderizado de forma legível porque tudo fica dentro de `.markdown-body` e herda a escala tipográfica do Primer, mas o tema não traz regras `doc-*` específicas — assinaturas e tabelas de parâmetros usam os padrões do Primer. [Referência](../reference.md) é a página que ele gera.

<a id="plugins-that-just-work"></a>

## Plugins que simplesmente funcionam

Estes não precisam de nada do tema além de HTML bem formado. O primeiro grupo está habilitado neste site, para que isso continue verdadeiro:

| Plugin | O que ele faz neste site |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Monta a navegação a partir de `docs/.nav.yml` em vez de uma chave `nav:`. |
| [mkdocs-glightbox][glightbox] | Abre as imagens de [Elementos](../elements.md) em um lightbox. |
| [mkdocs-minify-plugin][minify] | Minifica o HTML, o CSS e o JS de cada página, inclusive o script de modo de cor embutido do tema. |
| [mkdocs-redirects][redirects] | `/options/` redireciona para [Configuração](configuration.md). |
| [mkdocs-macros-plugin][macros] | Renderiza Jinja no Markdown. Este site é **{{ config.site_name }}**, gerado com o tema `{{ config.theme.name }}` — essa frase vem do plugin, não do Markdown. |

O segundo grupo foi verificado com o tema em um build de teste, em vez de integrado a este site, porque cada um exige conteúdo de exemplo que não teria lugar na documentação de um tema:

| Plugin | Verificado |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | Tag `<swagger-ui>` expandida, arquivos copiados. |
| [mkdocs-include-markdown-plugin][include-markdown] | Trecho incluído no texto. |
| [markdown-exec][markdown-exec] | Código executado, saída incluída no texto. |
| [mkdocs-table-reader-plugin][table-reader] | CSV renderizado como tabela. |
| [mkdocs-markdownextradata-plugin][extradata] | Valores de `extra:` interpolados. |
| [mkdocs-autolinks-plugin][autolinks] | Links simples `[file.md](file.md)` resolvidos. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Corpo da página criptografado sem nenhum texto puro sobrando no HTML, formulário de senha renderizado, estrutura do tema intacta ao redor. |
| [mkdocs-monorepo-plugin][monorepo] | Subprojeto incorporado via `!include`. |
| `material/group` | Habilita ou desabilita um grupo de plugins. Com o `search` embutido dentro dele, a caixa de pesquisa do tema aparece corretamente quando o grupo está ativado e some quando está desativado. |

Plugins que atuam na navegação e nos arquivos — [mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — nem chegam a passar por um template.

<a id="known-plugin-conflicts"></a>

## Conflitos conhecidos entre plugins

Nem toda falha é culpa do tema. Seis que vale a pena conhecer, todas reproduzíveis com qualquer tema.

Três delas são o motivo de este site não ser o único build do repositório: os plugins envolvidos não podem dividir uma configuração com os que já estão habilitados aqui, então ganham um site próprio em `examples/`, gerado com `--strict` pelo mesmo job de CI.

A página [Exemplos](../examples.md) mostra o que cada um deles demonstra.

- **mkdocs-rss-plugin com mkdocs-static-i18n** — o plugin de RSS reescreve a sua
  própria `date_from_meta.default_time` de string para `datetime` durante o `on_config`. O plugin i18n executa o `on_config` uma vez por idioma, então a segunda passada tenta interpretar de novo um `datetime` e emite um aviso, abortando um build com `--strict`. Demonstrado em vez disso em [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files com mkdocs-static-i18n** — os arquivos criados durante o
  `on_files` não são classificados pelo plugin i18n, que registra `Unhandled file case` e os descarta do build. Demonstrado em vez disso em [examples/gen-files/]({{ config.site_url }}examples/gen-files/), junto com o mkdocs-literate-nav, que de outra forma disputaria a navegação com o mkdocs-awesome-nav.
- **Mermaid com `minify_html`** — o Mermaid lê o seu código-fonte linha por linha, e
  o minificador junta as quebras de linha dentro do seu `<div>`. O diagrama é renderizado como *Syntax error in text* e o build não diz nada. Demonstrado em vez disso em [examples/diagrams/]({{ config.site_url }}examples/diagrams/), que também cobre o [mkdocs-charts-plugin][charts] e como ambos acompanham o modo de cor.
- **mkdocs-monorepo sem `repo_url`** — o build de uma página de subprojeto lança
  `TypeError: join() missing 1 required positional argument`. Definir `repo_url` e `edit_uri` evita o erro. Reproduz-se de forma idêntica com o tema `mkdocs` embutido.
- **`search` com um idioma padrão que o mkdocs-static-i18n não lista
  primeiro** — o plugin i18n faz uma passada de build por idioma, começando pelo
  padrão, e depois percorre `languages` pulando aquele que acabou de gerar. Ele
  compara cada entrada com a passada anterior, e não com o idioma padrão, então um
  idioma padrão listado em qualquer posição que não a primeira é gerado duas vezes,
  e cada uma das suas páginas chega duas vezes ao plugin de pesquisa. O índice leva
  as duplicatas até a página de pesquisa, que lista cada resultado duas vezes. Listar
  o padrão primeiro evita isso, mas é a última passada que escreve os únicos
  `404.html` e `search.html` do site — por isso este site mantém `en` por último e
  descarta as entradas duplicadas em `hooks.py`.
- **`material/search` com um tema que não é o Material** — o plugin de pesquisa do Material
  renderiza `partials/language.html` pelo ambiente Jinja do tema *ativo*. Com qualquer tema que não traga esse template, ele lança `TemplateNotFound` e o build morre. Use o plugin `search` embutido; o tema foi feito para ele.

[autolinks]: https://github.com/zachhannum/mkdocs-autolinks-plugin
[awesome-nav]: https://lukasgeiter.github.io/mkdocs-awesome-nav/
[awesome-pages]: https://github.com/lukasgeiter/mkdocs-awesome-pages-plugin
[encryptcontent]: https://github.com/unverbuggt/mkdocs-encryptcontent-plugin
[mike]: https://github.com/jimporter/mike
[charts]: https://timvink.github.io/mkdocs-charts-plugin/
[exclude]: https://github.com/apenwarr/mkdocs-exclude
[extradata]: https://github.com/rosscdh/mkdocs-markdownextradata-plugin
[git-authors]: https://timvink.github.io/mkdocs-git-authors-plugin/
[git-date]: https://timvink.github.io/mkdocs-git-revision-date-localized-plugin/
[glightbox]: https://blueswen.github.io/mkdocs-glightbox/
[i18n]: https://ultrabug.github.io/mkdocs-static-i18n/
[include-markdown]: https://github.com/mondeja/mkdocs-include-markdown-plugin
[literate-nav]: https://github.com/oprypin/mkdocs-literate-nav
[macros]: https://mkdocs-macros-plugin.readthedocs.io/
[markdown-exec]: https://pawamoy.github.io/markdown-exec/
[mermaid2]: https://mkdocs-mermaid2.readthedocs.io/
[minify]: https://github.com/byrnereese/mkdocs-minify-plugin
[mkdocstrings]: https://mkdocstrings.github.io/
[monorepo]: https://github.com/backstage/mkdocs-monorepo-plugin
[print-site]: https://timvink.github.io/mkdocs-print-site-plugin/
[redirects]: https://github.com/mkdocs/mkdocs-redirects
[rss]: https://guts.github.io/mkdocs-rss-plugin/
[section-index]: https://github.com/oprypin/mkdocs-section-index
[swagger]: https://blueswen.github.io/mkdocs-swagger-ui-tag/
[table-reader]: https://timvink.github.io/mkdocs-table-reader-plugin/
