import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react';

// Use proxy in development, full URL in production
const API_BASE_URL = import.meta.env.DEV ? '' : 'http://localhost:5001';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  designation?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to check if server is running with multiple attempts
const checkServerHealth = async (retries = 3): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout per attempt
      
      // Try both proxy and direct connection
      const urls = [
        `${API_BASE_URL}/api/health`,
        'http://localhost:5001/api/health' // Fallback direct connection
      ];
      
      for (const url of urls) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
            mode: 'cors',
          });
          
          clearTimeout(timeoutId);
          if (response.ok) {
            return true;
          }
        } catch (err) {
          // Try next URL
          continue;
        }
      }
      
      clearTimeout(timeoutId);
    } catch (error: any) {
      console.error(`Server health check attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }
  }
  return false;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check server health first
      console.log('Checking server connection...');
      const isServerRunning = await checkServerHealth();
      
      if (!isServerRunning) {
        const errorMsg = '❌ Server Connection Failed!\n\n' +
          'Server port 5001 par nahi chal raha.\n\n' +
          '🔧 Fix karne ke liye:\n\n' +
          '1️⃣  Root folder mein "start-app.bat" ya "start-app.ps1" run karein\n' +
          '   Ya manually:\n' +
          '2️⃣  Terminal khol kar:\n' +
          '   cd server\n' +
          '   npm start\n\n' +
          '3️⃣  Agar port 5001 busy hai:\n' +
          '   cd server\n' +
          '   node free-port.js\n' +
          '   npm start\n\n' +
          '✅ Server start hone ke baad phir se login karein!';
        
        alert(errorMsg);
        setIsLoading(false);
        return false;
      }
      
      console.log('✅ Server connection successful!');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Try proxy first, then direct connection
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          signal: controller.signal,
          mode: 'cors',
        });
      } catch (proxyError) {
        // If proxy fails, try direct connection
        console.log('Proxy failed, trying direct connection...');
        clearTimeout(timeoutId);
        const directController = new AbortController();
        const directTimeout = setTimeout(() => directController.abort(), 10000);
        
        response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          signal: directController.signal,
          mode: 'cors',
        });
        
        clearTimeout(directTimeout);
      }
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        const error = await response.json().catch(() => ({ message: 'Login failed. Invalid credentials.' }));
        alert(error.message || 'Login failed. Please check your credentials.');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMsg = '❌ Login Failed!\n\n';
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        errorMsg += '⏱️ Server response timeout!\n\n';
        errorMsg += 'Server slow hai ya nahi chal raha.\n\n';
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMsg += '🌐 Network Connection Error!\n\n';
        errorMsg += 'Server se connect nahi ho pa raha.\n\n';
      } else {
        errorMsg += '❌ Connection Error!\n\n';
      }
      
      errorMsg += '🔧 Solution:\n\n';
      errorMsg += '1️⃣  Server check karein:\n';
      errorMsg += '   Browser mein open karein: http://localhost:5001/api/health\n\n';
      errorMsg += '2️⃣  Server start karein:\n';
      errorMsg += '   cd server\n';
      errorMsg += '   npm start\n\n';
      errorMsg += '3️⃣  Port issue ho to:\n';
      errorMsg += '   cd server\n';
      errorMsg += '   node free-port.js\n\n';
      errorMsg += '✅ Server start hone ke baad phir se try karein!';
      
      alert(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!token) return false;
      
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      } else {
        const error = await response.json().catch(() => ({ message: 'Profile update failed' }));
        alert(error.message || 'Profile update failed');
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Network error. Please check if the server is running.');
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
