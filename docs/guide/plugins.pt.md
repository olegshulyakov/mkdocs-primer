# Plug-ins

A maioria dos plug-ins MkDocs nunca tocam em um modelo, portanto funcionam com qualquer tema. Um poucos não: eles esperam que o tema renderize algo que eles calcularam, ou que lidar com uma forma de navegação que eles criaram. Esses são os que vale a pena conferir.

Este site é o cheque. `mkdocs.yml` na raiz do repositório habilita os plugins que precisam de suporte ao tema, e a CI o constrói com `--strict`, portanto, uma regressão quebra a construção em vez de degradar silenciosamente uma página. Os candidatos foram levados do [catálogo MkDocs](https://github.com/mkdocs/catalog), trabalhando por popularidade.

## Plugins que precisam de algo do tema

### mkdocs-section-index

[mkdocs-section-index][section-index] dobra `guide/index.md` no **Guia** seção em si, então um item de navegação termina com `children` e `url`. Um tema que renderiza "tem filhos" como um rótulo de seção simples torna a página de índice inacessível na barra lateral.

`partials/nav-item.html` verifica `nav_item.url` e renderiza o rótulo como um link quando há um. Você pode vê-lo na barra lateral: **Guide** e **Nested** são ambos clicáveis.

!!! note "Um aviso que você pode ignorar"
    O plugin reconhece temas suportados combinando caminhos de arquivo de modelo
    contra uma lista interna, então ele registra

```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

para cada tema de terceiros, incluindo este. O suporte aqui é nativo –
    nada precisa de adaptação - mas a mensagem é inevitável do lado do tema.

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] reescreve `theme.locale` apenas para os temas que ele envia suporte para, que não inclui temas de terceiros. Lendo `theme.locale` sozinho, portanto, rotula cada página traduzida com o idioma padrão.

`base.html` prefere a variável `i18n_page_locale` que o plugin coloca na página contexto e volta para `theme.locale` quando o plugin está ausente:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

As páginas traduzidas em `/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` e `/fr/` carrega o atributo `lang` correspondente. Páginas sem tradução `*.<locale>.md` volte para a fonte em inglês, que é o comportamento padrão do plugin.

Quando pelo menos dois idiomas configurados possuem `build: true`, o cabeçalho também renderiza um seletor de idioma. Seus rótulos vêm do `name` de cada idioma e cada entrada permanece na mesma página na localidade de destino. Isso inclui páginas para o qual o plug-in retorna à fonte do idioma padrão. O seletor não é renderizado sem `mkdocs-static-i18n`, para uma construção de idioma único ou na página 404 estática.

### mkdocs-git-revision-date-localizado

[mkdocs-git-revision-date-localized][git-date] lê o log do git e armazena o resultará em `page.meta.git_revision_date_localized`. Nada o exibe, a menos que o tema pede isso, então um tema sem essa linha faz o plugin parecer quebrado. `partials/footer.html` imprime - a linha "Última atualização" na parte inferior desta página.

### mkdocs-git-autores

[mkdocs-git-authors][git-authors] tem o mesmo formato: coloca `git_page_authors` no contexto da página como uma string de HTML e deixa o exibição para o tema. O rodapé imprime ao lado da data de revisão.

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] escreve `feed_rss_created.xml` e `feed_rss_updated.xml`, mas não adiciona nenhuma marcação, então nada aponta o leitor para eles. `base.html` emite o par `<link rel="alternate">`, pegando os nomes dos arquivos de a própria configuração do plugin em vez de codificá-los, já que são opções.

O plug-in não está habilitado neste site — consulte [Conflitos de plug-ins conhecidos](#known-plugin-conflicts).

### Mike

[mike][mike] mantém várias versões de documentação lado a lado e adiciona um menu suspenso de versão. Ele encontra os ativos suspensos de um tema por meio do `mike.themes` grupo de ponto de entrada e, para um tema que não consegue encontrar lá, cria **no seletor em tudo e não diz nada** — o site é implantado, as versões existem e a única maneira mover-se entre eles é editar o URL.

`pyproject.toml` registra `mkdocs_primer.mike` nesse grupo, então Mike escolhe up `version-select.css` e `version-select.js` deste pacote e cópias neles. O seletor chega ao cabeçalho próximo ao nome do site e segue o modo de cor. Os aliases são resolvidos para sua versão real, então `/latest/` mostra `2.0` selecionado em vez de um controle vazio.

Esse script lê o `base_url` global, que `base.html` declara incondicionalmente. Costumava ser declarado apenas quando o plugin `search` era ativado, o que deixaria o seletor quebrado em um site sem pesquisa.

### mkdocs-print-site

[mkdocs-print-site][print-site] renderiza o site inteiro como uma página usando o modelos do tema ativo, que funcionam aqui. O que não pode fazer é fornecer impressão CSS: envia uma folha de estilo por tema que conhece e avisa `Theme 'primer' not yet supported` para o resto.

De qualquer forma, esse é o trabalho do tema. `theme.css` carrega um bloco `@media print` que elimina o cabeçalho, a barra lateral e a paginação, libera a coluna de conteúdo para largura total e evita que blocos de código e tabelas se dividam nas páginas. Isso também fixa o corpo do texto na cor de primeiro plano *clara* do Primer, porque um visitante imprimir no modo escuro, caso contrário, obteria texto cinza claro em papel branco. Esse bloqueio se aplica a qualquer página, com ou sem plugin.

### procurar

O plugin `search` integrado precisa do tema para enviar um modelo `search.html` e carregar `search/main.js` com `base_url` no escopo. Ambos estão no tema; a caixa de pesquisa do cabeçalho aparece sempre que o plugin está ativado e desaparece quando não é.

### mkdocstrings

[mkdocstrings][mkdocstrings] emite sua própria marcação com classes `doc-*` e deixa o estilo por conta do tema. É renderizado de forma legível aqui porque tudo pousa dentro do `.markdown-body` e pega a escala de tipo do Primer, mas o tema não fornece regras `doc-*` dedicadas - assinaturas e tabelas de parâmetros usam Primer's padrões. [Referência](../reference.md) é a página que ele gera.

## Plugins que simplesmente funcionam

Eles não precisam de nada do tema além de HTML bem formado. O primeiro grupo é habilitado neste site, então isso permanece verdadeiro:

| Plug-in | O que faz neste site |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | Constrói a navegação a partir de `docs/.nav.yml` em vez de uma chave `nav:`. |
| [mkdocs-glightbox][glightbox] | Abre as imagens na [página inicial](../index.md) em uma lightbox. |
| [mkdocs-minify-plugin][minify] | Minimiza o HTML, CSS e JS de cada página, incluindo o script de modo de cor embutido do tema. |
| [mkdocs-redirects][redirects] | `/options/` redireciona para [Configuração](configuration.md). |
| [mkdocs-macros-plugin][macros] | Renderiza Jinja em Markdown. Este site é **{{ config.site_name }}**, construído com o tema `{{ config.theme.name }}` — essa frase vem do plugin, não do Markdown. |

O segundo grupo foi verificado em relação ao tema em uma construção inicial, em vez de conectado a este site, porque cada um quer conteúdo fixo que não renderia seu lugar na documentação de um tema:

| Plug-in | Verificado |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | A tag `<swagger-ui>` se expande, os recursos são copiados. |
| [mkdocs-include-markdown-plugin][include-markdown] | Snippet embutido. |
| [markdown-exec][markdown-exec] | Código executado, saída embutida. |
| [mkdocs-table-reader-plugin][table-reader] | CSV renderizado como uma tabela. |
| [mkdocs-markdownextradata-plugin][extradata] | Valores `extra:` interpolados. |
| [mkdocs-autolinks-plugin][autolinks] | Links `[file.md](file.md)` vazios resolvidos. |
| [mkdocs-encryptcontent-plugin][encryptcontent] | Corpo da página criptografado sem texto simples no HTML, formulário de senha renderizado, shell do tema intacto ao seu redor. |
| [mkdocs-monorepo-plugin][monorepo] | Subprojeto mesclado por meio de `!include`. |
| `material/group` | Habilita ou desabilita um grupo de plugins. Com o `search` integrado, a caixa de pesquisa do tema aparece corretamente quando o grupo está ativado e desaparece quando está desativado. |

Plugins de navegação e nível de arquivo — [mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — nunca alcance um modelo em tudo.

<a id="known-plugin-conflicts"></a>

## Conflitos de plugins conhecidos

Nem todo fracasso é do tema. Cinco que vale a pena conhecer, todos reproduzíveis sob qualquer tema.

Três deles são o motivo pelo qual este site não é a única compilação no repositório: o plugins envolvidos não podem compartilhar uma configuração com aqueles já habilitados aqui, então eles obtêm um site próprio sob `examples/`, construído com `--strict` pelo mesmo trabalho de CI.

A página [Examples](../examples.md) descreve o que cada um deles mostra.

- **mkdocs-rss-plugin com mkdocs-static-i18n** — o plugin RSS reescreve seu
  próprio `date_from_meta.default_time` de uma string para um `datetime` durante `on_config`. O plugin i18n executa `on_config` uma vez por idioma, então o segundo pass analisa novamente um `datetime` e avisa, abortando uma compilação `--strict`. Demonstrado em vez disso, em [examples/rss/]({{ config.site_url }}examples/rss/).
- **mkdocs-gen-files com mkdocs-static-i18n** — arquivos criados durante
  `on_files` não são classificados pelo plugin i18n, que registra `Unhandled file case` e os elimina da compilação. Demonstrado em vez disso em [exemplos/gen-files/]({{ config.site_url }}examples/gen-files/), junto com mkdocs-literate-nav, que de outra forma competiria com mkdocs-awesome-nav por a navegação.
- **Mermaid com `minify_html`** — Mermaid analisa sua fonte linha por linha e
  o minificador recolhe as novas linhas dentro de seu `<div>`. O diagrama é renderizado como *Erro de sintaxe no texto* e a compilação não diz nada. Demonstrado em vez disso em [exemplos/diagramas/]({{ config.site_url }}examples/diagrams/), que também cobre [mkdocs-charts-plugin][charts] e como ambos selecionam o modo de cor.
- **mkdocs-monorepo sem `repo_url`** — a construção de uma página de subprojeto aumenta
  `TypeError: join() missing 1 required positional argument`. Configurando `repo_url` e `edit_uri` evita isso. Reproduz de forma idêntica no `mkdocs` integrado tema.
- **`material/search` com tema não Material** — Plugin de pesquisa de Material
  renderiza `partials/language.html` através do Jinja do tema *ativo* ambiente. Sob qualquer tema que não inclua esse modelo, ele gera `TemplateNotFound` e a compilação morre. Use o plug-in `search` integrado em vez disso; o tema é construído contra esse.

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
