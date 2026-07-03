const searchInput = document.getElementById("search");
const tableRows = document.querySelectorAll("#universitiesTable tbody tr");
const noResults = document.getElementById("noResults");

searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.toLowerCase();
    let visibleCount = 0;

    tableRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(filter)) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }
    });
    noResults.style.display = visibleCount === 0 ? "block" : "none";
});