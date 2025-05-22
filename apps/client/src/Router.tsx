import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from './pages/Landing/Landing.page';
import { CreatePostPage } from './pages/CreatePost/CreatePost.page';
import { DashboardPage } from './pages/Dashboard/Dashboard.page';
import { AuthPage } from './pages/Auth/Auth.page';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/create',
    element: <ProtectedRoute><CreatePostPage /></ProtectedRoute>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  }
]);

export function Router() {
  return <RouterProvider router={router} />;
}
