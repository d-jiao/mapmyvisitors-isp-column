// ==UserScript==
// @name         MapMyVisitors - Inline ISP & Location Resolver
// @namespace    https://github.com/d-jiao/mapmyvisitors-isp-column
// @version      1.2.0
// @description  Adds an inline ISP/Organization column to MapMyVisitors and resolves Unknown Locations and missing flags directly in the Recent Visitors column.
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
                            resolve({ isp: 'Unknown ISP', location: 'Unknown', flagImg: '' });
                            return;
                        }

                        const isp = data.connection?.isp || data.connection?.org || 'Unknown ISP';
                        const parts = [data.city, data.region, data.country].filter(Boolean);
                        const uniqueParts = [...new Set(parts)];
                        const location = uniqueParts.length > 0 ? uniqueParts.join(', ') : 'Unknown';
                        const flagImg = data.flag?.img || '';

                        resolve({ isp, location, flagImg });
                    } catch {
                        resolve({ isp: 'Parse Error', location: 'Unknown', flagImg: '' });
                    }
                },
                onerror: () => resolve({ isp: 'Lookup Failed', location: 'Unknown', flagImg: '' })
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

        // Add "ISP" header if not already added
        const headerRow = visitorTable.querySelector('thead tr') || visitorTable.querySelector('tr');
        if (headerRow && !headerRow.querySelector('.tm-isp-header')) {
            const ispTh = document.createElement(headerRow.children[0].tagName);
            ispTh.className = 'tm-isp-header';
            ispTh.textContent = 'ISP';
            ispTh.style.fontWeight = 'bold';
            headerRow.appendChild(ispTh);
        }

        // Process each visitor row
        const rows = visitorTable.querySelectorAll('tbody tr');
        rows.forEach((row) => {
            if (row.querySelector('.tm-isp-cell')) return;
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return; // Skip footer/login prompt rows

            const ipCell = cells[3];
            const ipText = ipCell ? ipCell.innerText.trim() : '';

            const ispCell = document.createElement('td');
            ispCell.className = 'tm-isp-cell';
            ispCell.style.fontSize = '0.9em';
            ispCell.style.color = '#333';
            ispCell.style.whiteSpace = 'nowrap';
            ispCell.textContent = 'Loading...';
            row.appendChild(ispCell);

            if (ipText) {
                fetchIPInfo(ipText).then(({ isp, location, flagImg }) => {
                    ispCell.textContent = isp;

                    const firstCell = cells[0];
                    if (!firstCell || location === 'Unknown') return;

                    // Replace "Unknown Location" or country-only text in the first column
                    const links = firstCell.querySelectorAll('a');
                    links.forEach((a) => {
                        const text = a.innerText.trim();
                        if (text.includes('Unknown Location') || (!text.includes(',') && location.includes(','))) {
                            a.innerHTML = `<i class="glyphicon glyphicon-map-marker"></i>${location}`;
                            a.title = `Resolved via ipwho.is (${location})`;
                        }
                    });

                    // Replace the gray "?" unknown flag image if present
                    if (flagImg) {
                        const img = firstCell.querySelector('img');
                        if (img && (img.src.includes('unknown') || img.src.includes('question') || img.alt === '' || img.src.includes('blank'))) {
                            img.src = flagImg;
                            img.style.width = '24px';
                            img.style.height = 'auto';
                        }
                    }
                });
            } else {
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
