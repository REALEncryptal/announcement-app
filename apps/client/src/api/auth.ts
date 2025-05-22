// Auth API functions for interacting with the server
const API_URL = 'http://localhost:3000'; // Update with your server URL

export const login = (): void => {
  // Redirect to auth page with loading screen, which will then redirect to server
  window.location.href = '/auth?action=login';
};

export const logout = (): void => {
  // Redirect to auth page with loading screen, which will then redirect to server
  window.location.href = '/auth?action=logout';
};

export const getProfile = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    credentials: 'include', // Important for cookies/session
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return await response.json();
};
