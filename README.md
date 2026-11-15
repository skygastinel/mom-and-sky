# Mom & Sky · Our Travels

A one-page scrapbook: a handwritten letter → a book cover that opens as you scroll → one section per trip.

## How the page flows
1. **Opening:** a full-screen painted lake (willow, two black swans, fountain, pavilion) with an envelope in the middle. The page can't scroll until the envelope is opened.
2. **Letter:** clicking the envelope opens it and scrolls down to the letter, on lined paper over the painting.
3. **Cover:** keep scrolling and a book cover swings open into the scrapbook.
4. **Scrapbook:** one section per trip, built from `trips.js`.

The cursor is a warm light orb on computers with a mouse; phones and tablets keep normal touch.

## Files
- `index.html` · page structure. **The letter** lives inside `<div class="letter-body">`, one `<p>` per paragraph.
- `trips.js` · **the only file to edit for trips** (place, year, notes, photo list).
- `scene.js` · the painted lake, swans, willow and envelope.
- `orb.js` · the light orb cursor.
- `styles.css` · look and design tokens (top of the file).
- `script.js` · scrapbook builder, reveal-on-scroll, book cover.
- `photos/<trip-folder>/` · your images (e.g. `photos/new-york-2020/1.jpg`).

## Adding a trip
1. Make a folder: `photos/lisbon-2026/`
2. Drop photos in (resize to ~1600px wide first so the page loads fast).
3. Add an entry to `TRIPS` in `trips.js`.

## Preview locally
Double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

## Publish on GitHub Pages
1. Create a new repo on GitHub (e.g. `mom-and-sky`) and upload/push these files.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. Live at `https://<username>.github.io/mom-and-sky/` in about a minute.

### Custom domain (optional)
- Subdomain like `travels.skygastinel.com`: add a **CNAME** DNS record `travels` → `<username>.github.io`, then enter the domain in Settings → Pages → Custom domain and tick *Enforce HTTPS*.
