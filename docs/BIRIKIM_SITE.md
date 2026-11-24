# Birikim Site

## What it is

The public face of Birikim at `birikim.app`: a static site on GitHub Pages with the landing page, the legal texts and
the account deletion page the stores require. It also tells iOS and Android which paths on `birikim.app` belong to
the app, so a link to a record opens it in the app.

## The parts

| Part | What it does | Where | More |
|---|---|---|---|
| Pages | Landing, account deletion; the old privacy and KVKK addresses send on to `/legal/` | `index.html`, `delete.html`, `privacy.html`, `kvkk.html` | [`PAGES.md`](PAGES.md) |
| Legal texts | Read in the browser from EFA ID's public route, never kept here | `legal/`, `404.html` | [`PAGES.md`](PAGES.md) |
| iOS association | `applinks` and `webcredentials` for `79S2VKLWU7.app.birikim.mobile`; 13 app paths, the site's images excluded | `.well-known/apple-app-site-association` | [`APP_LINKS.md`](APP_LINKS.md) |
| Android association | `app.birikim.mobile` handles all URLs, with three SHA-256 fingerprints | `.well-known/assetlinks.json` | [`APP_LINKS.md`](APP_LINKS.md) |
| Styles and scripts | SCSS and JavaScript sources, the built CSS and JavaScript, images | `src/`, `dist/` | |
| Release note | `changelog/1.2.0_ios.md` | `changelog/` | |

## Publishing

GitHub Pages serves `main` at `birikim.app` (`CNAME`); `_config.yml` includes `.well-known`, which Jekyll would
otherwise skip. There is no build step in the repository: `dist/` is committed as it is served.

## Rules

- A path the app claims is never renamed; the site never uses a claimed path for its own page.
- A legal text is written and published in the EFA Console (EFA ID › Yasal metinler), never here; the site and the app
  show the same version and SHA-256.
- A new signing certificate's fingerprint goes into `assetlinks.json` before a build signed with it ships.

## Decisions

- **A static site.** Nothing to run or patch; the stores' required pages are plain HTML.
- **The app's paths on the site's domain.** A link in a notification or an email works with or without the app.

## Known gaps

- Files no page uses: the eight screenshots in `assets/*.png`, `dist/webp/v2.0/`, `mail_2.png`,
  `dist/images/play_store.png` and the six feature icons in `src/images/` and `dist/images/`.
- `index.html` keeps a commented-out pricing block with placeholder text, and its footer says © 2022.
- `changelog/1.2.0_ios.md` holds the notes of version 2.0.0.
- `src/` has no build setup (no package file); `dist/` cannot be rebuilt from it here.
