/**
 * App registry.
 *
 * To publish a policy for a new app, add one entry to APPS below. Every page on
 * this site is generated from this data, so no HTML needs to be written.
 *
 * The `facts` block drives the generated policy text. Keep it truthful: it is a
 * legal statement about what the app actually does.
 */

/* Contact address shown on every policy page. This is PUBLIC once the site is
 * deployed — swap it for a support alias if you would rather not publish a
 * personal inbox. Google Play requires a working contact address. */
const CONTACT_EMAIL = 'choudharyashutosh7070@gmail.com';

const DEVELOPER_NAME = 'Ashutosh Choudhary';

const APPS = {
  'chess-master': {
    code: 'chess-master',
    name: 'Chess Master',
    tagline: 'Play chess against a friend or the machine.',
    packageId: 'com.chess.master.game',
    platforms: ['Android'],
    icon: 'assets/img/chess-master.png',
    effectiveDate: '2026-09-09',
    /* Alternate ?app= values that resolve to this app. */
    aliases: ['com.chess.master.game', 'chessmaster', 'chess'],
    facts: {
      collectsPersonalData: false,
      /* Data the app stores only on the device and never transmits. */
      onDeviceOnly: [
        'Current game state (board position, whose turn it is, captured pieces)',
      ],
      /* Android/iOS permissions the app declares, with why. */
      permissions: [
        {
          name: 'Network access (INTERNET)',
          reason:
            'Required by the React Native application framework the app is built on. ' +
            'The app itself makes no network requests and is fully playable offline.',
        },
      ],
      thirdPartyServices: [],
      showsAds: false,
      inAppPurchases: false,
      requiresAccount: false,
      childDirected: false,
    },
  },
};

/** Resolve an ?app= value (code, alias, or package id) to an app, or null. */
function resolveApp(rawCode) {
  if (!rawCode) return null;
  const key = String(rawCode).trim().toLowerCase();
  if (Object.prototype.hasOwnProperty.call(APPS, key)) return APPS[key];
  return (
    Object.values(APPS).find(
      app =>
        app.packageId.toLowerCase() === key ||
        (app.aliases || []).some(alias => alias.toLowerCase() === key)
    ) || null
  );
}

/** Apps in display order for the home page. */
function allApps() {
  return Object.values(APPS).sort((a, b) => a.name.localeCompare(b.name));
}

/** 2026-09-09 -> "9 September 2026" */
function formatDate(iso) {
  const parts = String(iso).split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return iso;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${parts[2]} ${months[parts[1] - 1]} ${parts[0]}`;
}
