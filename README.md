# Sector

Strategically place tiles to build the greatest galactic empire.

**Players:** 2

**Time:** 15 minutes

[Play Now!](https://skedwards88.github.io/sector/)

![Game icon](images/favicon.png)

---

Do you have feedback or ideas for improvement? [Open an issue](https://github.com/skedwards88/sector/issues/new).

Want more games? Visit [SECT Games](https://skedwards88.github.io/).

![Status](https://github.com/skedwards88/sector/actions/workflows/deploy.yml/badge.svg)

---

This app was built with plain JS/HTML as an exercise to compare to building with React.

`workbox-config.js` was generated with using workbox:
`npm install workbox-cli --save-dev`
`npx workbox wizard`

Then the service worker is generated: `workbox generateSW workbox-config.js` (also saved as `npm run build`). The service worker is automatically updated on every push thorough a GitHub Actions workflow.

Run locally with `npm start`. (Served with express.)
