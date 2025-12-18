import React, { useEffect, useState } from 'react'; // Add useState
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [error, setError] = useState(''); // Add state for error messages
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // ADD THIS: Role protection for admin-only access
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      setError('You must be logged in to access the admin panel.');
      navigate('/login');
      return;
    }

    if (role !== 'ADMIN' && role !== 'ROLE_ADMIN') {
      setError('You do not have permission to access the admin panel.');
      navigate('/'); // ⛔ block non-admins
      return;
    }

    // Clear any previous errors if access is granted
    setError('');
  }, [navigate]);

  const adminCards = [
    {
      title: "Doctor Management",
      description: "Add, edit, and manage doctor profiles",
      icon: "👨‍⚕️",
      buttonText: "Manage Doctors",
      path: "/doctors-dashboard",
      gradient: "from-[#3D9DA4] to-[#3F89A9]"
    },
    {
      title: "User Management",
      description: "Manage patient accounts",
      icon: "👥",
      buttonText: "Manage Users",
      path: "/users-dashboard",
      gradient: "from-[#003554] to-[#13315C]"
    },
    {
      title: "Pharmacy / Inventory",
      description: "Track medications, supplies, and inventory levels",
      icon: "💊",
      buttonText: "Manage Inventory",
      path: "/inventory-dashboard",
      gradient: "from-[#3D9DA4] to-[#3F89A9]"
    },
    {
      title: "Appointment Management",
      description: "View and manage all patient appointments",
      icon: "📅",
      buttonText: "View Appointments",
      path: "/appointments-dashboard",
      gradient: "from-[#003554] to-[#13315C]"
    },
  ];

  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
      <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#003554] to-[#13315C] py-12">
          <div className="container mx-auto px-6">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Panel</h1>
              <p className="text-xl max-w-2xl mx-auto">
                Centralized management for all system operations and user administration
              </p>
            </div>
          </div>
        </section>

        {/* ADD THIS: Error message display */}
        {error && (
          <div className="container mx-auto px-6 mt-6">
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#13315C] mb-4">System Management</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Access and manage all administrative functions from one centralized dashboard.
                Select a category below to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {adminCards.map((card, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4"
                  style={{ borderTopColor: card.gradient.includes('#3D9DA4') ? '#3D9DA4' : '#003554' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{card.icon}</div>
                    <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                      Admin
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#003554] mb-3">{card.title}</h3>
                  <p className="text-gray-600 mb-6">{card.description}</p>
                  
                  <button
                    onClick={() => navigate(card.path)}
                    className={`w-full py-3 bg-gradient-to-r ${card.gradient} text-white font-semibold rounded-lg hover:shadow-lg transition-shadow`}
                  >
                    {card.buttonText} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer scrollToSection={scrollToSection} />
    </>
  );
}