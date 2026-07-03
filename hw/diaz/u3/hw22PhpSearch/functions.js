const searchInput = document.getElementById("search");
const tableBody = document.getElementById("universitiesBody");
const noResults = document.getElementById("noResults");
const status = document.getElementById("status");
const apiUrl = (() => {
    const configuredUrl = document.body.dataset.apiUrl || "/universities";
    if (configuredUrl.startsWith("http://") || configuredUrl.startsWith("https://")) {
        return configuredUrl;
    }

    return `${window.location.origin}${configuredUrl.startsWith("/") ? "" : "/"}${configuredUrl}`;
})();

const normalizeText = (value) => value.trim();

const escapeHtml = (value) =>
    String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

const renderUniversities = (universities) => {
    tableBody.innerHTML = universities
        .map(
            (uni) => `
                <tr data-country="${escapeHtml(uni.country)}">
                    <td>${escapeHtml(uni.name)}</td>
                    <td>${escapeHtml(uni.country)}</td>
                    <td>${escapeHtml(uni.domain)}</td>
                    <td>
                        <a href="${escapeHtml(uni.webPage)}" target="_blank" rel="noopener noreferrer">
                            ${escapeHtml(uni.webPage)}
                        </a>
                    </td>
                </tr>
            `
        )
        .join("");

    noResults.style.display = universities.length === 0 ? "block" : "none";
};

const loadUniversities = async (forceAll = false) => {
    const country = normalizeText(searchInput.value);

   
    const requestAll = forceAll === true;

    if (!requestAll && !country) {
        tableBody.innerHTML = "";
        noResults.style.display = "block";
        noResults.textContent = "Write a country to search";
        status.textContent = "Waiting...";
        return;
    }

    const targetUrl = requestAll ? apiUrl : `${apiUrl}?country=${encodeURIComponent(country)}`;
    status.textContent = requestAll ? `Loading...` : `Searching in ${country}...`;
    noResults.style.display = "none";

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error("No se pudo obtener la información");
        }

        const payload = await response.json();
        renderUniversities(payload.data || []);
        status.textContent = `${payload.total || 0} results for ${payload.country || (requestAll ? 'All' : country)}`;
    } catch (error) {
        tableBody.innerHTML = "";
        noResults.style.display = "block";
        noResults.textContent = "The data could not be loaded.";
        status.textContent = "Error in search";
    }
};

let debounceTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => loadUniversities(false), 300);
});


window.addEventListener('load', () => loadUniversities(true));