import React, { useState, useEffect } from 'react';
import { getDoctorsWithAvailability } from '../../api/doctors';
import Navbar from '../../pages/Navbar';
import Footer from '../../pages/Footer';
import { bookAppointment } from '../../api/appointments';
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT

export default function BookAppointment() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // ADD THIS
  
  // Scroll helper for Navbar/Footer
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // CHECK USER ROLE ON COMPONENT LOAD
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Check if user is logged in
    if (!token) {
      setMsg('You must be logged in to book an appointment.');
      return;
    }
    
    // Check if user is a patient
    if (role !== 'PATIENT') {
      setMsg('Only patients can book appointments.');
      return;
    }
  }, [navigate]);

  // Fetch doctors whenever date or time changes
  useEffect(() => {
    // Don't fetch if user is not a patient
    const role = localStorage.getItem('role');
    if (role !== 'PATIENT') {
      return;
    }
    
    if (!date || !time) {
      setDoctors([]);
      return;
    }

    setLoading(true);
    setMsg('');
    getDoctorsWithAvailability(date, time)
      .then(data => {
        setDoctors(data);
      })
      .catch(err => {
        console.error('Error fetching doctors:', err);
        setMsg('Failed to load doctors. Try again later.');
        setDoctors([]);
      })
      .finally(() => setLoading(false));
  }, [date, time]);

  function onChange(e, fieldName) {
    const value = e.target.value;
    
    if (fieldName === 'reason') {
      setReason(value);
      if (errors.reason) {
        setErrors({...errors, reason: false});
      }
    } else if (fieldName === 'notes') {
      setNotes(value);
    } else if (fieldName === 'doctorId') {
      setDoctorId(value);
      if (errors.doctorId) {
        setErrors({...errors, doctorId: false});
      }
    } else if (fieldName === 'date') {
      setDate(value);
      if (errors.date) {
        setErrors({...errors, date: false});
      }
    } else if (fieldName === 'time') {
      setTime(value);
      if (errors.time) {
        setErrors({...errors, time: false});
      }
    }
  }

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    
    // Check user role before submitting
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      setMsg('You must be logged in to book an appointment.');
      return;
    }
    
    if (role !== 'PATIENT') {
      setMsg('Only patients can book appointments.');
      return;
    }
    
    // Reset errors
    setErrors({});
    
    // Validation logic
    const newErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = [
      { name: 'date', value: date, label: 'Appointment Date' },
      { name: 'time', value: time, label: 'Appointment Time' },
      { name: 'doctorId', value: doctorId, label: 'Doctor' },
      { name: 'reason', value: reason, label: 'Reason for Appointment' }
    ];
    
    requiredFields.forEach(field => {
      if (!field.value || String(field.value).trim() === '') {
        newErrors[field.name] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      setMsg('Please fill in all required fields.');
      return;
    }

    try {
      const res = await bookAppointment(
        { doctor_user_id: doctorId, appointment_date: date, appointment_time: time, reason, notes },
        token
      );

      setMsg(res.message || 'Appointment requested successfully!');

      // Reset form and errors
      setDate('');
      setTime('');
      setDoctorId('');
      setReason('');
      setNotes('');
      setDoctors([]);
      setErrors({});
    } catch (err) {
      console.error(err);
      setMsg('Error booking appointment. Please try again.');
    }
  }

  const inputClass = (name) => 
    `w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
      errors[name] 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-gray-200 focus:border-[#3D9DA4]'
    }`;

  const selectClass = (name) => 
    `w-full p-3 border-2 rounded-lg focus:outline-none transition-colors bg-white ${
      errors[name] 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-gray-200 focus:border-[#3D9DA4]'
    }`;

  // Check if user is a patient - if not, show access denied message
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  
  if (!token) {
    return (
      <>
        <Navbar scrollToSection={scrollToSection} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFF] to-[#FFFFF] p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#3D9DA4] to-[#3D9DA4] p-6">
                <h2 className="text-2xl font-bold text-white text-center">Access Denied</h2>
              </div>
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h3>
                <p className="text-gray-600 mb-6">You must be logged in to book an appointment.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer scrollToSection={scrollToSection} />
      </>
    );
  }
  
  if (role !== 'PATIENT') {
    return (
      <>
        <Navbar scrollToSection={scrollToSection} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFF] to-[#FFFFF] p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#3D9DA4] to-[#3D9DA4] p-6">
                <h2 className="text-2xl font-bold text-white text-center">Access Denied</h2>
              </div>
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">🚫</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Patient Access Only</h3>
                <p className="text-gray-600 mb-4">Only patients can book appointments.</p>
                <p className="text-sm text-gray-500 mb-6">
                  Your current role: <span className="font-semibold">{role || 'None'}</span>
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer scrollToSection={scrollToSection} />
      </>
    );
  }

  // If user is a patient, show the booking form
  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFF] to-[#FFFFF] p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#3D9DA4] to-[#3D9DA4] p-6">
              <h2 className="text-2xl font-bold text-white text-center">Book Appointment</h2>
              <p className="text-[#003554] text-center mt-2">Select a date, time, and available doctor</p>
            </div>
            
            <div className="p-8">
              <form onSubmit={submit} className="space-y-6">
                
                {/* Row 1: Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#13315C] font-medium mb-2">Appointment Date *</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => onChange(e, 'date')}
                      className={inputClass('date')}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">Appointment Date is required.</p>}
                  </div>
                  
                  <div>
                    <label className="block text-[#13315C] font-medium mb-2">Appointment Time *</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => onChange(e, 'time')}
                      className={inputClass('time')}
                    />
                    {errors.time && <p className="text-red-500 text-sm mt-1">Appointment Time is required.</p>}
                  </div>
                </div>

                {/* Row 2: Doctor Selection */}
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Select Doctor *</label>
                  <select
                    value={doctorId}
                    onChange={(e) => onChange(e, 'doctorId')}
                    className={selectClass('doctorId')}
                  >
                    <option value="">Choose a doctor</option>
                    {loading && <option disabled>Loading doctors...</option>}
                    {!loading && doctors.length === 0 && date && time && (
                      <option disabled>No doctors available for selected date/time</option>
                    )}
                    {doctors.map(d => (
                      <option
                        key={d.user_id}
                        value={d.user_id}
                        disabled={!d.available}
                        className={d.available ? "text-gray-900" : "text-gray-400"}
                      >
                        Dr. {d.first_name} {d.last_name} — {d.available ? 'Available' : 'Not available'}
                      </option>
                    ))}
                  </select>
                  {errors.doctorId && <p className="text-red-500 text-sm mt-1">Please select a doctor.</p>}
                  <p className="text-sm text-gray-500 mt-2">
                    {date && time ? 'Doctors shown are available for the selected date and time' : 'Select date and time first to see available doctors'}
                  </p>
                </div>

                {/* Row 3: Reason */}
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Reason for Appointment *</label>
                  <input
                    placeholder="e.g., General checkup, Specific symptoms, Follow-up"
                    value={reason}
                    onChange={(e) => onChange(e, 'reason')}
                    className={inputClass('reason')}
                  />
                  {errors.reason && <p className="text-red-500 text-sm mt-1">Reason for Appointment is required.</p>}
                </div>

                {/* Row 4: Notes */}
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Additional Notes (Optional)</label>
                  <textarea
                    placeholder="Any additional information for the doctor"
                    value={notes}
                    onChange={(e) => onChange(e, 'notes')}
                    className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3D9DA4] transition-colors min-h-[100px] resize-none`}
                    rows="3"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full p-4 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md text-lg"
                  >
                    Request Appointment
                  </button>
                </div>
              </form>
              
              {/* Message Display */}
              {msg && (
                <div className={`mt-6 p-4 rounded-lg text-center ${
                  msg.toLowerCase().includes('successfully') || 
                  msg.toLowerCase().includes('requested successfully') || 
                  msg.toLowerCase().includes('success')
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <p className="font-medium">{msg}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer scrollToSection={scrollToSection} />
    </>
  );
}