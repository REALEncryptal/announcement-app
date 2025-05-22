import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProfile } from '../api/auth';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loadUserProfile: () => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProfile();
      setUser(data.user);
    } catch (err) {
      setUser(null);
      setError('Failed to fetch user profile');
      // Error is handled by setting the error state
    } finally {
      setIsLoading(false);
    }
  };

  // Load user on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
