// Point this at your deployed API Gateway stage URL in production,
// e.g. "https://xxxxxxx.execute-api.us-east-1.amazonaws.com/api/products"
const API_BASE = window.SHOPCART_API_BASE || "http://localhost:3006/api/products";

const TOTAL_SLOTS = 5;

const productCardsEl = document.getElementById("productCards");
const progressEl = document.getElementById("progressIndicator");
const summaryHeaderEl = document.getElementById("summaryHeader");
const summaryBodyEl = document.getElementById("summaryBody");
const saveStatusEl = document.getElementById("saveStatus");
const saveBtn = document.getElementById("saveBtn");

// -------------------- Tabs --------------------

document.querySelectorAll(".tab").forEach(tab => {

    tab.addEventListener("click", () => {

        document.querySelectorAll(".tab").forEach(t => {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
        });

        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
        document.getElementById(`panel-${tab.dataset.tab}`).classList.remove("hidden");

        if (tab.dataset.tab === "vat") loadVatTab();
        if (tab.dataset.tab === "expiration") loadExpirationTab();

    });

});

// -------------------- Build the 5 product cards --------------------

function buildCards(){

    for (let i = 1; i <= TOTAL_SLOTS; i++){

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-index">${String(i).padStart(2, "0")}</div>

            <div class="field product-name">
                <input type="text" placeholder="Product name" data-slot="${i}" data-field="name">
            </div>

            <div class="card-row">
                <div class="field">
                    <label>Price (USD)</label>
                    <input type="number" min="0" step="0.01" placeholder="0.00" data-slot="${i}" data-field="price">
                </div>

                <div class="field">
                    <label>VAT rate (%)</label>
                    <select data-slot="${i}" data-field="vatRate">
                        <option value="0">0%</option>
                        <option value="15">15%</option>
                        <option value="21" selected>21%</option>
                    </select>
                </div>

                <div class="field">
                    <label>Expiry (DD/MM/YYYY)</label>
                    <div class="expiry-inputs">
                        <input type="number" min="1" max="31" placeholder="DD" data-slot="${i}" data-field="day">
                        <input type="number" min="1" max="12" placeholder="MM" data-slot="${i}" data-field="month">
                        <input type="number" min="2000" max="2100" placeholder="YYYY" data-slot="${i}" data-field="year">
                    </div>
                </div>
            </div>
        `;

        productCardsEl.appendChild(card);

    }

    productCardsEl.addEventListener("input", updateSummary);

}

// -------------------- Read current form state --------------------

function readProducts(){

    const products = [];

    for (let i = 1; i <= TOTAL_SLOTS; i++){

        const name = valueOf(i, "name").trim();
        const price = valueOf(i, "price");
        const vatRate = valueOf(i, "vatRate");
        const day = valueOf(i, "day");
        const month = valueOf(i, "month");
        const year = valueOf(i, "year");

        const isFilled = name && price;

        if (isFilled){
            products.push({
                id: i,
                name,
                price: Number(price),
                vatRate: Number(vatRate || 21),
                expiration: {
                    day: Number(day || 0),
                    month: Number(month || 0),
                    year: Number(year || 0)
                }
            });
        }

    }

    return products;

}

function valueOf(slot, field){
    const el = productCardsEl.querySelector(`[data-slot="${slot}"][data-field="${field}"]`);
    return el ? el.value : "";
}

// -------------------- Live summary --------------------

function updateSummary(){

    const products = readProducts();

    progressEl.textContent = `${products.length}/${TOTAL_SLOTS} products`;
    summaryHeaderEl.textContent = `SUMMARY — ${products.length} OF ${TOTAL_SLOTS} PRODUCTS ENTERED`;

    if (products.length === 0){
        summaryBodyEl.innerHTML = `<p class="empty">No products entered yet.</p>`;
        return;
    }

    const total = products.reduce((sum, p) => sum + p.price, 0);

    const rows = products.map(p => `
        <div class="summary-row">
            <span class="row-name">${escapeHtml(p.name)}</span>
            <span>$${p.price.toFixed(2)}</span>
        </div>
    `).join("");

    summaryBodyEl.innerHTML = `
        ${rows}
        <div class="summary-row">
            <span class="row-name">Total</span>
            <span class="row-total">$${total.toFixed(2)}</span>
        </div>
    `;

}

// -------------------- Save (bulk POST) --------------------

document.getElementById("catalogForm").addEventListener("submit", async e => {

    e.preventDefault();

    const products = readProducts();

    if (products.length === 0){
        setStatus("Enter at least one product before saving.", "error");
        return;
    }

    saveBtn.disabled = true;
    setStatus("Saving…", "");

    try{

        const res = await fetch(`${API_BASE}/bulk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Could not save products");

        setStatus(`Saved ${products.length} product(s).`, "success");

    }catch(err){

        setStatus(err.message, "error");

    }finally{

        saveBtn.disabled = false;

    }

});

