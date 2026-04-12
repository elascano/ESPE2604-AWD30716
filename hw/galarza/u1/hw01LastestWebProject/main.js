class ElectronicGamesStore {
    constructor() {
        this.cart = [];
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.initializeEventListeners();
        this.initializeCarousel();
        this.loadCartFromStorage();
        this.updateCartDisplay();
        this.initializeCheckoutButton();
    }

    initializeEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('overlay');
        mobileMenuToggle === null || mobileMenuToggle === void 0 ? void 0 : mobileMenuToggle.addEventListener('click', () => {
            mobileMenu === null || mobileMenu === void 0 ? void 0 : mobileMenu.classList.toggle('active');
            overlay === null || overlay === void 0 ? void 0 : overlay.classList.toggle('active');
        });
        // Cart sidebar toggle
        const cartBtn = document.getElementById('cart-btn');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCart = document.getElementById('close-cart');
        cartBtn === null || cartBtn === void 0 ? void 0 : cartBtn.addEventListener('click', () => {
            cartSidebar === null || cartSidebar === void 0 ? void 0 : cartSidebar.classList.add('open');
            overlay === null || overlay === void 0 ? void 0 : overlay.classList.add('active');
        });
        closeCart === null || closeCart === void 0 ? void 0 : closeCart.addEventListener('click', () => {
            cartSidebar === null || cartSidebar === void 0 ? void 0 : cartSidebar.classList.remove('open');
            overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove('active');
        });
        // Close menus when clicking overlay
        overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener('click', () => {
            mobileMenu === null || mobileMenu === void 0 ? void 0 : mobileMenu.classList.remove('active');
            cartSidebar === null || cartSidebar === void 0 ? void 0 : cartSidebar.classList.remove('open');
            overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove('active');
        });
        // Search functionality desktop
        const searchInput = document.getElementById('search-input-desktop');
        const searchBtn = document.querySelector('.search-desktop');
        const performSearch = () => {
            const query = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim();
            if (query) {
                this.searchProducts(query);
            }
        };
        searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener('click', performSearch);
        searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        // Search functionality mobile
        const searchInputMobile = document.getElementById('search-input-mobile');
        const searchBtnMobile = document.querySelector('.search-mobile');
        const performSearchMObile = () => {
            const query = searchInputMobile === null || searchInputMobile === void 0 ? void 0 : searchInputMobile.value.trim();
            if (query) {
                this.searchProducts(query);
            }
        };
        searchBtnMobile === null || searchBtnMobile === void 0 ? void 0 : searchBtnMobile.addEventListener('click', performSearchMObile);
        searchInputMobile === null || searchInputMobile === void 0 ? void 0 : searchInputMobile.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearchMObile();
            }
        });
        // Carousel controls
        const carouselPrev = document.getElementById('carousel-prev');
        const carouselNext = document.getElementById('carousel-next');
        carouselPrev === null || carouselPrev === void 0 ? void 0 : carouselPrev.addEventListener('click', () => this.previousSlide());
        carouselNext === null || carouselNext === void 0 ? void 0 : carouselNext.addEventListener('click', () => this.nextSlide());
        // Carousel dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        // Category card clicks
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach((card, index) => {
            card.addEventListener('click', () => this.scrollToSection(index));
        });
        // Smooth scrolling for navigation links
        document.addEventListener('click', (e) => {
            var _a, _b;
            const target = e.target;
            if (target.tagName === 'A' && ((_a = target.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.startsWith('#'))) {
                e.preventDefault();
                const targetId = (_b = target.getAttribute('href')) === null || _b === void 0 ? void 0 : _b.substring(1);
                if (targetId) {
                    this.scrollToElement(targetId);
                }
            }
        });
    }
    initializeCarousel() {
        // Auto-advance carousel
        setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    previousSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    updateCarousel() {
        const track = document.getElementById('carousel-track');
        const dots = document.querySelectorAll('.dot');
        if (track) {
            track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    scrollToSection(categoryIndex) {
        const sections = ['consolas', 'pokemon', 'accesorios', 'celulares'];
        const targetSection = sections[categoryIndex];
        if (targetSection) {
            this.scrollToElement(targetSection);
        }
    }
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    searchProducts(query) {
        var _a, _b;
        const productCards = document.querySelectorAll('.product-card');
        let foundAny = false;
        for (const card of productCards) {
            const title = ((_b = (_a = card.querySelector('h3')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
            const matches = title.includes(query.toLowerCase());
            if (matches) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('highlight');
                setTimeout(() => card.classList.remove('highlight'), 2000);
                if (!foundAny)
                    foundAny = true;
            }
        }
        if (!foundAny) {
            // Construye la notificación
            const notification = document.createElement('div');
            notification.classList.add('search-notif');
            notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 5px;">Sin resultados</div>
      <div style="font-size: 0.9rem;">No se encontraron productos para "${query}"</div>
    `;
            document.body.appendChild(notification);

            // Desaparece tras 3s
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
    // Cart Management
    addToCart(id, name, price, image) {
        const existingItem = this.cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        }
        else {
            this.cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showCartNotification(name);
    }
    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCartToStorage();
        this.updateCartDisplay();
    }
    updateQuantity(id, quantity) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(id);
            }
            else {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartDisplay();
            }
        }
    }
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const emptyCart = document.querySelector('.empty-cart');
        // Update cart count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems.toString();
            cartCount.style.display = totalItems >= 0 ? 'flex' : 'none';
        }
        // Update cart items
        if (cartItems && emptyCart) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '';
                emptyCart.style.display = 'block';
            }
            else {
                emptyCart.style.display = 'none';
                cartItems.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
                // Add event listeners to cart item controls
                this.attachCartItemListeners();
            }
            this.updateCartSummary();
        }
        // Update total

        const checkoutBtn = document.getElementById("checkout-btn");
        if (checkoutBtn) {
            checkoutBtn.style.display = this.cart.length > 0 ? "inline-block" : "none";
        }
    }

    updateCartSummary() {
        let subtotal = 0;
        this.cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const iva = subtotal * 0.15;
        const total = subtotal + iva;

        const formatCurrency = num => `$${num.toFixed(2)} USD`;

        document.getElementById("cart-subtotal").textContent = formatCurrency(subtotal);
        document.getElementById("cart-iva").textContent = formatCurrency(iva);
        document.getElementById("cart-total").textContent = formatCurrency(total);  // total ya incluye IVA
    }

    updateProductStockAfterPurchase() {
        let products = JSON.parse(localStorage.getItem("productos")) || [];

        this.cart.forEach(cartItem => {
            const productIndex = products.findIndex(p => p.id === cartItem.id);
            if (productIndex !== -1) {
                products[productIndex].stock -= cartItem.quantity;
                if (products[productIndex].stock < 0) {
                    products[productIndex].stock = 0;  // Asegura que no sea negativo
                }
            }
        });

        localStorage.setItem("productos", JSON.stringify(products));
    }


    createCartItemHTML(item) {
        return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
        </div>
        <div class="cart-item-details" style="flex: 1; margin-left: 15px;">
          <h4 style="font-size: 0.9rem; margin-bottom: 5px; line-height: 1.3;">${item.name}</h4>
          <p style="color: var(--accent-pink); font-weight: 600; font-size: 0.9rem;">$${item.price.toFixed(2)} USD</p>
          <div class="quantity-controls" style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
            <button class="quantity-btn minus" style="width: 25px; height: 25px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">-</button>
            <span class="quantity" style="min-width: 20px; text-align: center;">${item.quantity}</span>
            <button class="quantity-btn plus" style="width: 25px; height: 25px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">+</button>
            <button class="remove-item" style="margin-left: auto; background: var(--accent-pink); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Eliminar</button>
          </div>
        </div>
      </div>
      <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
    `;
    }
    attachCartItemListeners() {
        const cartItems = document.getElementById('cart-items');
        cartItems === null || cartItems === void 0 ? void 0 : cartItems.addEventListener('click', (e) => {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem)
                return;
            const itemId = Number.parseInt(cartItem.dataset.id || '0');
            const quantitySpan = cartItem.querySelector('.quantity');
            const currentQuantity = Number.parseInt(quantitySpan.textContent || '0');
            if (target.classList.contains('plus')) {
                this.updateQuantity(itemId, currentQuantity + 1);
            }
            else if (target.classList.contains('minus')) {
                this.updateQuantity(itemId, currentQuantity - 1);
            }
            else if (target.classList.contains('remove-item')) {
                this.removeFromCart(itemId);
            }
        });
    }



    showConfirmModal(message) {
        return new Promise(resolve => {
            const modal = document.getElementById('confirm-modal');
            const modalMessage = modal.querySelector('p');
            const yesBtn = document.getElementById('confirm-yes');
            const noBtn = document.getElementById('confirm-no');

            modalMessage.textContent = message;
            modal.classList.remove('hidden');  // Mostrar modal

            yesBtn.onclick = () => {
                modal.classList.add('hidden');
                resolve(true);
            };

            noBtn.onclick = () => {
                modal.classList.add('hidden');
                resolve(false);
            };
        });
    }


    initializeCheckoutButton() {
        const checkoutBtn = document.getElementById("checkout-btn");
        if (!checkoutBtn) return;

        checkoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const activeUser = JSON.parse(localStorage.getItem("activeUser"));

            if (!activeUser) {
                showNotification("Debes iniciar sesión para finalizar la compra.");
                document.getElementById("cart-sidebar")?.classList.remove("open");
                document.getElementById("overlay")?.classList.remove("active");
                document.getElementById("auth-modal")?.classList.remove("hidden");
                document.getElementById("login-form")?.classList.remove("oculto");
                document.getElementById("register-form")?.classList.add("oculto");
                return;
            }

            if (this.cart.length === 0) {
                showNotification("Tu carrito está vacío.");
                return;
            }

            // 🔥 Confirmación usando el modal personalizado
            const confirmacion = await this.showConfirmModal("¿Estás seguro de realizar la compra?");
            if (!confirmacion) return;

            showNotification(`Compra finalizada. Gracias por tu compra, ${activeUser.username}!`);

            try {
                await this.generateUserPDF(activeUser, this.cart);
                this.updateProductStockAfterPurchase();
            } catch (error) {
                showNotification("Error generando PDF:", error);
            }

            this.cart = [];
            this.saveCartToStorage();
            this.updateCartDisplay();

            document.getElementById("cart-sidebar")?.classList.remove("open");
            document.getElementById("overlay")?.classList.remove("active");

            location.reload();
        });

    }




    async generateUserPDF(userData, cartItems) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const facturaNumero = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); // número aleatorio  
        doc.setFontSize(18);
        doc.text("Factura - HTMLStore", 20, 20);

        doc.setFontSize(12);
        doc.text(`Número de Factura: ${facturaNumero}`, 20, 30);
        doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 36);

        doc.text("Datos del usuario:", 20, 40);

        let yPos = 50;

        // Crear copia de userData sin la foto
        const userDataCopy = { ...userData };
        delete userDataCopy.photo;  // eliminamos la foto
        delete userDataCopy.password;

        // Mostrar datos del usuario (sin foto)
        for (const key in userDataCopy) {
            if (userDataCopy.hasOwnProperty(key)) {
                let value = userDataCopy[key];
                if (typeof value === "object") {
                    value = JSON.stringify(value);
                }
                const splitText = doc.splitTextToSize(`${capitalize(key)}: ${value}`, 170);
                doc.text(splitText, 20, yPos);
                yPos += splitText.length * 7;
            }
        }

        yPos += 10;
        doc.text("Productos comprados:", 20, yPos);
        yPos += 10;

        // Encabezados tabla productos
        doc.setFont(undefined, 'bold');
        doc.text("Producto", 20, yPos);
        doc.text("Cant.", 100, yPos);
        doc.text("Precio Unit.", 120, yPos);
        doc.text("Subtotal", 160, yPos);
        doc.setFont(undefined, 'normal');

        yPos += 7;

        let subtotal = 0;
        cartItems.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;

            doc.text(item.name, 20, yPos);
            doc.text(String(item.quantity), 100, yPos);
            doc.text(`$${item.price.toFixed(2)}`, 120, yPos);
            doc.text(`$${itemSubtotal.toFixed(2)}`, 160, yPos);

            yPos += 7;

            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });

        yPos += 10;
        const iva = subtotal * 0.15;
        const total = subtotal + iva;

        doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, yPos);
        yPos += 7;
        doc.text(`IVA (15%): $${iva.toFixed(2)}`, 140, yPos);
        yPos += 7;
        doc.setFont(undefined, 'bold');
        doc.text(`Total: $${total.toFixed(2)}`, 140, yPos);
        doc.setFont(undefined, 'normal');

        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        doc.save(`Factura_${userData.Nombre}_${Date.now()}.pdf`);
    }

    showCartNotification(productName) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.classList.add('cart-notif');
        notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 5px;">¡Producto agregado!</div>
      <div style="font-size: 0.9rem;">${productName}</div>
    `;
        document.body.appendChild(notification);
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    saveCartToStorage() {
        localStorage.setItem('electronicGamesCart', JSON.stringify(this.cart));
    }
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('electronicGamesCart');
        if (savedCart) {
            try {
                this.cart = JSON.parse(savedCart);
            }
            catch (error) {
                console.error('Error loading cart from storage:', error);
                this.cart = [];
            }
        }
    }
}
// Initialize the application
const app = new ElectronicGamesStore();
window.addToCart = (id, name, price, image) => {
    app.addToCart(id, name, price, image);
};
// Add highlight animation CSS
const style = document.createElement('style');
style.textContent = `
  .highlight {
    animation: highlight 2s ease-in-out;
  }

  @keyframes highlight {
    0%, 100% { background-color: transparent; }
    50% { background-color: rgba(188, 58, 97, 0.1); }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
// Función para mostrar notificaciones pequeñas

function showNotification(message, duration = 3000) {
    const container = document.getElementById("notification-container");
    if (!container) return;

    const notif = document.createElement("div");
    notif.className = "notification";
    notif.textContent = message;

    container.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, duration);
}


