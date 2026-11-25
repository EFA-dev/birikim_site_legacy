// Birikim's legal pages (efaid_api docs/LEGAL_TEXTS.md §3.8): every text is read from EFA ID's public route and
// drawn here, so the site, the app and the record show the same version and the same SHA-256. Nothing is kept in this
// repository. A page names its document with <body data-slug="privacy">, or the path /legal/<slug>, or ?slug=; no slug
// lists every document. ?lang=en or tr picks the language, else the page's own, else Turkish.
(function () {
  'use strict';

  var config = window.BIRIKIM_LEGAL || {};
  var words = {
    tr: {
      title: 'Yasal metinler',
      inEffect: 'Sürüm {0} · {1} tarihinden beri yürürlükte',
      upcoming: 'Sürüm {0}, {1} tarihinde yürürlüğe girer.',
      changes: 'Neler değişti',
      contents: 'İçindekiler',
      earlier: 'Önceki sürümler',
      version: 'Sürüm {0} · {1} tarihinden',
      fingerprint: 'Metnin parmak izi (SHA-256)',
      link: 'Bu metin başka bir sitede:',
      failed: 'Metinler şu an okunamadı. Biraz sonra tekrar deneyin.',
      missing: 'Böyle bir metin yok.',
      all: 'Tüm metinler',
      other: 'English',
    },
    en: {
      title: 'Legal texts',
      inEffect: 'Version {0} · in effect since {1}',
      upcoming: 'Version {0} takes effect on {1}.',
      changes: 'What changed',
      contents: 'Contents',
      earlier: 'Earlier versions',
      version: 'Version {0} · from {1}',
      fingerprint: "The text's fingerprint (SHA-256)",
      link: 'This text is on another site:',
      failed: 'The texts could not be read just now. Try again in a moment.',
      missing: 'There is no such text.',
      all: 'All texts',
      other: 'Türkçe',
    },
  };

  var params = new URLSearchParams(location.search);
  var pathSlug = (location.pathname.match(/^\/legal\/([a-z0-9_]+)\/?$/) || [])[1];
  var slug = params.get('slug') || document.body.getAttribute('data-slug') || pathSlug || '';
  var lang = params.get('lang') || document.documentElement.getAttribute('lang') || 'tr';
  lang = lang.indexOf('en') === 0 ? 'en' : 'tr';
  var t = words[lang];
  var root = document.getElementById('legal');

  function say(text, args) {
    return text.replace(/\{(\d)\}/g, function (_, i) {
      return args[Number(i)];
    });
  }

  function day(iso) {
    if (!iso) {
      return '';
    }

    return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(iso));
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);

    Object.keys(attrs || {}).forEach(function (key) {
      if (key === 'text') {
        node.textContent = attrs[key];
      } else {
        node.setAttribute(key, attrs[key]);
      }
    });
    (children || []).forEach(function (child) {
      node.appendChild(child);
    });

    return node;
  }

  function href(toSlug, toLang) {
    return '/legal/' + (toSlug ? toSlug + '/' : '') + '?lang=' + toLang;
  }

  function markdown(text) {
    var html = window.marked.parse(text || '', { headerIds: true });

    return window.DOMPurify.sanitize(html);
  }

  function inEffect(document) {
    var upcoming = document.upcoming;

    if (upcoming && upcoming.effective_at && new Date(upcoming.effective_at) <= new Date()) {
      return upcoming;
    }

    return document.current;
  }

  function header(document) {
    var nav = el('nav', { class: 'legal-nav' }, [
      el('a', { href: href('', lang), text: t.all }),
      el('a', { href: document ? href(document.slug, lang === 'tr' ? 'en' : 'tr') : href('', lang === 'tr' ? 'en' : 'tr'), text: t.other }),
    ]);

    return nav;
  }

  function list(texts) {
    document.title = t.title + ' · Birikim';
    root.appendChild(header(null));
    root.appendChild(el('h1', { text: t.title }));

    var items = texts.documents.map(function (document) {
      var link = document.link_url
        ? el('a', { href: document.link_url, rel: 'noopener', text: document.title })
        : el('a', { href: href(document.slug, lang), text: document.title });
      var version = inEffect(document);
      var note = version ? say(t.inEffect, [version.version, day(version.effective_at)]) : '';

      return el('li', {}, [link, el('span', { class: 'legal-muted', text: note ? ' · ' + note : '' })]);
    });

    root.appendChild(el('ul', { class: 'legal-list' }, items));
  }

  function show(texts, document) {
    window.document.title = document.title + ' · Birikim';
    root.appendChild(header(document));
    root.appendChild(el('h1', { text: document.title }));

    if (document.link_url) {
      root.appendChild(el('p', {}, [el('span', { text: t.link + ' ' }), el('a', { href: document.link_url, rel: 'noopener', text: document.link_url })]));

      return;
    }

    var version = inEffect(document);

    if (!version) {
      root.appendChild(el('p', { text: t.missing }));

      return;
    }

    var line = earlierVersion ? t.version : t.inEffect;

    root.appendChild(el('p', { class: 'legal-muted', text: say(line, [version.version, day(version.effective_at)]) }));

    var upcoming = document.upcoming;

    if (upcoming && upcoming.version !== version.version) {
      root.appendChild(el('p', { class: 'legal-note', text: say(t.upcoming, [upcoming.version, day(upcoming.effective_at)]) }));
    }

    if (version.summary) {
      root.appendChild(el('details', { class: 'legal-changes' }, [
        el('summary', { text: t.changes }),
        el('p', { text: version.summary }),
      ]));
    }

    var body = el('article', { class: 'legal-body' });
    body.innerHTML = markdown(version.body);

    var headings = body.querySelectorAll('h1, h2, h3');

    if (headings.length > 1) {
      var entries = [];

      headings.forEach(function (heading, index) {
        heading.id = heading.id || 'part-' + index;
        entries.push(el('li', {}, [el('a', { href: '#' + heading.id, text: heading.textContent })]));
      });
      root.appendChild(el('nav', { class: 'legal-contents' }, [el('strong', { text: t.contents }), el('ol', {}, entries)]));
    }

    root.appendChild(body);
    root.appendChild(el('p', { class: 'legal-hash' }, [
      el('span', { text: t.fingerprint + ': ' }),
      el('code', { text: version.sha256 }),
    ]));

    var earlier = (document.versions || []).filter(function (row) {
      return row.version !== version.version && new Date(row.effective_at) <= new Date();
    });

    if (earlier.length) {
      root.appendChild(el('h2', { text: t.earlier }));
      root.appendChild(el('ul', { class: 'legal-list' }, earlier.map(function (row) {
        return el('li', {}, [
          el('a', {
            href: href(document.slug, lang) + '&version=' + row.version,
            text: say(t.version, [row.version, day(row.effective_at)]),
          }),
        ]);
      })));
    }
  }

  function fail(text) {
    root.textContent = '';
    root.appendChild(el('p', { class: 'legal-note', text: text }));
  }

  function read(path) {
    return fetch(config.api + path, { headers: { Accept: 'application/json' } }).then(function (answer) {
      if (!answer.ok) {
        throw new Error(String(answer.status));
      }

      return answer.json();
    });
  }

  var base = '/v1/products/' + config.product + '/legal';
  var earlierVersion = Number(params.get('version')) || 0;

  read(base + '?lang=' + lang)
    .then(function (texts) {
      root.textContent = '';

      if (!slug) {
        list(texts);

        return;
      }

      var document = texts.documents.filter(function (row) {
        return row.slug === slug;
      })[0];

      if (!document) {
        fail(t.missing);

        return;
      }

      if (!earlierVersion) {
        show(texts, document);

        return;
      }

      return read(base + '/' + slug + '/' + earlierVersion + '?lang=' + lang).then(function (old) {
        show(texts, Object.assign({}, document, { current: old, upcoming: null, versions: document.versions }));
      });
    })
    .catch(function () {
      fail(t.failed);
    });
})();
