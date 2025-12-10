import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ scrollToSection }) {
  return (
    <footer id="contact" className="bg-[#13315C] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-xl font-bold">Wellness Medical Clinic</span>
            </div>
            <p className="text-gray-300">
              Providing exceptional healthcare with compassion and expertise.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  New Patient
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Primary Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Emergency Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  Specialists
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-300">
              <li>123 Medical Center Drive</li>
              <li>Wellness City, WC 10001</li>
              <li>(123) 456-7890</li>
              <li>info@wellnessmedical.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Wellness Medical Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}