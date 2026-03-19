// Shodan IP/Domain Extractor - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const extractIPsBtn = document.getElementById('extractIPs');
  const extractDomainsBtn = document.getElementById('extractDomains');
  const extractBothBtn = document.getElementById('extractBoth');
  const statusEl = document.getElementById('status');
  const statsEl = document.getElementById('stats');
  const ipCountEl = document.getElementById('ipCount');
  const domainCountEl = document.getElementById('domainCount');

  // Show status message
  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusEl.className = 'status';
    }, 5000);
  }

  // Show extraction stats
  function showStats(ips, domains) {
    ipCountEl.textContent = ips.length;
    domainCountEl.textContent = domains.length;
    statsEl.classList.add('visible');
  }

  // Hide stats
  function hideStats() {
    statsEl.classList.remove('visible');
  }

  // Download file
  function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Extract data from current tab
  async function extractFromTab(action) {
    try {
      // Get current active tab
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.id) {
        showStatus('No active tab found', 'error');
        return;
      }

      // Execute content script to extract data using scripting API (Manifest V3)
      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: function() {
          const ipElements = document.querySelectorAll('strong');
          const ips = [];
          const domains = [];
          
          ipElements.forEach(function(el) {
            const text = el.textContent.trim().replace(/["']/g, '');
            
            // Check if it's an IP address
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
      });

      if (!results || results.length === 0 || !results[0].result) {
        showStatus('Failed to extract data from page', 'error');
        return;
      }

      const { ips, domains } = results[0].result;

      if (ips.length === 0 && domains.length === 0) {
        showStatus('No IPs or domains found on this page', 'info');
        hideStats();
        return;
      }

      // Show stats
      showStats(ips, domains);

      // Process based on action
      switch (action) {
        case 'ips':
          if (ips.length > 0) {
            const content = ips.join('\n');
            downloadFile(content, 'ip.txt');
            showStatus(`Exported ${ips.length} IP addresses`, 'success');
          } else {
            showStatus('No IP addresses found', 'info');
          }
          break;

        case 'domains':
          if (domains.length > 0) {
            const content = domains.join('\n');
            downloadFile(content, 'domains.txt');
            showStatus(`Exported ${domains.length} domains`, 'success');
          } else {
            showStatus('No domains found', 'info');
          }
          break;

        case 'both':
          if (ips.length > 0 || domains.length > 0) {
            let content = 'IPs:\n';
            content += ips.length > 0 ? ips.join('\n') : 'No IPs found';
            content += '\n\nDomains:\n';
            content += domains.length > 0 ? domains.join('\n') : 'No domains found';
            downloadFile(content, 'shodan-extract.txt');
            showStatus(`Exported ${ips.length} IPs and ${domains.length} domains`, 'success');
          } else {
            showStatus('No data found to export', 'info');
          }
          break;
      }

    } catch (error) {
      console.error('Extraction error:', error);
      showStatus('Error: ' + error.message, 'error');
    }
  }

  // Event listeners
  extractIPsBtn.addEventListener('click', () => extractFromTab('ips'));
  extractDomainsBtn.addEventListener('click', () => extractFromTab('domains'));
  extractBothBtn.addEventListener('click', () => extractFromTab('both'));
});
