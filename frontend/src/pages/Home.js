import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import Footer from './Footer';
import doctorPatientImage from '../assets/HomeIcon.png';

export default function Home() {
  const navigate = useNavigate();
 
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Use useEffect to update login status if the token changes
  useEffect(() => {
  const checkLoginStatus = () => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  };
  
  checkLoginStatus(); // Initial check
  
  const interval = setInterval(checkLoginStatus, 500);
  
  return () => clearInterval(interval);
}, []);

  const handleLogout = () => {
  localStorage.clear(); // Clears ALL localStorage
  sessionStorage.clear(); // Also clear sessionStorage if you use it
  setIsLoggedIn(false);
  navigate('/');
  };
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20">
       {/* Navbar*/}
      <Navbar scrollToSection={scrollToSection} />

      {/* Hero Section*/}
      <section id="home" className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-2 bg-[#99C5FF]/20 text-[#003554] font-semibold rounded-full">
                Trusted Healthcare Since 2010
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#13315C] leading-tight">
              Your Health is Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9]"> Priority</span>
            </h1>
            <p className="text-xl text-gray-600">
              Experience comprehensive healthcare with our team of dedicated professionals.
              We provide personalized medical services for you and your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-xl transition-shadow text-lg shadow-lg"
              >
                Book Appointment
              </button>
              <button className="px-8 py-4 border-2 border-[#003554] text-[#003554] font-semibold rounded-lg hover:bg-[#003554] hover:text-white transition-colors text-lg">
                Call Now: (123) 456-7890
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - Updated image only */}
          <div className="relative w-full">
            <div className="relative z-10">
              <img
                src={doctorPatientImage}
                alt="Doctor and patient"
                className="rounded-3xl w-full h-auto object-cover min-h-[500px] shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section (Remains unchanged) */}
      <section id="services" className="bg-gradient-to-b from-[#99C5FF]/10 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#13315C] mb-4">Our Medical Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services for all your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Primary Care", icon: "🏥", desc: "Regular checkups and preventive care" },
              { title: "Emergency Care", icon: "🚑", desc: "24/7 emergency medical services" },
              { title: "Specialist Consultation", icon: "👨‍⚕️", desc: "Expert consultations with specialists" },
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-[#3D9DA4]">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-[#003554] mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
                <button className="mt-6 text-[#3F89A9] font-semibold hover:text-[#003554] transition-colors bg-transparent border-none cursor-pointer">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* This entire section only renders if the user is NOT logged in */}
      {!isLoggedIn && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-[#003554] to-[#13315C] rounded-3xl p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of patients who trust Wellness Medical for their healthcare needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-white text-[#003554] font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  Register Now
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#003554] transition-colors text-lg"
                >
                  Patient Login
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer*/}
      <Footer scrollToSection={scrollToSection} />

    </div>
  );
}