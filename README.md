# Rivane investor deck

The current 14-slide presentation, including its logo, product screenshot, styles, navigation and presenter notes. No dependencies or build step are required.

## Preview

Two branded deck URLs:

- `/rivane/` — the current presentation
- `/rivane-classic/` — the original detailed presentation

The root URL opens `/rivane/`. Legacy `/v1/` and `/v2/` links redirect to the corresponding decks, preserving the slide number.

Serve `dist` locally and open either deck URL. Use the arrow keys to navigate, O for overview, N for notes and F for fullscreen.

## Push to GitHub

Run these commands from this extracted folder if the destination repository is still empty:

```sh
git init -b main
git add .
git commit -m "Add Rivane investor deck"
git remote add origin https://github.com/basithambat/pitchdecks.git
git push -u origin main
```

If the repository already has commits, clone it first, copy these files into the checkout, then commit and push normally. Do not force-push.

## Deploy on Vercel

Import `basithambat/pitchdecks` as a new Vercel project. Keep the repository root as the Root Directory. Select Other for Framework Preset. The included `vercel.json` sets the output directory to `dist` with no install or build step.

Review deployment access settings before sharing. Access protection from the original ChatGPT-hosted site is not included in this static export.

## Editing

- `dist/rivane-classic/index.html`: classic slide content and source notes
- `dist/rivane/index.html`: current slide content
- `dist/style.css`: base styles
- `dist/investor.css`: investor-specific layouts
- `dist/deck.js`: navigation and animation
- `dist/assets/`: logo and synthetic-data product screenshot

This export preserves the current published content and typography.
