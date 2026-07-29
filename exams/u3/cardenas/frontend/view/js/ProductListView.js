class ProductListView {
  constructor() {
    this.suppliesTableBody = document.getElementById('suppliesTableBody');
    this.searchNameInput = document.getElementById('searchName');
    
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartTotalValue = document.getElementById('cartTotalValue');
    this.calculateCartTotalBtn = document.getElementById('calculateCartTotalBtn');
    this.clearCartBtn = document.getElementById('clearCartBtn');
    
    this.ivaSearchNameInput = document.getElementById('ivaSearchName');
    this.getIvaBtn = document.getElementById('getIvaBtn');
    this.ivaValueSpan = document.getElementById('ivaValue');
    
    this.expSearchNameInput = document.getElementById('expSearchName');
    this.expDayInput = document.getElementById('expDay');
    this.expMonthInput = document.getElementById('expMonth');
    this.expYearInput = document.getElementById('expYear');
    this.getDaysLeftBtn = document.getElementById('getDaysLeftBtn');
    this.daysLeftValueSpan = document.getElementById('daysLeftValue');
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString;
    return parsedDate.toLocaleDateString();
  }

  renderTable(products) {
    this.suppliesTableBody.innerHTML = '';
    if (products.length === 0) {
      this.suppliesTableBody.innerHTML = '<tr><td colspan="6" class="empty-row-text">No products found</td></tr>';
      return;
    }

    products.forEach(item => {
      const row = document.createElement('tr');
      
      let leftDaysText = item.leftDays;
      let statusClass = 'status-active';
      if (item.leftDays < 0) {
        leftDaysText = `${Math.abs(item.leftDays)} days ago (Expired)`;
        statusClass = 'status-expired';
      } else if (item.leftDays === 0) {
        leftDaysText = 'Expires today';
        statusClass = 'status-expires-today';
      } else {
        leftDaysText = `${item.leftDays} days left`;
      }

      row.innerHTML = `
        <td><strong>${item.name || 'N/A'}</strong></td>
        <td>${this.formatCurrency(item.price || 0)}</td>
        <td>${this.formatDate(item.expiration_date)}</td>
        <td>${this.formatCurrency(item.iva || 0)}</td>
        <td class="${statusClass}">${leftDaysText}</td>
        <td>
          <button class="btn btn-xs add-to-cart-btn" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
        </td>
      `;
      this.suppliesTableBody.appendChild(row);
    });
  }

  renderCart(cartList) {
    this.cartItemsList.innerHTML = '';
    if (cartList.length === 0) {
      this.cartItemsList.innerHTML = '<li class="empty-cart-text">No products in cart.</li>';
      return;
    }
    
    cartList.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'cart-item-row';
      li.innerHTML = `
        <span>${item.name} (${this.formatCurrency(item.price)})</span>
        <a href="#" class="btn-remove remove-cart-item-btn" data-index="${index}">Remove</a>
      `;
      this.cartItemsList.appendChild(li);
    });
  }

  renderCartTotal(total) {
    this.cartTotalValue.textContent = this.formatCurrency(total);
  }

  renderIva(iva) {
    this.ivaValueSpan.textContent = this.formatCurrency(iva);
    this.ivaValueSpan.style.color = 'inherit';
  }

  renderIvaError() {
    this.ivaValueSpan.textContent = 'Product not found';
    this.ivaValueSpan.style.color = '#dc2626';
  }

  renderDaysLeft(days) {
    if (days < 0) {
      this.daysLeftValueSpan.textContent = `${Math.abs(days)} days ago (Expired)`;
      this.daysLeftValueSpan.className = 'status-expired';
    } else if (days === 0) {
      this.daysLeftValueSpan.textContent = 'Expires today';
      this.daysLeftValueSpan.className = 'status-expires-today';
    } else {
      this.daysLeftValueSpan.textContent = `${days} days left`;
      this.daysLeftValueSpan.className = 'status-active';
    }
  }

  renderDaysLeftError() {
    this.daysLeftValueSpan.textContent = 'Product not found';
    this.daysLeftValueSpan.className = 'status-expired';
  }
}
