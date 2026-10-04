# scottfoggo.com

Personal website for [scottfoggo.com](https://scottfoggo.com), built with React and Vite.

## Local development

Use Node.js 22 or newer, then install dependencies and start the development server:

```sh
nvm use
npm install
npm run dev
```

## Commands

- `npm run dev` starts the local development server.
- `npm test` runs the test suite once.
- `npm run build` creates an optimized production build in `dist/`.
- `npm run preview` serves the production build locally.

## Canadian Fire Perimeter Atlas

The homepage links to `/projects/canadian-fire-perimeter-atlas/`, a separate Vite HTML entry with its own React page. Both this route and `/atlas/` are real directories in the production build, so direct links work on GitHub Pages without a single-page-app fallback. Links respect `VITE_BASE_PATH` for staging under `/dev/`.

`public/atlas/` bundles the complete historical atlas: 13 jurisdiction overviews, seven close-ups, all 40 PNGs (titled exports and map crops), the browser viewer, and the source manifest. The page uses the titled BC and Alberta exports. Atlas hashes such as `#BC/1` and `#AB/1` open specific close-ups.

These assets were copied from the Wildfire Technology Field Guide's `outputs/atlas/` on October 3, 2026. They use the NFDB archive edition posted January 28, 2026, filtered to 1980-2024. No source archive or absolute local paths are required at runtime. See the page's **Method & coverage** section for attribution and limitations, and `public/atlas/README.md` for asset maintenance.
