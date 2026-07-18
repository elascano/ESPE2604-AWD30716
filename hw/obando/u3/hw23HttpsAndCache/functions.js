const countries = ["Ecuador", "Colombia", "Peru", "Spain", "Argentina", "Mexico", "Chile", "Brazil"];
const searchInput = document.getElementById("search");
const noResults = document.getElementById("noResults");
const countrySelect = document.getElementById("country");
const universitiesBody = document.getElementById("universitiesBody");

function initCountrySelector() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentCountry = urlParams.get('country') || 'Ecuador';

    countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        if (country.toLowerCase() === currentCountry.toLowerCase()) {
            option.selected = true;
        }
        countrySelect.appendChild(option);
    });

    fetchUniversities(currentCountry);
}

function fetchUniversities(country) {
    const url = `proxy.php?country=${encodeURIComponent(country)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(renderTable)
        .catch(() => {
            universitiesBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: red;">Error loading data.</td></tr>`;
        });
}

function renderTable(universities) {
    universitiesBody.innerHTML = "";

    if (universities.length === 0) {
        universitiesBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No universities found.</td></tr>`;
        return;
    }

    universities.forEach(uni => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${uni.name}</td>
            <td>${uni.domains[0] || 'N/A'}</td>
            <td>${uni.web_pages[0] ? `<a href="${uni.web_pages[0]}" target="_blank">${uni.web_pages[0]}</a>` : 'N/A'}</td>
        `;
        
        universitiesBody.appendChild(row);
    });
}

initCountrySelector();

searchInput.addEventListener("keyup", function () {
    const tableRows = document.querySelectorAll("#universitiesTable tbody tr");
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