import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPatient from './components/Auth/RegisterPatient';
import Login from './components/Auth/Login';
import CreateDoctor from './components/Doctor/CreateDoctor';
import Home from './pages/Home';
import OurStaff from './pages/OurStaff';
import AboutUs from './pages/AboutUs';

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
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        
        <Route path="/staff" element={<OurStaff/>} />
        <Route path="/aboutus" element={<AboutUs/>} />
        <Route path="/create-doctor" element={
          <PrivateRoute>
            <CreateDoctor />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;