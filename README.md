# MapMyVisitors - Inline ISP Column

A lightweight [Tampermonkey](https://www.tampermonkey.net/) userscript that automatically adds an inline **ISP / Organization** column to the **Recent visitors** table on [MapMyVisitors](https://mapmyvisitors.com/) analytics pages.

Instead of manually clicking into every visitor IP address to check their network or institution (e.g., universities, corporate networks, cloud providers, or residential ISPs), this tool resolves and displays the ISP/Organization directly inside the table.

---

## Features

- **Zero-Click ISP Display:** Appends an `ISP` column directly to the `Recent visitors` table on any `mapmyvisitors.com/web/*` page.
- **Institutional & Network Identification:** Quickly spot visits from universities, research institutions, corporate networks, or cloud/VPN providers.
- **In-Memory Caching:** Deduplicates repeated IP addresses on the page so identical visitor IPs are only queried once per session.
- **Dynamic Table Support:** Uses a `MutationObserver` to automatically populate ISP data if the visitor table updates dynamically.

---

## Installation

### Step 1: Install a Userscript Manager
If you don't already have one, install the **Tampermonkey** browser extension:
- [Tampermonkey for Chrome / Edge / Brave](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Tampermonkey for Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

### Step 2: Install the Userscript
Click the one-click install link below. Tampermonkey will automatically detect the `.user.js` file and prompt you to click **Install**:

👉 **[Install MapMyVisitors - Inline ISP Column (One-Click)](https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js)**

*(Alternatively, open the Tampermonkey Dashboard, click the `+` tab to create a new script, paste the contents of [`mapmyvisitors-isp.user.js`](./mapmyvisitors-isp.user.js), and press `Cmd/Ctrl + S` to save.)*

---

## Usage

1. Navigate to your MapMyVisitors analytics dashboard (`https://mapmyvisitors.com/web/...`).
2. Scroll down to the **Recent visitors** table.
3. When prompted by Tampermonkey on first run, click **Always allow domain** for `ipwho.is` so the script can fetch ISP metadata.
4. The **ISP** column will automatically appear on the right side of the table and populate each visitor's organization/ISP name.

---

## How It Works

MapMyVisitors hides the visitor's ISP inside individual IP detail views. This script:
1. Locates the `Recent visitors` table on `https://mapmyvisitors.com/web/*`.
2. Injects a new `ISP` table header (`<th>`) and appends a cell (`<td>`) to each visitor row.
3. Queries the free, key-less [ipwho.is](https://ipwho.is/) JSON API via `GM_xmlhttpRequest` to retrieve `connection.isp` / `connection.org` for each unique IPv4/IPv6 address.

---

## License

Released under the [MIT License](./LICENSE).
