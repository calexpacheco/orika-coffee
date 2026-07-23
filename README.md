# ORIKA COFFEE — "unfold the cup"

An immersive **scroll-driven 3D world** for a fictional Japanese boutique coffee brand.
As you scroll, a camera flies continuously through seven origami-paper dioramas — from a
folded hillside plantation to the last blooming paper-lotus cup — with no cuts.

Built with the [scroll-world](https://github.com/oso95/scroll-world) technique: AI-generated
isometric origami scenes + frame-locked camera clips, scrubbed by scroll position. Optional
layered ambient audio (a continuous music bed + a per-scene natural soundscape) toggles on
via the speaker button.

## The journey
Plantation → Harvest → Grain selection → Roasting → The boutique → Delivery → The bar.

## Run locally
It's a static site — serve the folder over HTTP (blob-based video scrubbing needs `http://`,
not `file://`):

```bash
python3 -m http.server 8777
# then open http://localhost:8777
```

Or double-click `serve.command` on macOS.

## Structure
- `index.html` — the page + engine config (sections, copy, theme, audio).
- `scrub-engine.js` — the portable scroll-scrub camera engine.
- `audio-layer.js` — ambient music bed + per-scene soundscape crossfade + sound toggle.
- `assets/` — scene posters (`*.jpg`), clips (`vid/`), and audio (`audio/`).

> Visuals and audio are AI-generated; the coffee brand is fictional.
