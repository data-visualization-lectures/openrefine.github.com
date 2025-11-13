OpenRefine.org website
======================

We use [Docusaurus](https://docusaurus.io/) for our website.

If you want to run it locally, you can follow the instructions below, otherwise you should be able to edit most pages directly with a Markdown editor or IDE.
Opening a pull request for your changes will generate a preview on Netlify that you can browse to check the rendering.

### Requirements

Building the website requires [Node.js (LTS recommended)](https://nodejs.org/en/download/), which includes the `npm` package manager.

### Installation

Once you have installed Node, which includes the npm package manager, we can install and set-up the dependencies:

```sh
npm install
```

### Local Development

The following command starts a local development server and opens up a browser window. Usually at the URL <http://localhost:3000>.

Most changes you make to pages and content are reflected live without having to restart the server.

```sh
npm run start
```

### Build

The following command generates static content into the `build` directory and can be served using any static contents hosting service.

```sh
npm run build
```

### (Optional) Test Build Locally
You can locally test ([with parameters](https://docusaurus.io/docs/cli#docusaurus-serve-sitedir)) the static content in the `build` directory (in case you don't have access to a hosting service) by using:

```sh
npm run serve
```

### Deployment

#### Netlify (recommended)

Netlify automatically builds and deploys this repository via `netlify.toml`.

1. In Netlify, create a new site from Git and point it to this repo + the `master` branch.
2. Netlify will pick up the `build` command and publish directory from `netlify.toml` (`npm run build` and `build/`). No extra environment variables are required because the site’s default `baseUrl` is `/`.
3. Optional tweaks:
   - Set `NODE_VERSION` (e.g. `20`) in the Netlify UI to lock the runtime.
   - Add a custom domain and, if needed, configure redirects or headers in `netlify.toml`.
4. Every push to `master` triggers a production deployment; pull requests get deploy previews automatically.

#### Manual deployment

If you need to publish from your machine (for example when testing a hotfix), run (requires the [Netlify CLI](https://docs.netlify.com/cli/get-started/)):

```sh
npm run build
netlify deploy --dir=build --prod
```

or any other static hosting service that can serve the generated `build/` folder.

### License

This website is published under the [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
