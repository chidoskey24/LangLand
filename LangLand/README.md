# LangLand

Basic web app for English ↔ Turkish translation using the free [LibreTranslate](https://libretranslate.com/) API.

## Getting started
1. Open `index.html` in your browser.
2. Type text, choose languages, and click "Translate".

No build step or server required—just static files.

### About the API
LibreTranslate is an open-source project that offers a free public endpoint for demo purposes at `https://libretranslate.de`. For heavy usage or production reliability you should self-host or obtain an API key.

## Project structure
- `index.html` – markup and layout
- `style.css` – styling
- `script.js` – API calls and interaction logic 

## Features
- Instant translation between English and Turkish.
- Swap button to quickly flip source and target languages.
- Copy-to-clipboard button for the translated text.
- Automatic fallback chain: tries three public LibreTranslate instances, then falls back to MyMemory if all fail.
- Footer updates in real time to show which service delivered the result.
- 100 % client-side (static files) – no backend or build step.
- Responsive layout that works on mobile, tablet and desktop.

## How it works
1. When **Translate** is pressed, `script.js` sends a JSON POST request to the first LibreTranslate endpoint (`translate.argosopentech.com`).
2. If the request errors or returns a non-200 status, the code rotates through two additional public instances (`libretranslate.de`, `libretranslate.com`).
3. Should every LibreTranslate host be unreachable the app transparently switches to the free **MyMemory** REST API.
4. Successful responses populate the output textarea and update the footer’s provider link.
5. The **Copy** button uses the Clipboard API to copy the translation and gives visual feedback.

## Running locally
Because browsers block `file://` origins for XHR, serve the folder over HTTP:
```bash
# Option 1 – VS Code Live Server
# Option 2 – tiny npm static server
npx serve LangLand
# Option 3 – Python 3
cd LangLand && python -m http.server 8000
```
Then navigate to the printed URL (e.g. http://localhost:8000).

## Deploying
LangLand is a plain static site, making deployment trivial:
* **GitHub Pages** – push `LangLand/` contents to a `gh-pages` branch.
* **Netlify / Vercel** – drag-and-drop or connect the repo; build command: `N/A`, publish directory: `LangLand`.
* **AWS S3 / Cloudflare Pages** – upload the files as-is.

## Customising / Extending
1. **More languages** – add `<option>` elements to the two `<select>` boxes in `index.html` and update the default values.
2. **Own translation backend** – swap the `API_ENDPOINTS` array in `script.js` with your self-hosted LibreTranslate URL.
3. **Styling tweaks** – edit `style.css`; the project is framework-free.

## Contributing
Pull requests are welcome! Please:
1. Fork and create a descriptive topic branch.
2. Keep the code dependency-free (vanilla JS / CSS).
3. Include a clear description of the change or feature.
4. Run in the browser to ensure no console errors.

## License
This project is licensed under the MIT License – see the `LICENSE` file for details.

## Acknowledgements
* [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) – open-source machine translation.
* [MyMemory](https://mymemory.translated.net/) – free fallback API.
* Everyone who maintains public instances we rely on. 