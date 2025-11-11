import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/api';
import MetaCodSarLogo from './MetaCodSarLogo';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-blue-950 shadow-xl border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all">
                <MetaCodSarLogo size={20} />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap">MetaCodsar</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-emerald-400 px-3 py-2 transition-colors font-medium">Home</Link>
            <Link to="/about" className="text-white hover:text-emerald-400 px-3 py-2 transition-colors font-medium">About</Link>
            <Link to="/services" className="text-white hover:text-emerald-400 px-3 py-2 transition-colors font-medium">Services</Link>
            <Link to="/projects" className="text-white hover:text-emerald-400 px-3 py-2 transition-colors font-medium">Projects</Link>
            <Link 
              to="/team" 
              className="text-white hover:text-emerald-400 px-3 py-2 transition-colors font-medium"
              onMouseEnter={() => {
                // Prefetch team data on hover
                const cachedData = sessionStorage.getItem('teamMembers');
                if (!cachedData) {
                  const url = API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');
                  fetch(`${url}/api/team`)
                    .then(res => res.ok ? res.json() : null)
                    .then(data => {
                      if (data) {
                        sessionStorage.setItem('teamMembers', JSON.stringify(data));
                      }
                    })
                    .catch(() => {});
                }
              }}
            >
              Team
            </Link>
            <Link to="/contact" className="text-white hover:text-emerald-400 px-3 py-2 transition-colors font-medium">Contact</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg font-medium">
                  Dashboard
                </Link>
                <span className="text-white px-3 py-2 font-medium">Welcome, {user?.name}</span>
                <button 
                  onClick={logout}
                  className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-lg font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg font-medium">Login</Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-gray-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-blue-950 border-t border-emerald-500/20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block text-white hover:text-emerald-400 px-3 py-2 rounded transition-colors">Home</Link>
              <Link to="/about" className="block text-white hover:text-emerald-400 px-3 py-2 rounded transition-colors">About</Link>
              <Link to="/services" className="block text-white hover:text-emerald-400 px-3 py-2 rounded transition-colors">Services</Link>
              <Link to="/portfolio" className="block text-white hover:text-emerald-400 px-3 py-2 rounded transition-colors">Portfolio</Link>
              <Link 
                to="/team" 
                className="block text-white hover:text-emerald-400 px-3 py-2 rounded transition-colors"
                onMouseEnter={() => {
                  // Prefetch team data on hover
                  const cachedData = sessionStorage.getItem('teamMembers');
                  if (!cachedData) {
                    const API_BASE_URL = import.meta.env.PROD 
                      ? (import.meta.env.VITE_API_URL || '') 
                      : '';
                    fetch(`${API_BASE_URL}/api/team`)
                      .then(res => res.ok ? res.json() : null)
                      .then(data => {
                        if (data) {
                          sessionStorage.setItem('teamMembers', JSON.stringify(data));
                        }
                      })
                      .catch(() => {});
                  }
                }}
              >
                Team
              </Link>
              <Link to="/contact" className="block text-white hover:text-emerald-400 px-3 py-2 rounded transition-colors">Contact</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 py-2 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all">
                    Dashboard
                  </Link>
                  <span className="block text-white px-3 py-2">Welcome, {user?.name}</span>
                  <button 
                    onClick={logout}
                    className="block w-full text-left bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-2 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 py-2 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all">Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;