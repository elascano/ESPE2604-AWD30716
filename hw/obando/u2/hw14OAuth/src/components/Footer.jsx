import React from 'react';

function Footer() {
    return (
        <div className="container-fluid bg-secondary text-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-4 col-md-6">
                        <h4 className="text-uppercase mb-4">Contáctanos</h4>
                        <div className="d-flex align-items-center mb-2">
                            <div className="btn-square bg-dark flex-shrink-0 me-3">
                                <span className="fa fa-map-marker-alt text-primary"></span>
                            </div>
                            <span>Calle Inés Gangotena con Av. Atahualpa</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <div className="btn-square bg-dark flex-shrink-0 me-3">
                                <span className="fa fa-clock text-primary"></span>
                            </div>
                            <span>10:00 a.m. - 8:30 p.m.</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="btn-square bg-dark flex-shrink-0 me-3">
                                <span className="fa fa-cut text-primary"></span>
                            </div>
                            <span>Barbería PANDA Black And White</span>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <h4 className="text-uppercase mb-4">Enlaces Rápidos</h4>
                        <a className="btn btn-link" href="/about">Nosotros</a>
                        <a className="btn btn-link" href="/contact">Contacto</a>
                        <a className="btn btn-link" href="/service">Servicios</a>
                        <a className="btn btn-link" href="/price">Precios</a>
                        <a className="btn btn-link" href="/open">Horarios</a>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <h4 className="text-uppercase mb-4">Agenda</h4>
                        <div className="position-relative mb-4">
                            <a href="/" className="btn btn-primary py-2 px-4">
                                Agendar cita
                            </a>
                        </div>
                        <div className="d-flex pt-1 m-n1">
                            <a className="btn btn-lg-square btn-dark text-primary m-1" href=""><i className="fab fa-twitter"></i></a>
                            <a className="btn btn-lg-square btn-dark text-primary m-1" href=""><i className="fab fa-facebook-f"></i></a>
                            <a className="btn btn-lg-square btn-dark text-primary m-1" href=""><i className="fab fa-youtube"></i></a>
                            <a className="btn btn-lg-square btn-dark text-primary m-1" href=""><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; <a className="border-bottom" href="#">Barbería PANDA Black And White</a>, todos los derechos reservados.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
