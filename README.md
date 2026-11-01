# App Privacy Policies

Static site hosting the privacy policies required by app store listings. Plain
HTML, CSS and JavaScript — no build step, no dependencies, no framework.
Deployable to GitHub Pages exactly as it stands.

Every page is generated from a single data file, so publishing a policy for a
new app means adding one object to `assets/js/apps-data.js`.

## Published apps

| App | Code | Package | Policy URL |
| --- | --- | --- | --- |
| Chess Master | `chess-master` | `com.chess.master.game` | `chess-master/` |

## Project structure

```
.
├── index.html                  Home — lists every app
├── chess-master/
│   ├── index.html              Chess Master's policy page
│   └── app-ads.txt             Chess Master's AdMob app-ads.txt line
├── privacy.html                Legacy ?app= URL — redirects to the app's folder
├── assets/
│   ├── css/
│   │   └── styles.css          All styling; light and dark themes
│   ├── img/
│   │   └── chess-master.png    App icons (256×256)
│   └── js/
│       ├── apps-data.js        ← the app registry; the only file you normally edit
│       ├── home.js             Builds the app list on the home page
│       └── privacy.js          Generates policy text from an app's facts
├── .nojekyll                   Stops GitHub Pages running Jekyll over the files
├── .gitignore
└── README.md
```

## How it works

`apps-data.js` holds an `APPS` registry. Each entry carries the app's identity
(name, package id, icon) plus a `facts` block describing its actual data
practices. `privacy.js` turns those facts into the eleven standard policy
sections, and `home.js` builds the index from the same registry.

Because the wording is generated rather than hand-written per app, every policy
stays consistent, and updating shared wording means editing one function instead
of every page.

### Policy URLs

Each app's policy lives in a folder named after its code, e.g. `chess-master/`.
The folder's `index.html` names the app on `<body data-app="…" data-root="../">`,
and `privacy.js` renders that app's policy.

The older `privacy.html?app=` form still works and redirects to the folder, so
links already pasted into a store listing keep resolving. It accepts the code,
any alias, or the package id, case-insensitively; an unknown value renders a
"not found" state that links back to the home page.

## Adding an app

1. Drop the icon into `assets/img/` (256×256 PNG is plenty).
2. Add an entry to `APPS` in `assets/js/apps-data.js`:

```js
'my-app': {
  code: 'my-app',
  name: 'My App',
  tagline: 'What it does.',
  packageId: 'com.example.myapp',
  platforms: ['Android'],
  icon: 'assets/img/my-app.png',
  effectiveDate: '2026-01-31',   // YYYY-MM-DD
  aliases: ['com.example.myapp'],
  facts: {
    collectsPersonalData: false,
    onDeviceOnly: ['Saved settings'],
    permissions: [
      { name: 'Network access (INTERNET)', reason: 'Why it is needed.' },
    ],
    thirdPartyServices: [],      // e.g. ['Google AdMob — serves ads']
    showsAds: false,
    inAppPurchases: false,
    requiresAccount: false,
    childDirected: false,
  },
},
```

3. Copy `chess-master/index.html` to `my-app/index.html` and change the
   `data-app` attribute, `<title>`, description and icon to the new app.
4. Add the row to the table at the top of this README.

### `facts` reference

| Field | Type | Effect on the generated policy |
| --- | --- | --- |
| `collectsPersonalData` | boolean | `false` shows the "collects no personal data" banner and the no-collection wording |
| `onDeviceOnly` | string[] | Lists what is stored locally; the section is omitted when empty |
| `permissions` | `{name, reason}[]` | Renders the permissions section |
| `thirdPartyServices` | string[] | Empty means "no third-party services"; otherwise each is listed |
| `showsAds` | boolean | Advertising wording |
| `inAppPurchases` | boolean | Purchases wording |
| `requiresAccount` | boolean | Whether sign-in is needed |
| `childDirected` | boolean | Children's-privacy wording |

**This block is a legal statement about the app.** Check it against what the app
actually does — permissions in the manifest, any analytics or ads SDKs, anything
written to disk — rather than copying another app's entry.

## Local preview

The site is fully static, so any web server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

Opening `index.html` directly over `file://` also works, since nothing uses
`fetch` or modules (links point at `<code>/index.html` there, because browsers
show a directory listing for a bare folder over `file://`).

## Deploying to GitHub Pages

1. Push this directory to a GitHub repository.
2. **Settings → Pages → Source**: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The site publishes at `https://<user>.github.io/<repo>/`.

All paths are relative, so the site works from a project subpath with no
configuration. `.nojekyll` keeps Jekyll from processing the files.

Paste the full policy URL into the store listing, for example:

```
https://<user>.github.io/<repo>/chess-master/
```

Google Play requires the policy to be reachable publicly, without a login, and
to stay live for as long as the app is listed.

## Before publishing

- **`CONTACT_EMAIL` becomes public.** It is set in `assets/js/apps-data.js` and
  is scrapable once deployed. Play requires a working contact address — use a
  support alias if you would rather not publish a personal inbox.
- **Check `effectiveDate`** on any policy you have edited.
- **Re-read the `facts` block** for each app against its current build. A policy
  that no longer matches the app is worse than no policy.

## Implementation notes

- **Output is built with DOM nodes, not `innerHTML`.** The `?app=` value is
  reflected back in the unknown-app state, so on a public URL it is
  attacker-controllable; building nodes means it can never be parsed as markup.
- **Themes** follow `prefers-color-scheme`; both are defined in `styles.css`.
- **Responsive** down to small phones, with a layout breakpoint at 480px.
- **No dependencies**, so there is nothing to keep patched and no supply chain.
