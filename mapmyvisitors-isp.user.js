// ==UserScript==
// @name         MapMyVisitors - Inline ISP Column
// @namespace    https://github.com/d-jiao/mapmyvisitors-isp-column
// @version      1.0.0
// @description  Adds an ISP/Organization column directly to the Recent Visitors table on MapMyVisitors without clicking each IP.
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

    function fetchISP(ip) {
        if (ipCache[ip]) return ipCache[ip];
        ipCache[ip] = new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://ipwho.is/${encodeURIComponent(ip)}`,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        const isp = data.connection?.isp || data.connection?.org || 'Unknown ISP';
                        resolve(isp);
                    } catch {
                        resolve('Parse Error');
                    }
                },
                onerror: () => resolve('Lookup Failed')
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
            const th = document.createElement(headerRow.children[0].tagName);
            th.className = 'tm-isp-header';
            th.textContent = 'ISP';
            th.style.fontWeight = 'bold';
            headerRow.appendChild(th);
        }

        // Process each visitor row
        const rows = visitorTable.querySelectorAll('tbody tr');
        rows.forEach((row) => {
            if (row.querySelector('.tm-isp-cell')) return;
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return; // Skip footer/login prompt rows

            const ipCell = cells[cells.length - 1];
            const ipText = ipCell.innerText.trim();

            const ispCell = document.createElement('td');
            ispCell.className = 'tm-isp-cell';
            ispCell.style.fontSize = '0.9em';
            ispCell.style.color = '#333';
            ispCell.textContent = 'Loading...';
            row.appendChild(ispCell);

            if (ipText) {
                fetchISP(ipText).then((isp) => {
                    ispCell.textContent = isp;
                });
            } else {
                ispCell.textContent = '-';
            }
        });
    }

    // Run once on load and watch for dynamic table updates
    window.addEventListener('load', () => {
        enhanceTable();
        const observer = new MutationObserver(() => enhanceTable());
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
