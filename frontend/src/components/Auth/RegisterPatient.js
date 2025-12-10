// RegisterPatient.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerPatient } from '../../api/auth';

export default function RegisterPatient() {
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    first_name: '', 
    last_name: '', 
    date_of_birth: '', 
    gender: '', 
    phone: '', 
    insurance_info: '' 
  });
  const [message, setMessage] = useState(null);
  // State to track validation errors (true/false per field)
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function onChange(e) {
    setForm({...form, [e.target.name]: e.target.value});
    // Clear the error for this field as the user starts typing
    if (errors[e.target.name]) {
      // Set error for the current field to false
      setErrors({...errors, [e.target.name]: false}); 
    }
  }

  async function submit(e){
    e.preventDefault();

    // Regex for basic email format validation (covers most common cases)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // --- UPDATED Validation Logic: Make ALL fields required and check email format ---
    const requiredFields = [
      'email', 
      'password', 
      'first_name', 
      'last_name',
      'date_of_birth',
      'gender',
      'phone',
      'insurance_info'
    ];
    
    const newErrors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      // 1. Check if the field is empty or contains only whitespace
      if (!form[field] || form[field].trim() === '') {
        newErrors[field] = true; // Mark field as having an error
        isValid = false;
      }
    });
    
    // 2. Email format specific check
    if (form.email && !emailRegex.test(form.email)) {
        newErrors.email = 'format'; // Use a specific error state for format
        isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      // Set a generic message when not all fields are filled or email is incorrect
      setMessage('Please correct the highlighted fields!');
      return;
    }
    
    // Clear previous messages if validation passes
    setMessage(null); 
    
    const res = await registerPatient(form);
    
    if(res.token){
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setMessage(res.message || 'Error during registration');
    }
  }

  const inputClass = (name) => 
    `w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
      errors[name] 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-gray-200 focus:border-[#3D9DA4]'
    }`;


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C9E8D9] to-[#CCE0FF] p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#01497C] to-[#01497C] p-6">
            <h2 className="text-2xl font-bold text-white text-center">Create Patient Account</h2>
            <p className="text-[#b4d4ff] text-center mt-2">Fill in your details below</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">First Name</label> 
                  <input 
                    name="first_name" 
                    onChange={onChange} 
                    placeholder="Enter first name" 
                    className={inputClass('first_name')}
                  />
                  {errors.first_name && <p className="text-red-500 text-sm mt-1">First Name is required.</p>}
                </div>
                
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Last Name</label>
                  <input 
                    name="last_name" 
                    onChange={onChange} 
                    placeholder="Enter last name" 
                    className={inputClass('last_name')}
                  />
                  {errors.last_name && <p className="text-red-500 text-sm mt-1">Last Name is required.</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Email Address</label>
                  <input 
                    name="email" 
                    onChange={onChange} 
                    placeholder="Enter email" 
                    className={inputClass('email')}
                  />
                 
                  {errors.email === true && <p className="text-red-500 text-sm mt-1">Email Address is required.</p>}
                  {errors.email === 'format' && <p className="text-red-500 text-sm mt-1">Please enter a valid email format (e.g., user@domain.com).</p>}
                </div>
                
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Password</label>
                  <input 
                    name="password" 
                    type="password" 
                    onChange={onChange} 
                    placeholder="Create password" 
                    className={inputClass('password')}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">Password is required.</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Date of Birth</label>
                  <input 
                    name="date_of_birth" 
                    type="date" 
                    onChange={onChange} 
                    className={inputClass('date_of_birth') + ' text-gray-700'}
                  />
                  {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">Date of Birth is required.</p>}
                </div>
                
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Gender</label>
                  <input 
                    name="gender" 
                    onChange={onChange} 
                    placeholder="Enter gender" 
                    className={inputClass('gender')}
                  />
                  {errors.gender && <p className="text-red-500 text-sm mt-1">Gender is required.</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Phone Number</label>
                  <input 
                    name="phone" 
                    onChange={onChange} 
                    placeholder="Enter phone number" 
                    className={inputClass('phone')}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">Phone Number is required.</p>}
                </div>
                
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Insurance Information</label>
                  <input 
                    name="insurance_info" 
                    onChange={onChange} 
                    placeholder="Enter insurance details" 
                    className={inputClass('insurance_info')}
                  />
                  {errors.insurance_info && <p className="text-red-500 text-sm mt-1">Insurance Information is required.</p>}
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full p-4 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md text-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
            
            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center ${message.includes('successful') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <p className="font-medium">{message}</p>
                {message.includes('successful') && (
                  <div className="mt-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
                    <span className="text-sm">Please wait...</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <span 
                  className="text-[#003554] font-semibold hover:text-[#3F89A9] cursor-pointer transition-colors"
                  onClick={() => navigate('/login')}
                >
                  Login here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}