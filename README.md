# MapMyVisitors - Inline ISP Column

A lightweight [Tampermonkey](https://www.tampermonkey.net/) userscript that automatically adds an inline **ISP / Organization** column to the **Recent visitors** table on [MapMyVisitors](https://mapmyvisitors.com/) analytics pages, while directly resolving `Unknown Location` entries and missing country flags in the first column.

Instead of manually clicking into every visitor IP address or searching Google to check their geographic location and institution (e.g., universities, corporate networks, cloud providers, or residential ISPs), this tool resolves and displays both the inferred **City, Region, Country** (inline in the `Recent visitors` column) and **ISP/Organization** without widening or cluttering the table.

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
Click the raw `.user.js` install link below. Tampermonkey will automatically detect the script and prompt you to click **Install**:

👉 **[Install / Update MapMyVisitors - Inline ISP Column (One-Click)](https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js)**

---

## Updating the Tool (In-Place Override)

Because the script's `@name` (`MapMyVisitors - Inline ISP Column`), `@namespace`, and `@updateURL` are locked to this repository's raw `.user.js` URL, updates automatically **overwrite your existing script in place** without creating duplicate entries:

1. **One-Click Overwrite:** Click the **[One-Click Install / Update Link](https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js)** above. Tampermonkey will recognize the matching `@name` and `@namespace` and display an **Update** (or **Reinstall**) button that overwrites the installed version.
2. **Built-In Update Check:** Click the Tampermonkey extension icon -> **Check for userscript updates** (or open the Tampermonkey Dashboard, click the script's **Last updated** timestamp, and Tampermonkey will pull the latest version from GitHub).

> **Note if upgrading from an early test version:** If you previously installed intermediate test scripts named `MapMyVisitors - Inline ISP & Location Column` or `MapMyVisitors - Inline ISP & Location Resolver`, delete those duplicate entries once in your Tampermonkey Dashboard and keep only **`MapMyVisitors - Inline ISP Column`**.

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

Released under the [MIT License](./LICENSE).
