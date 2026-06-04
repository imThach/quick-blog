import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth();
    console.log("Check ProtectedRoute:", { user, loading, allowedRoles });
    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Đang kiểm tra quyền truy cập...</p>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    const userRole = user.role || 'user';
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}