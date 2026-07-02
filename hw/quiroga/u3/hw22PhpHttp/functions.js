const searchInput = document.getElementById("search");
const noResults = document.getElementById("noResults");

// El filtro de dominio solo aplica cuando hay tabla con resultados
if (searchInput) {
    const tableRows = document.querySelectorAll("#universitiesTable tbody tr");

    searchInput.addEventListener("keyup", function () {
        const filter = searchInput.value.toLowerCase();
        let visibleCount = 0;

        tableRows.forEach(row => {
            const domainCell = row.cells[1];
            const domainText = domainCell ? domainCell.innerText.toLowerCase() : "";

            if (domainText.includes(filter)) {
                row.style.display = "";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    });
}