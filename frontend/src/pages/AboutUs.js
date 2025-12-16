import React from 'react';

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 py-16">
      <div className="max-w-6xl mx-auto px-6 shadow-lg rounded-xl bg-white/70 backdrop-blur-md">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Teksti */}
          <div>
            <span className="text-orange-500 font-semibold uppercase tracking-wide">
              Mission
            </span>

            <h2 className="text-4xl font-bold text-gray-800 mt-2 mb-6">
              Our Mission & <span className="text-orange-500 border-b-4 border-orange-300 pb-1">Vision</span>
            </h2>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Comprehensive physical examination, also simply known as a
              physical, is a process in which the physician evaluates the
              overall health of the patient.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Pandemic Control
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Primary Care
                </li>
              </ul>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Cold, Cough and Flu
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  High Blood Pressure
                </li>
              </ul>
            </div>
            
            <button className="mt-8 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium py-3 px-8 rounded-full transition duration-300 shadow-xl hover:shadow-2xl">
              Learn More
            </button>
          </div>

          {/* Fotoja me efekte */}
          <div className="hidden md:flex justify-center items-center relative animate-fadeIn">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            
            <div className="relative z-10">
              <img 
                src="/doctor.jpg" 
                alt="Doctor" 
                className="w-80 h-80 rounded-full object-cover shadow-2xl border-8 border-white ring-2 ring-orange-200 transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full border-2 border-orange-300 -m-4"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;