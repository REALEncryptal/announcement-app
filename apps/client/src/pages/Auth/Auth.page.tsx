import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingPage } from '../Loading/Loading.page';

/**
 * Auth page that handles login and logout redirections with loading state
 * Shows a loading screen until the user is redirected to the authentication provider
 */
export function AuthPage() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  
  useEffect(() => {
    // Small delay to ensure the loading page is shown before redirect
    const timer = setTimeout(() => {
      if (action === 'login') {
        // Redirect to server auth login endpoint
        window.location.href = 'http://localhost:3000/auth/login';
      } else if (action === 'logout') {
        // Redirect to server auth logout endpoint
        window.location.href = 'http://localhost:3000/auth/logout';
      }
    }, 1000); // 1 second delay for visual feedback
    
    return () => clearTimeout(timer);
  }, [action]);
  
  const message = action === 'logout' 
    ? 'Logging you out...' 
    : 'Redirecting to login...';
    
  return <LoadingPage message={message} />;
}
