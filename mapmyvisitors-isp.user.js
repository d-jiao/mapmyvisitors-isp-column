// ==UserScript==
// @name         MapMyVisitors - Inline ISP & Location Column
// @namespace    https://github.com/d-jiao/mapmyvisitors-isp-column
// @version      1.1.0
// @description  Adds ISP/Organization and inferred Location columns to the Recent Visitors table on MapMyVisitors and resolves Unknown Locations.
// @author       Dian Jiao
// @match        https://mapmyvisitors.com/web/*
// @match        https://*.mapmyvisitors.com/web/*
// @grant        GM_xmlhttpRequest
// @connect      ipwho.is
// @license      MIT
// @homepageURL  https://github.com/d-jiao/mapmyvisitors-isp-column
// @supportURL   https://github.com/d-jiao/mapmyvisitors-isp-column/issues
// @updateURL    https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js
// @downloadURL  https://raw.githubusercontent.com/d-jiao/mapmyvisitors-isp-column/main/mapmyvisitors-isp.user.js
// ==/UserScript==

(function() {
    'use strict';

    const ipCache = {};

    function fetchIPInfo(ip) {
        if (ipCache[ip]) return ipCache[ip];
        ipCache[ip] = new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://ipwho.is/${encodeURIComponent(ip)}`,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (!data || data.success === false) {
                            resolve({ isp: 'Unknown ISP', location: 'Unknown', flagEmoji: '' });
                            return;
                        }

                        const isp = data.connection?.isp || data.connection?.org || 'Unknown ISP';
                        const parts = [data.city, data.region, data.country].filter(Boolean);
                        // Deduplicate if city === region (e.g., Singapore, Hong Kong)
                        const uniqueParts = [...new Set(parts)];
                        const location = uniqueParts.length > 0 ? uniqueParts.join(', ') : 'Unknown';
                        const flagEmoji = data.flag?.emoji || '';

                        resolve({ isp, location, flagEmoji });
                    } catch {
                        resolve({ isp: 'Parse Error', location: 'Unknown', flagEmoji: '' });
                    }
                },
                onerror: () => resolve({ isp: 'Lookup Failed', location: 'Unknown', flagEmoji: '' })
            });
        });
        return ipCache[ip];
    }

    function enhanceTable() {
        const tables = document.querySelectorAll('table');
        let visitorTable = null;

        for (const table of tables) {
            if (table.innerText.includes('Recent visitors') && table.innerText.includes('IP')) {
                visitorTable = table;
                break;
            }
        }
        if (!visitorTable) return;

        // Add "Location" and "ISP" headers if not already added
        const headerRow = visitorTable.querySelector('thead tr') || visitorTable.querySelector('tr');
        if (headerRow && !headerRow.querySelector('.tm-loc-header')) {
            const tagName = headerRow.children[0].tagName;

            const locTh = document.createElement(tagName);
            locTh.className = 'tm-loc-header';
            locTh.textContent = 'Location';
            locTh.style.fontWeight = 'bold';

            const existingIspTh = headerRow.querySelector('.tm-isp-header');
            if (existingIspTh) {
                headerRow.insertBefore(locTh, existingIspTh);
            } else {
                headerRow.appendChild(locTh);
                const ispTh = document.createElement(tagName);
                ispTh.className = 'tm-isp-header';
                ispTh.textContent = 'ISP';
                ispTh.style.fontWeight = 'bold';
                headerRow.appendChild(ispTh);
            }
        }

        // Process each visitor row
        const rows = visitorTable.querySelectorAll('tbody tr');
        rows.forEach((row) => {
            if (row.querySelector('.tm-loc-cell')) return;
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return; // Skip footer/login prompt rows

            // Find the original IP cell (4th column, index 3)
            const ipCell = cells[3];
            const ipText = ipCell ? ipCell.innerText.trim() : '';

            // Create Location cell
            const locCell = document.createElement('td');
            locCell.className = 'tm-loc-cell';
            locCell.style.fontSize = '0.9em';
            locCell.style.color = '#333';
            locCell.textContent = 'Loading...';

            // Create or reuse ISP cell
            let ispCell = row.querySelector('.tm-isp-cell');
            if (!ispCell) {
                ispCell = document.createElement('td');
                ispCell.className = 'tm-isp-cell';
                ispCell.style.fontSize = '0.9em';
                ispCell.style.color = '#333';
                ispCell.textContent = 'Loading...';
            }

            // Insert Location before ISP so the order is [IP | Location | ISP]
            if (ispCell.parentNode === row) {
                row.insertBefore(locCell, ispCell);
            } else {
                row.appendChild(locCell);
                row.appendChild(ispCell);
            }

            if (ipText) {
                fetchIPInfo(ipText).then(({ isp, location, flagEmoji }) => {
                    locCell.textContent = flagEmoji && location !== 'Unknown'
                        ? `${flagEmoji} ${location}`
                        : location;
                    ispCell.textContent = isp;

                    // Also update "Unknown Location" link in the first column if resolved
                    const firstCell = cells[0];
                    if (firstCell && location !== 'Unknown') {
                        const links = firstCell.querySelectorAll('a');
                        links.forEach((a) => {
                            if (a.innerText.includes('Unknown Location')) {
                                a.innerHTML = `<i class="glyphicon glyphicon-map-marker"></i>${location}`;
                                a.title = 'Resolved via ipwho.is';
                            }
                        });
                    }
                });
            } else {
                locCell.textContent = 'Unknown';
                ispCell.textContent = '-';
            }
        });
    }

    window.addEventListener('load', () => {
        enhanceTable();
        const observer = new MutationObserver(() => enhanceTable());
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
