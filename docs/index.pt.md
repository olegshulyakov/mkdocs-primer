# Tema MkDocs Primer

Um tema para o [MkDocs](https://www.mkdocs.org/) construído sobre o [sistema de design
Primer do GitHub](https://primer.style/) — documentação que parece fazer parte
do GitHub.

Este site é o próprio tema se renderizando. O artigo que você está lendo é estilizado
pelas regras `.markdown-body` do próprio GitHub, e tudo ao redor dele — o cabeçalho,
a árvore de navegação, a trilha de navegação, o sumário na coluna da direita — é
o que um site seu recebe com duas linhas de configuração.

<a id="install"></a>

## Instalação

```console
$ pip install mkdocs-primer
```

```yaml
# mkdocs.yml
theme:
  name: primer
```

Essa é toda a configuração: cada opção tem um valor padrão que funciona, e o tema
renderiza o `nav` que o MkDocs já construiu. Veja [Instalação](guide/installation.md).

<a id="what-you-get"></a>

## O que você recebe

- **A renderização de artigos do GitHub** — a tipografia, as tabelas, a moldura do código e
  as âncoras ao passar o mouse de um README no github.com. O CSS do Primer vem embutido no
  pacote, então instalar o tema não exige nenhuma ferramenta do Node.
- **Claro e escuro**, a partir das cores primitivas do Primer. O controle no cabeçalho
  segue o sistema operacional até o visitante escolher um modo, e depois lembra a
  escolha. O destaque de sintaxe também acompanha.
- **Navegação que escala** — uma barra lateral com aninhamento ilimitado, recolhida
  até a seção em que o leitor está, além de uma trilha de navegação, links de anterior/próxima,
  uma página de pesquisa e uma página 404.
- **Admonitions estilizadas como os alertas do GitHub.** A extensão `admonition` não traz
  CSS e o `@primer/css` não tem regra para ela, então na maioria dos temas `!!! note`
  é renderizado sem decoração.
- **Sete idiomas** para os textos do próprio tema — inglês, espanhol, francês,
  hindi, português, russo e chinês — e layouts da direita para a esquerda.
- **Suporte aos plugins que precisam da ajuda do tema**: páginas de índice de seção,
  sites traduzidos, datas de revisão e autores, descoberta automática de RSS e o
  seletor de versão do mike.

<a id="where-to-go-next"></a>

## Para onde ir agora

[Guia](guide/index.md)

:   Instalação, todas as opções do tema e os plugins com os quais este tema foi
    testado.

[Elementos](elements.md)

:   Cada bloco que o tema estiliza dentro de um artigo, desenhado uma vez — admonitions,
    citações, código, tabelas, imagens.

[Estilização](styling.md)

:   As variáveis a definir numa folha de estilo própria, e a única substituição de token
    do Primer que não funciona como parece que deveria.

[Exemplos](examples.md)

:   Três sites completos que mostram o que o tema faz com feeds, páginas
    geradas e diagramas.

[Referência](reference.md)

:   A documentação do próprio pacote do tema, renderizada pelo mkdocstrings.
