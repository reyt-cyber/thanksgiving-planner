# Notes for coding agents

This is a static PWA with no build step and no dependencies: `index.html`, `styles.css`, `app.js`, plus `sw.js` and `manifest.webmanifest` for home-screen install.

- It is deployed by GitHub Pages straight from the `main` branch root. Anything merged to `main` goes live at https://reyt-cyber.github.io/thanksgiving-planner/ within a minute or two.
- Keep it dependency-free and framework-free. Do not add a bundler or package.json unless asked.
- The primary target is iPhone Safari in standalone (home-screen) mode: keep inputs at 16px or larger, respect the safe-area insets, and test at 375px wide.
- All user data lives in `localStorage` under the key `tg-planner-v1`. If the shape of `state` changes, keep `load()` backward compatible so an installed copy doesn't lose its menu.
- The OpenAI API key is entered by the user in Settings and stored only on their device. Never hardcode or commit a key.
- Menu and timeline changes go through `setDish`, `removeDish`, `setTask` and `removeTask` in `app.js`; both the edit dialogs and the ChatGPT tools call these, so keep them as the single path.
- Check syntax with `node --check app.js`. Preview with `npx serve .`.
