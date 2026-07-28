const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const productImage = document.getElementById('product-image');
const productDescription = document.getElementById('product-description');
const vatAmountEl = document.getElementById('vat-amount');
const expirationForm = document.getElementById('expiration-form');
const expirationResult = document.getElementById('expiration-result');


async function loadDetail() {
  const [productRes, vatRes] = await Promise.all([
    fetch(`${CONFIG.API_URL}/products/${id}`),
    fetch(`${CONFIG.API_URL}/products/${id}/vat`)
  ]);

  const product = await productRes.json();
  const vat = await vatRes.json();

  document.querySelector('.detail-image-block h2').textContent = product.name;
  productImage.src = product.image;
  productImage.alt = product.name;
  productDescription.textContent = product.description;
  vatAmountEl.textContent = `$${vat.vatAmount.toFixed(2)}`;
}


expirationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const day = document.getElementById('day').value;
  const month = document.getElementById('month').value;
  const year = document.getElementById('year').value;

  const res = await fetch(`${CONFIG.API_URL}/products/${id}/expiration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ day, month, year })
  });
  const data = await res.json();

  if (!res.ok) {
    expirationResult.textContent = data.error;
    return;
  }

  expirationResult.textContent = data.expired
    ? `This product expired ${Math.abs(data.daysRemaining)} day(s) ago.`
    : `Days left to sell: ${data.daysRemaining}`;
});

loadDetail();
