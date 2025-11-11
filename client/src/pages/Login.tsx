import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import MetaCodSarLogo from '../components/MetaCodSarLogo';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/admin');
      } else {
        // Error message will be shown by the login function via alert
        // But we can also set a local error message
        setErrorMessage('Login failed. Please check your credentials and try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-green-600 mb-4 sm:mb-6">
            <MetaCodSarLogo size={40} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-2">METACODSAR</h1>
          <p className="text-base sm:text-lg text-green-600 italic mb-6 sm:mb-8">CODE FROM THE HEIGHTS</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-sm sm:text-base text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
        </div>
              <input
                id="email"
                name="email"
                type="email"
                  autoComplete="email"
                required
                value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="admin@metacodsar.com"
              />
            </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              <input
                id="password"
                name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                required
                value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                  Forgot your password?
                </a>
            </div>
          </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Demo Credentials</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span className="text-green-600 font-mono">admin@metacodsar.com</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Password:</span>
                <span className="text-green-600 font-mono">password</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Use these credentials to access the admin dashboard
            </p>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Team member? 
              <a href="/team-login" className="font-medium text-green-600 hover:text-green-500 ml-1 transition-colors">
                Sign in here
              </a>
            </p>
          </div>
          </div>
          
        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © 2024 MetaCodsar. All rights reserved.
          </p>
          </div>
      </div>
    </div>
  );
};

export default Login;