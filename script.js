/* ---------- Reveal on scroll ---------- */
document.querySelectorAll(".letter-body p, .signoff, .signature")
  .forEach((el, i) => {
    el.classList.add("reveal");
    // first lines "write in" one after another right after the page unfolds
    if (i < 3) el.style.setProperty("--delay", `${520 + i * 260}ms`);
  });

const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }),
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// When the letter is folded back into the envelope, let it "write in" again next time.
addEventListener("letter:reset", () => {
  document.querySelectorAll(".letter-body .reveal, .signoff, .signature").forEach(el => {
    el.classList.remove("in"); io.observe(el);
  });
});

/* ---------- Cover opens as you scroll through its stage ---------- */
const stage = document.getElementById("cover-stage");
const cover = document.getElementById("book-cover");
const hint  = document.querySelector(".scroll-hint");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = v => Math.min(1, Math.max(0, v));
// easeInOutCubic, matches --ease-in-out in feel
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let ticking = false;
function onScroll() {
  ticking = false;
  const r = stage.getBoundingClientRect();
  const p = clamp(-r.top / (r.height - window.innerHeight));

  // 0 to 0.15 hold closed · 0.15 to 0.75 cover swings open · 0.75 to 1 zoom into the book
  const open = ease(clamp((p - 0.15) / 0.6));
  const zoom = ease(clamp((p - 0.75) / 0.25));

  cover.style.transform = `rotateY(${-open * 165}deg)`;
  stage.style.setProperty("--zoom", zoom);
  if (hint) {
    const L = document.getElementById("letter");
    const reading = window.scrollY + window.innerHeight < L.offsetTop + L.offsetHeight - 40;
    hint.style.opacity = reading ? 1 : 0;
  }
}

if (!reduce) {
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
} else {
  cover.style.transform = "rotateY(-165deg)";
}


/* ---------- Closing loop ----------
   Scroll-driven, one continuous move:
   arriving      the lake photo sits as a card on the page
   0    to 0.14  the card opens to full screen (clip + slow settle)
   0.14 to 0.22  holds
   0.22 to 0.46  dissolves into the painted lake behind it (fade + soften + slight push in)
   0.46 to 1     the painting holds while a hairline fills
   then          back to the start screen, where the envelope settles in

   The hairline is what makes looping deliberate: it can only fill while she is actively scrolling
   down, and never faster than LOOP_FILL_MS for the whole bar. A fling, the End key or a scrollbar
   drag to the bottom is not enough on its own; she has to keep scrolling for a few seconds. */
const LOOP_FILL_MS = 2600;
const loopEl = document.getElementById("loop");
const loopStage = loopEl.querySelector(".loop-stage");
const loopPhoto = document.getElementById("loop-photo");
const loopHint = document.getElementById("loop-hint");
const loopFill = document.getElementById("loop-fill");
const loopCS = getComputedStyle(loopPhoto);
let loopTick = false, looping = false, loopRun = false;
let loopP = 0, loopShown = 0, loopLastY = 0, loopLastT = 0, loopDownAt = -1e9;

const loopDown = () => { loopDownAt = performance.now(); };
window.addEventListener("wheel", e => { if (e.deltaY > 0) loopDown(); }, { passive: true });
window.addEventListener("keydown", e => { if (["ArrowDown", "PageDown", "End", " "].includes(e.key)) loopDown(); });
let loopTouchY = 0;
window.addEventListener("touchstart", e => { loopTouchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener("touchmove", e => { const y = e.touches[0].clientY; if (y < loopTouchY) loopDown(); loopTouchY = y; }, { passive: true });

function loopReset() {
  loopPhoto.style.opacity = 1; loopPhoto.style.filter = "none"; loopPhoto.style.clipPath = ""; loopPhoto.style.transform = "";
  loopStage.classList.remove("open"); loopHint.style.opacity = 0; loopFill.style.transform = "scaleX(0)";
  loopShown = 0; looping = false;
}
// Runs only while the painting is holding: fills (or empties) the hairline, and loops when it is full.
function loopFrame(now) {
  if (!window.__loopOn || looping || loopP < 0.44) { loopRun = false; return; }
  const dt = Math.min(64, now - loopLastT); loopLastT = now;
  const target = clamp((loopP - 0.46) / 0.52);
  if (target < loopShown) loopShown = target;
  else if (now - loopDownAt < 250) loopShown = Math.min(target, loopShown + dt / LOOP_FILL_MS);
  loopFill.style.transform = `scaleX(${loopShown})`;
  loopHint.style.opacity = Math.min(clamp((loopP - 0.44) / 0.05), clamp((1 - loopShown) / 0.08));   // in after the dissolve, out just before the loop
  if (loopShown >= 1 && window.__toStart && window.__toStart()) {
    looping = true; loopRun = false; window.__loopOn = false;
    setTimeout(loopReset, 1400);
    return;
  }
  requestAnimationFrame(loopFrame);
}
function onLoop() {
  loopTick = false;
  const r = loopEl.getBoundingClientRect();
  const on = r.top < window.innerHeight && document.body.classList.contains("opened");
  window.__loopOn = on;
  if (window.scrollY > loopLastY) loopDown();
  loopLastY = window.scrollY;
  if (!on || looping) return;
  const p = loopP = clamp(-r.top / (r.height - window.innerHeight));
  const open = ease(clamp(p / 0.14));
  const melt = ease(clamp((p - 0.22) / 0.24));
  const iy = parseFloat(loopCS.getPropertyValue("--loop-y")) * (1 - open);
  const ix = parseFloat(loopCS.getPropertyValue("--loop-x")) * (1 - open);
  loopPhoto.style.clipPath = `inset(${iy}% ${ix}% round ${8 * (1 - open)}px)`;
  loopPhoto.style.transform = reduce ? "none" : `scale(${1.12 - 0.12 * open + 0.05 * melt})`;
  loopPhoto.style.opacity = 1 - melt;
  loopPhoto.style.filter = reduce || melt === 0 ? "none" : `blur(${(10 * melt).toFixed(2)}px)`;
  loopStage.classList.toggle("open", open >= 1);
  if (melt > 0 && window.__sceneClear) window.__sceneClear();
  if (p < 0.44) { loopHint.style.opacity = 0; loopFill.style.transform = "scaleX(0)"; loopShown = 0; }
  else if (!loopRun) { loopRun = true; loopLastT = performance.now(); requestAnimationFrame(loopFrame); }
}
window.addEventListener("scroll", () => {
  if (!loopTick) { loopTick = true; requestAnimationFrame(onLoop); }
}, { passive: true });
