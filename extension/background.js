chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FETCH_URL') {
    fetch(message.url, {
      headers: { 'User-Agent': 'ScrapifyBot/1.0' }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.text();
      })
      .then(html => sendResponse({ success: true, html }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
