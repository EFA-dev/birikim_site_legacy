# birikim_site

Birikim's website at `birikim.app`, served by GitHub Pages: the landing page, the legal texts drawn from EFA ID, the
account deletion page the stores ask for, and the two files that claim the app's paths for universal links.

## What it holds

| Part | What it does |
|---|---|
| `index.html` | The landing page: the App Store and Google Play badges, the app's eight screenshots (`dist/webp/v2.8/`), the modules, contact and KVKK links |
| `legal/` | The legal texts read in the browser from EFA ID's public route (`legal.js`, `legal-config.js` names the address): `/legal/` lists them, `/legal/<slug>/` shows one with its version, what changed, contents, earlier versions and SHA-256; `404.html` draws a slug with no folder yet |
| `privacy.html`, `kvkk.html` | Their old addresses, sent on to `/legal/privacy/` and `/legal/kvkk/` |
| `delete.html` | How to delete a Birikim account, in Turkish |
| `.well-known/apple-app-site-association` | Claims the app's 13 paths (`/incomes`, `/bills/*` … `/inbox/*`) for iOS; the site's images and icons excluded |
| `.well-known/assetlinks.json` | Lets the Android app (`app.birikim.mobile`) handle all URLs, with its three signing certificates' fingerprints |
| `docs/` | The docs; `docs/archive/legal/` keeps the old texts and pages, no longer served as the texts |
| `src/`, `dist/` | The styles (SCSS) and scripts, the built CSS and JavaScript, images |
| `changelog/` | One release note |

## Use

A link such as `https://birikim.app/bills/8f2c` opens the bill in the app when it is installed (the path is one of
`birikim_shared`'s `AppPathManager`), and this site otherwise.

## Stands on, used by

- **Stands on:** GitHub Pages (`CNAME`, `_config.yml` keeps `.well-known`).
- **Used by:** Birikim's users, the App Store and Google Play (privacy and deletion pages), iOS and Android (app links),
  `birikim_mobile`'s link test (reads the iOS file beside the app).

## Run

Pushing to `main` publishes the site. A local look:

```bash
python3 -m http.server 8000
```

## More

- [`docs/BIRIKIM_SITE.md`](docs/BIRIKIM_SITE.md): the parts, publishing, rules, decisions and known gaps.
- [`docs/APP_LINKS.md`](docs/APP_LINKS.md): how the app's paths are claimed and kept in step.
- [`docs/PAGES.md`](docs/PAGES.md): the pages and the legal texts, and where the app reads its own.
