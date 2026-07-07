document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const clearBtn = document.getElementById("clear-search");
    const tableRows = document.querySelectorAll("#universitiesTable tbody tr");
    const noResults = document.getElementById("no-results");
    const searchStats = document.getElementById("search-stats");
    const totalCount = tableRows.length;

    // Cache original cell text to avoid DOM pollution and facilitate restoring
    const rowData = Array.from(tableRows).map(row => {
        const nameCell = row.querySelector(".uni-name");
        const domainCell = row.querySelector(".uni-domain");
        const webCell = row.querySelector(".uni-web a");
        
        return {
            row: row,
            nameCell: nameCell,
            domainCell: domainCell,
            webCell: webCell,
            originalName: nameCell.textContent.trim(),
            originalDomain: domainCell.textContent.trim(),
            originalWeb: webCell.textContent.trim(),
            originalWebHref: webCell.getAttribute("href")
        };
    });

    function highlightText(text, search) {
        if (!search) return escapeHTML(text);
        const index = text.toLowerCase().indexOf(search.toLowerCase());
        if (index === -1) return escapeHTML(text);
        
        const before = text.substring(0, index);
        const match = text.substring(index, index + search.length);
        const after = text.substring(index + search.length);
        
        return `${escapeHTML(before)}<mark class="highlight">${escapeHTML(match)}</mark>${escapeHTML(after)}`;
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        // Show/hide clear button
        clearBtn.style.display = query ? "block" : "none";

        rowData.forEach(item => {
            const matchesName = item.originalName.toLowerCase().includes(query);
            const matchesDomain = item.originalDomain.toLowerCase().includes(query);
            const matchesWeb = item.originalWeb.toLowerCase().includes(query);

            if (matchesName || matchesDomain || matchesWeb) {
                item.row.style.display = "";
                visibleCount++;

                // Highlight matches
                if (query) {
                    item.nameCell.innerHTML = highlightText(item.originalName, query);
                    item.domainCell.innerHTML = highlightText(item.originalDomain, query);
                    // For web cell, preserve the SVG icon inside the link
                    const highlightedWebText = highlightText(item.originalWeb, query);
                    item.webCell.innerHTML = `${highlightedWebText} <svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
                } else {
                    // Restore original
                    item.nameCell.textContent = item.originalName;
                    item.domainCell.textContent = item.originalDomain;
                    item.webCell.innerHTML = `${escapeHTML(item.originalWeb)} <svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
                }
            } else {
                item.row.style.display = "none";
            }
        });

        // Update stats
        if (query) {
            searchStats.textContent = `Found ${visibleCount} of ${totalCount} universities`;
        } else {
            searchStats.textContent = `Showing all ${totalCount} universities`;
        }

        // Show/hide no results banner
        noResults.style.display = visibleCount === 0 ? "flex" : "none";
    }

    searchInput.addEventListener("input", performSearch);

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        performSearch();
        searchInput.focus();
    });
});