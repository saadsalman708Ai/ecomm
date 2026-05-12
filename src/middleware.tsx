import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { OrderSuspenseLoader } from './components/shared/OrderSuspenseLoader';
import { AdminSuspenseLoader } from './components/shared/AdminSuspenseLoader';

export const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-[90vh] w-full flex items-center justify-center">
        {adminOnly ? <AdminSuspenseLoader /> : <OrderSuspenseLoader />}
      </div>
    );
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to home if user is authenticated but not admin
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
