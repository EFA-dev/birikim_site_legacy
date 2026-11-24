# Pages and legal texts

The site's pages, and its legal texts, which are EFA ID's (efaid_api `docs/LEGAL_TEXTS_PLAN.md` YM11).

## The pages

| Page | Language | What it says |
|---|---|---|
| `index.html` | Turkish | "Birikim - Finans Asistanınız": the App Store and Google Play badges, the eight screenshots of version 2.8 (`dist/webp/v2.8/`), the modules and reports, `info@birikim.app`, Twitter and KVKK links |
| `legal/index.html` | Turkish, or `?lang=en` | Every legal document Birikim publishes, each with its version in effect and its date |
| `legal/<slug>/index.html` (`terms`, `privacy`, `kvkk`, `news`) | Turkish, or `?lang=en` | One document: the version in effect and its date, the next version's date, "Neler değişti", the contents, the text, its SHA-256, the earlier versions (`?version=<n>`) |
| `404.html` | Turkish | A `/legal/<slug>` with no folder yet (a new document) is drawn here; any other path says it is not here |
| `privacy.html`, `kvkk.html` | — | The old addresses, sent on to `/legal/privacy/?lang=en` and `/legal/kvkk/` |
| `delete.html` | Turkish | Account deletion: Settings › Account Settings; the account turns passive and is deleted if no sign-in follows in 30 days |

`index.html` loads its animation scripts from unpkg (`animejs@3.0.1`, `scrollreveal@4.0.0`) and its font from Google
Fonts. The legal pages load `marked@12.0.2` and `dompurify@3.1.6` from unpkg.

## The legal texts

The texts, their versions and the record of who saw and accepted what live in EFA ID; they are written and published in
the EFA Console (EFA ID › Yasal metinler). `legal/legal.js` reads `GET /v1/products/birikim/legal?lang=` (and an earlier
version's `GET /v1/products/birikim/legal/<slug>/<version>`) from the address in `legal/legal-config.js`, draws the
Markdown cleaned by DOMPurify, and shows each version's SHA-256, the same the app records. A link document (Apple's
EULA) shows its address. EFA ID allows `https://birikim.app` to read it (`CORS_ORIGINS` in efaid_api's
`config/stage.env` and `config/prod.env`).

`legal-config.js` names EFA ID's stage until EFA ID's prod address exists; it changes with the prod rollout (YM13).

The app reads the same route through `efa_legal` (birikim_mobile `docs/START.md`); EFA ID's legal emails link to
`https://birikim.app/legal/<slug>`.

## The account deletion today

The app deletes an account after a 7-day wait: Settings › Delete account, a fresh sign-in, then the request; the
email that confirms it carries a link that takes it back (`birikim_mobile/docs/SUBSCRIPTION_AND_ACCOUNT.md`).

## Rules

- A legal text is never kept here: it is written and published in the EFA Console and read from EFA ID.
- The deletion page says what the app does.

## Decisions

- **Read in the browser.** GitHub Pages has no build step; the page reads EFA ID at each visit, so a published version
  shows at once and the site and the app show the same hash.
- **One folder per document, and a fallback.** `/legal/<slug>/` is a real page for the stores and search; a document
  made later works at once through `404.html`.
- **The old sources archived.** `docs/archive/legal/` keeps the old privacy policy, KVKK notice and their pages.

## Known gaps

- `delete.html` describes an old deletion: "Account Settings", a passive account and 30 days without a sign-in. The app
  waits 7 days after Settings › Delete account; a sign-in alone does not take it back, the app and the email offer to.
- A new document's page comes from `404.html`, served with status 404, until its folder is added.
- Live since 2026-11-24 reading EFA ID's stage, so `birikim.app/legal/` shows stage's sample texts until the owner's
  real texts are published and `legal-config.js` names EFA ID's prod (YM2, YM13); the owner chose to keep it so.
