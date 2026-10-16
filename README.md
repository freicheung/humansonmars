# Humans on Mars

Source for humansonmars.info: an English-first guide to life on Mars with interactive tools.

- Static site built with [Astro](https://astro.build); hosted on Firebase Hosting.
- Tool calculations live in `src/lib/` and are covered by `tests/` (acceptance cases from the project plan).
- No accounts, no database, no generative API calls. Tool inputs never leave the browser.

## Develop

```sh
npm install
npm run dev      # local server
npm test         # calculation tests
npm run build    # static site in dist/
```

## Deploy

GitHub Actions builds every pull request and push. Deployment runs once the repository has:

- variable `FIREBASE_PROJECT_ID`: the Google Cloud / Firebase project id
- secret `FIREBASE_SERVICE_ACCOUNT`: a service account key with the Firebase Hosting Admin role

Pull requests then get a preview URL; merges to `main` go live. Roll back from the Firebase console (Hosting → release history).
