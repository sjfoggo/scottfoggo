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

## Deployment

The `Build and deploy website` GitHub Actions workflow publishes production and staging together:

- Pull requests into `master` must install, test, and build successfully.
- A push to `master` tests and builds both branches.
- A push to `codex/redesign` requests that same deployment from `master`, keeping GitHub Pages environment protection intact.
- `master` is published to [scottfoggo.com](https://scottfoggo.com).
- `codex/redesign` is built with a `/dev/` asset base and published to [scottfoggo.com/dev/](https://scottfoggo.com/dev/).
- The staging build includes a `noindex, nofollow` robots meta tag and is intentionally public.
- Manual workflow runs can deploy only when run from `master`.

One repository setting is required when enabling the workflow: under **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.

The legacy `npm run deploy` command is retained temporarily as a rollback path while the Actions migration is being verified.
