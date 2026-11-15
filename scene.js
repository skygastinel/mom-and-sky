/* =========================================================
   PAINTED LAKE (intro background) + ENVELOPE
   Impressionist "morning haze" scene drawn from brush dabs.
   The scene is authored on a 680 x 440 canvas and scaled to
   cover the window. Static layers are painted once into an
   offscreen canvas; willow, swans, water and fountain animate.
   ========================================================= */
(() => {
  const P = { seed: 19, S: 1.7, al: .38, jit: 8, den: .55, wl: 50, haze: .25, ns: 58 };
  const W = 680, H = 440, HZ = 252;
  const cv = document.getElementById("scene");
  const ctx = cv.getContext("2d");
  const bg = document.createElement("canvas");
  const b = bg.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let vw, vh, dpr, sc, ox, oy, portrait, leaf = 1, stride = 2, strandCount = 58;
  let sd;
  const r = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const col = (p, j = P.jit) => {
    const c = hx(p[(r() * p.length) | 0]);
    return "rgb(" + c.map(v => Math.max(0, Math.min(255, v + (r() - .5) * j * 2)) | 0).join(",") + ")";
  };
  const dab = (g, x, y, w, h, a, c, al) => {
    g.globalAlpha = al; g.fillStyle = c; g.beginPath();
    g.ellipse(x, y, Math.max(.5, w), Math.max(.5, h), a, 0, 6.283); g.fill();
  };
  const S = P.S, D = P.den, A = P.al;
  const pal = {
    sky: ["#E9EBE6", "#DADDD6", "#E5E4DB", "#D3D9D6", "#EEEFEA"],
    far: ["#9DB08A", "#8AA275", "#B4C29E", "#7C9469", "#A7B88F", "#C2CCAE"],
    mid: ["#5F7A4C", "#6E8A57", "#4E6740", "#7E9963", "#8FA870"],
    wil: ["#9FBF62", "#B5CF78", "#8AAE52", "#C3D78E", "#7A9C48"],
    wat: ["#B6BDB1", "#8D978B", "#C5CBC0", "#A7B4A3", "#99A596"],
    ref: ["#8C9C80", "#7E8F72", "#97A58B", "#6F8364"],
    grass: ["#8DB05A", "#7EA24C", "#A2C06B", "#6D9042", "#B3CC7E"],
    trunk: ["#3B3530", "#4A423A", "#2E2A26", "#5A5048"]
  };
  const ft = x => HZ - 38 - 20 * (.5 + .5 * Math.sin(x * .021 + 1.3)) - 10 * Math.sin(x * .057 + .4) - 5 * Math.sin(x * .13);
  const mt = x => HZ - 12 - 10 * (.5 + .5 * Math.sin(x * .035 + 2)) - 6 * Math.sin(x * .09) - (x > 580 ? (x - 580) * .9 : 0);
  const by = x => H - (H - 342) * Math.pow(Math.max(0, x - 240) / 440, .6);
  const bz = (t, p) => { const u = 1 - t; return u * u * u * p[0] + 3 * u * u * t * p[1] + 3 * u * t * t * p[2] + t * t * t * p[3]; };

  /* ---------- Static painting ---------- */
  function paintBackground() {
    sd = P.seed;
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.clearRect(0, 0, bg.width, bg.height);
    b.setTransform(sc * dpr, 0, 0, sc * dpr, ox * dpr, oy * dpr);
    const region = (top, bot, fill) => {
      b.globalAlpha = 1; b.fillStyle = fill; b.beginPath(); b.moveTo(0, top(0));
      for (let x = 0; x <= W; x += 4) b.lineTo(x, top(x));
      for (let x = W; x >= 0; x -= 4) b.lineTo(x, bot(x));
      b.fill();
    };
    // sky
    b.globalAlpha = 1; b.fillStyle = "#E1E3DD"; b.fillRect(0, 0, W, HZ);
    for (let i = 0; i < 1400 * D; i++) dab(b, r() * W, r() * HZ, (8 + r() * 14) * S, (3 + r() * 4) * S, (r() - .5) * .5, col(pal.sky), A * .7);
    // far trees
    region(ft, () => HZ, "#9AAD87");
    for (let i = 0; i < 3000 * D; i++) { const x = r() * W, t = ft(x), y = t - 2 + r() * (HZ - t + 2); dab(b, x, y, (3 + r() * 6) * S, (2.5 + r() * 4) * S, r() * 3, col(pal.far), A); }
    b.globalAlpha = P.haze; b.fillStyle = "#EEF0EB"; b.fillRect(0, 0, W, HZ);
    // bridge
    b.globalAlpha = .85; b.strokeStyle = "#55594F"; b.lineWidth = 2.6;
    b.beginPath(); b.moveTo(36, HZ - 1); b.quadraticCurveTo(78, HZ - 22, 120, HZ - 1); b.stroke();
    b.lineWidth = 1; b.beginPath(); b.moveTo(40, HZ - 6); b.quadraticCurveTo(78, HZ - 26, 116, HZ - 6); b.stroke();
    // near trees
    region(mt, () => HZ, "#6E8A5A");
    for (let i = 0; i < 2600 * D; i++) { const x = r() * W, t = mt(x), y = t - 2 + r() * (HZ - t + 2); dab(b, x, y, (3 + r() * 6) * S, (2.5 + r() * 4) * S, r() * 3, col(pal.mid), A); }
    b.globalAlpha = P.haze * .5; b.fillStyle = "#EEF0EB"; b.fillRect(0, HZ - 60, W, 60);
    // pavilion
    const pv = (x, y, w, h, c) => { b.globalAlpha = 1; b.fillStyle = c; b.fillRect(x, y, w, h); };
    pv(466, HZ - 7, 124, 5, "#D5D7CF"); pv(480, HZ - 24, 92, 17, "#7E3F33");
    for (let x = 484; x < 570; x += 7) dab(b, x, HZ - 16, 1.6, 5, 0, col(["#B98C7A", "#C9A08C", "#8E5446"]), .8);
    b.globalAlpha = 1; b.fillStyle = "#3F423D"; b.beginPath();
    b.moveTo(470, HZ - 22); b.lineTo(486, HZ - 37); b.lineTo(566, HZ - 37); b.lineTo(582, HZ - 22); b.fill();
    for (let i = 0; i < 60; i++) dab(b, 476 + r() * 100, HZ - 35 + r() * 12, 2, 1.4, 0, col(["#4A4D47", "#35382F", "#5A5D55"]), .7);
    [458, 471].forEach(x => {
      b.globalAlpha = 1; b.strokeStyle = "#555"; b.lineWidth = 1; b.beginPath(); b.moveTo(x, HZ - 15); b.lineTo(x, HZ - 6); b.stroke();
      for (let i = 0; i < 8; i++) dab(b, x - 4 + r() * 8, HZ - 16 + r() * 3, 2.2, 1.6, 0, col(["#C0433A", "#D45A4E"]), .9);
    });
    b.globalAlpha = P.haze * .6; b.fillStyle = "#EEF0EB"; b.fillRect(440, HZ - 40, 160, 40);
    // water
    b.globalAlpha = 1; b.fillStyle = "#A0A99D"; b.fillRect(0, HZ, W, H - HZ);
    for (let i = 0; i < 1800 * D; i++) { const x = r() * W, d = r() * (HZ - ft(x)) * .9, y = HZ + d; dab(b, x, y, (6 + r() * 10) * S, (1.2 + r() * 2) * S, 0, col(pal.ref), Math.max(0, A * .7 * (1 - d / 80))); }
    for (let i = 0; i < 120 * D; i++) dab(b, 470 + r() * 115, HZ + 2 + r() * 30, (4 + r() * 8) * S, 1.3 * S, 0, col(["#7A4A40", "#5B4A44", "#9C7466"]), .35);
    for (let i = 0; i < 2600 * D; i++) { const x = r() * W, y = HZ + 4 + r() * (H - HZ); dab(b, x, y, (8 + r() * P.wl) * S, (1 + r() * 1.6) * S, (r() - .5) * .05, col(pal.wat), A * .75); }
    // grass bank
    region(by, () => H, "#86A856");
    for (let i = 0; i < 2600 * D; i++) { const x = 240 + r() * 440, t = by(x); if (t >= H) continue; const y = t - 1 + r() * (H - t + 1); dab(b, x, y, (3 + r() * 6) * S, (1.5 + r() * 3) * S, -.4 + r() * .8, col(pal.grass), A + .1); }
    for (let x = 240; x < W; x += 3) dab(b, x, by(x) + 1, 3 * S, 1.6 * S, -.3, col(["#5E7D3B", "#4F6B32", "#6C8A47"]), .7);
    for (let i = 0; i < 70; i++) { const x = 300 + r() * 380, t = by(x); if (t >= H - 6) continue; dab(b, x, t + 4 + r() * (H - t - 4), 1.4, 1, r() * 3, "#F1F1EC", .85); }
    // willow trunk + branches
    const tr = [[678, 660, 646, 662], [-5, 90, 190, 350]];
    for (let t = 0; t <= 1; t += .004) { const x = bz(t, tr[0]), y = bz(t, tr[1]), w = 7 + t * 4; for (let k = 0; k < 3; k++) dab(b, x + (r() - .5) * w * 1.4, y, (2 + r() * 3), (3 + r() * 4), 0, col(pal.trunk), .85); }
    [[[668, 600, 500, 400], [30, 12, 22, 4], 3], [[662, 610, 545, 490], [80, 66, 70, 52], 2.2]].forEach(([px, py, w]) => {
      for (let t = 0; t <= 1; t += .006) dab(b, bz(t, px), bz(t, py), w * .9, w * .7, 0, col(pal.trunk), .85);
    });
    b.globalAlpha = 1;
  }

  /* ---------- Animated elements (generated once) ---------- */
  sd = 7331;
  const strands = [];
  for (let i = 0; i < 92; i++) {   // extra strands are used on large screens
    const x0 = 290 + r() * 395, y0 = 2 + Math.max(0, x0 - 380) * .14 + r() * 14;
    let L = 70 + r() * 200; if (x0 < 450) L = Math.min(L, 138 - y0);
    const n = Math.max(8, L / (1.6 * S)) | 0, ds = [];   // dense; thinned on small screens
    for (let j = 0; j < n; j++) ds.push([j / n, (r() - .5) * 4 * S, (1.1 + r() * 1.3) * S, (3 + r() * 3.5) * S, col(pal.wil), (r() - .5) * .5]);
    strands.push({ x0, y0, L, k: (r() - .5) * 14, ph: r() * 6.28, f: .22 + r() * .2, ds, d: 0, v: 0 });
  }
  const reeds = [];
  for (let i = 0; i < 14; i++) { const x = 560 + i * 7 + r() * 5; reeds.push({ x, y: by(x) + 6, h: 40 + r() * 45, ph: r() * 6.28, c: col(["#7E9A55", "#A7B97A", "#6C8A48"]) }); }
  const shim = [];
  for (let i = 0; i < 34; i++) shim.push({ x: r() * W, y: HZ + 10 + r() * (H - HZ - 20), w: (10 + r() * 24) * S, ph: r() * 6.28 });
  const fd = [];
  for (let i = 0; i < 26; i++) fd.push([-22 + r() * 48, -13 + r() * 11, 2 + r() * 3, 1 + r() * 1.2, (r() - .5) * .6, col(["#2E2E2E", "#3A3A3A", "#262626"])]);

  const body = new Path2D("M-28 0 C-30 -10 -18 -16 0 -15 C14 -14 26 -16 34 -26 C31 -12 35 -4 28 0 Z");
  const neck = new Path2D("M-20 -8 C-28 -20 -17 -34 -24 -46");
  const beak = new Path2D("M-29 -48.5 L-39 -44.5 L-29 -44 Z");
  function swan(x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.globalAlpha = .2; ctx.fillStyle = "#2a2f28"; ctx.beginPath(); ctx.ellipse(2, 4, 36, 4, 0, 0, 6.283); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = "#1A1A1A"; ctx.fill(body);
    fd.forEach(([a, c2, w, h, an, cc]) => { ctx.globalAlpha = .8; ctx.fillStyle = cc; ctx.beginPath(); ctx.ellipse(a, c2, w, h, an, 0, 6.283); ctx.fill(); });
    ctx.globalAlpha = 1; ctx.strokeStyle = "#1A1A1A"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.stroke(neck);
    ctx.fillStyle = "#1A1A1A"; ctx.beginPath(); ctx.arc(-26, -47, 4.2, 0, 6.283); ctx.fill();
    ctx.fillStyle = "#C93A2E"; ctx.fill(beak);
    ctx.restore();
  }

  /* ---------- Layout: cover the window ---------- */
  function layout() {
    vw = innerWidth; vh = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    sc = Math.max(vw / W, vh / H);
    portrait = vw < vh;
    const focusX = portrait ? 340 : W / 2;           // portrait: keep swans + edge of the willow in view
    leaf = 1 / Math.max(1, sc / 1.25);               // finer leaves when the painting is scaled up
    stride = leaf < .8 ? 1 : 2;                      // and more of them
    strandCount = sc > 1.3 ? 92 : P.ns;
    ox = Math.min(0, Math.max(vw - W * sc, vw / 2 - focusX * sc));
    oy = (vh - H * sc) / 2;
    cv.width = bg.width = Math.round(vw * dpr);
    cv.height = bg.height = Math.round(vh * dpr);
    paintBackground();
  }
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { layout(); if (reduce) frame(0); }, 150); });
  layout();

  /* ---------- Pointer → willow ---------- */
  const zoomNow = () => { const t = getComputedStyle(cv).transform; return t && t !== "none" ? new DOMMatrix(t).a : 1; };
  const M = { x: -999, y: -999, vx: 0, vy: 0, in: false };
  addEventListener("pointermove", e => {
    if (e.target.closest && e.target.closest(".paper")) { M.in = false; return; }
    const z = zoomNow(), zx = vw / 2, zy = vh * .45;              // undo the focus-pull zoom
    const cxp = zx + (e.clientX - zx) / z, cyp = zy + (e.clientY - zy) / z;
    const x = (cxp - ox) / sc, y = (cyp - oy) / sc;
    if (M.in) { M.vx = M.vx * .5 + (x - M.x) * .5; M.vy = M.vy * .5 + (y - M.y) * .5; }
    M.x = x; M.y = y; M.in = true;
  });
  document.addEventListener("pointerleave", () => { M.in = false; });

  /* ---------- Frame ---------- */
  const letter = document.getElementById("letter");
  window.__sceneVisible = true;
  function frame(ms) {
    const visible = scrollY < letter.offsetTop + letter.offsetHeight || window.__loopOn === true;   // also live behind the closing photo
    window.__sceneVisible = visible;
    if (!visible) return;
    const t = ms / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(sc * dpr, 0, 0, sc * dpr, ox * dpr, oy * dpr);
    // fountain
    [[200, 56], [213, 36]].forEach(([x, h], k) => {
      const hh = h * (1 + .06 * Math.sin(t * 3 + k));
      for (let j = 0; j < 16; j++) dab(ctx, x + Math.sin(j * 1.7 + t * 4) * 1.3 * (j / 16), HZ - hh * j / 16, 1.8, 3.5, 0, "#F3F5F1", .4);
    });
    dab(ctx, 206, HZ - 4, 26, 8, 0, "#F3F5F1", .35);
    // water shimmer
    shim.forEach(s => dab(ctx, s.x + Math.sin(t * .4 + s.ph) * 6, s.y, s.w, 1.1 * S, 0, "#D4DAD0", .2 + .3 * (.5 + .5 * Math.sin(t * .8 + s.ph))));
    // swans: one adult, one smaller trailing behind
    const bx = (portrait ? 300 : 250) + (portrait ? 18 : 38) * Math.sin(t * .15);
    swan(bx, 368 + Math.sin(t * 1.9) * 1.2, 1.15);
    swan(bx + (portrait ? 58 : 70) + 6 * Math.sin(t * .32 + 1), 386 + Math.sin(t * 2.3 + .6), .68);
    // reeds
    reeds.forEach(e => {
      ctx.globalAlpha = .8; ctx.strokeStyle = e.c; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(e.x, e.y);
      ctx.quadraticCurveTo(e.x - 2, e.y - e.h * .6, e.x + Math.sin(t * .6 + e.ph) * 4, e.y - e.h); ctx.stroke();
    });
    // willow: slow breeze + soft spring response to the cursor
    const speed = Math.min(14, Math.abs(M.vx) + Math.abs(M.vy) * .3);
    for (let si = 0; si < strandCount; si++) {
      const s = strands[si];
      if (M.in && M.y > s.y0 && M.y < s.y0 + s.L + 8) {
        const cx = s.x0 + s.k * .5 + s.d * ((M.y - s.y0) / s.L) ** 2, dx = Math.abs(M.x - cx);
        if (dx < 36) {
          const fall = (1 - dx / 36) * ((M.y - s.y0) / s.L + .3);
          s.v += Math.max(-3, Math.min(3, M.vx)) * .035 * fall + (Math.sign(cx - M.x) || 1) * speed * .004 * fall;
        }
      }
      s.v += -s.d * .0045; s.v *= .985; s.d += s.v; s.d = Math.max(-36, Math.min(36, s.d));
      const sw = 6 * Math.sin(t * s.f + s.ph) + 2.5 * Math.sin(t * .17 + s.x0 * .02) + s.d;
      for (let j = 0; j < s.ds.length; j += stride) {
        const [tt, ox2, w, h, c, a] = s.ds[j], e2 = tt * tt;
        dab(ctx, s.x0 + s.k * Math.sin(tt * 3.14) + sw * e2 + ox2 * leaf, s.y0 + s.L * tt - Math.abs(s.d) * e2 * .12, w * leaf, h * leaf, a + sw * .03 * tt, c, Math.min(1, A + .3));
      }
    }
    M.vx *= .85; M.vy *= .85; ctx.globalAlpha = 1;
  }
  if (reduce) frame(0);
  else { const loop = ms => { frame(ms); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  if (reduce) addEventListener("scroll", () => frame(0), { passive: true });

  /* ---------- Envelope + letter ----------
     One travelling sheet does all the moving, using only transform + clip-path.
     Handoffs (envelope letter <-> sheet <-> page) happen only when everything is at rest
     and the two look identical, so they can't be seen. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  scrollTo(0, 0);
  const env = document.getElementById("env");
  const eLetter = env.querySelector(".e-letter");
  const sheet = document.getElementById("sheet");
  const sCurl = sheet.querySelector(".sheet-curl");
  const veil = document.getElementById("veil");
  const paper = document.getElementById("paper");
  const paperWrap = paper.parentElement;
  const wait = ms => new Promise(res => setTimeout(res, ms));
  const IO = "cubic-bezier(.65,0,.35,1)", OUT = "cubic-bezier(.22,.61,.36,1)";
  const ZOOM = 1.06, DIM = .2, GROW = 1150;
  const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const CURL = 2.25 * remPx, PEEL = 5 * remPx;
  let busy = false;

  // Sheet = the page's top, as tall as the screen below the top margin.
  function geom() {
    const T = parseFloat(getComputedStyle(letter).paddingTop);
    const W = paper.offsetWidth;
    const lr = letter.getBoundingClientRect();
    const L = lr.left + (letter.clientWidth - W) / 2;
    const H = Math.max(innerHeight - T + 6, 200);
    const tilt = parseFloat((getComputedStyle(document.documentElement).getPropertyValue("--tilt-sm") || "1deg")) * -.5;
    Object.assign(sheet.style, { left: L + "px", top: T + "px", width: W + "px", height: H + "px" });
    return { T, W, L, H, tilt };
  }
  // The envelope letter's box when fully slid out (measured with the envelope at rest, not mid-transition).
  function letterOutBox() {
    const sent = env.classList.contains("sent");
    env.classList.add("measure"); env.classList.remove("sent");
    const r = eLetter.getBoundingClientRect();
    if (sent) env.classList.add("sent");
    void env.offsetWidth; env.classList.remove("measure");
    return r;
  }
  // Same transform function list in every state so they interpolate cleanly.
  const tf = (g, x, y, a, s) => `translate(${x}px, ${y}px) translate(${g.W / 2}px, 0px) rotate(${a}deg) translate(${-g.W / 2}px, 0px) scale(${s})`;
  const atLetter = (g, r) => tf(g, r.left - g.L, r.top - g.T, 0, r.width / g.W);
  const atPage = g => tf(g, 0, 0, g.tilt, 1);
  const clip = (g, h, c) => `polygon(0px 0px, ${g.W - c}px 0px, ${g.W}px ${c}px, ${g.W}px ${h}px, 0px ${h}px)`;
  const shutH = (g, r) => r.height / (r.width / g.W);           // shows exactly the envelope letter's proportions
  // Every animation also resolves on a timer, so a stalled animation can never leave the letter hidden.
  const anim = (el, kf, dur, easing = IO) => Promise.race([
    el.animate(kf, { duration: dur, easing, fill: "forwards" }).finished.catch(() => {}),
    wait(dur + 250)
  ]);
  const clear = (...els) => els.forEach(el => el.getAnimations().forEach(a => a.cancel()));

  function showPage() {
    document.body.classList.remove("locked");
    document.body.classList.add("opened");
    paperWrap.classList.remove("away");
    scrollTo(0, letter.offsetTop);
  }

  async function openLetter() {
    if (busy || env.classList.contains("open")) return;
    busy = true;
    if (reduce) { env.classList.add("open", "out", "sent"); showPage(); paperWrap.classList.remove("away"); busy = false; return; }

    try {
    // 1. flap lifts and tucks behind; the letter slides all the way out
    env.classList.add("open");
    await wait(480);
    env.classList.add("out");
    await wait(760);

    // 2. at rest: the sheet takes the letter's exact place
    const g = geom(), r = letterOutBox(), h0 = shutH(g, r);
    clear(sheet, sCurl);
    sheet.style.transform = atLetter(g, r);
    sheet.style.clipPath = clip(g, h0, 0);
    sheet.classList.add("on");
    env.classList.add("gone");

    // 3. focus pull: painting eases in and dims, envelope sinks away, sheet grows into the page
    anim(cv, [{ transform: "scale(1)" }, { transform: `scale(${ZOOM})` }], GROW);
    anim(veil, [{ opacity: 0 }, { opacity: DIM }], GROW);
    env.classList.add("sent");
    anim(sCurl, [{ width: "0px", height: "0px" }, { width: "0px", height: "0px", offset: .78 }, { width: CURL + "px", height: CURL + "px" }], GROW);
    await anim(sheet, [
      { transform: atLetter(g, r), clipPath: clip(g, h0, 0) },
      { clipPath: clip(g, g.H, 0), offset: .78 },
      { transform: atPage(g), clipPath: clip(g, g.H, CURL) }
    ], GROW);

    // 4. at rest: the real page fades in underneath (with its shadow), then the sheet steps aside
    showPage();
    paperWrap.classList.remove("away");
    await wait(440);
    } catch (err) {
      console.error(err);
    } finally {
      // whatever happened above, she always ends up looking at the letter
      if (!document.body.classList.contains("opened")) showPage();
      paperWrap.classList.remove("away");
      sheet.classList.remove("on");
      busy = false;
    }
  }

  async function closeLetter() {
    if (busy || !document.body.classList.contains("opened")) return;
    busy = true;
    const toStart = () => {
      document.body.classList.remove("opened", "folding");
      document.body.classList.add("locked");
      scrollTo(0, 0);
      dispatchEvent(new Event("letter:reset"));
    };
    if (reduce) {
      toStart(); paperWrap.classList.add("away");
      env.classList.remove("open", "out", "gone", "sent"); clear(cv, veil); busy = false; return;
    }

    // 1. back to the top of the letter; the words lift off and the corner peels further
    if (Math.abs(scrollY - letter.offsetTop) > 4) { scrollTo({ top: letter.offsetTop, behavior: "smooth" }); await wait(650); }
    document.body.classList.add("folding");
    await wait(470);

    // 2. at rest: the sheet (peeled, no words) takes the page's place; the page fades out beneath
    const g = geom();
    clear(sheet, sCurl);
    sheet.style.transform = atPage(g);
    sheet.style.clipPath = clip(g, g.H, PEEL);
    sCurl.style.width = sCurl.style.height = PEEL + "px";
    sheet.classList.add("on");
    paperWrap.classList.add("away");
    await wait(140);

    // 3. the opening screen returns underneath (painting is fixed, so nothing visibly jumps)
    toStart();
    const r = letterOutBox(), h0 = shutH(g, r);

    // 4. sheet shrinks back onto the envelope, curl relaxing flat; painting un-dims; envelope rises back
    anim(cv, [{ transform: `scale(${ZOOM})` }, { transform: "scale(1)" }], GROW);
    anim(veil, [{ opacity: DIM }, { opacity: 0 }], GROW);
    setTimeout(() => env.classList.remove("sent"), 380);
    anim(sCurl, [{ width: PEEL + "px", height: PEEL + "px" }, { width: "0px", height: "0px", offset: .3 }, { width: "0px", height: "0px" }], GROW);
    await anim(sheet, [
      { transform: atPage(g), clipPath: clip(g, g.H, PEEL) },
      { clipPath: clip(g, g.H, 0), offset: .3 },
      { transform: atLetter(g, r), clipPath: clip(g, h0, 0) }
    ], GROW);

    // 5. at rest: hand back to the envelope's own letter, slide it in, close the flap, settle
    env.classList.remove("gone");
    sheet.classList.remove("on"); sCurl.style.width = sCurl.style.height = "";
    clear(cv, veil);
    await wait(60);
    env.classList.remove("out");
    await wait(760);
    env.classList.remove("open");
    await wait(540);
    await env.animate(
      [{ transform: "translate(-50%, -50%) scale(1)" }, { transform: "translate(-50%, -50%) scale(.97)", offset: .4 }, { transform: "translate(-50%, -50%) scale(1)" }],
      { duration: 380, easing: OUT }
    ).finished;
    busy = false;
  }

  // Safety net: if any step of an animation fails, still land in a usable state.
  const safeOpen = () => openLetter().catch(() => {
    sheet.classList.remove("on"); env.classList.add("open", "out", "gone", "sent"); showPage(); busy = false;
  });
  const safeClose = () => closeLetter().catch(() => {
    sheet.classList.remove("on"); clear(cv, veil);
    document.body.classList.remove("opened", "folding"); document.body.classList.add("locked"); scrollTo(0, 0);
    paperWrap.classList.add("away"); env.classList.remove("open", "out", "gone", "sent");
    dispatchEvent(new Event("letter:reset")); busy = false;
  });
  // Used by the closing loop (script.js): show the plain painting, then land back on the start screen.
  window.__sceneClear = () => clear(cv, veil);
  window.__toStart = () => {
    if (busy) return false;
    busy = true;
    const root = document.documentElement;
    try {
      root.style.scrollBehavior = "auto";                       // stop any smooth scroll still in flight
      sheet.classList.remove("on"); clear(cv, veil, sheet, sCurl);
      document.body.classList.remove("opened", "folding"); document.body.classList.add("locked");
      scrollTo(0, 0);
      paperWrap.classList.add("away");
      // close the envelope in one step (no flap or letter animating shut), then let it settle in
      env.classList.add("measure");
      env.classList.remove("open", "out", "gone", "sent");
      void env.offsetWidth; env.classList.remove("measure");
      env.blur();
      dispatchEvent(new Event("letter:reset"));
      if (!reduce) env.animate([{ opacity: 0, translate: "0 28px", scale: ".94" }, { opacity: 1, translate: "0 0", scale: "1" }], { duration: 1300, easing: "cubic-bezier(.22,1,.36,1)" });
    } catch (err) { console.error(err); }
    // leftover momentum can nudge the page after the jump: hold it at the top until it settles
    const t0 = performance.now();
    const pin = () => {
      if (!document.body.classList.contains("locked")) { root.style.scrollBehavior = ""; return; }
      if (scrollY !== 0) scrollTo(0, 0);
      if (performance.now() - t0 < 900) requestAnimationFrame(pin); else root.style.scrollBehavior = "";
    };
    requestAnimationFrame(pin);
    busy = false;
    return true;
  };
  env.addEventListener("click", safeOpen);
  env.addEventListener("keydown", e => {
    if (document.body.classList.contains("opened")) return;      // once open, Space and Enter belong to the page again
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); safeOpen(); }
  });
  document.getElementById("curl").addEventListener("click", safeClose);
})();
