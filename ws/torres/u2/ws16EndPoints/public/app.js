const itemsBody = document.getElementById("itemsBody");

async function loadDanceItems() {
  try {
    const response = await fetch("/torresstore/items");
    const items = await response.json();

    if (!Array.isArray(items) || items.length === 0) {
      itemsBody.innerHTML = '<tr><td colspan="6">No dance items available.</td></tr>';
      return;
    }

    itemsBody.innerHTML = items
      .map(
        (item) => `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.size}</td>
            <td>$${Number(item.price).toFixed(2)}</td>
            <td>${item.stock}</td>
          </tr>
        `
      )
      .join("");
  } catch (error) {
    itemsBody.innerHTML = '<tr><td colspan="6">Could not load endpoint data.</td></tr>';
  }
}

loadDanceItems();
