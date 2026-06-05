import React from 'react';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-secondary navbar-dark sticky-top py-lg-0 px-lg-5">
            <a href="/" className="navbar-brand ms-4 ms-lg-0" data-section="home">
                <div className="d-flex align-items-center">
                    <img src="/img/BarberShop_PandaBlackAndWhite.png"
                        alt="Logo Barbería PANDA Black And White"
                        style={{ height: '58px', width: 'auto', marginRight: '12px' }} />
                    <h1 className="mb-0 text-primary text-uppercase">Barbería PANDA Black And White</h1>
                </div>
            </a>
            <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto p-4 p-lg-0">
                    <a href="/" className="nav-item nav-link active text-uppercase" data-section="home">Inicio</a>
                    <a href="/about" className="nav-item nav-link text-uppercase" data-section="about">Nosotros</a>
                    <a href="/service" className="nav-item nav-link text-uppercase" data-section="service">Servicios</a>

                    <div className="nav-item dropdown">
                        <a href="#" className="nav-link dropdown-toggle text-uppercase" data-bs-toggle="dropdown">Páginas</a>
                        <div className="dropdown-menu m-0">
                            <a href="/price" className="dropdown-item text-uppercase" data-section="price">Precios</a>
                            <a href="/team" className="dropdown-item text-uppercase" data-section="team">Barberos</a>
                            <a href="/open" className="dropdown-item text-uppercase" data-section="open">Horarios</a>
                            <a href="/testimonial" className="dropdown-item text-uppercase" data-section="testimonial">Opiniones</a>
                            <a href="/404" className="dropdown-item text-uppercase" data-section="notFound">Página 404</a>
                        </div>
                    </div>

                    <a href="/contact" className="nav-item nav-link text-uppercase" data-section="contact">Contacto</a>

                    <a href="/customer/login" className="btn btn-primary rounded-0 py-2 px-lg-4 mt-3 mt-lg-0 ms-lg-3 align-self-start align-self-lg-center">
                        Agendar Cita
                        <i className="fa fa-arrow-right ms-3"></i>
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
