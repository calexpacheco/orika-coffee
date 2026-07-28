# ORIKA COFFEE — Technical Case

**Página visual:** `/pt/case/` → https://orika-coffee.vercel.app/pt/case/
**Experiência:** https://orika-coffee.vercel.app
**Rascunho (v1):** https://orika-coffee.vercel.app/draft
**Design System:** https://orika-coffee.vercel.app/design-system/

---

## O problema

Contar a jornada de um café — da terra à xícara — sem que o visitante sinta que está pulando entre seções. A navegação tinha que ser **contínua**: uma câmera só, atravessando sete cenários, sem corte.

## A premissa técnica

**A rolagem não move a página. Ela move o tempo.**

O site toca vídeo pré-renderizado com a posição de scroll mapeada para `video.currentTime`. A câmera se moveu de verdade, na hora do render; o scroll apenas dirige em que instante dela você está. É a mesma técnica das páginas de produto da Apple, e ela permite um movimento de câmera que CSS ou WebGL não entregariam com esse acabamento.

```
scroll (px)  →  segmento ativo  →  currentTime do clipe  →  quadro exibido
                    ↑ suavizado por requestAnimationFrame
```

---

## Arquitetura: mergulhos + conectores

Sete cenas, treze clipes:

```
[dive 1] → conn1 → [dive 2] → conn2 → … → conn6 → [dive 7]
   ↑                   ↑
mergulha na cena   sobe, sobrevoa, desce na próxima
```

- **7 mergulhos** (8s cada) — image-to-video: a câmera parte de fora da cena e voa para dentro.
- **6 conectores** (8s cada) — frames-to-video: sobe, cruza o mundo de papel, desce na cena seguinte.

Essa arquitetura ("diorama / god's-eye") foi escolhida porque combina com a estética de miniatura. Em um walkthrough realista, o recuo do conector leria como rebobinar.

---

## O núcleo: emenda travada por quadro

É o que faz a costura ser invisível — e o erro mais fácil de cometer.

**A regra:** os quadros inicial e final de cada conector precisam ser os **quadros realmente renderizados** dos mergulhos vizinhos, extraídos do vídeo com ffmpeg. Nunca a imagem original da cena.

```
conector i:
  quadro inicial = ÚLTIMO quadro renderizado de dive_i
  quadro final   = PRIMEIRO quadro renderizado de dive_(i+1)
```

Resultado: `fim(dive_i) == início(conn_i)` e `fim(conn_i) == início(dive_i+1)`, pixel a pixel.

**Por que não usar a imagem original:** cada geração renderiza um pouco diferente. Se o conector termina numa versão nova da cena e o mergulho seguinte começa na *dele*, as duas não batem — e aparece um "pulo" na troca.

```bash
# extração dos quadros de emenda
ffmpeg -sseof -0.15 -i dive_i.mp4      -frames:v 1 -q:v 2 last_i.png   # interior
ffmpeg -ss 0        -i dive_next.mp4   -frames:v 1 -q:v 2 first_next.png # estabelecimento
```

Um crossfade curto de poucos quadros cobre diferenças mínimas remanescentes. O crossfade é seguro-extra, não substituto: um salto de conteúdo grande não se esconde com dissolvição.

---

## Duas gerações do pipeline

| | **v1 — rascunho** | **v2 — final** |
|---|---|---|
| Vídeo | Seedance 2.0 mini · 480p | **Veo 3.1** (Frames to Video) · 720p |
| Cenas | GPT Image 2 · 2K | reaproveitadas da v1 |
| Fluxo | API automatizada | **híbrido**: geração manual, orquestração automatizada |
| Custo | ~135 créditos (~US$ 7–11) | assinatura |
| Papel | validar jornada, ritmo e emendas barato | acabamento |

A v1 existe até hoje em `/draft` — não foi descartada, virou prova da evolução do projeto.

**Por que o Veo 3.1:** ele expõe condicionamento por **quadro inicial e final** (`lastFrame` / "Frames to Video"). Sem esse recurso, conector com emenda travada é impossível — a escolha do modelo foi por capacidade, não por preferência.

### O fluxo híbrido (v2)
Geração cara feita à mão em ferramenta por assinatura; todo o resto automatizado. Entregas em rodadas:

