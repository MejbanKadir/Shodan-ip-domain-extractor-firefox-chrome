// Shodan IP/Domain Extractor - Content Script
// This script runs on Shodan pages and can extract data

(function() {
  // Prevent multiple injections
  if (window.shodanExtractorInjected) {
    return;
  }
  window.shodanExtractorInjected = true;

  // Function to extract IPs and domains from <strong> elements
  function extractData() {
    const ipElements = document.querySelectorAll('strong');
    const ips = [];
    const domains = [];

    ipElements.forEach(function(el) {
      const text = el.textContent.trim().replace(/["']/g, '');
      
      // Check if it's an IP address (IPv4)
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      // Check if it's a domain name
      const domainRegex = /^(?!\d+\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (ipRegex.test(text)) {
        ips.push(text);
      } else if (domainRegex.test(text)) {
        domains.push(text);
      }
    });

    return { ips: ips, domains: domains };
  }

  // Listen for messages from popup
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extract') {
      const data = extractData();
      sendResponse(data);
    }
    return true;
  });

  console.log('Shodan IP/Domain Extractor content script loaded');
})();
