import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPatient from './components/Auth/RegisterPatient';
import Login from './components/Auth/Login';
import CreateDoctor from './components/Doctor/CreateDoctor';
import Home from './pages/Home';
import OurStaff from './pages/OurStaff';
import Profile from './pages/Profile';
import BookAppointment from './components/Appointment/BookAppointment';
import DoctorAppointments from './components/Doctor/DoctorAppointments';
import AboutUs from './pages/AboutUs';
import AdminPanel from './pages/AdminPanel';
import Inventory from './pages/Inventory';
import DoctorsDashboard from './pages/DoctorsDashboard';
import MedicalRecordPage from './components/MedicalRecord/MedicalRecordPage';
import PatientDashboard from './components/Patient/PatientDashboard';
import EditPatient from './components/Patient/EditPatient';


function App() {

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPatient />} />
        <Route path="/login" element={<Login />} />
          <Route
          path="/adminpanel"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
     <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
         <Route
          path="/doctors-dashboard"
          element={
            <PrivateRoute>
              <DoctorsDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-patient/:id"
          element={
            <PrivateRoute>
              <EditPatient />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        
        <Route path="/staff" element={<OurStaff/>} />
        <Route path="/aboutus" element={<AboutUs/>} />
        <Route path="/medical-record/:appointmentId" element={<MedicalRecordPage />} />
        <Route path="/create-doctor" element={
          <PrivateRoute>
            <CreateDoctor />
          </PrivateRoute>
        } />

        <Route
        path="/book-appointment"
        element={
          <PrivateRoute>
            <BookAppointment />
          </PrivateRoute>
        }
      />
        <Route
        path="/doctor/appointments"
        element={
          <PrivateRoute>
            <DoctorAppointments />
          </PrivateRoute>
        }
      />
    
      </Routes>
    </Router>
  );
}

export default App;