1. Prompts das 7 cenas → geração manual → pasta
2. Prompts dos 7 mergulhos (quadro inicial = cada cena) → geração manual → pasta
3. **Extração automática dos 12 quadros de emenda**, pareados e nomeados
4. Prompts dos 6 conectores (com os pares de quadro) → geração manual → pasta
5. Encode, montagem, QA e deploy automatizados

---

## Reprodução: encode e playback

Rolar quadro a quadro exige **seekability**, não densidade de keyframes. Dois pontos costumam ser mal resolvidos:

**1. Blob seeking.** Muitos hosts não servem HTTP range, o que prende `video.seekable` em `[0,0]` e trava todo seek no quadro 0 — o vídeo parece congelado. A solução: buscar cada clipe como `Blob` e tocar de um object URL em memória. Blob é sempre totalmente seekable, independente do host.

**2. Não sacrificar qualidade por fluidez.** All-intra incha um clipe de 8s para ~25 MB. GOP curto resolve com ~⅓ do peso:

```bash
ffmpeg -i src.mp4 -an -vf "crop=1152:648,unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart out.mp4
```

O `crop` uniforme nos 13 clipes remove a marca d'água do gerador sem descentralizar a composição.

---

## Camada de áudio

Como o vídeo toca **mudo** (é "scrubado", não reproduzido), qualquer áudio embutido no clipe seria inútil. O som é uma camada independente:

- Uma trilha musical contínua ao fundo
- Um soundscape por cena, em loop, com **crossfade atrelado à seção ativa**
- Detecção da cena ativa por `MutationObserver` na classe que o motor já alterna — sem modificar o motor
- Inicia mudo; só toca após clique explícito (política de autoplay)

---

## Topologia de deploy

| Rota | Conteúdo |
|---|---|
| `/` | Experiência final (Veo 3.1) |
| `/draft` | Versão de rascunho (480p) |
| `/design-system/` | Design System |
| `/pt/story/` · `/pt/case/` | Páginas de estudo de caso |

GitHub conectado à Vercel: push em `main` re-publica sozinho.

---

## Problemas resolvidos (o que custou tempo)

**Limite de concorrência por tipo de job.** O plano permitia 4 jobs simultâneos de imagem, mas apenas **2** de vídeo. O primeiro lote disparou 7 e metade voltou rejeitada. Solução: cap de concorrência por estágio e script idempotente que só gera o que falta — as rejeições não custaram créditos.

**Colisão de cache com nomes iguais.** A v2 reaproveitou os nomes de arquivo da v1. Navegadores que já tinham visitado o site serviam os vídeos antigos do cache na rota nova. Solução: versionar as URLs dos assets (`?v=veo1`).

**Caminho relativo com barra final.** Com o link apontando para `/draft` (sem barra), o navegador resolve `assets/…` a partir da **raiz** — a subpágina carregava os arquivos da página principal e as duas pareciam idênticas. Solução: **caminhos absolutos** em toda subpasta. Regra aplicada preventivamente em `/design-system/`, `/pt/story/` e `/pt/case/`.

**Transições entre cenas muito diferentes.** Os dois últimos conectores partiam de um interior fechado ou de um close no nível da rua e tinham que chegar a uma vista aérea. Prompt genérico falhava. Duas soluções: (a) descrever o movimento **em etapas explícitas** ("primeiro recua e sai pela frente da loja, depois sobe, depois desce"); (b) no trecho final, abraçar a metáfora — a cena **se desmonta em dobras**, flutua e **se remonta**, o que é ao mesmo tempo mais fiel à marca e mais fácil para o modelo interpolar.

---

## Números

| | |
|---|---|
| Cenas | 7 |
| Clipes | 13 (7 mergulhos + 6 conectores) |
| Duração total de vídeo | ~104 s |
| Rolagem total | ~18 alturas de tela |
| Resolução final | 1152×648 (pós-corte) |
| Faixas de áudio | 8 (1 trilha + 7 ambientes) |
| Custo da v1 completa | ~135 créditos (~US$ 7–11) |

---

## Stack

HTML · CSS · JavaScript (vanilla, zero dependências no runtime) · ffmpeg · Veo 3.1 (Frames to Video) · geração de imagem por IA · GitHub · Vercel

O motor de scroll não usa framework: constrói o próprio DOM e injeta o próprio CSS, então entra em qualquer stack.
