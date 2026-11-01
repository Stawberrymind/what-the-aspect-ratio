# What The Aspect Ratio

See how a film looks on every recent iPad, iPhone, Samsung Galaxy and OnePlus screen, in each of its release formats (IMAX 1.43:1, IMAX 1.90:1, 70mm 2.20:1, Scope 2.39:1, 16:9 …), and which device shows it best.

- **Viewer** — one device, the official trailer inside its screen, every format drawn as a frame line on the glass, plus picture size in inches, share of the screen used, picture pixels and panel.
- **Compare** — up to six devices side by side, optionally at true physical scale.
- **Rankings** — the best iPad, iPhone, Galaxy Tab, Galaxy phone, OnePlus phone and OnePlus Pad for the chosen film and format, with the full scored table.

Every view is a shareable link (state lives in the URL hash).

## How "best" is scored

For a film ratio on a device, the picture rectangle is computed from the screen's real diagonal and native resolution (Fit = letterbox/pillarbox, Fill = crop).

| Lens | What it measures |
|---|---|
| Biggest picture | Physical picture area in square inches, relative to the largest in the set |
| Fills the screen | Share of the glass that is picture rather than bars |
| Image quality | Panel (OLED bars are truly black), sharpness (picture pixels, ppi) and peak brightness |

Balanced = 50% picture size, 20% fill, 30% image quality.

The trailer in each screen is a framing simulation cropped from YouTube's 16:9 master. In cinemas, the taller IMAX formats reveal more image rather than cropping it.

## Develop

```bash
npm install
npm run dev
npx vitest run
npm run build
```

Deploys to GitHub Pages from `main` via `.github/workflows/deploy.yml`.
