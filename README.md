# Shodan IP/Domain Extractor

A browser extension that extracts IP addresses and domain names from Shodan search results and exports them to text files.

## Features

- **Extract IPs Only** - Export only IP addresses to `ip.txt`
- **Extract Domains Only** - Export only domain names to `domains.txt`
- **Extract Both** - Export both IPs and domains in a combined file `shodan-extract.txt`
- **Real-time Stats** - Shows the number of IPs and domains found
- **Cross-Browser** - Works on Firefox, Chrome, and Edge

## Supported Browsers

- Firefox  
- Chrome  
- Edge  

## Installation

### Firefox (Temporary/Testing)

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to the extension folder and select `manifest.json`
6. The extension icon should appear in your toolbar

### Chrome / Edge (Developer Mode)

1. Open Chrome or Edge
2. Navigate to `chrome://extensions` (Chrome) or `edge://extensions` (Edge)
3. Enable "Developer mode" toggle in the top-right corner
4. Click "Load unpacked"
5. Select the extension folder
6. The extension icon should appear in your toolbar

### Permanent Installation

1 (coming soon, not available right now)
   - [Mozilla Add-ons](https://addons.mozilla.org/) (Firefox)
   - [Chrome Web Store](https://chrome.google.com/webstore) (Chrome)
   - [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons) (Edge)

## Usage

1. Visit [Shodan.io](https://www.shodan.io) and perform a search
2. Click the extension icon in the toolbar
3. Choose one of the three options:
   - **Extract IPs Only** - Downloads `ip.txt` with all IP addresses
   - **Extract Domains Only** - Downloads `domains.txt` with all domain names
   - **Extract Both** - Downloads `shodan-extract.txt` with both IPs and domains organized

## How It Works

The extension scans all `<strong>` elements on the page and:
- Identifies IPv4 addresses using regex: `^(\d{1,3}\.){3}\d{1,3}$`
- Identifies domain names using regex: `^(?!\d+\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

## Files

- `manifest.json` - Extension configuration (Manifest V3)
- `popup.html` - Extension popup UI
- `popup.js` - Popup JavaScript logic
- `content.js` - Content script for page interaction
- `background.js` - Background script
- `icons/icon.svg` - Extension icon

## License

MIT License

## Credit
@Mejbankadir