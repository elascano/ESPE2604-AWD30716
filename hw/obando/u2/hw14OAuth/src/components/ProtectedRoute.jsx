import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    
    // Si no hay token guardado, mandamos al usuario de regreso al Login (ruta /)
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Si tiene token, renderizamos la ruta (Dashboard)
    return children;
}

export default ProtectedRoute;
