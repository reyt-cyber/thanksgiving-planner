# Thanksgiving Planner

A small installable web app (PWA) for planning Thanksgiving dinner on an iPhone.

- **Menu & List** – the menu laid out by course, with each dish's ingredients beside it as a tick-off shopping list. "All items" shows one combined list for the store.
- **Timeline** – a day-by-day cooking schedule from the weekend before through Thanksgiving Day.
- **Ask ChatGPT** – ask cooking questions (conversions, substitutions) or tell it to change the menu, ingredients or timeline. It edits the plan directly.

## How it works

Plain HTML, CSS and JavaScript with no build step. Everything is stored in the browser's `localStorage` on the device.

The chat tab calls the OpenAI API straight from the phone. Enter your own API key under Settings (the gear); it is saved only on that device and never committed to this repository.

## Run locally

```bash
npx serve .
```

## Install on an iPhone

Open the deployed site in Safari, tap Share, then **Add to Home Screen**.

## Files

- `index.html`, `styles.css`, `app.js` – the app
- `sw.js`, `manifest.webmanifest`, `icons/` – home-screen install and offline support
- `tools/make-icons.js` – regenerates the icons (`node tools/make-icons.js`)
