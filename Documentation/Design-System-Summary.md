# ORIKA COFFEE — Design System Summary

**File:** `/design-system/index.html`
**Styles:** `/design-system/styles.css`
**Assets:** `/design-system/assets/` (as 7 imagens iniciais de cena)
**Run:** `python3 -m http.server 8788` na **raiz do projeto** → `http://localhost:8788/pt/design-system/`
**Live:** `https://orika-coffee.vercel.app/pt/design-system/`

> **Importante:** sirva a partir da **raiz do projeto**, não de dentro de `design-system/`. O HTML usa caminhos **absolutos** (`/design-system/…`) de propósito — assim a página funciona com ou sem barra final na URL (o `url()` do CSS continua relativo ao próprio arquivo, o que já é correto).

> **Status:** Design System v1.0, estável. A landing page já implementa padrões ainda não formalizados aqui como componentes: o motor de scroll-scrub (câmera dirigida pela rolagem), a camada de áudio ambiente por cena e a troca entre versões (Veo / draft). Tokens e regras de componente abaixo são a fonte da verdade.

---

## Estrutura — 16 Seções + Prévia de Telas

| # | ID | Título | Conteúdo-chave |
|---|---|---|---|
| 01 | `#foundations` | Fundamentos | Valores da marca, princípios de design, regra do papel |
| 02 | `#colors` | Sistema de Cor | Paleta completa com tokens, uso semântico, contraste |
| 03 | `#typography` | Tipografia | Escala, pareamento mincho + sans, espécime |
| 04 | `#spacing` | Espaçamento | Grid base de 8px, tokens de espaço |
| 05 | `#layout` | Layout | Contêineres, breakpoints |
| 06 | `#components` | Componentes V1 | Cartão de cena, superfícies, tags |
| 07 | `#motion` | Movimento | Curvas de easing, durações, princípios |
| 08 | `#buttons` | Botões | Todos os estados: default, hover, focus, disabled |
| 09 | `#icons` | Iconografia | Sistema de tamanho (.icon-sm até .icon-xxl) |
| 10 | `#sumi` | Tema Sumi | Variante noturna via `.sumi-section` |
| 11 | `#components-v2` | Componentes V2 | Faixa de CTA, destaque de mídia, galeria |
| 12 | `#forms` | Formulários | Inputs, select, textarea, checkbox |
| 13 | `#navigation` | Navegação | Barra flutuante, trilho de rota |
| 14 | `#borders` | Bordas & Elevação | Tokens de borda, elevação, raios |
| 15 | `#motion-v2` | Movimento V2 | Scroll-scrub, emenda travada, blob seeking |
| 16 | `#accessibility` | Acessibilidade | Contraste, foco, reduced-motion, áudio |
| Extra | `#screens` | Telas | As 7 áreas da jornada com imagem inicial |

---

## Header

O header do Design System (`ds-header`) usa:
- `background-image: url('assets/bar.jpg')` — a cena final (o bar / xícara-lótus)
- Overlay: `linear-gradient(to bottom, rgba(242,236,221,0.88) 0%, rgba(242,236,221,0.72) 45%, rgba(242,236,221,0.94) 100%)`
- Marca: bloco `折` (dobrar) em matcha-cedar, `--radius-sm`, 54×54px
- Título em mincho, `ORIKA` em sumi + `COFFEE` em cobre

---

## Referência de Tokens CSS

### Cores
```css
--clr-washi:       #F2ECDD;   /* base — creme washi (== fundo das cenas) */
--clr-washi-warm:  #EAE2D0;
--clr-washi-deep:  #DED4BE;
--clr-paper:       #FBF8F1;   /* superfície elevada */

--clr-sumi:        #2B2B28;   /* tinta primária */
--clr-sumi-soft:   #4A4A44;
--clr-sumi-dim:    #6E6E66;

--clr-umber:        #6B4226;  /* umbre torrado — texto secundário, terra */
--clr-umber-light:  #8A5A38;
--clr-umber-subtle: rgba(107, 66, 38, 0.10);
--clr-umber-border: rgba(107, 66, 38, 0.22);

--clr-copper:        #B87333; /* ACENTO PRIMÁRIO */
--clr-copper-light:  #CE8E4E;
--clr-copper-dim:    #9A5F28;
--clr-copper-subtle: rgba(184, 115, 51, 0.12);
--clr-copper-border: rgba(184, 115, 51, 0.28);
--clr-copper-glow:   rgba(184, 115, 51, 0.16);

--clr-matcha:        #5C6B4C; /* origem / natureza */
--clr-hinomaru:      #BC002D; /* RESERVADO — desfecho e ênfase crítica */
```

