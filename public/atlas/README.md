# Canadian Wildfire Atlas

The [portfolio page](../projects/canadian-wildfire-atlas/) combines selected regional images with one continuous, zoomable map of Canada. The former atlas entry redirects to the national map section. The earlier portfolio URL also redirects to the renamed page.

Red transparency indicates overlap of recorded 1980-2024 National Fire Database perimeters, not fire risk, burn severity, or ignition density. Coverage differs by jurisdiction and year. A pale area is not evidence that it has never burned.

## Assets

- `national/`: continuous Canada rendering, WebP overview, PNG overview download, DZI tile pyramid and national manifest. City labels are positioned from the same Statistics Canada geometries and are drawn separately by the viewer to remain legible while zooming.
- `previews/`: responsive regional WebP previews derived from the PNG exports. Files with `-detail-` use the map-only crops; the portfolio hero uses the complete national preview.
- The original 20 titled regional PNGs, 20 matching map crops and `manifest.json` remain available as source exports. They were generated on 2026-10-03.

The regional crops retain the source generator's rendering. The national image reprocesses the entire archive in one pass, merging multipart records by agency, year and fire ID before clipping to Canada. It simplifies geometry by 250 metres for display; image pixels and source generalization limit fine-scale interpretation. Never interpret national and regional incident counts as interchangeable counts of all fires.

## Sources

Fire data: Canadian Forest Service. 2021. *Canadian National Fire Database - Agency Fire Data.* Natural Resources Canada, Canadian Forest Service, Northern Forestry Centre, Edmonton, Alberta. [NFDB polygon archive and documentation](https://cwfis.cfs.nrcan.gc.ca/downloads/nfdb/fire_poly/current_version/), edition posted 2026-01-28, downloaded 2026-10-03. Archive SHA-256: `a0373a6dd8e341c3440ed9907f81e8ba6227135dacd9cdc07e4c6af0a59b1b4e`.

Boundaries and labels: Statistics Canada, [2021 cartographic boundaries](https://geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer/0), [population-centre geometries](https://geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer/7), and [2021 Census population-centre counts](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810001101).

## Updating

Use `scripts/build_national_atlas.py` with the FireStat Python environment, cached Statistics Canada layers, and the archived NFDB download. Start with the static preview, inspect it, then build the high-resolution tile pyramid. Pass a fresh cache directory when changing the source edition or geometry processing. See the repository README for commands. Update source dates and coverage notes when changing editions.

Regional previews are WebP derivatives of the corresponding PNGs, using quality 90. The retained Southern Interior wide crop uses quality 92. Keep the full-resolution PNG downloads intact.
