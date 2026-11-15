/* =========================================================
   SCRAPBOOK: "through the letters"
   Each trip opens with its place name cut out of the page, with
   the trip's first photo showing through. The opening rotates:
     dive  · scroll dives into one letter until the photo fills the screen
     part  · the letters drift apart and the page melts away
     split · the word splits along its middle and the photo opens between
   A trip can choose its own with  transition: "dive" | "part" | "split"
   in trips.js. The rest of the trip's photos and notes follow below.
   ========================================================= */
(() => {
  const MODES = ["dive", "part", "split"];
  const book = document.getElementById("scrapbook");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = v => Math.min(1, Math.max(0, v));
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const pad = n => String(n).padStart(2, "0");
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // letters with a solid vertical stem, and where that stem sits across the letter (for the dive)
  const STEM = { B: .16, D: .16, E: .16, F: .16, H: .14, I: .5, K: .16, L: .16, M: .12, N: .14, P: .16, R: .16, T: .5, U: .14 };

  // cover shows the span of years
  const years = TRIPS.map(t => t.year);
  if (years.length) {
    const lo = Math.min(...years), hi = Math.max(...years);
    document.getElementById("cover-years").textContent = lo === hi ? lo : `${lo} – ${hi}`;
  }

  const shot = (trip, p) => `
    <div class="shot"${p.w && p.h ? ` style="--ar:${p.w} / ${p.h}"` : ""}>
      <img src="photos/${esc(trip.folder)}/${esc(p.file)}"${p.focus ? ` style="object-position:${esc(p.focus)}"` : ""} alt="${esc(p.caption || `${trip.place}, ${trip.year}`)}" loading="lazy" decoding="async">
      <span class="path label">photos/${esc(trip.folder)}/${esc(p.file)}</span>
    </div>`;

  book.innerHTML = TRIPS.map((t, i) => {
    const mode = MODES.includes(t.transition) ? t.transition : MODES[i % MODES.length];
    const first = t.photos[0] || { file: "1.jpg" };
    const opener = t.cover
      ? `<div class="shot"><img src="photos/covers-art/${esc(t.cover)}" alt="${esc(`Painting for ${t.place}`)}" loading="lazy" decoding="async"><span class="path label">photos/covers-art/${esc(t.cover)}</span></div>`
      : shot(t, first);
    const word = mode === "part"
      ? `<span class="word">${[...t.place.toUpperCase()].map(ch => `<span class="ch">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("")}</span>`
      : `<span class="word">${esc(t.place)}</span>`;
    const cut = mode === "split"
      ? `<div class="cut half top">${word}</div><div class="cut half bot">${word}</div>`
      : `<div class="cut">${word}</div>`;
    const rest = t.cover ? t.photos : t.photos.slice(1);
    const dense = rest.length >= 8;                      // long trips use a tighter three-across layout
    const layout = dense ? ["e1", "e2", "e3", "e4", "e5"]
      : (t.notes || []).length ? ["a", "b", "c", "d"] : ["b", "a", "d", "c2", "c"];
    return `
    <section class="chapter" id="${slug(`${t.place}-${t.year}`)}" data-mode="${mode}" style="--tone:${esc(t.color || "#c9d6df")}">
      <div class="zoom">
        <div class="stage">
          ${mode === "split" ? `<div class="photo-wrap">${opener}</div>` : opener}
          ${cut}
          <p class="above label">${pad(i + 1)} · ${esc(t.when || t.year)}${t.cities ? ` · ${esc(t.cities)}` : ""}</p>
          <div class="over">
            <span class="label">${pad(i + 1)} · ${esc(t.when || t.year)}</span>
            <span class="place">${esc(t.place)}</span>
            ${t.cities ? `<span class="label">${esc(t.cities)}</span>` : ""}
            ${!t.cover && first.caption ? `<span class="cap">${esc(first.caption)}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="after${dense ? " dense" : ""}">
        ${(t.notes || []).map((n, k) => `<p class="note reveal" style="--delay:${k * 120}ms">${esc(n)}</p>`).join("")}
        ${rest.map((p, k) => `
          <figure class="${layout[k % layout.length]} reveal" style="--delay:${(k % 2) * 80}ms">
            ${shot(t, p).replace('class="shot"', 'class="shot framed"')}
            ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}
          </figure>`).join("")}
      </div>
    </section>`;
  }).join("");

  // photo loading: fade in when ready, tinted placeholder with the expected path if missing
  book.querySelectorAll(".shot img").forEach(img => {
    const box = img.parentElement;
    const ok = () => box.classList.add("loaded"), bad = () => box.classList.add("missing");
    if (img.complete) (img.naturalWidth ? ok() : bad()); else { img.addEventListener("load", ok); img.addEventListener("error", bad); }
  });

  const chapters = [...book.querySelectorAll(".chapter")].map((sec, i) => {
    const st = sec.querySelector(".stage");
    return {
      sec, st, mode: sec.dataset.mode, trip: TRIPS[i], zoom: sec.querySelector(".zoom"),
      cut: st.querySelector(".cut"), words: [...st.querySelectorAll(".word")],
      chars: [...st.querySelectorAll(".ch")], top: st.querySelector(".top"), bot: st.querySelector(".bot"),
      photo: st.querySelector(".photo-wrap")
    };
  });

  // flight paths for "part" (seeded so they're the same every visit)
  chapters.forEach((c, ci) => {
    let s = ci * 11 + 3; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    c.paths = c.chars.map((_, k) => {
      const side = (k + .5) / c.chars.length - .5;
      return { dx: side * 140 + (r() - .5) * 20, dy: (r() - .5) * 90, rot: (r() - .5) * 50, s: 1.6 + r() * 1.4 };
    });
  });

  // long place names shrink to fit; the dive is aimed at a solid stroke of one letter
  function measure() {
    chapters.forEach(c => {
      c.words.forEach(w => {
        w.style.fontSize = "";
        const max = innerWidth * .92;
        if (w.scrollWidth > max) w.style.fontSize = (parseFloat(getComputedStyle(w).fontSize) * max / w.scrollWidth) + "px";
      });
      if (c.mode !== "dive") return;
      const w = c.words[0], text = w.textContent.toUpperCase();
      let ci = [...text].findIndex(ch => STEM[ch] !== undefined); if (ci < 0) ci = 0;
      const prev = c.cut.style.transform; c.cut.style.transform = "none";
      const range = document.createRange(); range.setStart(w.firstChild, ci); range.setEnd(w.firstChild, ci + 1);
      const lr = range.getBoundingClientRect(), sr = c.st.getBoundingClientRect();
      c.cut.style.transformOrigin = `${lr.left - sr.left + lr.width * (STEM[text[ci]] ?? .5)}px ${lr.top - sr.top + lr.height * .55}px`;
      c.cut.style.transform = prev;
    });
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(measure);
  addEventListener("resize", measure);
  measure();

  if (reduce) { book.classList.add("still"); return; }

  function frame() {
    chapters.forEach(c => {
      const r = c.zoom.getBoundingClientRect();
      if (r.bottom < -innerHeight || r.top > innerHeight * 2) return;      // off screen: skip
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
      if (c.mode === "dive") {
        const d = ease(clamp(p / .75));
        c.cut.style.transform = `scale(${Math.pow(60, d)})`;               // even-paced exponential zoom
        c.cut.style.opacity = 1 - clamp((d - .7) / .25);
        c.st.classList.toggle("moving", d > .02);
        c.st.classList.toggle("done", d > .92);
      } else if (c.mode === "part") {
        const e = ease(clamp(p / .78));
        c.chars.forEach((ch, k) => {
          const q = c.paths[k];
          ch.style.transform = `translate(${q.dx * e}vw, ${q.dy * e}vh) rotate(${q.rot * e}deg) scale(${1 + (q.s - 1) * e})`;
        });
        c.cut.style.opacity = 1 - clamp((e - .25) / .6);
        c.st.classList.toggle("moving", e > .02);
        c.st.classList.toggle("done", e > .95);
      } else {
        const e = ease(clamp(p / .72));
        c.top.style.transform = `translate3d(0, ${-e * 56}vh, 0)`;
        c.bot.style.transform = `translate3d(0, ${e * 56}vh, 0)`;
        c.photo.style.transform = `scale(${1.18 - .18 * e})`;
        c.st.classList.toggle("moving", e > .02);
        c.st.classList.toggle("done", e > .9);
      }
    });
  }
  let queued = false;
  const q = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; frame(); }); } };
  addEventListener("scroll", q, { passive: true });
  addEventListener("resize", q);
  frame();
})();
