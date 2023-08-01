# Sector (old)

This is the old build of the Sector game, built as an exercise to learn the difference between building an app with/without React.

[See](https://github.com/skedwards88/sector) and [play](https://skedwards88.github.io/sector) the newer instead.

## Development

This app was built with plain JS/HTML as an exercise to compare to building with React.

`workbox-config.js` was generated with using workbox:
`npm install workbox-cli --save-dev`
`npx workbox wizard`

Then the service worker is generated: `workbox generateSW workbox-config.js` (also saved as `npm run build`). The service worker is automatically updated on every push thorough a GitHub Actions workflow.

Run locally with `npm start`. (Served with express.)
