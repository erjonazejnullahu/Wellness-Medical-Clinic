import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDoctorAppointments,
  confirmAppointment,
  completeAppointment
} from '../../api/doctorAppointments';
import { getRecordByAppointment } from '../../api/medicalRecords'; // ✅ ADDED
import Navbar from '../../pages/Navbar';
import Footer from '../../pages/Footer';

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [medicalRecords, setMedicalRecords] = useState({}); // ✅ ADDED
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

   // Scroll helper for Navbar/Footer
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  async function load() {
    if (!token) {
      setError('You must be logged in as a doctor to see appointments.');
      return;
    }

    try {
      const data = await getDoctorAppointments(token);

      if (data.message) {
        setError(data.message);
      } else {
        setAppointments(data);
        setError('');
        //Load Medical Records
        const recordsMap = {};
        for (const appt of data) {
          try {
            const record = await getRecordByAppointment(appt.id, token);
            if (record && record.id) {
              recordsMap[appt.id] = record;
            }
          } catch {}
        }
        setMedicalRecords(recordsMap);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load appointments.');
    }
  }

  useEffect(() => {
    if (!token) {
      setError('You must be logged in.');
      navigate('/login');
      return;
    }

    if (role !== 'DOCTOR') {
      navigate('/'); // ⛔ block non-doctors
      return;
    }

    load();
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'ALL') return true;
    return apt.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
      <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/20">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-[#13315C] mb-3">Doctor's Appointment Dashboard</h1>
              <p className="text-lg text-gray-600">Manage and track your patient appointments</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {error}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#3D9DA4]">
                <div className="text-3xl font-bold text-[#003554]">{appointments.length}</div>
                <div className="text-gray-600 font-medium">Total Appointments</div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500">
                <div className="text-3xl font-bold text-yellow-700">
                  {appointments.filter(a => a.status === 'PENDING').length}
                </div>
                <div className="text-gray-600 font-medium">Pending</div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-700">
                  {appointments.filter(a => a.status === 'CONFIRMED').length}
                </div>
                <div className="text-gray-600 font-medium">Confirmed</div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
                <div className="text-3xl font-bold text-green-700">
                  {appointments.filter(a => a.status === 'COMPLETED').length}
                </div>
                <div className="text-gray-600 font-medium">Completed</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 mb-6">
                {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-5 py-2 rounded-lg font-medium transition-colors ${filter === status 
                      ? 'bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-[#3D9DA4]'}`}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-5xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments found</h3>
                  <p className="text-gray-500">No appointments match the current filter</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#003554] to-[#13315C] text-white">
                      <tr>
                        <th className="p-4 text-left font-semibold">Patient</th>
                        <th className="p-4 text-left font-semibold">Date & Time</th>
                        <th className="p-4 text-left font-semibold">Status</th>
                        <th className="p-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAppointments.map(appointment => (
                        <React.Fragment key={appointment.id}>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">
                                {appointment.patient_name || `Patient #${appointment.patient_user_id}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {appointment.patient_user_id}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-gray-900">
                                {formatDate(appointment.appointment_date)}
                              </div>
                              <div className="text-gray-600">
                                {appointment.appointment_time}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                {appointment.status === 'PENDING' && (
                                  <button
                                    onClick={async () => {
                                      await confirmAppointment(appointment.id, token);
                                      load();
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                                  >
                                    Confirm
                                  </button>
                                )}

                                {appointment.status === 'CONFIRMED' && (
                                  <button
                                    onClick={async () => {
                                      await completeAppointment(appointment.id, token);
                                      load();
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                                  >
                                    Complete
                                  </button>
                                )}

                                <button
                                  onClick={() => navigate(`/medical-record/${appointment.id}`)}
                                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                                >
                                  {medicalRecords[appointment.id] ? 'View / Edit Record' : 'Add Medical Record'}
                                </button>

                                {(appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') && (
                                  <span className="px-4 py-2 text-gray-500 font-medium">
                                    No actions
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>

                          {medicalRecords[appointment.id] && (
                            <tr className="bg-gray-50">
                              <td colSpan="4" className="p-4">
                                <div className="border-l-4 border-purple-600 pl-4 space-y-1">
                                  <h4 className="font-semibold text-purple-700">Medical Record</h4>
                                  <p><strong>Diagnosis:</strong> {medicalRecords[appointment.id].diagnosis}</p>
                                  <p><strong>Symptoms:</strong> {medicalRecords[appointment.id].symptoms}</p>
                                  <p><strong>Medication:</strong> {medicalRecords[appointment.id].medication}</p>
                                  <p><strong>Treatment Notes:</strong> {medicalRecords[appointment.id].treatment_notes}</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Stats Footer */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              Showing {filteredAppointments.length} of {appointments.length} appointments
              {filter !== 'ALL' && ` (filtered by ${filter.toLowerCase()})`}
            </div>
          </div>
        </div>
      </div>
      <Footer scrollToSection={scrollToSection} />
    </>
  );
}
