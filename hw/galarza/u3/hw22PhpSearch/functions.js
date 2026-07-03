document.addEventListener("DOMContentLoaded", () => {
    const countryList = document.getElementById("countryList");
    const countryInput = document.getElementById("countryInput");
    const countryForm = document.getElementById("countryForm");
    const searchInput = document.getElementById("search");
    const tableRows = document.querySelectorAll("#universitiesTable tbody tr:not(#emptyStateRow)");
    const noResults = document.getElementById("noResults");

    let validCountries = [];

    fetch("https://restcountries.com/v3.1/all?fields=name")
        .then(response => response.json())
        .then(data => {
            validCountries = data.map(item => item.name.common).sort();
            
            validCountries.forEach(country => {
                const option = document.createElement("option");
                option.value = country;
                countryList.appendChild(option);
            });
        })
        .catch(error => console.error("Error:", error));

    countryInput.addEventListener("input", function() {
        if (validCountries.includes(this.value)) {
            countryForm.submit();
        }
    });

    if (searchInput && tableRows.length > 0) {
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
            
            if (noResults) {
                if (visibleCount === 0) {
                    noResults.classList.remove("hidden");
                } else {
                    noResults.classList.add("hidden");
                }
            }
        });
    }
});
