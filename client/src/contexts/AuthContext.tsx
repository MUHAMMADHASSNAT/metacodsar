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
      
      const isProduction = import.meta.env.PROD;
      
      // Skip health check in production for faster login
      // Only do quick health check in development
      if (!isProduction && API_BASE_URL) {
        // Quick health check with short timeout (2 seconds max)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        try {
          const healthResponse = await fetch(`${API_BASE_URL}/api/health`, { 
            method: 'GET',
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (!healthResponse.ok) {
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
        } catch (healthError: any) {
          clearTimeout(timeoutId);
          if (healthError.name === 'AbortError') {
            // Timeout - server might be slow, but proceed with login
            console.warn('⚠️ Health check timeout, proceeding with login');
          } else {
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
        }
      }

      // Build login URL - prioritize configured API URL
      let loginUrl: string;
      
      if (API_BASE_URL) {
        // If API_BASE_URL is set, use it
        loginUrl = `${API_BASE_URL}/api/auth/login`;
      } else if (isProduction) {
        // Production: Try relative path first
        loginUrl = '/api/auth/login';
      } else {
        // Development: Try proxy first, then direct connection
        // In development, empty API_BASE_URL means use Vite proxy
        // But if proxy fails, try direct connection
        loginUrl = '/api/auth/login'; // Try proxy first
      }
      
      console.log('🔍 Attempting login:', loginUrl);
      console.log('🔍 API_BASE_URL:', API_BASE_URL || 'empty (using proxy)');
      
      // Login with retry logic (3 attempts with increasing timeout)
      let response: Response | null = null;
      let responseData: any = null;
      let lastError: any = null;
      const maxRetries = 3;
      const timeouts = [15000, 20000, 25000]; // 15s, 20s, 25s for each retry
      let loginSuccess = false;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeout = timeouts[attempt];
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          console.log(`🔄 Login attempt ${attempt + 1}/${maxRetries} (timeout: ${timeout}ms)`);
          
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
          
          console.log(`📥 Response status: ${response.status}`);
          
          // If successful, process response immediately
          if (response.ok) {
            try {
              responseData = await response.json();
              console.log(`✅ Login successful on attempt ${attempt + 1}`);
              
              if (!responseData.token || !responseData.user) {
                console.error('❌ Invalid response data:', responseData);
                lastError = new Error('Invalid response data');
                continue; // Try again
              }
              
              // Store token and user data
              setToken(responseData.token);
              setUser(responseData.user);
              localStorage.setItem('token', responseData.token);
              localStorage.setItem('user', JSON.stringify(responseData.user));
              console.log('✅ User data stored successfully');
              loginSuccess = true;
              break; // Success, exit retry loop
            } catch (parseError) {
              console.error('❌ Error parsing successful response:', parseError);
              lastError = parseError;
              if (attempt < maxRetries - 1) {
                const waitTime = (attempt + 1) * 1000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
              }
              continue;
            }
          } else {
            // Handle error responses
            try {
              const errorData = await response.clone().json();
              console.log('📄 Error response:', errorData);
              lastError = new Error(errorData.message || 'Login failed');
              
              // If it's a credential error, don't retry
              if (response.status === 401) {
                alert(errorData.message || 'Invalid credentials. Please check your email and password.');
                setIsLoading(false);
                return false;
              }
            } catch (e) {
              lastError = new Error(`Login failed with status ${response.status}`);
            }
            
            // If not last attempt, wait before retrying
            if (attempt < maxRetries - 1) {
              const waitTime = (attempt + 1) * 1000; // 1s, 2s, 3s
              console.log(`⏳ Waiting ${waitTime}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            }
          }
        } catch (fetchError: any) {
          console.warn(`❌ Login request attempt ${attempt + 1} failed:`, fetchError.message);
          lastError = fetchError;
          
          // If it's an abort error (timeout), wait before retrying
          if (fetchError.name === 'AbortError' && attempt < maxRetries - 1) {
            const waitTime = (attempt + 1) * 1000; // 1s, 2s, 3s
            console.log(`⏱️ Timeout occurred. Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          // In development, try direct connection if proxy fails (only on first attempt)
          if (attempt === 0 && !isProduction && loginUrl === '/api/auth/login') {
            console.log('🔄 Proxy failed, trying direct connection to localhost:5001...');
            try {
              const directController = new AbortController();
              const directTimeout = setTimeout(() => directController.abort(), 15000);
              
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
              
              if (response.ok) {
                try {
                  responseData = await response.json();
                  if (responseData.token && responseData.user) {
                    setToken(responseData.token);
                    setUser(responseData.user);
                    localStorage.setItem('token', responseData.token);
                    localStorage.setItem('user', JSON.stringify(responseData.user));
                    console.log('✅ Direct connection successful');
                    loginSuccess = true;
                    break;
                  }
                } catch (parseError) {
                  console.error('❌ Error parsing direct connection response:', parseError);
                }
              } else {
                // If direct connection also fails, continue with retry loop
                console.warn('⚠️ Direct connection returned status:', response.status);
              }
            } catch (directError: any) {
              console.error('❌ Direct connection failed:', directError.message);
              // If direct connection fails, it means server is not running
              if (directError.name === 'TypeError' && directError.message.includes('fetch')) {
                lastError = new Error('Server is not running. Please start the server on port 5001.');
              }
            }
          }
        }
      }
      
      // If login was successful, return true
      if (loginSuccess && responseData) {
        setIsLoading(false);
        return true;
      }
      
      // If login failed after all retries
      console.error('❌ Login failed after all retries');
      console.error('Last error:', lastError);
      console.error('Response status:', response?.status);
      
      // Handle specific error cases
      if (response && response.status === 401) {
        alert('Invalid credentials. Please check your email and password.');
        setIsLoading(false);
        return false;
      }
      
      // If production and no API_BASE_URL, show helpful error
      if (isProduction && !API_BASE_URL) {
        const errorMsg = '❌ Server URL not configured!\n\n' +
          'VITE_API_URL environment variable missing in Vercel.\n\n' +
          '🔧 Fix karne ke liye:\n\n' +
          '1️⃣  Vercel Dashboard → Client Project → Settings → Environment Variables\n' +
          '2️⃣  Add New Variable:\n' +
          '   Name: VITE_API_URL\n' +
          '   Value: https://metacodsar-2vf1.vercel.app\n' +
          '3️⃣  Redeploy karein\n\n' +
          '✅ Config fix ke baad phir se login karein!';
        
        alert(errorMsg);
        setIsLoading(false);
        return false;
      }
      
      // Throw error to be caught by outer catch block
      throw lastError || new Error('Login failed after all retry attempts');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMsg = '❌ Login Failed!\n\n';
      const isProduction = import.meta.env.PROD;
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        errorMsg += '⏱️ Server Response Timeout!\n\n';
        errorMsg += 'The server took too long to respond. This might be due to:\n';
        errorMsg += '• Server is starting up (cold start)\n';
        errorMsg += '• Slow database connection\n';
        errorMsg += '• Network latency\n\n';
        
        if (isProduction) {
          errorMsg += '🔧 Solutions:\n\n';
          errorMsg += '1️⃣  Please wait 5-10 seconds and try again\n';
          errorMsg += '    (The system will automatically retry)\n\n';
          errorMsg += '2️⃣  Check server status:\n';
          errorMsg += `   ${API_BASE_URL || 'https://metacodsar-2vf1.vercel.app'}/api/health\n\n`;
          errorMsg += '3️⃣  If problem persists, check:\n';
          errorMsg += '   • Vercel Dashboard → Server Logs\n';
          errorMsg += '   • MongoDB connection status\n';
          errorMsg += '   • Network connectivity\n\n';
          errorMsg += '💡 Tip: First request may be slow (cold start).\n';
          errorMsg += '    Subsequent requests will be faster!';
        } else {
          errorMsg += '🔧 Development Solutions:\n\n';
          errorMsg += '1️⃣  Server check karein:\n';
          errorMsg += '   Browser mein open karein: http://localhost:5001/api/health\n';
          errorMsg += '   Agar "Cannot GET" ya error aaye, to server nahi chal raha\n\n';
          errorMsg += '2️⃣  Server start karein:\n';
          errorMsg += '   Option A: Root folder mein "start-app.bat" ya "start-app.ps1" run karein\n';
          errorMsg += '   Option B: Manually terminal mein:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   npm start\n\n';
          errorMsg += '3️⃣  Agar port 5001 busy hai:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   node free-port.js\n';
          errorMsg += '   npm start\n\n';
          errorMsg += '4️⃣  Server start hone ke baad:\n';
          errorMsg += '   - Wait 5-10 seconds for MongoDB connection\n';
          errorMsg += '   - Check http://localhost:5001/api/health\n';
          errorMsg += '   - Phir login try karein\n\n';
          errorMsg += '✅ Server running hone ke baad automatically retry hoga!';
        }
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.message?.includes('not running')) {
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
          errorMsg += '❌ Server Connection Failed!\n\n';
          errorMsg += 'Server port 5001 par nahi chal raha.\n\n';
          errorMsg += '🔧 Fix karne ke liye:\n\n';
          errorMsg += '1️⃣  Server check karein:\n';
          errorMsg += '   Browser mein open karein: http://localhost:5001/api/health\n';
          errorMsg += '   Agar "Cannot GET" ya connection error aaye, to server nahi chal raha\n\n';
          errorMsg += '2️⃣  Server start karein (choose one):\n';
          errorMsg += '   Option A: Root folder mein "start-app.bat" ya "start-app.ps1" run karein\n';
          errorMsg += '   Option B: Terminal mein manually:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   npm start\n\n';
          errorMsg += '3️⃣  Agar port 5001 busy hai:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   node free-port.js\n';
          errorMsg += '   npm start\n\n';
          errorMsg += '4️⃣  Server start hone ke baad:\n';
          errorMsg += '   - Wait 5-10 seconds for MongoDB connection\n';
          errorMsg += '   - Check http://localhost:5001/api/health (should show status: OK)\n';
          errorMsg += '   - Phir login try karein\n\n';
          errorMsg += '✅ Server running hone ke baad automatically retry hoga!';
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
          errorMsg += '❌ Server Connection Failed!\n\n';
          errorMsg += 'Server se connect nahi ho pa raha.\n\n';
          errorMsg += '🔧 Development Solution:\n\n';
          errorMsg += '1️⃣  Server check karein:\n';
          errorMsg += '   Browser mein open karein: http://localhost:5001/api/health\n';
          errorMsg += '   Agar "Cannot GET" ya connection error aaye, to server nahi chal raha\n\n';
          errorMsg += '2️⃣  Server start karein:\n';
          errorMsg += '   Option A: Root folder mein "start-app.bat" ya "start-app.ps1" run karein\n';
          errorMsg += '   Option B: Terminal mein manually:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   npm start\n\n';
          errorMsg += '3️⃣  Agar port 5001 busy hai:\n';
          errorMsg += '   cd server\n';
          errorMsg += '   node free-port.js\n';
          errorMsg += '   npm start\n\n';
          errorMsg += '4️⃣  Server start hone ke baad:\n';
          errorMsg += '   - Wait 5-10 seconds for MongoDB connection\n';
          errorMsg += '   - Check http://localhost:5001/api/health (should show status: OK)\n';
          errorMsg += '   - Phir login try karein\n\n';
          errorMsg += '✅ Server running hone ke baad automatically retry hoga!';
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
