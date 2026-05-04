document.addEventListener("DOMContentLoaded", () => {

  // Elementos del modal
  const addProductBtn = document.getElementById("agregar-producto-btn");
  const addProductModal = document.getElementById("add-product-modal");
  const closeAddProductModal = document.getElementById("close-add-product-modal");
  const addProductForm = document.getElementById("add-product-form");
  const addProductPhotoInput = document.getElementById("add-product-photo");
  const addProductPhotoPreview = document.getElementById("add-product-photo-preview");
  const editProductStockInput = document.getElementById("edit-product-stock");


  const openCameraBtn = document.getElementById("open-camera-btn");
  const takePhotoBtn = document.getElementById("take-photo-btn");
  const cameraContainer = document.getElementById("camera-container");
  const cameraVideo = document.getElementById("camera-video");
  let cameraStream = null;

  const editProductCategoryInput = document.getElementById("edit-product-category");


  // Activar cámara al dar clic en "Usar cámara"
  openCameraBtn.addEventListener("click", async () => {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraVideo.srcObject = cameraStream;
      cameraContainer.classList.remove("hidden");
    } catch (error) {
      alert("No se pudo acceder a la cámara.");
    }
  });

  // Tomar la foto desde la cámara
  takePhotoBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = cameraVideo.videoWidth;
    canvas.height = cameraVideo.videoHeight;
    canvas.getContext("2d").drawImage(cameraVideo, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    addProductPhotoPreview.src = imageData;
    detenerCamara();
  });

  function detenerCamara() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    cameraContainer.classList.add("hidden");
  }



  // Mostrar modal
  addProductBtn.addEventListener("click", () => {
    addProductPhotoPreview.src = ""; // limpia previa
    addProductPhotoInput.value = "";
    addProductForm.reset();
    addProductModal.classList.remove("hidden");
  });

  // Cerrar modal
  closeAddProductModal.addEventListener("click", () => {
    addProductModal.classList.add("hidden");
    detenerCamara();
  });


  // Cambiar imagen previa
  addProductPhotoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      addProductPhotoPreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Guardar producto
  addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = addProductForm.nombre.value.trim();
    const precio = parseFloat(addProductForm.precio.value);
    const imagen = addProductPhotoPreview.src || "";
    const categoria = addProductForm.categoria.value.trim();



    if (!nombre || isNaN(precio)) {
      alert("Nombre o precio inválido.");
      return;
    }

    const stock = parseInt(addProductForm.stock.value) || 0;

    const nuevoProducto = { nombre, precio, imagen, categoria, stock };
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(productos));

    addProductModal.classList.add("hidden");
    renderProducts();
    alert("Producto agregado exitosamente.");
  });




  // --- Contenedores y secciones ---
  const productsList = document.getElementById('admin-productos');
  const usuariosLista = document.getElementById("usuarios-lista");
  const usuariosSection = document.getElementById("usuarios");
  const productosSection = document.getElementById("productos");
  const bienvenidaSection = document.getElementById("bienvenido");

  const usuariosLink = document.getElementById("usuarios-link");
  const productosLink = document.getElementById("productos-link");

  // Modal y formulario edición usuario
  const editModal = document.getElementById("edit-user-modal");
  const closeEditModalBtn = document.getElementById("close-edit-modal");
  const editUserForm = document.getElementById("edit-user-form");
  const photoPreview = document.getElementById("edit-user-photo-preview");
  const photoInput = document.getElementById("edit-user-photo");

  // Modal y formulario edición producto (nuevo)
  const editProductModal = document.getElementById("edit-product-modal");
  const closeEditProductModalBtn = document.getElementById("close-edit-product-modal");
  const editProductForm = document.getElementById("edit-product-form");
  const editProductPhotoInput = document.getElementById("edit-product-photo");
  const editProductPhotoPreview = document.getElementById("edit-product-photo-preview");

  // --- Datos ---
  let usuarios = JSON.parse(localStorage.getItem("users")) || [];
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let editingUserIndex = null;
  let editingProductIndex = null;

  // Placeholder imagen base64
  const placeholderImgBase64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iMzIiIHk9IjMyIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5Vc2VyczwvdGV4dD48L3N2Zz4=";

  // --- FUNCIONES ---

  // Renderizar productos
  function renderProducts() {
    productsList.innerHTML = "";
    if (productos.length === 0) {
      productsList.innerHTML = "<p>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto, index) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image">
          <img src="${producto.imagen || placeholderImgBase64}" alt="${producto.nombre}" />
        </div>
        <div class="product-info">
          <h3>${producto.nombre}</h3>
          <span class="price">$${producto.precio.toFixed(2)} USD</span>

          <p class="product-stock" style="margin-bottom: 20px; font-size: 0.9rem;">
            ${producto.stock > 0
          ? `Stock: ${producto.stock}`
          : `<span class="out-of-stock" style="color: #2cacce; font-weight: bold;">Fuera de stock</span>`}
          </p>

          <button data-index="${index}" class="edit-product-btn" style="
          background-color: #28a745;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-right: 10px;
        ">Editar</button>

        <button data-index="${index}" class="delete-product-btn" style="
          background-color: #dc3545;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        ">Eliminar</button>

                </div>
              `;


      productsList.appendChild(card);
    });

    // Eventos botones editar producto
    document.querySelectorAll(".edit-product-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        editingProductIndex = e.target.getAttribute("data-index");
        abrirModalEditarProducto(editingProductIndex);
      });
    });

    // Eventos botones eliminar producto
    document.querySelectorAll(".delete-product-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.getAttribute("data-index");
        if (confirm(`¿Seguro que quieres eliminar el producto "${productos[idx].nombre}"?`)) {
          productos.splice(idx, 1);
          localStorage.setItem("productos", JSON.stringify(productos));
          renderProducts();
        }
      });
    });
  }

  // Abrir modal edición usuario
  function abrirModalEditar(index) {
    const user = usuarios[index];
    if (!user) return;

    editingUserIndex = index;
    editUserForm.Nombre.value = user.Nombre || "";
    editUserForm.Email.value = user.Email || "";
    editUserForm.Telefono.value = user.Telefono || "";
    editUserForm.Direccion.value = user.Direccion || "";
    photoPreview.src = user.photo || placeholderImgBase64;

    photoInput.value = "";
    editModal.classList.remove("hidden");
  }

  // Abrir modal edición producto (nuevo)
  function abrirModalEditarProducto(index) {
    const producto = productos[index];
    if (!producto) return;

    editingProductIndex = index;
    editProductForm.nombre.value = producto.nombre || "";
    editProductForm.precio.value = producto.precio || 0;
    editProductPhotoPreview.src = producto.imagen || placeholderImgBase64;
    editProductStockInput.value = producto.stock || 0;

    editProductCategoryInput.value = producto.categoria || "";


    editProductPhotoInput.value = "";
    editProductModal.classList.remove("hidden");
  }

  // Cerrar modales
  closeEditModalBtn.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });
  closeEditProductModalBtn.addEventListener("click", () => {
    editProductModal.classList.add("hidden");
  });

  // Cambiar foto usuario
  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.");
      photoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = e => photoPreview.src = e.target.result;
    reader.readAsDataURL(file);
  });

  // Cambiar foto producto
  editProductPhotoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.");
      editProductPhotoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = e => editProductPhotoPreview.src = e.target.result;
    reader.readAsDataURL(file);
  });

  // Guardar cambios usuario
  editUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (editingUserIndex === null) return;

    const updatedUser = {
      Nombre: editUserForm.Nombre.value.trim(),
      Email: editUserForm.Email.value.trim(),
      Telefono: editUserForm.Telefono.value.trim(),
      Direccion: editUserForm.Direccion.value.trim(),
      photo: photoPreview.src
    };

    usuarios[editingUserIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(usuarios));
    mostrarUsuarios();
    editModal.classList.add("hidden");
  });

  // Guardar cambios producto (nuevo)
  editProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (editingProductIndex === null) return;

    const nombre = editProductForm.nombre.value.trim();
    const precio = parseFloat(editProductForm.precio.value);
    if (nombre === "" || isNaN(precio) || precio < 0) {
      alert("Nombre o precio inválidos.");
      return;
    }
    const stock = parseInt(editProductStockInput.value) || 0;
    const updatedProducto = {
      nombre,
      precio,
      imagen: editProductPhotoPreview.src,
      categoria: editProductCategoryInput.value.trim(),
      stock
    };

    productos[editingProductIndex] = updatedProducto;
    localStorage.setItem("productos", JSON.stringify(productos));
    renderProducts();
    editProductModal.classList.add("hidden");
  });

  // Renderizar usuarios
  function mostrarUsuarios() {
    bienvenidaSection.style.display = "none";
    productosSection.style.display = "none";
    usuariosSection.style.display = "block";

    if (usuarios.length === 0) {
      usuariosLista.innerHTML = "<p>No hay usuarios registrados.</p>";
      return;
    }

    let html = `
      <table id="myTable"">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    usuarios.forEach((user, index) => {
      html += `
        <tr>
          <td><img src="${user.photo || placeholderImgBase64}" alt="Foto" style="width:50px; height:50px; border-radius:50%; object-fit:cover;" /></td>
          <td>${user.Nombre || ""}</td>
          <td>${user.Email || ""}</td>
          <td>${user.Telefono || ""}</td>
          <td>${user.Direccion || ""}</td>
          <td>
            <button data-index="${index}" class="editar-btn">Editar</button>
            <button data-index="${index}" class="eliminar-btn">Eliminar</button>
          </td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    usuariosLista.innerHTML = html;
    $('#myTable').DataTable();

    // Eventos eliminar usuario
    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.getAttribute("data-index");
        if (confirm(`¿Seguro que quieres eliminar al usuario "${usuarios[idx].Nombre}"?`)) {
          usuarios.splice(idx, 1);
          localStorage.setItem("users", JSON.stringify(usuarios));
          mostrarUsuarios();
        }
      });
    });

    // Eventos editar usuario
    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        editingUserIndex = e.target.getAttribute("data-index");
        abrirModalEditar(editingUserIndex);
      });
    });
  }

  // Mostrar sección productos
  function mostrarProductos() {
    bienvenidaSection.style.display = "none";
    usuariosSection.style.display = "none";
    productosSection.style.display = "block";
    renderProducts();
  }

  // Navegación menú
  usuariosLink.addEventListener("click", (e) => {
    e.preventDefault();
    usuarios = JSON.parse(localStorage.getItem("users")) || [];
    mostrarUsuarios();
  });

  productosLink.addEventListener("click", (e) => {
    e.preventDefault();
    productos = JSON.parse(localStorage.getItem("productos")) || [];
    mostrarProductos();
  });

  // Mostrar usuario activo navbar
  function mostrarAdminNavbar() {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    if (!user) return;

    const contenedor = document.getElementById("login-container");
    contenedor.innerHTML = `
      <li class="dropdown user-info-dropdown">
        <a href="#" class="dropdown-toggle user-info-toggle">
          <img src="${user.photo || placeholderImgBase64}" alt="Foto de perfil" />
          <span style="color: white;">${user.Nombre}</span>
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
      if (!contenedor.contains(e.target)) {
        dropdown.classList.remove("visible");
      }
    });

    contenedor.addEventListener("click", (e) => {
      if (e.target.id === "cerrar-sesion") {
        e.preventDefault();
        localStorage.removeItem("activeUser");
        location.href = "index.html";
      }

      if (e.target.id === "ver-perfil") {
        e.preventDefault();
        alert(`Perfil de: ${user.Nombre} (${user.Email})`);
      }
    });
  }

  mostrarAdminNavbar();

  // Inicio mostrar bienvenida
  bienvenidaSection.style.display = "block";
  usuariosSection.style.display = "none";
  productosSection.style.display = "none";
});
