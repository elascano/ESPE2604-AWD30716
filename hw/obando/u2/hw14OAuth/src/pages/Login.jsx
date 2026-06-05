
import { GoogleLogin } from '@react-oauth/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Login() {

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await fetch('/api/v1/login/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token_id: credentialResponse.credential })
                })

            if (res.ok) {
                const data = await res.json()
                console.log("Inicio de sesión exitoso:", data);
                localStorage.setItem("token", data.access_token);
                window.location.href = "/dashboard";
            } else {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Error desconocido");
            }

        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
            alert(error.message);
        }
    }


    return (
        <>
            <Navbar />
            <main id="main-content" className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 wow fadeIn" data-wow-delay="0.1s">
                            <div className="form-wrapper mx-auto">
                                <div className="form-header text-center mb-4">
                                    <p className="d-inline-block bg-dark text-primary py-1 px-4 mb-3"
                                        style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                        Bienvenido de nuevo</p>
                                    <h2 className="text-center" style={{ fontSize: '2.2rem' }}>Inicio de sesión</h2>
                                    <p className="text-center mt-2">Usa tu cuenta de Google para acceder o crear una cuenta nueva.</p>
                                </div>
                                <div className="d-flex flex-column align-items-center mt-4">
                                    <div className="form-animated-element stagger-1 w-100 d-flex justify-content-center mb-3">
                                        <GoogleLogin
                                            onSuccess={handleGoogleLogin}
                                            onError={() => {
                                                console.log('Login Failed');
                                            }}
                                        />
                                    </div>
                                    <div className="col-12 form-animated-element stagger-3 mt-2">
                                        <button className="btn-submit-custom w-100" type="button" onClick={(e) => e.preventDefault()}>Iniciar Sesión <i
                                                className="fas fa-sign-in-alt ms-2"></i></button>
                                    </div>
                                    <div className="col-12 form-animated-element stagger-4">
                                        <div className="form-footer mt-3 text-center">
                                            ¿No tienes una cuenta? <a href="/">Regístrate aquí</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </main>
            <Footer />
        </>
    );
}

export default Login;