# Canadian Fire Perimeter Atlas

This website bundles the Wildfire Technology Field Guide atlas generated on 2026-10-03. Open `index.html` to explore 13 provinces and territories and seven closer views. The 20 titled PNG exports and their 20 matching `-map.png` crops are included with `manifest.json` and `atlas-data.js`.

Red transparency indicates overlap of recorded 1980-2024 National Fire Database perimeters, not fire risk, burn severity, or ignition density. Coverage differs by jurisdiction and year. A pale area is not evidence that it has never burned.

## Sources

Fire data: Canadian Forest Service. 2021. *Canadian National Fire Database - Agency Fire Data.* Natural Resources Canada, Canadian Forest Service, Northern Forestry Centre, Edmonton, Alberta. [NFDB polygon archive and documentation](https://cwfis.cfs.nrcan.gc.ca/downloads/nfdb/fire_poly/current_version/), edition posted 2026-01-28, downloaded 2026-10-03. Archive SHA-256: `a0373a6dd8e341c3440ed9907f81e8ba6227135dacd9cdc07e4c6af0a59b1b4e`.

Boundaries and labels: Statistics Canada, [2021 cartographic boundaries](https://geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer/0), [population-centre geometries](https://geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer/7), and [2021 Census population-centre counts](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810001101).

See the [portfolio page](../projects/canadian-fire-perimeter-atlas/#data) for the method and coverage gaps.

## Updating the bundle

Regenerate the atlas in the source Field Guide project, then copy its PNGs, `manifest.json`, and `atlas-data.js` together. Keep the site's viewer integration changes: portfolio return link, direct-view hashes, focus handling, accessible toggle controls, and contained map fitting. Verify every overview and close-up before replacing this snapshot. Update the edition/retrieval dates and coverage notes if the source changes.

The portfolio uses responsive WebP copies in `previews/` for the four BC and Alberta titled maps. Regenerate these at 640, 1280, and 1600 pixels square with quality 90 when the PNGs change. They preserve the full image composition; downloads and the zoomable viewer retain the original PNG assets.
