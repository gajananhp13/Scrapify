let scrapedData = null;

document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('url-input');
  const scrapeBtn = document.getElementById('scrape-btn');
  const scrapeCurrentBtn = document.getElementById('scrape-current-btn');
  const toggleSelectorBtn = document.getElementById('toggle-selector-btn');
  const copyCssBtn = document.getElementById('copy-css-btn');
  const copyRawBtn = document.getElementById('copy-raw-btn');
  const tabsContainer = document.getElementById('tabs');
  const statusBar = document.getElementById('status-bar');

  scrapeBtn.addEventListener('click', () => scrapeUrl(urlInput.value.trim()));
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') scrapeUrl(urlInput.value.trim());
  });
  scrapeCurrentBtn.addEventListener('click', scrapeCurrentPage);
  toggleSelectorBtn.addEventListener('click', toggleElementSelector);
  copyCssBtn.addEventListener('click', copyElementCSS);
  copyRawBtn.addEventListener('click', copyRawJSON);

  tabsContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'ELEMENT_SELECTED') {
      showElementCSS(message);
      toggleSelectorBtn.textContent = 'Pick Element (CSS)';
      toggleSelectorBtn.classList.remove('active');
    }
  });

  // Auto-fill current tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.url) urlInput.value = tabs[0].url;
  });
});

function showStatus(message, isError = false) {
  const statusBar = document.getElementById('status-bar');
  statusBar.textContent = message;
  statusBar.className = isError ? 'error' : '';
}

function showLoading(show) {
  document.getElementById('loading').classList.toggle('hidden', !show);
  document.getElementById('results').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
}

function showError(message) {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('error').classList.remove('hidden');
  document.getElementById('error-message').textContent = message;
  showStatus('', false);
}

async function scrapeUrl(url) {
  if (!url) {
    showStatus('Please enter a URL', true);
    return;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  showLoading(true);
  showStatus('Fetching page...');
  document.getElementById('element-css-section').classList.add('hidden');

  try {
    const response = await chrome.runtime.sendMessage({ type: 'FETCH_URL', url });
    if (!response.success) throw new Error(response.error);

    showStatus('Parsing content...');
    const data = parseHTML(response.html, url);
    scrapedData = data;
    displayResults(data);
    showStatus('Page scraped successfully!');
  } catch (err) {
    showError('Failed to scrape: ' + err.message);
  }
}

async function scrapeCurrentPage() {
  showLoading(true);
  showStatus('Scraping current page...');
  document.getElementById('element-css-section').classList.add('hidden');

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) throw new Error('No active tab found');

    const results = await chrome.tabs.sendMessage(tabs[0].id, { type: 'SCRAPE_CURRENT_PAGE' });
    results.url = tabs[0].url;
    scrapedData = results;
    displayResults(results);
    showStatus('Page scraped successfully!');
  } catch (err) {
    showError('Failed to scrape: ' + err.message + '. Make sure this page is loaded.');
  }
}

let selectorActive = false;

async function toggleElementSelector() {
  const btn = document.getElementById('toggle-selector-btn');

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) throw new Error('No active tab found');

    if (!selectorActive) {
      await chrome.tabs.sendMessage(tabs[0].id, { type: 'ACTIVATE_ELEMENT_SELECTOR' });
      selectorActive = true;
      btn.textContent = 'Cancel Selection';
      btn.classList.add('active');
      showStatus('Click an element on the page to extract its CSS');
    } else {
      await chrome.tabs.sendMessage(tabs[0].id, { type: 'DEACTIVATE_ELEMENT_SELECTOR' });
      selectorActive = false;
      btn.textContent = 'Pick Element (CSS)';
      btn.classList.remove('active');
      showStatus('');
    }
  } catch (err) {
    showError('Failed: ' + err.message);
  }
}

function showElementCSS(message) {
  const section = document.getElementById('element-css-section');
  section.classList.remove('hidden');

  document.getElementById('selector-path').textContent = message.selector;
  document.getElementById('css-output').textContent = message.cssText;

  // Store for copy
  section.dataset.cssText = message.cssText;

  showStatus('Element CSS extracted!');
}

function copyElementCSS() {
  const section = document.getElementById('element-css-section');
  const cssText = section.dataset.cssText;
  if (!cssText) return;

  navigator.clipboard.writeText(cssText).then(() => {
    showStatus('CSS copied to clipboard!');
  }).catch(() => {
    showStatus('Failed to copy', true);
  });
}

function copyRawJSON() {
  if (!scrapedData) return;
  navigator.clipboard.writeText(JSON.stringify(scrapedData, null, 2)).then(() => {
    showStatus('JSON copied to clipboard!');
  }).catch(() => {
    showStatus('Failed to copy', true);
  });
}

