# Nitin Verma — Portfolio website

A responsive portfolio built with plain HTML, CSS and JavaScript. No framework or build step is required.

## Run locally
1. Extract this folder.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. The navigation swaps between sections; it is intentionally not one long scrolling page.

## Customize
- Profile photo: `assets/nitin-verma.png`
- Resume: `assets/Nitin-Verma-Resume.docx` (replace with a PDF if you prefer)
- Certificate files: `assets/certificates/`
- Page content: `index.html`
- Design: `style.css`
- Navigation, filters and contact form: `script.js`

## Contact form behavior
This is a static site. The form validates fields and opens the visitor's default email application with a pre-filled message addressed to `nitinverma7546@gmail.com`. It does not store submissions or send them automatically. If you want messages saved in a database, connect a backend or Firebase with appropriate security rules; never put private service credentials in frontend JavaScript.

## Publish
You can host this folder on GitHub Pages, Netlify, or another static host. Keep `index.html`, `style.css`, `script.js`, and `assets/` together.
