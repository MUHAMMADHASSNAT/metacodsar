import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    email: 'info@metacodsar.com',
    phone: '+92 300 1234567',
    address: 'Pakistan'
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/contact`);
        if (response.ok) {
          const data = await response.json();
          setContactInfo({
            email: data.email || 'info@metacodsar.com',
            phone: data.phone || '+92 300 1234567',
            address: data.address || 'Pakistan'
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    fetchContactInfo();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">MetaCodsar</h3>
            <p className="text-slate-300">Professional software development company delivering innovative solutions.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">Services</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Web Development</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Mobile Apps</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Cloud Solutions</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Consulting</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">Company</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Our Team</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-emerald-400 transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">Contact</h4>
            <div className="text-slate-300 space-y-2">
              <p>Email: {contactInfo.email}</p>
              <p>Phone: {contactInfo.phone}</p>
              <p className="text-emerald-400">📍 {contactInfo.address}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-500/20 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 MetaCodsar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;