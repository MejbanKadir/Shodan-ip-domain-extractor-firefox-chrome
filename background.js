// Shodan IP/Domain Extractor - Background Script

// Handle extension installation
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Shodan IP/Domain Extractor installed');
  } else if (details.reason === 'update') {
    console.log('Shodan IP/Domain Extractor updated');
  }
});

// Handle messages from popup or content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ping') {
    sendResponse({ status: 'ok' });
  }
  return true;
});
