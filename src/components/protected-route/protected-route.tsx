import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIsAuthenticated, getAuthLoading } from '../../services/selectors';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isLoading = useSelector(getAuthLoading);

  const loadingNode = <div>Проверка авторизации...</div>;
  const redirectNode = (
    <Navigate to='/login' state={{ from: location }} replace />
  );

  if (isLoading) return loadingNode;
  if (!isAuthenticated) return redirectNode;

  return <>{children}</>;
};
