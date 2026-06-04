const apiBaseUrl = "/computerstore";

const totalCustomersElement = document.getElementById("totalCustomers");
const totalMoneySpentElement = document.getElementById("totalMoneySpent");
const customersTableBody = document.getElementById("customersTableBody");
const tableTitle = document.getElementById("tableTitle");
const statusMessage = document.getElementById("statusMessage");

const generalQuerySelect = document.getElementById("generalQuerySelect");
const searchTypeSelect = document.getElementById("searchTypeSelect");
const searchFieldsContainer = document.getElementById("searchFieldsContainer");

const btnRunGeneralQuery = document.getElementById("btnRunGeneralQuery");
const btnRunSearch = document.getElementById("btnRunSearch");

async function fetchData(endpoint) {
    const response = await fetch(`${apiBaseUrl}${endpoint}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.message || `Request failed with status ${response.status}`
        );
    }

    return response.json();
}

function formatMoney(value) {
    if (value === undefined || value === null || value === "") {
        return "-";
    }

    return `$${Number(value).toFixed(2)}`;
}

function normalizeCustomers(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (data && typeof data === "object") {
        return [data];
    }

    return [];
}

function clearTable(message = "Select an option to load data") {
    customersTableBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-row">${message}</td>
        </tr>
    `;

    statusMessage.textContent = "Ready";
}

function renderCustomersTable(data, title) {
    const customers = normalizeCustomers(data);

    tableTitle.textContent = title;
    customersTableBody.innerHTML = "";

    if (customers.length === 0) {
        customersTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-row">No customers found</td>
            </tr>
        `;

        statusMessage.textContent = "No records found";
        return;
    }

    customers.forEach((customer) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${customer.id ?? "-"}</td>
            <td>${customer.name ?? "-"}</td>
            <td>${customer.age ?? "-"}</td>
            <td>${formatMoney(customer.moneySpent)}</td>
        `;

        customersTableBody.appendChild(row);
    });

    statusMessage.textContent = `${customers.length} record(s) loaded`;
}

function showError(message) {
    customersTableBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty-row">${message}</td>
        </tr>
    `;

    statusMessage.textContent = "Error";
}

async function loadSummaryData() {
    try {
        const [countData, moneyData] = await Promise.all([
            fetchData("/customers/count"),
            fetchData("/customers/money-spent/total")
        ]);

        totalCustomersElement.textContent = countData.totalCustomers ?? 0;
        totalMoneySpentElement.textContent = formatMoney(moneyData.totalMoneySpent ?? 0);
    } catch (error) {
        console.error(error);
        totalCustomersElement.textContent = "Error";
        totalMoneySpentElement.textContent = "Error";
    }
}

async function runGeneralQuery() {
    const selectedOption = generalQuerySelect.value;

    try {
        if (selectedOption === "all") {
            statusMessage.textContent = "Loading all customers...";

            const customers = await fetchData("/customers");

            renderCustomersTable(customers, "All Customers");
        }

        if (selectedOption === "names") {
            statusMessage.textContent = "Loading customer names...";

            const customers = await fetchData("/customers/name");

            renderCustomersTable(customers, "Customer Names");
        }

        if (selectedOption === "ages") {
            statusMessage.textContent = "Loading customer ages...";

            const customers = await fetchData("/customers/age");

            renderCustomersTable(customers, "Customer Ages");
        }

        if (selectedOption === "moneySpent") {
            statusMessage.textContent = "Loading customer money spent...";

            const customers = await fetchData("/customers/money-spent");

            renderCustomersTable(customers, "Customer Money Spent");
        }
    } catch (error) {
        showError(error.message);
    }
}

function renderSearchFields() {
    const selectedSearchType = searchTypeSelect.value;

    searchFieldsContainer.innerHTML = "";

    if (selectedSearchType === "id") {
        searchFieldsContainer.innerHTML = `
            <input type="number" id="customerIdInput" placeholder="Customer ID">
        `;
    }

    if (selectedSearchType === "name") {
        searchFieldsContainer.innerHTML = `
            <input type="text" id="customerNameInput" placeholder="Customer name">
        `;
    }

    if (selectedSearchType === "age") {
        searchFieldsContainer.innerHTML = `
            <input type="number" id="customerAgeInput" placeholder="Customer age">
        `;
    }

    if (selectedSearchType === "moneyRange") {
        searchFieldsContainer.innerHTML = `
            <input type="number" id="minMoneyInput" placeholder="Minimum money spent">
            <input type="number" id="maxMoneyInput" placeholder="Maximum money spent">
        `;
    }

    clearTable("Search fields changed. Enter the new data and press Search.");
}

async function runSearch() {
    const selectedSearchType = searchTypeSelect.value;

    try {
        if (selectedSearchType === "id") {
            const customerIdInput = document.getElementById("customerIdInput");
            const id = customerIdInput.value.trim();

            if (!id) {
                showError("Please enter a customer ID");
                return;
            }

            statusMessage.textContent = "Searching customer by ID...";

            const customer = await fetchData(`/customer/${id}`);

            renderCustomersTable(customer, `Customer with ID ${id}`);
        }

        if (selectedSearchType === "name") {
            const customerNameInput = document.getElementById("customerNameInput");
            const name = customerNameInput.value.trim();

            if (!name) {
                showError("Please enter a customer name");
                return;
            }

            statusMessage.textContent = "Searching customers by name...";

            const customers = await fetchData(`/customers/name/${encodeURIComponent(name)}`);

            renderCustomersTable(customers, `Customers with name "${name}"`);
        }

        if (selectedSearchType === "age") {
            const customerAgeInput = document.getElementById("customerAgeInput");
            const age = customerAgeInput.value.trim();

            if (!age) {
                showError("Please enter a customer age");
                return;
            }

            statusMessage.textContent = "Searching customers by age...";

            const customers = await fetchData(`/customers/age/${age}`);

            renderCustomersTable(customers, `Customers with age ${age}`);
        }

        if (selectedSearchType === "moneyRange") {
            const minMoneyInput = document.getElementById("minMoneyInput");
            const maxMoneyInput = document.getElementById("maxMoneyInput");

            const min = minMoneyInput.value.trim();
            const max = maxMoneyInput.value.trim();

            if (!min || !max) {
                showError("Please enter minimum and maximum money spent");
                return;
            }

            if (Number(min) > Number(max)) {
                showError("Minimum money spent cannot be greater than maximum money spent");
                return;
            }

            statusMessage.textContent = "Searching customers by money spent range...";

            const customers = await fetchData(`/customers/money-spent/range/${min}/${max}`);

            renderCustomersTable(
                customers,
                `Customers with money spent between $${min} and $${max}`
            );
        }
    } catch (error) {
        showError(error.message);
    }
}

generalQuerySelect.addEventListener("change", () => {
    clearTable("General query changed. Press Load to get data.");
});

searchTypeSelect.addEventListener("change", () => {
    renderSearchFields();
});

btnRunGeneralQuery.addEventListener("click", runGeneralQuery);
btnRunSearch.addEventListener("click", runSearch);

document.addEventListener("DOMContentLoaded", async () => {
    renderSearchFields();
    await loadSummaryData();
    await runGeneralQuery();
});