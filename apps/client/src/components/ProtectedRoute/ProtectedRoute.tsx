import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '@/api/auth';
import { LoadingPage } from '@/pages/Loading/Loading.page';

type ProtectedRouteProps = {
  children?: React.ReactNode;
};

/**
 * ProtectedRoute component that verifies authentication
 * Redirects to home page if user is not authenticated
 * Renders children or an Outlet if user is authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while authentication status is being determined
  if (isLoading) {
    return <LoadingPage message="Verifying your account..." />;
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    login();
    return null;
  }

  // If authenticated, render children or outlet
  return children ? <>{children}</> : <Outlet />;
};
