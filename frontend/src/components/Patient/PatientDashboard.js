import React, { useState, useEffect } from 'react';
import { getAllPatients, deletePatient } from '../../api/patients';
import Navbar from '../../pages/Navbar';
import Footer from '../../pages/Footer';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getAllPatients(token);
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
        setError('No patient data found');
      }
    } catch (err) {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      const result = await deletePatient(id, token);
      if (result.message) {
        loadPatients();
      }
    } catch (err) {
      alert('Failed to delete patient');
    }
  };

   const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20 p-8">
      <p className="text-[#13315C]">Loading patients...</p>
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
      <section className="bg-gradient-to-r from-[#3F89A9] to-[#3F89A9] py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Patient Management Dashboard</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Manage all patient records efficiently. View, edit, and organize patient information in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-6 py-3 bg-gradient-to-r from-[#024959] to-[#024959] text-white font-semibold rounded-lg hover:shadow-xl transition-shadow"
              >
                Add New Patient
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-blue-600 font-bold text-3xl">{patients.length}</div>
            <div className="text-gray-600">Total Patients</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-green-600 font-bold text-3xl">
              {patients.filter(p => p.gender?.toLowerCase() === 'male').length}
            </div>
            <div className="text-gray-600">Male Patients</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-pink-600 font-bold text-3xl">
              {patients.filter(p => p.gender?.toLowerCase() === 'female').length}
            </div>
            <div className="text-gray-600">Female Patients</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-purple-600 font-bold text-3xl">
              {patients.filter(p => p.insurance_info).length}
            </div>
            <div className="text-gray-600">With Insurance</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#13315C]">All Patients ({patients.length})</h2>
          <button
            onClick={loadPatients}
            className="px-5 py-2.5 bg-[#3D9DA4] text-white font-semibold rounded-lg hover:bg-[#2C8C94] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {patients.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg mb-4">No patient records found</p>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Add First Patient
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Insurance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{patient.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {patient.first_name} {patient.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          User ID: {patient.user_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.gender?.toLowerCase() === 'male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : patient.gender?.toLowerCase() === 'female'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.gender || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.insurance_info ? (
                          <span className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.insurance_info}
                          </span>
                        ) : (
                          <span className="text-gray-400">No insurance</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            to={`/edit-patient/${patient.id}`}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer scrollToSection={scrollToSection} />
     </>
  );
}