### Tipografia
```css
--font-display: 'Hiragino Mincho ProN', 'Yu Mincho', Georgia, serif;
--font-body:    -apple-system, 'Segoe UI', Helvetica, sans-serif;

--text-display-xxl:  clamp(56px, 7.5vw, 104px);
--text-display-xl:   clamp(44px, 5.5vw, 76px);
--text-display-l:    clamp(36px, 4.4vw, 56px);
--text-heading-m:    clamp(30px, 3.6vw, 42px);
--text-heading-s:    clamp(24px, 2.8vw, 32px);
--text-card-heading: clamp(20px, 2.2vw, 26px);
--text-body-lg:      19px;
--text-body:         17px;
--text-small:        15px;
--text-caption:      13.5px;
--text-micro:        11.5px;

--ls-tight: -0.02em;  --ls-wide: 0.08em;
--ls-wider: 0.16em;   --ls-widest: 0.26em;   /* eyebrows */
```

### Movimento
```css
--ease-fold:   cubic-bezier(0.22, 1, 0.36, 1);    /* padrão — papel assentando */
--ease-unfold: cubic-bezier(0.33, 0, 0.2, 1);
--ease-drift:  cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-crease: cubic-bezier(0.65, 0, 0.35, 1);

--duration-fast:      220ms;
--duration-base:      380ms;
--duration-slow:      680ms;
--duration-cinematic: 1150ms;
```

### Espaçamento
```css
--space-4: 4px   --space-8: 8px    --space-12: 12px
--space-16: 16px --space-20: 20px  --space-24: 24px
--space-32: 32px --space-40: 40px  --space-48: 48px
--space-56: 56px --space-64: 64px  --space-80: 80px
--space-96: 96px --space-120: 120px --space-160: 160px
```

### Elevação (papel sobre papel — sombra quente, nunca preta pura)
```css
--elev-1:      0 1px 2px   rgba(43, 43, 40, 0.06);
--elev-2:      0 4px 14px  rgba(43, 43, 40, 0.09);
--elev-3:      0 12px 34px rgba(43, 43, 40, 0.13);
--elev-4:      0 24px 60px rgba(43, 43, 40, 0.16);
--elev-copper: 0 10px 30px rgba(184, 115, 51, 0.22);
--shadow-contact: 0 18px 40px -18px rgba(43, 43, 40, 0.35);
```

### Bordas e Raios
```css
--border-hair:        1px solid rgba(43, 43, 40, 0.10);
--border-subtle:      1px solid rgba(107, 66, 38, 0.14);
--border-copper:      1px solid var(--clr-copper-border);
--border-copper-bold: 1px solid rgba(184, 115, 51, 0.55);
--border-divider:     1px solid rgba(107, 66, 38, 0.18);
--focus-ring:         0 0 0 3px rgba(184, 115, 51, 0.45);

--radius-xs: 6px;  --radius-sm: 10px;  --radius-md: 16px;
--radius-lg: 22px; --radius-pill: 999px;
```

### Layout
```css
--container-xl: 1400px;  --container-lg: 1160px;  --container-md: 920px;
--container-sm: 700px;   --container-xs: 460px;
```

---

## Componentes-chave

### Botões
```html
<a class="btn-primary">Find your roast</a>   <!-- preenchido em cobre -->
<a class="btn-outline">Visit the bar</a>     <!-- só borda -->
<a class="btn-ghost">Explore the world <span class="arrow">→</span></a>
```

**Regras de hover:**
- `.btn-primary:hover` → `background: --clr-copper-light`, `translateY(-1px)`
- `.btn-outline:hover` → `background: --clr-copper-subtle`, borda/texto em `--clr-copper`
- `.btn-ghost:hover` → a seta desliza 4px para a direita
- **SEM pseudo-elementos `::after` de overlay** sobre o texto

