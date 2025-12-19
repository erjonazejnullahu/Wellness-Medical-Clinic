import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updatePatient, getPatientById } from '../../api/patients';
import Navbar from '../../pages/Navbar';
import Footer from '../../pages/Footer';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    insurance_info: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const token = localStorage.getItem('token');

  
   const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const patient = await getPatientById(id, token);
      setForm({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        date_of_birth: patient.date_of_birth || '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        insurance_info: patient.insurance_info || ''
      });
    } catch (error) {
      alert('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      const result = await updatePatient(id, form, token);
      
      if (result.message) {
        setTimeout(() => {
          navigate('/patient-dashboard');
        }, 1000);
      }
    } catch (error) {
      alert('Failed to update patient');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20 flex items-center justify-center">
      <p className="text-[#13315C]">Loading patient data...</p>
    </div>
  );

  return (
     <>
          <Navbar scrollToSection={scrollToSection} />
    <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/patient-dashboard')}
            className="flex items-center text-[#13315C] hover:text-[#003554] mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Patients
          </button>
          <h1 className="text-3xl font-bold text-[#13315C]">Edit Patient</h1>
          <p className="text-gray-600 mt-2">Update patient information and save changes</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6 pb-4 border-b">
            <h2 className="text-xl font-semibold text-[#13315C]">Editing Patient #{id}</h2>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={onChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
                  placeholder="First Name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={onChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={onChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <input
                  name="gender"
                  value={form.gender}
                  onChange={onChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
                  placeholder="Enter gender"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
                  placeholder="Phone Number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Information</label>
                <input
                  name="insurance_info"
                  value={form.insurance_info}
                  onChange={onChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
                  placeholder="Insurance Details"
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/patient-dashboard')}
                  className="px-6 py-3 border-2 border-[#003554] text-[#003554] font-semibold rounded-lg hover:bg-[#003554] hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer scrollToSection={scrollToSection} />
         </>
  );
}