# Thanksgiving Planner

A small installable web app (PWA) for planning Thanksgiving dinner on an iPhone.

- **Menu & List** – starts empty and offers three classic starter menus. The menu reads like a restaurant menu; each dish shows how many of its ingredients you own, and expands to a tick-off list of what is still to buy. "Shopping list" combines every dish into one list for the store.
- **Timeline** – a day-by-day cooking schedule from the weekend before through Thanksgiving Day.
- **Ask ChatGPT** – type or tap the mic and speak. Ask cooking questions (conversions, substitutions), or name the dishes you want and it adds them with ingredient lists based on popular versions of each recipe. It edits the menu and timeline directly.

## How it works

Plain HTML, CSS and JavaScript with no build step. Everything is stored in the browser's `localStorage` on the device.

The chat tab calls the OpenAI API straight from the phone. Voice input records with the microphone and transcribes through the same API. Enter your own API key under Settings (the gear); it is saved only on that device and never committed to this repository.

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
