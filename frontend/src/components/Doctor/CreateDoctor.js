import React, { useState } from 'react';
import { createDoctor } from '../../api/auth';

export default function CreateDoctor() {
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    first_name: '', 
    last_name: '', 
    specialization: '', 
    license_number: '', 
    years_of_experience: '' 
  });
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  function onChange(e) { 
    setForm({...form, [e.target.name]: e.target.value}); 
    if (errors[e.target.name]) {
      setErrors({...errors, [e.target.name]: false}); 
    }
  }

  async function submit(e){
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // --- Validation Logic: Make ALL fields required and check email format ---
    const requiredFields = [
      'email', 
      'password', 
      'first_name', 
      'last_name', 
      'specialization', 
      'license_number', 
      'years_of_experience'
    ];
    
    const newErrors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      if (!form[field] || String(form[field]).trim() === '') {
        newErrors[field] = true; 
        isValid = false;
      }
    });
    
    if (form.email && !emailRegex.test(form.email)) {
        newErrors.email = 'format';
        isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setMessage('Please correct the highlighted fields and ensure the email format is valid.');
      return;
    }
    
    setMessage(null); 
    
    const token = localStorage.getItem('token');
    const res = await createDoctor(form, token);
    
    // FIXED: Check for different possible success messages
    const successMessages = ['successfully', 'doctor created', 'created successfully', 'created', 'success'];
    
    // Check if any success keyword exists in the response
    const responseMessage = res.message || JSON.stringify(res) || '';
    const isSuccess = successMessages.some(keyword => 
      responseMessage.toLowerCase().includes(keyword)
    );
    
    if(isSuccess){
      setMessage('Doctor account created successfully!');
    } else {
      setMessage(responseMessage);
    }
  }

  const inputClass = (name) => 
    `w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
      errors[name] 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-gray-200 focus:border-[#3D9DA4]'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#99C5FF] to-[#3F89A9] p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#003554] to-[#13315C] p-6">
            <h2 className="text-2xl font-bold text-white text-center">Create Doctor Account (Admin)</h2>
            <p className="text-[#99C5FF] text-center mt-2">Enter the details for the new doctor</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={submit} className="space-y-6">
              
              {/* Row 1: First Name & Last Name */}
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

              {/* Row 2: Email & Password */}
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
                  {errors.email === 'format' && <p className="text-red-500 text-sm mt-1">Please enter a valid email format.</p>}
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
              
              {/* Row 3: Specialization & License Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">Specialization</label>
                  <input 
                    name="specialization" 
                    onChange={onChange} 
                    placeholder="e.g., Cardiology" 
                    className={inputClass('specialization')}
                  />
                  {errors.specialization && <p className="text-red-500 text-sm mt-1">Specialization is required.</p>}
                </div>
                
                <div>
                  <label className="block text-[#13315C] font-medium mb-2">License Number</label>
                  <input 
                    name="license_number" 
                    onChange={onChange} 
                    placeholder="Enter license number" 
                    className={inputClass('license_number')}
                  />
                  {errors.license_number && <p className="text-red-500 text-sm mt-1">License Number is required.</p>}
                </div>
              </div>

              {/* Row 4: Years of Experience */}
              <div>
                  <label className="block text-[#13315C] font-medium mb-2">Years of Experience</label>
                  <input 
                    name="years_of_experience" 
                    type="number" 
                    onChange={onChange} 
                    placeholder="Enter years of experience" 
                    className={inputClass('years_of_experience')}
                  />
                  {errors.years_of_experience && <p className="text-red-500 text-sm mt-1">Years of Experience is required (must be 0 or more).</p>}
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full p-4 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md text-lg"
                >
                  Create Doctor
                </button>
              </div>
            </form>
            
            {/* FIXED: Now checks for multiple success keywords */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center ${message.toLowerCase().includes('successfully') || message.toLowerCase().includes('doctor created') || message.toLowerCase().includes('created successfully') ? 
              'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <p className="font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}