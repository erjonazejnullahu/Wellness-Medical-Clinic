import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, getPatientByUserId, getDoctorByUserId } from '../api/profile';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import { FaHospitalUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const me = await getMe(token);
        setUser(me);

        if (me.role === 'PATIENT') {
          const patient = await getPatientByUserId(me.id);
          setDetails(patient);
        }

        if (me.role === 'DOCTOR') {
          const doctor = await getDoctorByUserId(me.id);
          setDetails(doctor);
        }

      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F6F0] to-[#E6F2FF]">
        <div className="text-[#003554] text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F6F0] to-[#E6F2FF]">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-red-600 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-lg font-semibold">{error}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'PATIENT':
        return <FaHospitalUser />;
      case 'DOCTOR':
        return <FaUserDoctor />;
      case 'ADMIN':
        return <RiAdminFill />;
      default:
        return <FaHospitalUser />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20">
      <Navbar scrollToSection={scrollToSection} />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#13315C] mb-4">
              My Profile
            </h1>
            <p className="text-xl text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#003554] to-[#13315C] p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl text-[#003554]">
                  {getRoleIcon(user.role)}
                </div>
                <div className="text-white text-center md:text-left">
                  <h2 className="text-2xl font-bold">
                    {details ? `${details.first_name} ${details.last_name}` : user.email}
                  </h2>
                  <div className="mt-2 inline-block px-4 py-1 bg-white/20 rounded-full">
                    <span className="font-medium">{user.role}</span>
                  </div>
                  <p className="mt-3 text-blue-200">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="p-8">
              {/* Account Information */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[#13315C] mb-6 pb-3 border-b-2 border-blue-100">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                    <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Account Type</label>
                    <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific Details */}
              {user.role === 'PATIENT' && details && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-[#13315C] mb-6 pb-3 border-b-2 border-blue-100">
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {details.first_name} {details.last_name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Date of Birth</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {formatDate(details.date_of_birth)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {details.gender || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {details.phone || 'Not provided'}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">Insurance Information</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {details.insurance_info || 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'DOCTOR' && details && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-[#13315C] mb-6 pb-3 border-b-2 border-blue-100">
                    Doctor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {details.first_name} {details.last_name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Specialization</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {details.specialization || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">License Number</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {details.license_number}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Years of Experience</label>
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-900">
                        {details.years_of_experience} years
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'ADMIN' && (
                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-[#13315C] mb-6 pb-3 border-b-2 border-blue-100">
                    Administrator Account
                  </h3>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <p className="text-gray-700">
                      This account has administrative privileges to manage the healthcare system, 
                      including user management, system settings, and overall operations.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 border-2 border-[#3D9DA4] text-[#003554] font-medium rounded-lg hover:bg-[#3D9DA4] hover:text-white transition-colors"
                  >
                    Back to Home
                  </button>
                  
                  {user.role === 'PATIENT' && (
                    <button
                      onClick={() => navigate('/appointments')}
                      className="px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      View Appointments
                    </button>
                  )}
                  
                  {user.role === 'DOCTOR' && (
                    <button
                      onClick={() => navigate('/doctor/dashboard')}
                      className="px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Doctor Dashboard
                    </button>
                  )}
                  
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => navigate('/admin/dashboard')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="text-3xl font-bold text-[#003554]">0</div>
              <div className="text-blue-700 font-medium">Appointments</div>
              <div className="text-sm text-gray-600 mt-2">Scheduled visits</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
              <div className="text-3xl font-bold text-[#003554]">0</div>
              <div className="text-green-700 font-medium">Medical Records</div>
              <div className="text-sm text-gray-600 mt-2">Health documents</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
              <div className="text-3xl font-bold text-[#003554]">--</div>
              <div className="text-purple-700 font-medium">Last Visit</div>
              <div className="text-sm text-gray-600 mt-2">Most recent appointment</div>
            </div>
          </div>
        </div>
      </div>

      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}