# App Privacy Policies

Static site hosting privacy policies for published mobile apps. Plain
HTML/CSS/JS with no build step and no dependencies — deployable to GitHub Pages
as-is.

## URLs

| Page | Path |
| --- | --- |
| Home (all apps) | `/index.html` |
| A policy | `/privacy.html?app=<code>` |

The `app` parameter accepts the app's short code, any alias, or its package id.
All of these resolve to the same page:

```
privacy.html?app=chess-master
privacy.html?app=com.chess.master.game
privacy.html?app=chess
```

An unknown or missing code renders a "not found" state linking back to the home
page, so a bad link never shows a blank screen.

## Adding an app

Edit `assets/js/apps-data.js` and add one entry to `APPS`. Nothing else needs to
change — both pages are generated from that file.

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
    permissions: [{ name: 'Network access (INTERNET)', reason: 'Why it is needed.' }],
    thirdPartyServices: [],      // e.g. ['Google AdMob — serves ads']
    showsAds: false,
    inAppPurchases: false,
    requiresAccount: false,
    childDirected: false,
  },
},
```

The `facts` block generates the policy wording, so it must describe what the app
actually does. Add the app icon to `assets/img/` (256×256 PNG is plenty).

## Deploying to GitHub Pages

1. Push this directory to a GitHub repository.
2. **Settings → Pages → Source**: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The site publishes at `https://<user>.github.io/<repo>/`.

Paths are all relative, so the site works from a project subpath without
configuration. `.nojekyll` is included to stop Jekyll from processing the files.

Use the full policy URL in the Play Console listing, for example:

```
https://<user>.github.io/<repo>/privacy.html?app=chess-master
```

## Before publishing

`CONTACT_EMAIL` in `assets/js/apps-data.js` becomes public once deployed. Google
Play requires a working contact address; swap in a support alias if you would
rather not publish a personal inbox.
