import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">MetaCodsar</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2">About</Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 px-3 py-2">Services</Link>
            <Link to="/portfolio" className="text-gray-700 hover:text-blue-600 px-3 py-2">Portfolio</Link>
            <Link to="/team" className="text-gray-700 hover:text-blue-600 px-3 py-2">Team</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2">Contact</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2">Home</Link>
              <Link to="/about" className="block text-gray-700 hover:text-blue-600 px-3 py-2">About</Link>
              <Link to="/services" className="block text-gray-700 hover:text-blue-600 px-3 py-2">Services</Link>
              <Link to="/portfolio" className="block text-gray-700 hover:text-blue-600 px-3 py-2">Portfolio</Link>
              <Link to="/team" className="block text-gray-700 hover:text-blue-600 px-3 py-2">Team</Link>
              <Link to="/contact" className="block text-gray-700 hover:text-blue-600 px-3 py-2">Contact</Link>
              <Link to="/login" className="block bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Login</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;