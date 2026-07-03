const searchInput = document.getElementById("search");
const table = document.getElementById("universitiesTable");
const tableRows = Array.from(table.querySelectorAll("tbody tr"));
const noResults = document.getElementById("noResults");
const visibleCount = document.getElementById("visibleCount");

function updateVisibleRows() {
    const query = searchInput.value.trim().toLowerCase();
    let matches = 0;

    tableRows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();
        const isVisible = rowText.includes(query);
        row.hidden = !isVisible;

        if (isVisible) {
            matches += 1;
        }
    });

    visibleCount.textContent = matches;
    noResults.classList.toggle("is-visible", matches === 0);
}

searchInput.addEventListener("input", updateVisibleRows);
updateVisibleRows();
