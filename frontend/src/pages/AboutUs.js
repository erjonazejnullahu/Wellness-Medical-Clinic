import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };
const AboutUs = () => {
  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
    <section className="bg-gradient-to-b from-white to-[#99C5FF]/10 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Teksti */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-4 py-2 bg-[#99C5FF]/20 text-[#003554] font-semibold rounded-full">
                  About Our Practice
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-[#13315C] leading-tight">
                Our Mission & 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] ml-2">
                  Vision
                </span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                At Wellness Medical, we are committed to providing comprehensive healthcare 
                with a patient-centered approach. Our team of dedicated professionals 
                ensures the highest standard of medical care for you and your family.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  {[
                    { text: "Pandemic Control", desc: "Advanced safety protocols" },
                    { text: "Primary Care", desc: "Preventive and routine care" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#3D9DA4] mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <span className="font-semibold text-[#003554]">{item.text}</span>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <ul className="space-y-4">
                  {[
                    { text: "Emergency Care", desc: "24/7 available services" },
                    { text: "Specialist Consultation", desc: "Expert medical advice" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#3D9DA4] mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <span className="font-semibold text-[#003554]">{item.text}</span>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book-appointment"
                  className="px-8 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  Book Appointment
                </Link>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-8 py-3 border-2 border-[#003554] text-[#003554] font-semibold rounded-lg hover:bg-[#003554] hover:text-white transition-colors"
                >
                  Meet Our Team
                </button>
              </div>
            </div>

            {/* Fotoja me efekte */}
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-[#99C5FF]/30 to-[#3F89A9]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-tr from-[#3D9DA4]/20 to-[#99C5FF]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              
              {/* Main image container */}
              <div className="relative z-10 flex justify-center items-center">
                <div className="relative group">
                  <img 
                    src="/doctor.jpg" 
                    alt="Our Medical Team" 
                    className="w-full max-w-md h-auto rounded-2xl object-cover shadow-2xl border-8 border-white transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Decorative border */}
                  <div className="absolute inset-0 rounded-2xl border-4 border-transparent group-hover:border-[#3D9DA4]/30 transition-all duration-500 -m-2"></div>
                  
                  {/* Info card overlay */}
                  <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-2xl max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#3D9DA4] to-[#3F89A9] rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#13315C]">Dr. John Smith</h4>
                        <p className="text-sm text-gray-600">Chief Medical Officer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "5000+", label: "Patients Treated" },
              { number: "50+", label: "Expert Doctors" },
              { number: "15+", label: "Years Experience" },
              { number: "24/7", label: "Emergency Care" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    <Footer scrollToSection={scrollToSection} />
     </>
  );
};

export default AboutUs;