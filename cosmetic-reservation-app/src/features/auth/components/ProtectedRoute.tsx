// src/features/auth/components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const { isAuthenticated, user, checkTokenExpiry } = useAuthStore();
    const location = useLocation();

    // Proactively check for token expiry on route change
    useEffect(() => {
        if (isAuthenticated) {
            checkTokenExpiry();
        }
    }, [location.pathname, isAuthenticated, checkTokenExpiry]);

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to access-denied if role is not sufficient
        return <Navigate to="/access-denied" replace />;
    }

    return <>{children}</>;
};
