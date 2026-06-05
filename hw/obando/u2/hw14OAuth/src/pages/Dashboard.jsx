function Dashboard() {
    return (
        <>
            <button className="sidebar-toggle" aria-label="Toggle sidebar"><i className="fa-solid fa-bars"></i></button>

            <nav className="sidebar">
                <div className="brand-text"><i className="fa-solid fa-scissors"></i> SHARKHUB</div>
                <a href="/barber/dashboard/agenda" className="nav-link active" data-tab="agenda" >
                    <i className="fa-regular fa-calendar-days"></i>Mi Agenda
                </a>
                <a href="/barber/dashboard/services" className="nav-link" data-tab="services">
                    <i className="fa-solid fa-list-check"></i> Mis Servicios
                </a>
                <a href="/barber/dashboard/products" className="nav-link" data-tab="products">
                    <i className="fa-solid fa-box-open"></i> Mis Productos
                </a>
                <a href="/" className="nav-link logout-mt">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión
                </a>
            </nav>

            <main className="main-content">
                <header className="page-header">
                    <div>
                        <h2>Panel de trabajo</h2>
                        <p className="text-muted mb-0">Gestiona tus citas, servicios y catálogo.</p>
                    </div>
                    <div className="user-profile">
                        <div className="text-end d-none d-sm-block">
                            <h6 className="mb-0" id="barberProfileName">Cargando...</h6>
                            <small className="text-muted" id="barberProfileRole">Barbero</small>
                        </div>
                        <img id="barberProfileAvatar" src="https://ui-avatars.com/api/?name=Barbero&background=D4AF37&color=000" alt="Barber" className="avatar" />
                    </div>
                </header>

                {/* Tab: Agenda (HU23 + HU25) */}
                <section id="agenda" className="content-section active">
                    <div className="row g-4 mb-5">
                        <div className="col-md-6">
                            <div className="stat-card">
                                <div className="stat-info"><h3 id="todayAppointmentsCount">0</h3><p>Citas de hoy</p></div>
                                <div className="stat-icon"><i className="fa-solid fa-clock"></i></div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="stat-card">
                                <div className="stat-info"><h3 id="pendingAppointmentsCount">0</h3><p>Solicitudes pendientes</p></div>
                                <div className="stat-icon"><i className="fa-solid fa-clipboard-list"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="section-title">
                        <h4>Agenda de citas</h4>
                        <input type="date" id="appointmentDateFilter" className="form-control form-control-sm" style={{ width: 'auto' }} />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-dashboard table-hover">
                            <thead>
                                <tr>
                                    <th>Hora</th>
                                    <th>Cliente</th>
                                    <th>Servicio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="barberAppointmentsTableBody">
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">Cargando citas...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Tab: Services (HU12-15) */}
                <section id="services" className="content-section">
                    <div className="section-title">
                        <h4>Mis Servicios</h4>
                    </div>
                    <div className="section-actions">
                        <button 
                            className="btn btn-outline-gold btn-sm dashboard-action-btn"
                            data-bs-toggle="modal" 
                            data-bs-target="#serviceModal">
                            <i className="fa-solid fa-plus"></i> Agregar Servicio
                        </button>

                        <button 
                            className="btn btn-outline-gold btn-sm dashboard-action-btn" 
                            id="openEditServicesModalBtn">
                            <i className="fa-solid fa-pen-to-square"></i> Editar servicio
                        </button>

                        <button 
                            className="btn btn-outline-danger btn-sm dashboard-action-btn" 
                            id="openDeleteServicesModalBtn">
                            <i className="fa-solid fa-trash"></i> Eliminar servicio
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-dashboard table-hover">
                            <thead><tr>
                                <th>Nombre del Servicio</th>
                                <th>Descripción</th>
                                <th>Duración</th>
                                <th>Precio</th>
                            </tr></thead>
                            <tbody>
                                {/* Dynamically loaded by barber-dashboard.js */}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Tab: Products (HU16-19) */}
                <section id="products" className="content-section">
                    <div className="section-title">
                        <h4>Mi Catálogo de Productos</h4>
                    </div>
                    <div className="section-actions">
                        <button 
                            className="btn btn-outline-gold btn-sm dashboard-action-btn"
                            data-bs-toggle="modal" 
                            data-bs-target="#productModal">
                            <i className="fa-solid fa-plus"></i> Agregar Producto
                        </button>
                        <button 
                            className="btn btn-outline-gold btn-sm dashboard-action-btn" 
                            id="openEditProductsModalBtn">
                            <i className="fa-solid fa-pen-to-square"></i> Editar producto
                        </button>

                        <button 
                            className="btn btn-outline-danger btn-sm dashboard-action-btn" 
                            id="openDeleteProductsModalBtn">
                            <i className="fa-solid fa-trash"></i> Eliminar producto
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-dashboard table-hover">
                            <thead><tr><th>Nombre del Producto</th><th>Categoría</th><th>Stock</th><th>Precio</th></tr></thead>
                            <tbody>
                                {/* Dynamically loaded by barber-dashboard.js */}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            
            {/* Modal for Products */}
            <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content bg-dark text-white border-gold">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title" id="productModalLabel">Detalles del Producto</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form id="productForm">
                            <div className="modal-body">
                                <input type="hidden" id="productId" />
                                <div className="mb-3">
                                    <label htmlFor="productName" className="form-label">Nombre</label>
                                    <input type="text" className="form-control bg-dark text-white border-secondary" id="productName" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="productDescription" className="form-label">Descripción</label>
                                    <textarea className="form-control bg-dark text-white border-secondary" id="productDescription"></textarea>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="productPrice" className="form-label">Precio</label>
                                        <input type="number" step="0.01" className="form-control bg-dark text-white border-secondary" id="productPrice" required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="productStock" className="form-label">Stock</label>
                                        <input type="number" className="form-control bg-dark text-white border-secondary" id="productStock" required />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="btn btn-gold">Guardar Producto</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal for Select Product to Edit */}
            <div className="modal fade" id="editProductsModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-dark text-light">
                        <div className="modal-header">
                            <h5 className="modal-title">Editar producto</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <p>Selecciona el producto que deseas editar.</p>

                            <table className="table table-dashboard">
                                <thead>
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>Producto</th>
                                        <th>Stock</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody id="editProductsTableBody">
                                </tbody>
                            </table>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>

                            <button type="button" className="btn btn-gold" id="confirmEditProductBtn">
                                Editar seleccionado
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Delete Product */}
            <div className="modal fade" id="deleteProductsModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-dark text-light">
                        <div className="modal-header">
                            <h5 className="modal-title">Eliminar productos</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <p>Selecciona los productos que deseas eliminar.</p>

                            <table className="table table-dashboard">
                                <thead>
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>Producto</th>
                                        <th>Stock</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody id="deleteProductsTableBody">
                                </tbody>
                            </table>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>

                            <button type="button" className="btn btn-danger" id="confirmDeleteProductsBtn">
                                Eliminar seleccionados
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Services */}
            <div className="modal fade" id="serviceModal" tabIndex="-1" aria-labelledby="serviceModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content bg-dark text-white border-gold">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title" id="serviceModalLabel">Detalles del Servicio</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form id="serviceForm">
                            <div className="modal-body">
                                <input type="hidden" id="serviceId" />
                                <div className="mb-3">
                                    <label htmlFor="serviceName" className="form-label">Nombre</label>
                                    <input type="text" className="form-control bg-dark text-white border-secondary" id="serviceName" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="serviceDescription" className="form-label">Descripción</label>
                                    <textarea className="form-control bg-dark text-white border-secondary" id="serviceDescription"></textarea>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="servicePrice" className="form-label">Precio</label>
                                        <input type="number" step="0.01" className="form-control bg-dark text-white border-secondary" id="servicePrice" required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="serviceDuration" className="form-label">Duración (min)</label>
                                        <input type="number" className="form-control bg-dark text-white border-secondary" id="serviceDuration" required />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="btn btn-gold">Guardar Servicio</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal for Select Service to Edit */}
            <div className="modal fade" id="editServicesModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-dark text-light">
                        <div className="modal-header">
                            <h5 className="modal-title">Editar servicio</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <p>Selecciona el servicio que deseas editar.</p>

                            <table className="table table-dashboard">
                                <thead>
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>Servicio</th>
                                        <th>Duración</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody id="editServicesTableBody"></tbody>
                            </table>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-gold" id="confirmEditServiceBtn">Editar seleccionado</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Delete Service */}
            <div className="modal fade" id="deleteServicesModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content bg-dark text-light">
                        <div className="modal-header">
                            <h5 className="modal-title">Eliminar servicios</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <p>Selecciona los servicios que deseas eliminar.</p>

                            <table className="table table-dashboard">
                                <thead>
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>Servicio</th>
                                        <th>Duración</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody id="deleteServicesTableBody"></tbody>
                            </table>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger" id="confirmDeleteServicesBtn">Eliminar seleccionados</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;