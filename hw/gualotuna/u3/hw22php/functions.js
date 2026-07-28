const countries = [
    "Ecuador",
    "Colombia",
    "Peru",
    "Spain",
    "Argentina",
    "Mexico",
    "Chile",
    "Brazil"
];

const searchInput = document.getElementById("search");
const noResults = document.getElementById("noResults");
const countrySelect = document.getElementById("country");

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