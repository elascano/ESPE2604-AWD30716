const nameInput = document.getElementById("nameFilter");
const keywordInput = document.getElementById("keywordFilter");
const tableBody = document.querySelector("#universitiesTable tbody");
const noResults = document.getElementById("noResults");
const visibleCountSpan = document.getElementById("visibleCount");
const statsDiv = document.getElementById("stats");
const totalCount = window.__UNIVERSITIES_DATA__ ? window.__UNIVERSITIES_DATA__.length : 0;

function filterTable() {
    const nameFilter = nameInput.value.toLowerCase().trim();
    const keywordFilter = keywordInput.value.toLowerCase().trim();
    let visibleCount = 0;

    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(row => {
        const name = (row.querySelector(".col-name")?.textContent || "").toLowerCase();
        const allText = row.textContent.toLowerCase();

        const matchName = !nameFilter || name.includes(nameFilter);
        const matchKeyword = !keywordFilter || allText.includes(keywordFilter);

        if (matchName && matchKeyword) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
    visibleCountSpan.textContent = visibleCount;
    statsDiv.style.display = "block";
}

nameInput.addEventListener("input", filterTable);
keywordInput.addEventListener("input", filterTable);
