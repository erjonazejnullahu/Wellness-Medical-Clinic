import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserDoctor } from "react-icons/fa6";
import { getPatientAppointments } from '../../api/patientAppointments';
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
      const data = await getPatientAppointments(token);

      if (data.message) {
        setError(data.message);
      } else {
        setAppointments(data);
      }
    } catch (err) {
      setError('Failed to load appointments');
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-[#99C5FF]/10">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#13315C] mb-4">
              My Appointments
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              View and manage all your scheduled medical appointments in one place
            </p>
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
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#3D9DA4] hover:text-[#003554]'
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <div className="text-red-500 mr-3">⚠️</div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Appointments Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D9DA4]"></div>
              <p className="mt-4 text-gray-600">Loading your appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                {filter === 'ALL' ? 'No appointments yet' : 'No appointments found'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {filter === 'ALL'
                  ? "You haven't booked any appointments yet. Schedule your first appointment to get started."
                  : `You don't have any ${filter.toLowerCase()} appointments.`}
              </p>
              {filter === 'ALL' && (
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="px-8 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                >
                  Book Your First Appointment
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Appointment Header */}
                  <div className="bg-gradient-to-r from-[#003554]/5 to-[#13315C]/5 p-6 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <FaUserDoctor className="text-2xl text-[#3D9DA4]" />
                          <div>
                            <h3 className="text-xl font-bold text-[#13315C]">
                              Dr. {appointment.doctor_name || `Doctor #${appointment.doctor_user_id}`}
                            </h3>
                            <p className="text-gray-600 text-sm">Medical Appointment</p>
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(appointment.status)}`}>
                        {statusIcon(appointment.status)} {appointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-500 text-sm font-medium mb-1">Date & Time</p>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">📅</span>
                            <p className="font-semibold text-gray-800">
                              {formatDate(appointment.appointment_date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400">⏰</span>
                            <p className="font-semibold text-gray-800">{appointment.appointment_time}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm font-medium mb-1">Reason</p>
                          <p className="text-gray-800 font-medium">
                            {appointment.reason || 'General Consultation'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-500 text-sm font-medium text-right mb-1">Booked On</p>
                          <p className="text-gray-700 font-medium text-right">
                            {new Date(appointment.createdAt || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        {/* This empty div maintains the layout */}
                        <div></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                      {appointment.status === 'PENDING' && (
                        <button className="px-5 py-2.5 text-sm font-medium text-[#003554] bg-[#003554]/10 rounded-lg hover:bg-[#003554]/20 transition-colors">
                          View Details
                        </button>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <button className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] rounded-lg hover:opacity-90 transition-opacity">
                          Join Appointment
                        </button>
                      )}
                      {appointment.status === 'COMPLETED' && (
                        <button className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          View Summary
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Stats */}
          {filteredAppointments.length > 0 && (
            <div className="mt-10 text-center">
              <p className="text-gray-500">
                Showing <span className="font-semibold text-[#003554]">{filteredAppointments.length}</span> of{' '}
                <span className="font-semibold">{appointments.length}</span> appointments
                {filter !== 'ALL' && (
                  <span className="text-[#3D9DA4]"> (filtered by {filter.toLowerCase()})</span>
                )}
              </p>
            </div>
          )}

          {/* Quick Action */}
          <div className="mt-12 bg-gradient-to-r from-[#003554]/5 to-[#13315C]/5 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-[#13315C] mb-3">Need a new appointment?</h3>
            <p className="text-gray-600 mb-6">Schedule with one of our expert doctors today</p>
            <button
              onClick={() => navigate('/book-appointment')}
              className="px-8 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow inline-flex items-center gap-2"
            >
              <span>+</span> Book New Appointment
            </button>
          </div>
        </div>
      </div>

      <Footer scrollToSection={scrollToSection} />
    </>
  );
}