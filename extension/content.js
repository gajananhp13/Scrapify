let elementSelectorActive = false;
let overlay = null;
let selectedElement = null;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.id = 'scrapify-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: 2147483647; pointer-events: none;
  `;
  document.body.appendChild(overlay);
}

function removeOverlay() {
  if (overlay) { overlay.remove(); overlay = null; }
}

function showOverlay(element) {
  if (!overlay) createOverlay();
  const rect = element.getBoundingClientRect();
  overlay.style.border = '2px solid #6366f1';
  overlay.style.backgroundColor = 'rgba(99, 102, 241, 0.08)';
  overlay.style.boxShadow = 'inset 0 0 0 2px rgba(99, 102, 241, 0.3)';
  overlay.style.pointerEvents = 'none';
  overlay.style.left = rect.left + 'px';
  overlay.style.top = rect.top + 'px';
  overlay.style.width = rect.width + 'px';
  overlay.style.height = rect.height + 'px';
}

function getCSSSelector(element) {
  if (element === document.body) return 'body';
  if (element.id) return '#' + CSS.escape(element.id);

  const path = [];
  let current = element;

  while (current && current !== document.body && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector = '#' + CSS.escape(current.id);
      path.unshift(selector);
      break;
    }

    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).filter(Boolean);
      if (classes.length > 0) {
        selector += '.' + classes.map(c => CSS.escape(c)).join('.');
      }
    }

    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        s => s.tagName === current.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += ':nth-child(' + (Array.from(parent.children).indexOf(current) + 1) + ')';
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

function extractElementCSS(element) {
  const computed = getComputedStyle(element);
  const styles = {};

  const relevantProps = [
    'display', 'position', 'width', 'height', 'margin', 'padding',
    'color', 'background-color', 'background', 'background-image',
    'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
    'text-align', 'text-decoration', 'text-transform',
    'border', 'border-radius', 'box-shadow',
    'opacity', 'overflow', 'visibility', 'cursor',
    'transform', 'transition', 'animation',
    'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'gap',
    'grid-template-columns', 'grid-template-rows', 'grid-gap',
    'top', 'left', 'right', 'bottom', 'z-index',
    'min-width', 'min-height', 'max-width', 'max-height',
    'outline', 'outline-offset', 'letter-spacing', 'word-spacing',
    'white-space', 'vertical-align', 'float', 'clear',
    'list-style', 'border-collapse'
  ];

  const allProps = [...new Set([
    ...relevantProps,
    ...Array.from(computed).filter(p =>
      !['-webkit-', '-moz-', '-ms-', 'scroll-', 'animation-', 'transition-']
        .some(prefix => p.startsWith(prefix))
    )
  ])];

  for (const prop of allProps) {
    const value = computed.getPropertyValue(prop);
    if (value && value !== 'none' && !value.includes('initial') && !value.includes('inherit')) {
      const isDefault = (
        (prop === 'display' && value === 'block') ||
        (prop === 'position' && value === 'static') ||
        (prop === 'opacity' && value === '1') ||
        (prop === 'visibility' && value === 'visible') ||
        (prop === 'cursor' && value === 'auto')
      );
      if (!isDefault) {
        styles[prop] = value;
      }
    }
  }

  return styles;
}

function getElementInfo(element) {
  return {
    tag: element.tagName.toLowerCase(),
    id: element.id || undefined,
    classes: element.className && typeof element.className === 'string'
      ? element.className.trim().split(/\s+/).filter(Boolean)
      : [],
    text: (element.textContent || '').trim().slice(0, 200),
    innerHTML: element.innerHTML.trim().slice(0, 500),
    outerHTML: element.outerHTML.trim().slice(0, 500),
  };
}

function scrapeCurrentPage() {
  const data = {
    url: window.location.href,
    title: document.title,
    meta: {
      description: (
        document.querySelector('meta[name="description"]')?.getAttribute('content') ||
        document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        ''
      ),
      keywords: (
        document.querySelector('meta[name="keywords"]')?.getAttribute('content') || ''
      ),
    },
    headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
    paragraphs: [],
    links: [],
    images: [],
    tables: [],
    jsonLd: [],
  };

  document.querySelectorAll('h1').forEach(el => data.headings.h1.push(el.textContent.trim()));
  document.querySelectorAll('h2').forEach(el => data.headings.h2.push(el.textContent.trim()));
  document.querySelectorAll('h3').forEach(el => data.headings.h3.push(el.textContent.trim()));
  document.querySelectorAll('h4').forEach(el => data.headings.h4.push(el.textContent.trim()));
  document.querySelectorAll('h5').forEach(el => data.headings.h5.push(el.textContent.trim()));
  document.querySelectorAll('h6').forEach(el => data.headings.h6.push(el.textContent.trim()));

  document.querySelectorAll('p').forEach(el => {
    const text = el.textContent.trim();
    if (text) data.paragraphs.push(text);
  });

  document.querySelectorAll('a[href]').forEach(el => {
    data.links.push({
      text: el.textContent.trim() || undefined,
      href: el.href,
    });
  });

  const seenSrcs = new Set();
  document.querySelectorAll('img[src], img[data-src]').forEach(el => {
    const src = el.src || el.getAttribute('data-src') || '';
    if (src && !seenSrcs.has(src)) {
      seenSrcs.add(src);
      data.images.push({ src, alt: el.alt || undefined });
    }
  });

  document.querySelectorAll('table').forEach((table, idx) => {
    const t = {
      id: table.id || `table-${idx + 1}`,
      caption: table.querySelector('caption')?.textContent.trim() || undefined,
      headers: [],
      rows: [],
    };

    table.querySelectorAll('thead th, thead td').forEach(th => t.headers.push(th.textContent.trim()));
    if (t.headers.length === 0) {
      table.querySelectorAll('tbody tr:first-child th, tbody tr:first-child td').forEach(td => t.headers.push(td.textContent.trim()));
    }

    table.querySelectorAll('tbody tr').forEach(row => {
      const cells = [];
      row.querySelectorAll('td').forEach(td => cells.push(td.textContent.trim()));
      if (cells.length > 0) t.rows.push(cells);
    });

    if (t.headers.length > 0 || t.rows.length > 0) data.tables.push(t);
  });

  document.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
    try {
      data.jsonLd.push(JSON.parse(el.textContent));
    } catch (e) {}
  });

  return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'SCRAPE_CURRENT_PAGE':
      sendResponse(scrapeCurrentPage());
      break;

    case 'ACTIVATE_ELEMENT_SELECTOR':
      elementSelectorActive = true;
      selectedElement = null;
      createOverlay();

      document.body.style.cursor = 'crosshair';

      const mouseMoveHandler = (e) => {
        if (!elementSelectorActive) return;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el && el !== selectedElement) {
          showOverlay(el);
        }
      };

      const clickHandler = (e) => {
        if (!elementSelectorActive) return;
        e.preventDefault();
        e.stopPropagation();

        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el === document.body || el === document.documentElement) return;

        const selector = getCSSSelector(el);
        const css = extractElementCSS(el);
        const info = getElementInfo(el);

        elementSelectorActive = false;
        document.body.style.cursor = '';
        removeOverlay();

        document.removeEventListener('mousemove', mouseMoveHandler, true);
        document.removeEventListener('click', clickHandler, true);

        const cssText = Object.entries(css)
          .map(([prop, val]) => `  ${prop}: ${val};`)
          .join('\n');

        chrome.runtime.sendMessage({
          type: 'ELEMENT_SELECTED',
          selector,
          css,
          cssText: `${selector} {\n${cssText}\n}`,
          elementInfo: info,
        });
      };

      document.addEventListener('mousemove', mouseMoveHandler, true);
      document.addEventListener('click', clickHandler, true);

      sendResponse({ active: true });
      break;

    case 'DEACTIVATE_ELEMENT_SELECTOR':
      elementSelectorActive = false;
      document.body.style.cursor = '';
      removeOverlay();
      sendResponse({ active: false });
      break;
  }
});