document.addEventListener("DOMContentLoaded", () => {

    let productos = [];
    try {
        const stored = JSON.parse(localStorage.getItem("productos"));
        if (Array.isArray(stored)) {
            productos = stored;
        } else {
            throw new Error("No es un array");
        }
    } catch {

        productos = [
            { id: 1, nombre: "Nintendo Switch Zelda Edition", precio: 475.0, categoria: "consola", imagen: "https://resources.sears.com.mx/medios-plazavip/mkt/65ba754971f87_nintendo-switch-oled-64gb-the-legend-of-zelda-tearsjpg.jpg?scale=500&qlty=75", stock: 10 },
            { id: 2, nombre: "Nintendo Switch Mario Edition", precio: 379.0, categoria: "consola", imagen: "https://resources.sears.com.mx/medios-plazavip/t1/1715803027NINTENDOSWITCHOLED64GBMARIOREDEDITION7PULGJPmascointroljpg?scale=500&qlty=75", stock: 5 },
            { id: 3, nombre: "Nintendo Switch Oled Neon", precio: 379.0, categoria: "consola", imagen: "https://resources.claroshop.com/medios-plazavip/t1/1715298906NintendoSwitchOledNeonMsKitAccesorios22En11jpg", stock: 7 },
            { id: 4, nombre: "Nintendo Switch Splatoon Edition", precio: 425.0, categoria: "consola", imagen: "https://comprarmag.com/wp-content/uploads/2024/05/WhatsApp-Image-2023-06-14-at-8.47.59-AM-1.jpeg", stock: 6 },
            { id: 5, nombre: "Asus Rog Ally Extreme Z1", precio: 749.0, categoria: "consola", imagen: "https://m.media-amazon.com/images/I/71k7sktKu7L._AC_SX450_.jpg", stock: 2 },
            { id: 6, nombre: "Valve Steam Deck OLED", precio: 790.0, categoria: "consola", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSog-GiUtfQt9Mq1aEKUWIo-j-aP3zofbIBbA&s", stock: 0 },
            { id: 7, nombre: "Palanca PS5 Roja", precio: 95.9, categoria: "accesorio", imagen: "https://http2.mlstatic.com/D_Q_NP_944000-MLA99504547436_112025-O.webp", stock: 3 },
            { id: 8, nombre: "Palanca PS5 Astro Bot", precio: 125.9, categoria: "accesorio", imagen: "https://www.abc.cl/dw/image/v2/BCPP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw8fb91140/images/large/5CC27973523.jpg?sw=1200&sh=1200&sm=fit", stock: 9 },
            { id: 9, nombre: "Palanca PS5 Spider-Man", precio: 37.9, categoria: "accesorio", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWoYJI-nVpalSMrxCbaDOLRl1io4cZ4bx2Ew&s", stock: 10 },
            { id: 10, nombre: "Palanca XBOX Minecraft", precio: 55.1, categoria: "accesorio", imagen: "https://m.media-amazon.com/images/I/71lLCjSKJ9L.jpg", stock: 0 },
            { id: 11, nombre: "Palanca XBOX TitanFall", precio: 162.4, categoria: "accesorio", imagen: "https://i.ebayimg.com/images/g/CIoAAOSwYU1nr2eW/s-l1200.jpg", stock: 7 },
            { id: 12, nombre: "Palanca XBOX Call Of Duty", precio: 162.4, categoria: "accesorio", imagen: "https://m.media-amazon.com/images/I/617klNqtkOL.jpg", stock: 13 }
        ];
        localStorage.setItem("productos", JSON.stringify(productos));
    }

    // 2. Función para renderizar productos filtrados:
    function renderProductosPorCategoria(categoria, contenedorSelector) {
        const contenedor = document.querySelector(contenedorSelector);
        if (!contenedor) return;

        // Filtrar productos por categoría
        const productosFiltrados = productos.filter(p => p.categoria === categoria);

        // Limpiar contenedor
        contenedor.innerHTML = "";

        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = `<p>No hay productos en la categoría ${categoria}.</p>`;
            return;
        }

        // Agregar productos al contenedor
        productosFiltrados.forEach(producto => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.dataset.productId = producto.id;

            card.innerHTML = `
          <div class="product-image">
            <img src="${producto.imagen}" alt="${producto.nombre}" style="height: 250px" />
          </div>
          <div class="product-info">
            <h3>${producto.nombre}</h3>
            <div class="product-price">
              <span class="price">A partir de $${producto.precio.toFixed(2)} USD</span>
            </div>
            <p class="product-stock" style="margin-bottom: 20px; font-size: 0.9rem;">
                    ${producto.stock > 0
                    ? `Stock: ${producto.stock}`
                    : `<span class="out-of-stock" style="color: #2cacce; font-weight: bold;">Fuera de stock</span>`}
            </p>
            <button class="add-to-cart" 
                onclick="addToCart(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}')"
                ${producto.stock === 0 ? 'disabled' : ''}>
                Agregar al carrito
            </button>
          </div>
        `;

            contenedor.appendChild(card);
        });
    }

    // 3. Llamadas a la función para que pinte productos en cada sección (usa los selectores de tu HTML):
    renderProductosPorCategoria("consola", "#consolas .products-grid");
    renderProductosPorCategoria("accesorio", "#accesorios .products-grid");



    // Guardar productos si aún no están en localStorage
    if (!localStorage.getItem("productos")) {
        localStorage.setItem("productos", JSON.stringify(productos));
    }

    // Obtener productos guardados y asegurarse de que sea un array
    const contenedor = document.getElementById("admin-productos");
    let productosGuardados;

    try {
        productosGuardados = JSON.parse(localStorage.getItem("productos"));
    } catch (e) {
        console.error("Error al parsear productos desde localStorage", e);
        productosGuardados = [];
    }

    if (!Array.isArray(productosGuardados)) {
        console.error("El contenido de 'productos' no es un array válido:", productosGuardados);
        productosGuardados = [];
    }

    const modal = document.getElementById("auth-modal");
    const loginBtn = document.querySelector(".login-btn");
    const closeBtn = document.getElementById("auth-close");

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    const showRegister = document.querySelector("#show-register");
    const showLogin = document.querySelector("#show-login");

    const photoUpload = document.getElementById("photo-upload");
    const photoPreview = document.getElementById("photo-preview");

    const video = document.getElementById("video");
    const takePhotoBtn = document.getElementById("take-photo");

    let stream;

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
    }

    function mostrarUsuarioEnNavbar(user) {
        const contenedor = document.getElementById("login-container");
        contenedor.innerHTML = `
      <li class="dropdown user-info-dropdown">
              <a href="#" class="dropdown-toggle user-info-toggle" style="text-decoration: none;">
                <img src="${user.photo || 'https://via.placeholder.com/30'}" alt="Foto de perfil">
          <span style="color: white; text-decoration: none;">${user.Nombre}</span>
              </a>
              <div class="dropdown-menu">
                <div class="submenu">
                    <a href="#" id="ver-perfil">👤 Ver perfil</a>
                    <a href="#" id="cerrar-sesion">🔒 Cerrar sesión</a>
                </div>
              </div>
            </li>
    `;

        const toggle = contenedor.querySelector(".user-info-toggle");
        const dropdown = contenedor.querySelector(".dropdown-menu");

        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("visible");
        });

        document.addEventListener("click", (e) => {
            if (contenedor.contains(e.target)) {
                dropdown.classList.remove("visible");
            }
        });
    }

    // Delegación para clicks en el dropdown dentro de #login-container
    document.getElementById("login-container").addEventListener("click", (e) => {
        if (e.target.id === "cerrar-sesion") {
            e.preventDefault();
            localStorage.removeItem("activeUser");
            showNotification("Has cerrado sesión.", 6000);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }


        if (e.target.id === "ver-perfil") {
            e.preventDefault();
            const usuarioActivo = JSON.parse(localStorage.getItem("activeUser"));
            if (usuarioActivo) {
                showNotification(`Perfil de: ${usuarioActivo.username}`);
            }
        }
    });

    // Mostrar usuario si está activo
    const usuarioActivo = JSON.parse(localStorage.getItem("activeUser"));
    if (usuarioActivo) {
        mostrarUsuarioEnNavbar(usuarioActivo);
    }

    // Mostrar modal login al pulsar botón
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("hidden");
        loginForm.classList.remove("oculto");
        registerForm.classList.add("oculto");
        stopCamera();
        photoPreview.classList.add("hidden");
        photoPreview.src = "";
        localStorage.removeItem("capturedPhoto");
        photoUpload.value = "";
    });

    // Cerrar modal
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        stopCamera();
        photoPreview.classList.add("hidden");
        photoPreview.src = "";
        localStorage.removeItem("capturedPhoto");
        photoUpload.value = "";
        loginForm.classList.remove("oculto");
        registerForm.classList.add("oculto");
    });

    // Mostrar formulario registro
    showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.add("oculto");
        registerForm.classList.remove("oculto");
        startCamera();
    });

    // Volver a login
    showLogin.addEventListener("click", (e) => {
        e.preventDefault();
        registerForm.classList.add("oculto");
        loginForm.classList.remove("oculto");
        stopCamera();
        photoPreview.classList.add("hidden");
        photoPreview.src = "";
        localStorage.removeItem("capturedPhoto");
        photoUpload.value = "";
    });

    // Preview imagen cargada
    photoUpload.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                photoPreview.src = e.target.result;
                photoPreview.classList.remove("hidden");
                localStorage.removeItem("capturedPhoto");
            };
            reader.readAsDataURL(file);
        } else return;
    });

    // Tomar foto con cámara
    takePhotoBtn.addEventListener("click", () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        photoPreview.src = imageData;
        photoPreview.classList.remove("hidden");
        localStorage.setItem("capturedPhoto", imageData);
        photoUpload.value = "";
    });

    // Registro usuario
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const Nombre = registerForm.querySelectorAll('input[type="text"]')[0].value;
        const Email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;
        const Telefono = registerForm.querySelector('input[type="tel"]').value;
        const Direccion = registerForm.querySelectorAll('input[type="text"]')[1].value;
        const photoFile = photoUpload.files[0];

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const exists = users.find(user => user.Email === Email);
        if (exists) {
            showNotification("Ya existe un usuario con ese correo.");
            return;
        }

        const guardarUsuario = (photoBase64) => {
            const nuevoUsuario = { Nombre, Email, password, Telefono, Direccion, photo: photoBase64 };
            users.push(nuevoUsuario);
            localStorage.setItem("users", JSON.stringify(users));
            showNotification("Registro exitoso. Ahora puedes iniciar sesión.");
            registerForm.reset();
            registerForm.classList.add("oculto");
            loginForm.classList.remove("oculto");
            photoPreview.classList.add("hidden");
            photoPreview.src = "";
            localStorage.removeItem("capturedPhoto");
            photoUpload.value = "";
            stopCamera();
        };

        const capturedPhoto = localStorage.getItem("capturedPhoto");
        if (capturedPhoto) {
            guardarUsuario(capturedPhoto);
        } else if (photoFile) {
            const reader = new FileReader();
            reader.onload = function (event) {
                guardarUsuario(event.target.result);
            };
            reader.readAsDataURL(photoFile);
        } else {
            guardarUsuario(null);
        }
    });

    // Login usuario
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Verificar si es el admin
        if (email === "admini@gmail.com" && password === "admini") {
            showNotification("Bienvenido, Administrador");
            // Puedes guardar algo especial si deseas:
            localStorage.setItem("activeUser", JSON.stringify({
                Nombre: "Administrador",
                Email: email,
                photo: "https://pbs.twimg.com/profile_images/1647754532531863552/DBzwIb8K_400x400.jpg" // o alguna imagen de admin
            }));
            // Redireccionar a admin.html
            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1500); // espera 1.5 segundos para mostrar notificación
            return; // detener el flujo aquí
        }

        // Resto del login normal para usuarios
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.Email === email && user.password === password);

        if (user) {
            showNotification(`¡Bienvenido, ${user.Nombre}!`);
            localStorage.setItem("activeUser", JSON.stringify(user));
            mostrarUsuarioEnNavbar(user);
            modal.classList.add("hidden");
            loginForm.reset();
        } else {
            showNotification("Correo o contraseña incorrectos.");
        }
    })
});