### Cartão de cena (componente-assinatura)
```html
<article class="scene-card">
  <div class="scene-card__media"><span class="scene-card__idx">01 / 07</span><img …></div>
  <div class="scene-card__body">
    <span class="eyebrow">From the hills</span>
    <h3>It begins on a folded hillside.</h3>
    <p>…</p>
    <div class="tags"><span class="tag tag--matcha">Single-origin</span></div>
  </div>
</article>
```
Hover: `translateY(-4px)` + elevação 2 → 3, com `--ease-fold`.

### Tamanhos de ícone
```css
.icon-sm  { 16px }   .icon-md { 20px }   .icon-lg { 24px }
.icon-xl  { 32px }   .icon-xxl { 48px }
```

### Tema Sumi (noturno)
Aplique `class="sumi-section"` no contêiner — os tokens semânticos se invertem automaticamente (`--clr-bg`, `--clr-ink`, `--clr-surface`, bordas). Cobre permanece como acento.

---

## Assets em `/design-system/assets/`

| Arquivo | Origem | Uso no DS |
|---|---|---|
| `plantation.jpg` | Poster da cena 01 | Cartão de cena, galeria, Tela 01 |
| `harvest.jpg` | Poster da cena 02 | Galeria, Tela 02 |
| `selection.jpg` | Poster da cena 03 | Galeria, Tela 03 |
| `roasting.jpg` | Poster da cena 04 | Cartão de cena, Tela 04 |
| `boutique.jpg` | Poster da cena 05 | Cartão de cena, Tela 05 |
| `delivery.jpg` | Poster da cena 06 | Galeria, Tela 06 |
| `bar.jpg` | Poster da cena 07 | Header, faixa de CTA, Tela 07 |

> Todas são cópias de `/assets/` (o quadro inicial de cada área no site ao vivo), em 1152×648 (16:9).

---

## Regras do Design System para a Landing Page

1. Importe ou replique os tokens exatamente — sem valores avulsos
2. Todos os botões vêm do Design System (sem overrides)
3. O fundo padrão é sempre `--clr-washi` (#F2ECDD) — o mesmo creme do fundo das cenas, para as ilhas flutuarem sem moldura
4. Texto sempre atende WCAG AA (mínimo 4.5:1)
5. Foco usa `--focus-ring` (anel de 3px em cobre)
6. Movimento usa `--ease-fold` como padrão; **proibido** bounce, elástico ou piscar
7. **Nada com `border-radius: 0`** — o washi tem borda deckled, sempre há amaciamento. Ações usam pastilha (`--radius-pill`)
8. `--clr-hinomaru` é **reservado**: cena final, selo e ênfase crítica. Nunca botão de rotina
9. `--clr-matcha` marca origem/natureza (plantação, colheita, entrega); `--clr-copper` é o acento de trabalho
10. Áudio sempre inicia mudo — só toca após ação explícita do visitante

---

## Padrões implementados na landing page (ainda não formalizados como componentes)

| Padrão | Onde | Notas |
|---|---|---|
| Motor de scroll-scrub | Global | Rolagem → `video.currentTime`, suavizado por rAF |
| Emenda travada por quadro | Entre cenas | Último quadro do clipe = primeiro do seguinte, extraído do render real |
| Crossfade de emenda | Entre cenas | Dissolvição de poucos quadros absorve diferenças mínimas |
| Blob seeking | Global | Clipes buscados como Blob → object URL (sempre seekable) |
| Linger por cena | Cenas hero/final | Remapeia o tempo para a câmera assentar onde a cópia aparece |
| Camada de áudio ambiente | Global | Trilha contínua + som por cena, crossfade atrelado à seção ativa |
| Botão de som | Global | Pastilha inferior-esquerda; inicia mudo (política de autoplay) |
| Trilho de rota | Global | Marcadores verticais à direita com rótulo no hover/ativo |
| Troca de versão | Global | Pastilha de link entre a versão final (Veo) e a `/draft` |

> Todos reutilizam os tokens existentes (cobre, umbre, matcha, `--ease-fold`, cantos amaciados). Quando estabilizarem, considere promovê-los a seções formais do DS.
