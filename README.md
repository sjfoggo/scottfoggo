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

## Canadian Wildfire Atlas

The homepage links to `/projects/canadian-wildfire-atlas/`. Its dedicated Vite HTML entry provides the portfolio page and lazily loads an OpenSeadragon national map. The earlier `/projects/canadian-fire-perimeter-atlas/` URL and `/atlas/` entry redirect to the new experience. All paths support staging under `VITE_BASE_PATH=/dev/`.

The page uses a Southern Interior hero and supporting Fort McMurray and Saguenay images. The final map displays one continuous Canada-wide rendering, loading only the image tiles needed for the current view. Touch devices use pinch-to-zoom; desktop users can scroll to zoom. Both support pan, zoom buttons, reset, city labels, keyboard controls and fullscreen.

### Rebuilding the national map

The generator adapts FireStat's NFDB processing, using its cached Statistics Canada geometries and Python dependencies. It needs GeoPandas, Shapely, Matplotlib, pandas, pyogrio, requests and Pillow. Paths below are build-time inputs only; the website bundles its assets and makes no runtime requests to the local source project.

```sh
python scripts/build_national_atlas.py \
  --source-project /path/to/firestat \
  --archive /path/to/NFDB_poly.zip \
  --cache /tmp/canadian-wildfire-atlas-cache \
  --output /tmp/canadian-wildfire-atlas-preview \
  --width 3600
```

Inspect the static PNG first. Then render the final map with `--width 16384 --tiles` into a temporary output folder. Copy its `canada_files/`, `canada.dzi`, `canada-preview.webp`, `canada-preview-800.webp`, `canada-preview.png`, and `national-manifest.json` into `public/atlas/national/`. The large intermediate `canada-map.png` is a build artifact and is not served. Reuse the cache only with the same source snapshot and processing rules.

See `public/atlas/README.md` for provenance, limitations and image maintenance. The national render has finite resolution; it is not a street- or parcel-level map.
