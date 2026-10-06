# Focus — "For you" page (static export)

A self-contained build of the Focus prototype's **For you** page. Everything it needs is in
this folder: no backend, no build step, no dev server.

## Hosting it

Serve this folder over HTTP. Any static host works — S3/CloudFront, Netlify, Vercel,
GitHub Pages, nginx, or a Confluence attachment someone unzips and serves locally:

```bash
# from inside this folder
python3 -m http.server 8080
# then open http://localhost:8080
```

Two things make it portable:

- **Asset paths are relative**, so the folder can live at a domain root *or* in a
  subdirectory (`https://example.com/demos/for-you/`) with no rebuild.
- **Routing is hash-based** (`/#/for-you`), so deep links and refreshes resolve in the
  browser. You do **not** need SPA rewrite rules, a custom 404 page, or any server config.

Opening `index.html` straight off the filesystem (`file://`) will *not* work — browsers
block ES modules on that protocol. It has to be served over `http://` or `https://`.

## What works offline

All the page data — focus areas, goals, risks, the insight feed, updates, dashboards,
action items — is served by a mock backend that runs **in the browser**. It intercepts the
app's own `/api/*` calls, so the page is fully interactive with no network dependency.

State you create while clicking around (read/unread, created or deleted insights,
customised feed) is held in the browser and resets on a hard reload.

## What degrades

Anything that needed a live model falls back to seeded content, because the AI Gateway
proxy only exists behind `yarn dev`:

- **Create insight** preview shows the seeded sample card and says so, rather than running
  your prompt against a model.
- **Rovo chat** replies come from scripted responses, not a live model.

This is the same behaviour as a deployed Bifrost preview.

## Rebuilding it

From the repo root:

```bash
yarn workspace @prototyping/proto-focus package:export
```

That writes `packages/prototypes/focus/export/dist/` and zips it to
`packages/prototypes/focus/export/focus-for-you.zip`.
