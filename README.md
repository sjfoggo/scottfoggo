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

The `Build and deploy website` GitHub Actions workflow is the production path:

- Pull requests into `master` must install, test, and build successfully.
- A merge or direct push to `master` repeats those checks and deploys `dist/` to GitHub Pages.
- Manual workflow runs can deploy only when run from `master`.

One repository setting is required when enabling the workflow: under **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.

The legacy `npm run deploy` command is retained temporarily as a rollback path while the Actions migration is being verified.
