const searchInput = document.getElementById("search_university");
const tableRows = document.querySelectorAll("#universitiesTable tbody tr");
const noResults = document.getElementById("noResults");
const universityCountBadge = document.getElementById("universityCount");

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

    if (universityCountBadge) {
        universityCountBadge.textContent = `${visibleCount} found`;
    }
    noResults.style.display = visibleCount === 0 ? "block" : "none";
});

// Prevent form submission on Enter key press inside the local filter input
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
});