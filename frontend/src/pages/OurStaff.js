import React, { useEffect, useState, useCallback } from 'react';
import DoctorCard from '../components/Doctor/DoctorCard';
import Navbar from './Navbar';
import Footer from './Footer';

export default function OurStaff() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/doctors');
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
        
        // Extract unique specializations
        const specs = [...new Set(data.map(doc => doc.specialization).filter(Boolean))];
        setSpecializations(specs);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Enhanced search functionality
  const filterDoctors = useCallback(() => {
    if (!searchTerm.trim() && selectedSpecialization === 'all') {
      setFilteredDoctors(doctors);
      return;
    }

    const filtered = doctors.filter(doctor => {
      // Specialization filter
      if (selectedSpecialization !== 'all' && doctor.specialization !== selectedSpecialization) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        
        return (
          doctor.first_name?.toLowerCase().includes(searchLower) ||
          doctor.last_name?.toLowerCase().includes(searchLower) ||
          `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchLower) ||
          doctor.specialization?.toLowerCase().includes(searchLower) ||
          doctor.hospital?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, doctors, selectedSpecialization]);

  // Apply filters when dependencies change
  useEffect(() => {
    filterDoctors();
  }, [filterDoctors]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#01497C]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3D9DA4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-[#003554] font-semibold">Loading our medical staff...</p>
        </div>
      </div>
    );
  }

  return (
      <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-white to-[#67B99A]/10">
      {/* Hero Banner */}
      <section className="bg-[#3F89A9] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Medical Staff</h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Meet our team of dedicated healthcare professionals committed to your well-being
            </p>
            
            {/* Simplified Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-xl mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    className="w-full px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3D9DA4]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute right-4 top-4 text-gray-400">🔍</span>
                </div>
                
                <select
                  className="px-4 py-4 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3D9DA4]"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  <option value="all">All Specializations</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
                
                {(searchTerm || selectedSpecialization !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-300">
              {searchTerm || selectedSpecialization !== 'all' ? (
                <span>Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}</span>
              ) : (
                <span>Total {doctors.length} medical professionals</span>
              )}
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#003554] mb-2">{doctors.length}</div>
              <div className="text-gray-600">Medical Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#003554] mb-2">
                {doctors.reduce((sum, doc) => sum + (doc.years_of_experience || 0), 0)}+
              </div>
              <div className="text-gray-600">Years of Combined Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#003554] mb-2">
                {specializations.length}
              </div>
              <div className="text-gray-600">Medical Specializations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="container mx-auto px-4 py-16">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">👨‍⚕️</div>
            <h3 className="text-2xl font-bold text-[#003554] mb-4">No doctors found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search criteria</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-[#13315C] mb-2">Meet Our Doctors</h2>
                  <p className="text-gray-600">
                    Showing {filteredDoctors.length} of {doctors.length} medical professionals
                    {searchTerm && ` for "${searchTerm}"`}
                    {selectedSpecialization !== 'all' && ` in ${selectedSpecialization}`}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedSpecialization('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedSpecialization === 'all'
                        ? 'bg-[#3D9DA4] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {specializations.slice(0, 3).map((spec, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSpecialization(spec)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedSpecialization === spec
                          ? 'bg-[#3D9DA4] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredDoctors.map(doc => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#3F89A9] to-[#3F89A9] rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Need to Schedule an Appointment?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Book a consultation with any of our qualified healthcare professionals today.
            </p>
            <button className="px-8 py-4 bg-white text-[#003554] font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg">
              Book Appointment Now
            </button>
          </div>
        </div>
      </section>
    </div>
     <Footer />
  </>
  );
}