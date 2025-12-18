import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDoctors, deleteDoctor } from '../api/doctorApi';
import DoctorTable from '../components/Doctor/DoctorTable';
import Navbar from './Navbar';
import Footer from './Footer';

export default function DoctorsDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await deleteDoctor(id);
      loadDoctors();
    } catch (err) {
      alert('Failed to delete doctor');
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20 p-8">
      <p className="text-[#13315C]">Loading doctors...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20 p-8">
      <p className="text-red-600">{error}</p>
    </div>
  );

  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
    <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#003554] to-[#13315C] py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Doctors Management Dashboard</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Manage your medical team efficiently. View, edit, and organize doctor profiles in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/create-doctor')}
                className="px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-xl transition-shadow"
              >
                Add New Doctor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#13315C]">All Doctors ({doctors.length})</h2>
          <button
            onClick={() => navigate('/create-doctor')}
            className="px-5 py-2.5 bg-[#3D9DA4] text-white font-semibold rounded-lg hover:bg-[#2C8C94] transition-colors"
          >
            + Add Doctor
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <DoctorTable
            doctors={doctors}
            onDelete={handleDelete}
            onUpdated={loadDoctors}
          />
        </div>
      </div>
    </div>
    <Footer scrollToSection={scrollToSection} />
     </>
  );
}