/* Renders the app list on the home page from the APPS registry. */
(function () {
  'use strict';

  var list = document.getElementById('app-list');
  var apps = allApps();

  if (!apps.length) {
    list.innerHTML =
      '<li class="error-box"><p>No apps have been published yet.</p></li>';
    return;
  }

  apps.forEach(function (app) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'app-card';
    a.href = appUrl(app);

    var img = document.createElement('img');
    img.src = app.icon;
    img.alt = '';
    img.width = 56;
    img.height = 56;
    img.loading = 'lazy';

    var body = document.createElement('div');
    body.className = 'app-card-body';

    var name = document.createElement('div');
    name.className = 'app-card-name';
    name.textContent = app.name + ' — Privacy Policy';

    var meta = document.createElement('div');
    meta.className = 'app-card-meta';
    meta.textContent = app.packageId + ' · ' + app.platforms.join(', ');

    var tagline = null;
    if (app.tagline) {
      tagline = document.createElement('div');
      tagline.className = 'app-card-tagline';
      tagline.textContent = app.tagline;
    }

    var arrow = document.createElement('span');
    arrow.className = 'app-card-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '›';

    body.appendChild(name);
    if (tagline) body.appendChild(tagline);
    body.appendChild(meta);
    a.appendChild(img);
    a.appendChild(body);
    a.appendChild(arrow);
    li.appendChild(a);
    list.appendChild(li);
  });

  document.getElementById('site-foot').textContent =
    '© ' + new Date().getFullYear() + ' ' + DEVELOPER_NAME;
})();