function parseHTML(html, baseUrl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const data = {
    url: baseUrl,
    title: doc.title || '',
    meta: {
      description: (
        doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        ''
      ),
      keywords: doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
    },
    headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
    paragraphs: [],
    links: [],
    images: [],
    tables: [],
    jsonLd: [],
  };

  doc.querySelectorAll('h1').forEach(el => data.headings.h1.push(el.textContent.trim()));
  doc.querySelectorAll('h2').forEach(el => data.headings.h2.push(el.textContent.trim()));
  doc.querySelectorAll('h3').forEach(el => data.headings.h3.push(el.textContent.trim()));
  doc.querySelectorAll('h4').forEach(el => data.headings.h4.push(el.textContent.trim()));
  doc.querySelectorAll('h5').forEach(el => data.headings.h5.push(el.textContent.trim()));
  doc.querySelectorAll('h6').forEach(el => data.headings.h6.push(el.textContent.trim()));

  doc.querySelectorAll('p').forEach(el => {
    const text = el.textContent.trim();
    if (text) data.paragraphs.push(text);
  });

  doc.querySelectorAll('a[href]').forEach(el => {
    const href = el.getAttribute('href');
    if (href) {
      try {
        data.links.push({
          text: el.textContent.trim() || undefined,
          href: new URL(href, baseUrl).href,
        });
      } catch (e) {}
    }
  });

  const seenSrcs = new Set();
  doc.querySelectorAll('img').forEach(el => {
    const src = el.getAttribute('src') || el.getAttribute('data-src') || '';
    if (src && !seenSrcs.has(src)) {
      seenSrcs.add(src);
      try {
        data.images.push({
          src: new URL(src, baseUrl).href,
          alt: el.getAttribute('alt')?.trim() || undefined,
        });
      } catch (e) {}
    }
  });

  doc.querySelectorAll('table').forEach((table, idx) => {
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

  doc.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
    try {
      data.jsonLd.push(JSON.parse(el.textContent));
    } catch (e) {}
  });

  return data;
}

function displayResults(data) {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');

  // Overview
  document.getElementById('result-title').textContent = data.title || 'Untitled Page';
  document.getElementById('result-description').textContent = data.meta.description || 'No description available';

  const stats = document.getElementById('stats');
  const statItems = [
    { label: 'Headings', value: Object.values(data.headings).flat().length },
    { label: 'Paragraphs', value: data.paragraphs.length },
    { label: 'Links', value: data.links.length },
    { label: 'Images', value: data.images.length },
    { label: 'Tables', value: data.tables.length },
  ];
  stats.innerHTML = statItems.map(s => `
    <div class="stat-card">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');

  // Headings & Paragraphs
  const headingsDisplay = document.getElementById('headings-display');
  let headingsHtml = '';
  for (const level of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
    const items = data.headings[level];
    if (items.length > 0) {
      headingsHtml += `<div class="content-section"><h3>&lt;${level}&gt; (${items.length})</h3>`;
      headingsHtml += items.map(h => `<h4>${escapeHtml(h)}</h4>`).join('');
      headingsHtml += `</div>`;
    }
  }
  headingsDisplay.innerHTML = headingsHtml;

  const paragraphsDisplay = document.getElementById('paragraphs-display');
  paragraphsDisplay.innerHTML = data.paragraphs.length > 0
    ? `<div class="content-section"><h3>Paragraphs (${data.paragraphs.length})</h3>` +
      data.paragraphs.map(p => `<p>${escapeHtml(p.slice(0, 500))}${p.length > 500 ? '...' : ''}</p>`).join('') +
      `</div>`
    : '<p style="color:#666">No paragraphs found</p>';

  // Links
  const linksList = document.getElementById('links-list');
  linksList.innerHTML = data.links.length > 0
    ? data.links.slice(0, 50).map(l => `
      <div class="link-item">
        <span class="link-text">${escapeHtml(l.text || '(no text)')}</span>
        <span class="link-url">${escapeHtml(l.href || '')}</span>
      </div>
    `).join('') + (data.links.length > 50 ? `<p style="color:#666;font-size:11px;padding:8px;">...and ${data.links.length - 50} more</p>` : '')
    : '<p style="color:#666;padding:8px;">No links found</p>';

  // Images
  const imagesGrid = document.getElementById('images-grid');
  imagesGrid.innerHTML = data.images.length > 0
    ? data.images.slice(0, 30).map(img => `
      <div class="image-card">
        <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || '')}" loading="lazy" onerror="this.style.display='none'" />
        <div class="image-alt">${escapeHtml(img.alt || '(no alt)')}</div>
      </div>
    `).join('') + (data.images.length > 30 ? `<p style="color:#666;font-size:11px;padding:8px;">...and ${data.images.length - 30} more</p>` : '')
    : '<p style="color:#666;padding:8px;">No images found</p>';

  // Tables
  const tablesDisplay = document.getElementById('tables-display');
  tablesDisplay.innerHTML = data.tables.length > 0
    ? data.tables.map(t => `
      <div class="table-card">
        ${t.caption ? `<div class="table-caption">${escapeHtml(t.caption)}</div>` : ''}
        <table>
          ${t.headers.length > 0 ? `<thead><tr>${t.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>` : ''}
          <tbody>
            ${t.rows.slice(0, 20).map(row => `<tr>${row.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}
            ${t.rows.length > 20 ? `<tr><td colspan="${t.headers.length || 1}" style="color:#666;text-align:center;">...${t.rows.length - 20} more rows</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    `).join('')
    : '<p style="color:#666;padding:8px;">No tables found</p>';

  // Raw JSON
  document.getElementById('raw-json').textContent = JSON.stringify(data, null, 2);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