function setStatus(message, kind){
    saveStatusEl.textContent = message;
    saveStatusEl.className = `save-status ${kind}`;
}

// -------------------- Tab 2: VAT calculator --------------------

async function loadVatTab(){

    const vatCardsEl = document.getElementById("vatCards");
    const vatTotalsEl = document.getElementById("vatTotals");

    vatCardsEl.innerHTML = `<p class="empty">Loading…</p>`;

    try{

        const res = await fetch(API_BASE);
        const products = await res.json();

        if (!products.length){
            vatCardsEl.innerHTML = `<p class="empty">No saved products yet. Save products in the catalog tab first.</p>`;
            vatTotalsEl.innerHTML = `<p class="empty">Nothing to calculate yet.</p>`;
            return;
        }

        vatCardsEl.innerHTML = products.map(p => {
            const rate = p.vatRate ?? 21;
            const iva = p.price * (rate / 100);
            return `
                <div class="result-card">
                    <div>
                        <div class="name">${escapeHtml(p.name)}</div>
                        <div class="meta">$${p.price.toFixed(2)} · ${rate}% VAT</div>
                    </div>
                    <div class="figure">$${iva.toFixed(2)}</div>
                </div>
            `;
        }).join("");

        const totalRes = await fetch(`${API_BASE}/total`);
        const totals = await totalRes.json();

        vatTotalsEl.innerHTML = `
            <div class="summary-row">
                <span class="row-name">Subtotal</span>
                <span>$${totals.total.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span class="row-name">Total with VAT</span>
                <span class="row-total">$${totals.totalWithVat.toFixed(2)}</span>
            </div>
        `;

    }catch(err){

        vatCardsEl.innerHTML = `<p class="empty">Could not load products from the API.</p>`;

    }

}

// -------------------- Tab 3: Expiration tracker --------------------

async function loadExpirationTab(){

    const expirationCardsEl = document.getElementById("expirationCards");
    expirationCardsEl.innerHTML = `<p class="empty">Loading…</p>`;

    try{

        const res = await fetch(API_BASE);
        const products = await res.json();

        if (!products.length){
            expirationCardsEl.innerHTML = `<p class="empty">No saved products yet. Save products in the catalog tab first.</p>`;
            return;
        }

        const cards = await Promise.all(products.map(async p => {

            const r = await fetch(`${API_BASE}/${p.id}/expiration`);
            const data = await r.json();

            const badgeClass = data.status === "Valid" ? "valid" : "expired";

            return `
                <div class="result-card">
                    <div>
                        <div class="name">${escapeHtml(p.name)}</div>
                        <span class="badge ${badgeClass}">${data.status.toUpperCase()}</span>
                    </div>
                    <div class="figure">${data.daysRemaining} days</div>
                </div>
            `;

        }));

        expirationCardsEl.innerHTML = cards.join("");

    }catch(err){

        expirationCardsEl.innerHTML = `<p class="empty">Could not load products from the API.</p>`;

    }

}

// -------------------- Utils --------------------

function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// -------------------- Init --------------------

buildCards();
updateSummary();
