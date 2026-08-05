# Escritor

Uma superfície de escrita no espírito do [iA Writer](https://ia.net/writer): folha branca, barra que some enquanto se escreve, Markdown realçado sem transformar o texto, e nada mais.

Abra `index.html` no navegador. Não há build, dependência ou servidor. É um único aplicativo local e funciona offline, fontes incluídas.

```bash
# opcional, se preferir servir por HTTP
python3 -m http.server 8000
```

O documento que aparece ao abrir é o **guia**, o texto que explica o aplicativo escrevendo nele mesmo. Ele volta a cada sessão enquanto você não tiver escrito nada seu; a partir do momento em que houver um texto seu guardado, é ele que abre. O botão **?** na barra traz o guia de volta quando você quiser.

---

## Como funciona por dentro

O texto vive numa `<textarea>` com a cor transparente. Logo abaixo dela, um `<div>` espelha o mesmo conteúdo já realçado, com **exatamente** a mesma métrica tipográfica: mesma fonte, mesmo corpo, mesma entrelinha, mesmo padding, mesma quebra de linha.

O resultado: você vê o texto realçado, mas o cursor, a seleção, o desfazer, o arrastar e o corretor ortográfico continuam sendo os **nativos do navegador**. Nenhum deles foi reimplementado.

A regra que sustenta tudo: **o realce nunca altera a quantidade de caracteres**. Os sinais do Markdown (`#`, `**`, `[ ]`) permanecem visíveis, apenas recuados em cinza. É por isso que o texto nunca "pula" enquanto você escreve e o cursor nunca desalinha.

### Pedaços, não camadas

Cada linha é quebrada numa lista de **pedaços**: um trecho de texto com zero ou mais classes. Foco, revisão de estilo, ortografia e classes gramaticais não empilham tags por fora do realce. Eles partem o pedaço no ponto exato onde começam e acrescentam mais uma classe a ele.

Isso importa por um motivo prático: emendar os pedaços de volta devolve a linha original, caractere por caractere. Ligar o modo foco não desmancha mais o realce dos títulos, das listas e das citações, como acontecia quando o recuo era uma tag envolvendo o resto.

---

## O que tem

### Foco
Recua tudo o que não é o trecho atual. Três escopos no menu **Foco**: **Frase** (o padrão do iA Writer), **Parágrafo** e **Linha**.

### Máquina de escrever
Mantém a linha do cursor sempre no centro vertical da tela. O texto sobe; os olhos ficam parados. A folha ganha respiro em cima e embaixo para que a primeira e a última linha também alcancem o meio.

### Ortografia
Faz uma coisa só: **um risco vermelho ondulado embaixo da palavra suspeita**. Sem sugestões por cima do texto, sem menus, sem interrupção. São duas camadas:

1. **O dicionário pt-BR do próprio navegador**, desenhado diretamente sobre a `<textarea>`. Como o marcador de erro é pintado independentemente da cor do texto, ele continua visível mesmo com o texto transparente. É daqui que vem a cobertura real do vocabulário.
2. **Uma lista própria** de erros clássicos do português escrito (`concerteza`, `derrepente`, `apartir`, `menas`, `pesquiza`, acentuação faltando em `voce`/`tambem`/`ja`…). Com o cursor em cima de uma dessas palavras, a forma correta aparece no canto do rodapé. **Clicar nela, ou `Ctrl+;`, faz a troca**. A caixa da palavra original é preservada (`Concerteza` vira `Com certeza`), e a correção entra como uma edição sua, então `Ctrl+Z` a desfaz.

> **Só entra na lista o que está sempre errado.** Formas que existem em algum contexto, como `mais`, `há`, `nós`, `pra`, `publico` (eu publico) e `pratica` (ele pratica), ficam de fora, porque um alarme falso custa mais caro do que um erro não apontado.

**Se nada for sublinhado**, o Chrome provavelmente não tem o dicionário de português instalado. A lista própria continua funcionando, mas a cobertura fica reduzida. Ative em:
`chrome://settings/languages` → **Verificação ortográfica** → adicione *Português (Brasil)*.
No Firefox: clique com o botão direito no editor → **Idiomas** → *Adicionar dicionários*.

### Revisão de estilo
Clichês, muletas, redundâncias e escorregões de norma-padrão recebem um traço pontilhado âmbar. O rodapé mostra quantos são; clicar na contagem abre a lista, e clicar num item leva direto ao trecho, já selecionado.

### Classes gramaticais
Pinta uma classe de palavras por vez (substantivos, verbos, adjetivos, advérbios ou conectivos) ou todas de uma vez. O resto do texto recua para dar protagonismo à classe escolhida. Serve para enxergar o ritmo da frase: excesso de adjetivo, falta de verbo, uma corrente de conectivos que não termina.

> **É uma heurística, não um analisador morfológico.** A classificação usa vocabulários de substantivos, adjetivos, advérbios e verbos frequentes, conectivos (conjunções, preposições e suas contrações) e regras conservadoras de sufixo. Artigos e pronomes não são tratados como conectivos. Há também exceções para o que uma terminação poderia confundir (`lugar` não é verbo só por terminar em `-ar`). Palavras ambíguas ou não reconhecidas ficam sem cor, em vez de receberem um palpite.

### Visualizar
Esconde os sinais do Markdown e mostra o texto formatado. Aqui os títulos enfim crescem: não há mais cursor para manter alinhado.

### Aa
Fonte, corpo do texto (14–28px) e papel nos temas Claro, Sépia e Escuro.

### Exportar
Markdown (`.md`), Texto simples (`.txt`), Página HTML (`.html`, com estilo embutido), Word (`.doc`) e PDF (via impressão, com CSS de página próprio). Também dá para copiar Markdown ou HTML direto para a área de transferência.

O nome do arquivo sai do primeiro título do documento. O `Ctrl+P` do navegador também imprime o documento formatado, e não a tela.

---

## Atalhos

| Atalho | O que faz |
| --- | --- |
| `Ctrl+B` | negrito |
| `Ctrl+I` | itálico |
| `Ctrl+K` | link |
| `Ctrl+E` | visualizar / editar |
| `Ctrl+D` | modo foco |
| `Ctrl+T` | máquina de escrever |
| `Ctrl+G` | classes gramaticais (liga/desliga) |
| `Ctrl+P` | ortografia |
| `Ctrl+;` | corrigir a palavra sob o cursor |
| `Ctrl+R` | revisão de estilo |
| `Ctrl+S` | exportar Markdown |
| `Ctrl+O` | abrir arquivo |
| `Ctrl+Alt+N` | novo documento |
| `Tab` / `Shift+Tab` | recuar / avançar bloco |
| `Enter` | continua listas, numeração e citações |
| `Esc` | fecha menus e painéis, sai da visualização |

Arrastar um `.md` ou `.txt` para a janela também abre o arquivo.

---

## As fontes

As três fontes da iA (**Duo**, **Mono** e **Quattro**) são livres (Apache 2.0, em [github.com/iaolo/iA-Fonts](https://github.com/iaolo/iA-Fonts)) e vêm **embutidas** em `fontes/`, em `woff2`. Não é preciso instalar nada no sistema, e o aplicativo tem a letra certa mesmo offline.

A escolha entre elas não é só de gosto. Um título em negrito só pode existir aqui se o negrito ocupar **exatamente** a mesma largura do texto normal. Caso contrário, a linha quebraria num ponto no espelho e noutro na `<textarea>`, e o cursor sairia do lugar. Medido nas três:

| Fonte | Negrito | Itálico | No Escritor |
| --- | --- | --- | --- |
| **Duo** | mesma largura | mesma largura | padrão, com negrito e itálico reais |
| **Mono** | mesma largura | mesma largura | monoespaçada de verdade |
| **Quattro** | mesma largura | **3,6% mais larga** | negrito real; a ênfase é marcada por cor, sem inclinação |

É por isso que o padrão é a **Duo**: é a que permite título em negrito e ênfase em itálico de verdade sem deslocar um pixel do cursor.

---

## Onde as coisas ficam

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | estrutura da página |
| `style.css` | fontes embutidas, papéis, cores, tipografia, impressão |
| `app.js` | pedaços, foco, gramática, ortografia, estilo, Markdown, exportação, guia |
| `fontes/` | iA Writer Duo, Mono e Quattro em `woff2` + licença |

O texto e as preferências são guardados no `localStorage` do navegador, nas chaves `escritor:texto` e `escritor:prefs`. Trocar de navegador ou limpar os dados do site apaga o rascunho. Para guardar de verdade, exporte.

### Ajustar as cores

Todas as cores são variáveis CSS no topo de `style.css`, agrupadas por papel:

```css
--tinta     /* o texto            */   --g-subst  /* substantivos */
--marca     /* sinais do Markdown */   --g-verbo  /* verbos       */
--apagado   /* o que o foco recua */   --g-adj    /* adjetivos    */
--c-link    /* links              */   --g-adv    /* advérbios    */
--c-codigo  /* código             */   --g-conj   /* conectivos   */
--c-enfase  /* ênfase na Quattro  */
--c-erro    /* ortografia         */   --c-estilo /* revisão      */
```

Largura da coluna, corpo do texto e entrelinha ficam em `--coluna`, `--tam` e `--altura`.

No espírito do original, o realce é quase todo monocromático: a cor fica reservada ao que pede atenção, como um link, um erro ou uma classe gramatical que você pediu para ver.
