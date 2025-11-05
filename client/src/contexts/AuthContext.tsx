import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react';
import { API_BASE_URL } from '../config/api';

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
      
      // Build URLs to try
      const urls: string[] = [];
      
      // If API_BASE_URL is set, use it
      if (API_BASE_URL) {
        urls.push(`${API_BASE_URL}/api/health`);
      } else if (import.meta.env.PROD) {
        // Production: try relative path (same domain)
        urls.push('/api/health');
      }
      
      // Development fallback
      if (import.meta.env.DEV) {
        urls.push('http://localhost:5001/api/health');
      }
      
      // Remove empty URLs
      const validUrls = urls.filter(url => url && url.trim() !== '');
      
      if (validUrls.length === 0) {
        console.error('No valid API URLs to check');
        return false;
      }
      
      for (const url of validUrls) {
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
      
      // Check server health first (skip in production if no API URL configured)
      const isProduction = import.meta.env.PROD;
      let isServerRunning = false;
      
      if (isProduction && !API_BASE_URL) {
        // Production without API URL: skip health check, try direct login
        console.warn('⚠️ VITE_API_URL not set in production, skipping health check and trying direct login');
        isServerRunning = true; // Allow login attempt
      } else {
        console.log('Checking server connection...');
        isServerRunning = await checkServerHealth();
        
        if (!isServerRunning && !isProduction) {
          // Only show error in development
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
        } else if (!isServerRunning && isProduction) {
          // Production: show warning but allow login attempt
          console.warn('⚠️ Server health check failed, but proceeding with login attempt');
          console.warn('If login fails, check VITE_API_URL in Vercel environment variables');
        }
      }
      
      if (isServerRunning) {
        console.log('✅ Server connection successful!');
      }

      // Build login URLs to try
      const loginUrls: string[] = [];
      
      if (API_BASE_URL) {
        // Primary: Use configured API URL
        loginUrls.push(`${API_BASE_URL}/api/auth/login`);
      } else if (isProduction) {
        // Production: Try multiple options
        const currentOrigin = window.location.origin;
        
        // Option 1: Relative path (same domain)
        loginUrls.push('/api/auth/login');
        
        // Option 2: Try common server URL patterns
        if (currentOrigin.includes('vercel.app')) {
          const projectName = currentOrigin.replace('https://', '').split('.')[0];
          const possibleUrls = [
            `https://${projectName}-api.vercel.app/api/auth/login`,
            `https://api-${projectName}.vercel.app/api/auth/login`,
            `https://${projectName.replace('-client', '').replace('-frontend', '').replace('-h3a4', '')}-api.vercel.app/api/auth/login`,
            `https://${projectName.replace('-client', '').replace('-frontend', '').replace('-h3a4', '')}-server.vercel.app/api/auth/login`,
          ];
          loginUrls.push(...possibleUrls);
        }
      } else {
        // Development: Direct connection
        loginUrls.push('http://localhost:5001/api/auth/login');
      }
      
      console.log('🔍 Attempting login with URLs:', loginUrls);
      
      // Try login request with retry logic (max 2 retries)
      let response: Response | null = null;
      let lastError: any = null;
      const maxRetries = 2;
      
      for (const loginUrl of loginUrls) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            if (attempt > 0) {
              console.log(`🔄 Retry attempt ${attempt} for: ${loginUrl}`);
              // Wait before retry (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            } else {
              console.log(`📡 Trying: ${loginUrl}`);
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
            
            response = await fetch(loginUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
              signal: controller.signal,
              mode: 'cors',
            });
            
            clearTimeout(timeoutId);
            
            // If successful, break out of loops
            if (response.ok) {
              console.log(`✅ Success with: ${loginUrl}`);
              break;
            }
            
            // If 503/504 (timeout/connection), retry
            if (response.status === 503 || response.status === 504) {
              const retryAfter = attempt < maxRetries ? 2 : 0;
              if (retryAfter > 0) {
                console.log(`⏳ Server timeout, will retry in ${retryAfter} seconds...`);
                continue;
              }
            }
            
            // If not 404, break (might be auth error)
            if (response.status !== 404) {
              break;
            }
          } catch (fetchError: any) {
            clearTimeout(timeoutId);
            console.warn(`❌ Failed: ${loginUrl} (attempt ${attempt + 1})`, fetchError.message);
            lastError = fetchError;
            
            // If timeout and more retries left, continue
            if (fetchError.name === 'AbortError' && attempt < maxRetries) {
              console.log(`⏳ Request timeout, retrying...`);
              continue;
            }
            
            // If last attempt, break to next URL
            if (attempt === maxRetries) {
              break;
            }
          }
        }
        
        // If we got a successful response, break out of URL loop
        if (response && response.ok) {
          break;
        }
      }
      
      // If all URLs failed
      if (!response || !response.ok) {
        
        // If production and no API_BASE_URL, show helpful error
        if (isProduction && !API_BASE_URL) {
          const errorMsg = '❌ Server URL not configured!\n\n' +
            'VITE_API_URL environment variable missing in Vercel.\n\n' +
            '🔧 Fix karne ke liye:\n\n' +
            '1️⃣  Vercel Dashboard → Client Project → Settings → Environment Variables\n' +
            '2️⃣  Add New Variable:\n' +
            '   Name: VITE_API_URL\n' +
            '   Value: https://your-server-project.vercel.app\n' +
            '   (Replace with your actual server URL)\n' +
            '3️⃣  Redeploy karein\n\n' +
            '✅ Config fix ke baad phir se login karein!';
          
          alert(errorMsg);
          setIsLoading(false);
          return false;
        }
        
        // If API_BASE_URL fails and we're in dev, try direct connection
        if (import.meta.env.DEV) {
          console.log('Proxy failed, trying direct connection...');
          const directController = new AbortController();
          const directTimeout = setTimeout(() => directController.abort(), 10000);
          
          try {
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
          } catch (devError) {
            clearTimeout(directTimeout);
            throw lastError || devError;
          }
        } else {
          throw lastError || new Error('All login attempts failed');
        }
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
      const isProduction = import.meta.env.PROD;
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        errorMsg += '⏱️ Server Response Timeout!\n\n';
        
        if (isProduction) {
          errorMsg += 'Server slow hai ya cold start ho raha hai.\n\n';
          errorMsg += '🔧 Production Solution:\n\n';
          errorMsg += '1️⃣  Vercel Dashboard → Server Project → Logs check karein\n';
          errorMsg += '2️⃣  MongoDB connection verify karein:\n';
          errorMsg += '   - MONGODB_URI set hai?\n';
          errorMsg += '   - Network Access allow hai?\n\n';
          errorMsg += '3️⃣  Wait 2-3 seconds aur phir se try karein\n';
          errorMsg += '   (Cold start ke baad automatically retry ho jayega)\n\n';
          errorMsg += '4️⃣  Server health check:\n';
          errorMsg += `   ${API_BASE_URL || 'https://metacodsar-2vf1.vercel.app'}/api/health\n\n`;
          errorMsg += '💡 Tip: First request slow hota hai (cold start).\n';
          errorMsg += '    Subsequent requests fast honge!';
        } else {
          errorMsg += 'Server slow hai ya nahi chal raha.\n\n';
          errorMsg += '🔧 Development Solution:\n\n';
          errorMsg += '1️⃣  Server check karein:\n';
          errorMsg += '   Browser mein open karein: http://localhost:5001/api/health\n\n';
          errorMsg += '2️⃣  Server start karein:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   npm start\n\n';
          errorMsg += '3️⃣  Port issue ho to:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   node free-port.js\n\n';
          errorMsg += '✅ Server start hone ke baad phir se try karein!';
        }
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMsg += '🌐 Network Connection Error!\n\n';
        
        if (isProduction) {
          errorMsg += 'Server se connect nahi ho pa raha.\n\n';
          errorMsg += '🔧 Production Solution:\n\n';
          errorMsg += '1️⃣  Vercel Dashboard → Client Project → Environment Variables\n';
          errorMsg += '   Check: VITE_API_URL set hai?\n';
          errorMsg += `   Value: ${API_BASE_URL || 'NOT SET'}\n\n`;
          errorMsg += '2️⃣  Server URL verify karein:\n';
          errorMsg += '   https://metacodsar-2vf1.vercel.app/api/health\n\n';
          errorMsg += '3️⃣  CORS check karein:\n';
          errorMsg += '   Server Project → FRONTEND_URL set hai?\n';
          errorMsg += '   Value: https://metacodsar-h3a4.vercel.app\n\n';
          errorMsg += '4️⃣  Redeploy dono projects after fixing variables';
        } else {
          errorMsg += 'Server se connect nahi ho pa raha.\n\n';
          errorMsg += '🔧 Development Solution:\n\n';
          errorMsg += '1️⃣  Server check karein:\n';
          errorMsg += '   Browser mein open karein: http://localhost:5001/api/health\n\n';
          errorMsg += '2️⃣  Server start karein:\n';
          errorMsg += '   cd server && npm start\n\n';
          errorMsg += '✅ Server start hone ke baad phir se try karein!';
        }
      } else {
        errorMsg += '❌ Connection Error!\n\n';
        
        if (isProduction) {
          errorMsg += '🔧 Production Troubleshooting:\n\n';
          errorMsg += '1️⃣  Server health check:\n';
          errorMsg += `   ${API_BASE_URL || 'https://metacodsar-2vf1.vercel.app'}/api/health\n\n`;
          errorMsg += '2️⃣  Vercel Logs check karein:\n';
          errorMsg += '   Server Project → Deployments → Logs\n\n';
          errorMsg += '3️⃣  Environment Variables verify:\n';
          errorMsg += '   - MONGODB_URI\n';
          errorMsg += '   - FRONTEND_URL\n';
          errorMsg += '   - VITE_API_URL (Client Project)\n\n';
          errorMsg += '4️⃣  Retry karein (automatic retry active hai)';
        } else {
          errorMsg += '🔧 Development Solution:\n\n';
          errorMsg += '1️⃣  Server check karein:\n';
          errorMsg += '   Browser mein open karein: http://localhost:5001/api/health\n\n';
          errorMsg += '2️⃣  Server start karein:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   npm start\n\n';
          errorMsg += '3️⃣  Port issue ho to:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   node free-port.js\n\n';
          errorMsg += '✅ Server start hone ke baad phir se try karein!';
        }
      }
      
      alert(errorMsg);
      setIsLoading(false);
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
