# MapMyVisitors - Inline ISP & Location Column

A lightweight [Tampermonkey](https://www.tampermonkey.net/) userscript that automatically adds inline **Location** and **ISP / Organization** columns to the **Recent visitors** table on [MapMyVisitors](https://mapmyvisitors.com/) analytics pages, while automatically resolving entries labeled as `Unknown Location`.

Instead of manually clicking into every visitor IP address or searching Google to check their geographic location and institution (e.g., universities, corporate networks, cloud providers, or residential ISPs), this tool resolves and displays both the inferred **City, Region, Country** and **ISP/Organization** directly inside the table.

---

## Features

- **Zero-Click ISP & Location Display:** Appends `Location` and `ISP` columns directly to the `Recent visitors` table on any `mapmyvisitors.com/web/*` page.
- **Resolves "Unknown Location" Entries:** MapMyVisitors frequently leaves visitor locations as `Unknown Location`. This script infers the city, region, country, and flag emoji from the IP address (and gracefully falls back to `Unknown` if an IP cannot be decoded).
- **Institutional & Network Identification:** Quickly spot visits from universities, research institutions, corporate networks, or cloud/VPN providers.
- **In-Memory Caching:** Deduplicates repeated IP addresses on the page so identical visitor IPs are only queried once per session using a single API call.
- **Dynamic Table Support:** Uses a `MutationObserver` to automatically populate Location and ISP data if the visitor table updates dynamically.

---

## Installation

### Step 1: Install a Userscript Manager
If you don't already have one, install the **Tampermonkey** browser extension:
- [Tampermonkey for Chrome / Edge / Brave](https://chromewebstore.google.com/detail/tampe# MapMyVisitors - Inline ISP & Location Resolver

A lightweight [Tampermonkey](https://www.tampermonkey.net/) userscript that automatically adds an inline **ISP / Organization** column to the **Recent visitors** table on [MapMyVisitors](https://mapmyvisitors.com/) analytics pages, while directly resolving `Unknown Location` entries and missing country flags in the first column.

Instead of manually clicking into every visitor IP address or searching Google to check their geographic location and institution (e.g., universities, corporate networks, cloud providers, or residential ISPs), this tool resolves and displays both the inferred **City, Region, Country** (inline in the `Recent visitors` column) and **ISP/Organization** without cluttering or widening the table.

---

## Features

- **Zero-Click ISP Display:** Appends a clean `ISP` column directly to the `Recent visitors` table on any `mapmyvisitors.com/web/*` page.
- **Inline Location & Flag Resolution:** MapMyVisitors frequently leaves visitor locations as `Unknown Location` (with a gray `?` icon) or only shows a country name. This script automatically overwrites `Unknown Location` and country-only entries in the first column with the full `City, Region, Country` and replaces the `?` placeholder with the visitor's actual country flag.
- **Institutional & Network Identification:** Quickly spot visits from universities, research institutions, corporate networks, or cloud/VPN providers.
- **In-Memory Caching:** Deduplicates repeated IP addresses on the page so identical visitor IPs are only queried once per session using a single API call.
- **Dynamic Table Support:** Uses a `MutationObserver` to automatically populate ISP and location data if the visitor table updates dynamically.

---

## Installation

### Step 1: Install a Userscript Manager
If you don't already have one, install the **Tampermonkey** browser extension:
- [Tampermonkey for Chrome / Edge / Brave](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Tampermonkey for Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

### Step 2: Install the Userscript
Click the one-click install link below. Tampermonkey will automatically detect the `.user.js` file and prompt you to click **Install**:

👉 **[Install MapMyVisitors - Inline ISP & Location Resolver (One-Click)](https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js)**

*(Alternatively, open the Tampermonkey Dashboard, click the `+` tab to create a new script, paste the contents of [`mapmyvisitors-isp.user.js`](./mapmyvisitors-isp.user.js), and press `Cmd/Ctrl + S` to save.)*

---

## Updating the Tool

If you already have an earlier version installed, you can update to the latest version using any of the following methods:

### Method 1: One-Click Reinstall (Fastest)
Simply click the **[One-Click Install / Update Link](https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js)**. Tampermonkey will detect the newer `@version` number and show an **Update** button.

### Method 2: Check for Updates in Tampermonkey
1. Click the **Tampermonkey** icon in your browser toolbar and open the **Dashboard**.
2. Find **MapMyVisitors - Inline ISP** in your installed scripts list.
3. Click the timestamp under the **Last updated** column (or select the script checkbox and choose **Trigger Update** from the top dropdown menu).

### Method 3: Manual Copy-Paste (If Originally Pasted Locally)
If you originally created the script manually by pasting the code without the `@updateURL` header:
1. Open the **Tampermonkey Dashboard** and click on the script to open the editor.
2. Replace the entire code with the latest [`mapmyvisitors-isp.user.js`](./mapmyvisitors-isp.user.js) and press `Cmd/Ctrl + S` to save.
3. Refresh your MapMyVisitors analytics tab.

---

## Usage

1. Navigate to your MapMyVisitors analytics dashboard (`https://mapmyvisitors.com/web/...`).
2. Scroll down to the **Recent visitors** table.
3. When prompted by Tampermonkey on first run, click **Always allow domain** for `ipwho.is` so the script can fetch IP metadata.
4. Unknown locations in the first column will automatically resolve to `City, Region, Country` with the proper flag, and the **ISP** column will appear on the right side of the table.

---

## How It Works

MapMyVisitors hides the visitor's ISP inside individual IP detail views and frequently fails to resolve city/state locations in the main table. This script:
1. Locates the `Recent visitors` table on `https://mapmyvisitors.com/web/*`.
2. Injects a single `ISP` table header (`<th>`) and appends an ISP cell (`<td>`) to each visitor row.
3. Queries the free, key-less [ipwho.is](https://ipwho.is/) JSON API via `GM_xmlhttpRequest` to retrieve both geographic fields (`city`, `region`, `country`, `flag.img`) and network fields (`connection.isp` / `connection.org`) in a single request per unique IPv4/IPv6 address.
4. Updates `Unknown Location` placeholders, country-only labels, and missing flag icons directly inside the first column when a valid location is decoded.

---

## License

Released under the [MIT License](./LICENSE).rmonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Tampermonkey for Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

### Step 2: Install the Userscript
Click the one-click install link below. Tampermonkey will automatically detect the `.user.js` file and prompt you to click **Install**:

👉 **[Install MapMyVisitors - Inline ISP & Location Column (One-Click)](https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js)**

*(Alternatively, open the Tampermonkey Dashboard, click the `+` tab to create a new script, paste the contents of [`mapmyvisitors-isp.user.js`](./mapmyvisitors-isp.user.js), and press `Cmd/Ctrl + S` to save.)*

---

## Updating the Tool

If you already have an earlier version installed, you can update to the latest version using any of the following methods:

### Method 1: One-Click Reinstall (Fastest)
Simply click the **[One-Click Install / Update Link](https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js)**. Tampermonkey will detect the newer `@version` number and show an **Update** button.

### Method 2: Check for Updates in Tampermonkey
1. Click the **Tampermonkey** icon in your browser toolbar and open the **Dashboard**.
2. Find **MapMyVisitors - Inline ISP Column** in your installed scripts list.
3. Click the timestamp under the **Last updated** column (or select the script checkbox and choose **Trigger Update** from the top dropdown menu).

### Method 3: Manual Copy-Paste (If Originally Pasted Locally)
If you originally created the script manually by pasting the code without the `@updateURL` header:
1. Open the **Tampermonkey Dashboard** and click on the script to open the editor.
2. Replace the entire code with the latest [`mapmyvisitors-isp.user.js`](./mapmyvisitors-isp.user.js) and press `Cmd/Ctrl + S` to save.
3. Refresh your MapMyVisitors analytics tab.

---

## Usage

1. Navigate to your MapMyVisitors analytics dashboard (`https://mapmyvisitors.com/web/...`).
2. Scroll down to the **Recent visitors** table.
3. When prompted by Tampermonkey on first run, click **Always allow domain** for `ipwho.is` so the script can fetch IP metadata.
4. The **Location** and **ISP** columns will automatically appear on the right side of the table and populate each visitor's city/region/country and organization/ISP name.

---

## How It Works

MapMyVisitors hides the visitor's ISP inside individual IP detail views and frequently fails to resolve city/state locations in the main table. This script:
1. Locates the `Recent visitors` table on `https://mapmyvisitors.com/web/*`.
2. Injects new `Location` and `ISP` table headers (`<th>`) and appends corresponding cells (`<td>`) to each visitor row.
3. Queries the free, key-less [ipwho.is](https://ipwho.is/) JSON API via `GM_xmlhttpRequest` to retrieve both geographic fields (`city`, `region`, `country`, `flag.emoji`) and network fields (`connection.isp` / `connection.org`) in a single request per unique IPv4/IPv6 address.
4. Replaces `Unknown Location` placeholders in the first column when a valid location is decoded.

---

## License

Released under the [MIT License](./LICENSE).
