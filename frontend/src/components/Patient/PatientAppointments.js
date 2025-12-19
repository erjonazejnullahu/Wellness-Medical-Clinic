import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserDoctor } from "react-icons/fa6";
import { getPatientAppointmentsWithMedicalRecords } from '../../api/patientAppointments';
import Navbar from '../../pages/Navbar';
import Footer from '../../pages/Footer';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (role !== 'PATIENT') {
      navigate('/');
      return;
    }
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getPatientAppointmentsWithMedicalRecords(token);
      if (data.message) {
        setError(data.message);
      } else {
        setAppointments(data);
      }
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'ALL') return true;
    return apt.status === filter;
  });

  const statusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'CONFIRMED': return '✅';
      case 'COMPLETED': return '🏁';
      case 'CANCELLED': return '❌';
      default: return '📅';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    return timeString;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Simplified Medical Record View matching the screenshot style
  const MedicalRecordView = ({ medicalRecord }) => {
    if (!medicalRecord || !medicalRecord.id) {
      return (
        <div className="mt-6 pt-4 border-t border-gray-100">
           <h4 className="text-lg font-bold text-[#A855F7] mb-2">Medical Record</h4>
           <p className="text-gray-600 italic">No medical record available yet. Your doctor hasn't uploaded the medical record for this appointment.</p>
        </div>
      );
    }

    return (
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="border-l-4 border-[#A855F7] pl-4 py-1">
          <h4 className="text-lg font-bold text-[#A855F7] mb-3">Medical Record</h4>
          <div className="space-y-2 text-gray-800">
            <p><span className="font-bold">Diagnosis:</span> {medicalRecord.diagnosis || 'N/A'}</p>
            <p><span className="font-bold">Symptoms:</span> {medicalRecord.symptoms || 'N/A'}</p>
            <p><span className="font-bold">Medication:</span> {medicalRecord.medication || 'N/A'}</p>
            <p><span className="font-bold">Treatment Notes:</span> {medicalRecord.treatment_notes || 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
      <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/10">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#13315C] mb-4"> My Appointments </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto"> View and manage your scheduled medical appointments </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#3D9DA4]'
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-[#3D9DA4]"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <h3 className="text-2xl font-semibold text-gray-700">No appointments found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                  {/* Card Header */}
                  <div className="bg-gray-50 p-6 border-b flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <FaUserDoctor className="text-2xl text-[#3D9DA4]" />
                      <h3 className="text-xl font-bold text-[#13315C]">
                        Dr. {appointment.doctor_name || `Doctor #${appointment.doctor_user_id}`}
                      </h3>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(appointment.status)}`}>
                      {statusIcon(appointment.status)} {appointment.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs font-bold uppercase">Date</p>
                        <p className="text-gray-800 font-medium">{formatDate(appointment.appointment_date)}</p>
                        <p className="text-gray-800 font-medium">{formatTime(appointment.appointment_time)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs font-bold uppercase">Reason</p>
                        <p className="text-gray-800 font-medium">{appointment.reason || 'General'}</p>
                      </div>
                    </div>

                    {/* ONLY show medical record if COMPLETED */}
                    {appointment.status === 'COMPLETED' && (
                      <MedicalRecordView medicalRecord={appointment.medical_record} />
                    )}

                    {/* Action Footer */}
                    <div className="mt-6 pt-4 border-t flex justify-end">
                       {appointment.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => navigate(`/join-appointment/${appointment.id}`)}
                            className="px-6 py-2 bg-[#3D9DA4] text-white rounded-lg font-bold hover:bg-[#13315C] transition-colors"
                          >
                            Join Appointment
                          </button>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer scrollToSection={scrollToSection} />
    </>
  );
}