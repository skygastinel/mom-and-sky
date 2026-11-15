/* =========================================================
   LIGHT ORB CURSOR
   A warm glowing orb that follows the mouse with a soft lag,
   leaves a faint trail of drifting light, swells over things
   you can click, and pulses on click.
   Mouse only: touch devices and reduced-motion keep the
   normal cursor.
   ========================================================= */
(() => {
  const fine = matchMedia("(pointer: fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.getElementById("orb");
  if (!fine || reduce) { cv.remove(); return; }

  const ctx = cv.getContext("2d");
  let vw, vh, dpr;
  function size() {
    vw = innerWidth; vh = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr);
  }
  size(); addEventListener("resize", size);

  const HOVER = ".env:not(.open), .curl, a, button, .polaroid";
  const O = { x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0, s: 1, ts: 1, pulse: 0, trail: [], seen: false };

  addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    document.documentElement.classList.add("orb-on");
    O.tx = e.clientX; O.ty = e.clientY; O.ta = 1;
    if (!O.seen) { O.x = O.tx; O.y = O.ty; O.seen = true; }
    O.ts = e.target.closest && e.target.closest(HOVER) ? 1.7 : 1;
  });
  document.addEventListener("pointerleave", () => { O.ta = 0; });
  addEventListener("blur", () => { O.ta = 0; });
  addEventListener("pointerdown", () => { O.pulse = 1; });

  function draw(ms) {
    const t = ms / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);

    const px = O.x, py = O.y;
    O.x += (O.tx - O.x) * .16; O.y += (O.ty - O.y) * .16;
    O.a += (O.ta - O.a) * .08; O.s += (O.ts - O.s) * .1; O.pulse *= .93;

    // Over the painting the light reads on its own; over the cream pages it needs a little more warmth.
    const onScene = window.__sceneVisible !== false;
    const halo = onScene ? [255, 228, 180] : [240, 186, 112];
    const haloA = onScene ? 1 : 1.25;

    // trail
    if (O.a > .05 && Math.hypot(O.x - px, O.y - py) > .4 && O.trail.length < 60) {
      O.trail.push({ x: O.x + (Math.random() - .5) * 6, y: O.y + (Math.random() - .5) * 6, l: 1, r: 1 + Math.random() * 1.6, dx: (Math.random() - .5) * .25, dy: -.15 - Math.random() * .3 });
    }
    ctx.globalCompositeOperation = "lighter";
    O.trail = O.trail.filter(p => (p.l -= .018) > 0);
    O.trail.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      ctx.globalAlpha = p.l * .55 * O.a; ctx.fillStyle = "#FFDFA6";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.l + .3, 0, 6.283); ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";

    if (O.a > .01) {
      const R = 34 * O.s * (1 + .06 * Math.sin(t * 2.2)) * (1 + O.pulse * .8);
      let g = ctx.createRadialGradient(O.x, O.y, 0, O.x, O.y, R);
      g.addColorStop(0, `rgba(255,236,196,${.55 * O.a * haloA})`);
      g.addColorStop(.3, `rgba(${halo},${.24 * O.a * haloA})`);
      g.addColorStop(1, `rgba(${halo},0)`);
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(O.x, O.y, R, 0, 6.283); ctx.fill();

      const cr = 5.5 * (1 + O.pulse * .5);
      g = ctx.createRadialGradient(O.x, O.y, 0, O.x, O.y, cr);
      g.addColorStop(0, `rgba(255,252,238,${O.a})`);
      g.addColorStop(.6, `rgba(255,232,186,${.75 * O.a})`);
      g.addColorStop(1, "rgba(255,220,160,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(O.x, O.y, cr, 0, 6.283); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
