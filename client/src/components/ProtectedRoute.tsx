import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: ('customer' | 'admin')[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        // Decide which login to redirect based on the requested path or a default
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to their specific dashboard if they try to access an unauthorized route
        if (user.role === 'admin') {
            return <Navigate to="/dashboard/admin" replace />;
        } else {
            return <Navigate to="/dashboard/customer" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
