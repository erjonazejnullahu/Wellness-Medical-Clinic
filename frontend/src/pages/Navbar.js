import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

export default function Navbar({ scrollToSection }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
           <div className="h-10 w-48 flex items-center">
            <img 
              src={logo} 
              alt="Wellness Medical Logo" 
              className="h-full w-auto object-contain" /* Fills container but maintains aspect ratio */
            />
          </div>


          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-[#003554] font-medium hover:text-[#3F89A9] transition-colors bg-transparent border-none cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-[#003554] font-medium hover:text-[#3F89A9] transition-colors bg-transparent border-none cursor-pointer"
            >
              Services
            </button>
              <Link to="/staff" className="nav-item">
              Our Staff
              </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-[#003554] font-medium hover:text-[#3F89A9] transition-colors bg-transparent border-none cursor-pointer"
            >      
              Contact
            </button>
          </div>

          <div className="flex space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-[#01497C] to-[#01497C] text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 border-2 border-[#3D9DA4] text-[#003554] font-medium rounded-lg hover:bg-[#3D9DA4] hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}