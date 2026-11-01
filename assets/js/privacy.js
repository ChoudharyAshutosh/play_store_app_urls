/**
 * Renders a privacy policy from the app's `facts` block.
 *
 * URL: <code>/ (one folder per app). The legacy privacy.html?app=<code | alias |
 * package id> URL redirects there.
 *
 * All output is built with textContent / DOM nodes rather than innerHTML: the
 * ?app= value is attacker-controllable and is reflected in the unknown-app
 * state, so it must never be parsed as markup.
 */
(function () {
  'use strict';

  var root = document.getElementById('root');

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function section(heading, children) {
    var s = document.createElement('section');
    s.appendChild(el('h2', null, heading));
    children.forEach(function (child) { s.appendChild(child); });
    return s;
  }

  function list(items) {
    var ul = document.createElement('ul');
    items.forEach(function (item) { ul.appendChild(el('li', null, item)); });
    return ul;
  }

  function mailLink() {
    var a = el('a', null, CONTACT_EMAIL);
    a.href = 'mailto:' + CONTACT_EMAIL;
    return a;
  }

  /* ---------- resolve the app ---------- */

  /* Per-app pages (<code>/index.html) name their app on <body>; the legacy
   * privacy.html?app= URL is still accepted and redirected to that page. */
  var siteRoot = document.body.getAttribute('data-root') || '';
  var pageApp = document.body.getAttribute('data-app');
  var requested = pageApp || new URLSearchParams(window.location.search).get('app');
  var app = resolveApp(requested);

  if (app && !pageApp) {
    window.location.replace(appUrl(app, siteRoot));
    return;
  }

  if (!app) {
    var box = el('div', 'error-box');
    box.appendChild(
      el('h1', null, requested ? 'Unknown app' : 'No app specified')
    );
    box.appendChild(
      el(
        'p',
        null,
        requested
          ? 'No privacy policy is published for "' + requested + '".'
          : 'Add an ?app= parameter, or pick an app from the home page.'
      )
    );
    var home = el('a', null, 'View all apps');
    home.href = siteRoot + 'index.html';
    box.appendChild(home);
    root.appendChild(box);
    return;
  }

  var f = app.facts;
  document.title = app.name + ' — Privacy Policy';

  /* ---------- header ---------- */

  var back = el('a', 'back-link', '‹ All apps');
  back.href = siteRoot + 'index.html';
  root.appendChild(back);

  var head = el('div', 'policy-head');
  var icon = document.createElement('img');
  icon.src = siteRoot + app.icon;
  icon.alt = '';
  icon.width = 60;
  icon.height = 60;
  head.appendChild(icon);
  var titleWrap = document.createElement('div');
  titleWrap.appendChild(el('h1', null, app.name + ' — Privacy Policy'));
  head.appendChild(titleWrap);
  root.appendChild(head);

  var sub = el('p', 'policy-sub');
  sub.appendChild(document.createTextNode('Effective ' + formatDate(app.effectiveDate) + ' · '));
  sub.appendChild(el('code', null, app.packageId));
  root.appendChild(sub);

  /* ---------- summary callout ---------- */

  if (!f.collectsPersonalData) {
    var callout = el('div', 'callout');
    var cp = document.createElement('p');
    cp.appendChild(el('strong', null, 'This app collects no personal data. '));
    cp.appendChild(
      document.createTextNode(
        'It works entirely on your device, requires no account, and sends nothing to us or anyone else.'
      )
    );
    callout.appendChild(cp);
    root.appendChild(callout);
  }

  /* ---------- sections ---------- */

  root.appendChild(
    section('1. Overview', [
      el(
        'p',
        null,
        'This policy explains how ' + app.name + ' (package ' + app.packageId +
          ') handles information. It applies to the ' + app.platforms.join(' and ') +
          ' version of the app published by ' + DEVELOPER_NAME + '.'
      ),
    ])
  );

  root.appendChild(
    section('2. Information We Collect', [
      el(
        'p',
        null,
        f.collectsPersonalData
          ? 'The app collects the personal information described below.'
          : 'We do not collect, store, or transmit any personal information. ' +
            'The app does not ask for your name, email address, phone number, ' +
            'contacts, location, photos, or any other personal data, and it ' +
            'contains no analytics, tracking, or advertising code.'
      ),
      el(
        'p',
        null,
        f.requiresAccount
          ? 'An account is required to use this app.'
          : 'No account or sign-in is required to use this app.'
      ),
    ])
  );

  if (f.onDeviceOnly && f.onDeviceOnly.length) {
    root.appendChild(
      section('3. Information Stored on Your Device', [
        el(
          'p',
          null,
          'The following is held on your device so the app can function. It ' +
            'never leaves your device and is not accessible to us:'
        ),
        list(f.onDeviceOnly),
        el(
          'p',
          null,
          'Uninstalling the app removes this information.'
        ),
      ])
    );
  }

  if (f.permissions && f.permissions.length) {
    var permNodes = [
      el('p', null, 'The app declares the following permissions:'),
    ];
    var permUl = document.createElement('ul');
    f.permissions.forEach(function (perm) {
      var li = document.createElement('li');
      li.appendChild(el('span', 'perm-name', perm.name));
      li.appendChild(document.createTextNode(' — ' + perm.reason));
      permUl.appendChild(li);
    });
    permNodes.push(permUl);
    root.appendChild(section('4. Permissions', permNodes));
  }

  root.appendChild(
    section('5. Third-Party Services', [
      f.thirdPartyServices && f.thirdPartyServices.length
        ? el('p', null, 'The app uses the following third-party services:')
        : el(
            'p',
            null,
            'The app integrates no third-party analytics, advertising, crash ' +
              'reporting, or social media services. No data is shared with ' +
              'third parties, because none is collected.'
          ),
    ].concat(
      f.thirdPartyServices && f.thirdPartyServices.length
        ? [list(f.thirdPartyServices)]
        : []
    ))
  );

  root.appendChild(
    section('6. Advertising and Purchases', [
      el(
        'p',
        null,
        (f.showsAds
          ? 'The app displays advertising. '
          : 'The app displays no advertisements. ') +
          (f.inAppPurchases
            ? 'The app offers in-app purchases, which are processed by the app store, not by us.'
            : 'The app offers no in-app purchases.')
      ),
    ])
  );

  var childText = f.childDirected
    ? 'The app is designed for a general audience that includes children, and ' +
      'is operated in line with the Children\'s Online Privacy Protection Act ' +
      '(COPPA) and the Google Play Families Policy.'
    : 'The app is not directed at children under 13, and we do not knowingly ' +
      'collect information from children.';

  if (!f.collectsPersonalData) {
    childText +=
      ' Because the app collects no personal information from anyone, no such ' +
      'information about a child can be collected, used, or disclosed.';
  }

  root.appendChild(section("7. Children's Privacy", [el('p', null, childText)]));

  root.appendChild(
    section('8. Data Security', [
      el(
        'p',
        null,
        'Any data the app creates stays on your device and is protected by your ' +
          "device's own security. We operate no servers that hold your data."
      ),
    ])
  );

  root.appendChild(
    section('9. Your Rights', [
      el(
        'p',
        null,
        'Data protection laws such as the GDPR and CCPA give you rights to ' +
          'access, correct, and delete personal data held about you. We hold no ' +
          'personal data about you, so there is nothing for us to return or ' +
          'erase. You can remove all app data at any time by uninstalling the app.'
      ),
    ])
  );

  root.appendChild(
    section('10. Changes to This Policy', [
      el(
        'p',
        null,
        'If this policy changes, the revised version will be posted on this page ' +
          'with a new effective date. Material changes will also be reflected in ' +
          'the app store listing.'
      ),
    ])
  );

  var contactP = document.createElement('p');
  contactP.appendChild(
    document.createTextNode('Questions about this policy can be sent to ')
  );
  contactP.appendChild(mailLink());
  contactP.appendChild(document.createTextNode('.'));
  root.appendChild(section('11. Contact', [contactP]));

  var foot = el('footer', 'site-foot');
  foot.textContent =
    '© ' + new Date().getFullYear() + ' ' + DEVELOPER_NAME +
    ' · Last updated ' + formatDate(app.effectiveDate);
  root.appendChild(foot);
})();
