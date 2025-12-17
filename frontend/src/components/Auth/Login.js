// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    const res = await login(form);

    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.user.role);
      console.log('Logged in with role:', res.user.role);
      setMessage('Logged in successfully!');
      navigate('/');
    } else {
      setMessage(res.message || 'Error');
    }
  }

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F6F0] to-[#E6F2FF] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#01497C] p-6">
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
            <p className="text-[#b4d4ff] text-center mt-2">Login in to your account</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-[#13315C] font-medium mb-2">Email</label>
                <input
                  name="email"
                  onChange={onChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3D9DA4] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-[#13315C] font-medium mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  onChange={onChange}
                  placeholder="Enter your password"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3D9DA4] transition-colors"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full p-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md"
              >
                Log In
              </button>
            </form>
            
            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <span 
                  className="text-[#003554] font-semibold hover:text-[#3F89A9] cursor-pointer transition-colors"
                  onClick={() => navigate('/register')}
                >
                  Register here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}