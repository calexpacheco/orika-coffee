/* audio-layer.js — ambient audio for scroll-world, no engine changes required.
   One continuous music bed + per-scene soundscape that crossfades as the active
   section changes (detected via the engine's `.is-active` nav class). Starts muted;
   a speaker toggle enables it (browsers block autoplay until a user gesture). */
function mountAudioLayer(opts) {
  const BEDV = opts.bedVolume != null ? opts.bedVolume : 0.26;
  const SCV  = opts.sceneVolume != null ? opts.sceneVolume : 0.5;
  const FADE = 900;

  const bed = new Audio(opts.bed); bed.loop = true; bed.preload = 'auto'; bed.volume = 0;
  const scenes = opts.scenes.map(s => { const a = new Audio(s.src); a.loop = true; a.preload = 'auto'; a.volume = 0; return a; });

  let on = false, active = 0;

  function ramp(el, target, dur, done) {
    if (el._raf) cancelAnimationFrame(el._raf);
    const start = el.volume, t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      try { el.volume = Math.max(0, Math.min(1, start + (target - start) * k)); } catch (e) {}
      if (k < 1) el._raf = requestAnimationFrame(step); else { el._raf = 0; if (done) done(); }
    })(t0);
  }

  function currentActiveFromDOM() {
    const idx = items.findIndex(n => n.classList.contains('is-active'));
    return idx >= 0 ? idx : 0;
  }

  function enable() {
    on = true; btn.classList.add('is-on'); btn.setAttribute('aria-pressed', 'true'); paint();
    active = currentActiveFromDOM();
    bed.play().catch(() => {}); ramp(bed, BEDV, FADE);
    scenes.forEach((a, i) => { a.play().catch(() => {}); ramp(a, i === active ? SCV : 0, FADE); });
  }
  function disable() {
    on = false; btn.classList.remove('is-on'); btn.setAttribute('aria-pressed', 'false'); paint();
    ramp(bed, 0, 400, () => bed.pause());
    scenes.forEach(a => ramp(a, 0, 400, () => a.pause()));
  }
  function setActive(i) {
    if (i === active) return;
    const prev = active; active = i;
    if (!on) return;
    if (scenes[prev]) ramp(scenes[prev], 0, FADE);
    if (scenes[i]) { scenes[i].play().catch(() => {}); ramp(scenes[i], SCV, FADE); }
  }

  // --- toggle button ---
  const btn = document.createElement('button');
  btn.className = 'sw-audio-btn'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle ambient sound'); btn.setAttribute('aria-pressed', 'false');
  const ICON_ON  = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a4 4 0 0 1 0 7"/><path d="M18.5 6a7 7 0 0 1 0 12"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l4 6M21 9l-4 6"/></svg>';
  const label = document.createElement('span'); label.className = 'sw-audio-btn__label';
  const ico = document.createElement('span'); ico.className = 'sw-audio-btn__ico';
  btn.appendChild(ico); btn.appendChild(label);
  function paint() { ico.innerHTML = on ? ICON_ON : ICON_OFF; label.textContent = on ? 'Sound on' : 'Sound off'; }
  paint();
  btn.addEventListener('click', () => (on ? disable() : enable()));

  const css = document.createElement('style');
  css.textContent = `
    .sw-audio-btn{position:fixed;left:20px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:60;
      display:inline-flex;align-items:center;gap:8px;padding:9px 14px 9px 11px;border-radius:999px;cursor:pointer;
      font:600 12.5px/1 var(--sw-font-body,system-ui);letter-spacing:.02em;color:var(--sw-ink,#2B2B28);
      background:color-mix(in srgb,var(--sw-bg,#F2ECDD) 82%,transparent);backdrop-filter:blur(8px);
      border:1px solid color-mix(in srgb,var(--sw-ink,#2B2B28) 16%,transparent);
      box-shadow:0 6px 20px rgba(43,43,40,.12);transition:transform .15s ease,background .2s ease,color .2s ease;}
    .sw-audio-btn:hover{transform:translateY(-1px);}
    .sw-audio-btn.is-on{background:var(--sw-accent,#B87333);color:#fff;border-color:transparent;}
    .sw-audio-btn__ico{display:inline-flex;} .sw-audio-btn__label{white-space:nowrap;}
    @media (max-width:860px){ .sw-audio-btn__label{display:none;} .sw-audio-btn{padding:10px;} }
    @media (prefers-reduced-motion: reduce){ .sw-audio-btn{transition:none;} }`;
  document.head.appendChild(css);
  document.body.appendChild(btn);

  // --- observe the engine's active-section class ---
  const items = [...document.querySelectorAll('.sw-nav__item')];
  const fallbackDots = [...document.querySelectorAll('.sw-route__dot')];
  const watch = items.length ? items : fallbackDots;
  if (watch.length) {
    const mo = new MutationObserver(() => setActive(currentActiveFromDOM()));
    watch.forEach(n => mo.observe(n, { attributes: true, attributeFilter: ['class'] }));
  }
}
