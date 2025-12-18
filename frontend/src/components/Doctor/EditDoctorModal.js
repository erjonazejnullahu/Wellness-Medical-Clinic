import React, { useState } from 'react';
import { updateDoctor } from '../../api/doctorApi';

export default function EditDoctorModal({ doctor, onClose, onUpdated }) {
  const [form, setForm] = useState({
    first_name: doctor.first_name,
    last_name: doctor.last_name,
    specialization: doctor.specialization || '',
    license_number: doctor.license_number,
    years_of_experience: doctor.years_of_experience
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await updateDoctor(doctor.id, form);
      onUpdated();
      onClose();
    } catch (err) {
      alert('Failed to update doctor');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-[#13315C] mb-6">Edit Doctor</h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            name="first_name"
            value={form.first_name}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
            placeholder="First Name"
            required
          />

          <input
            name="last_name"
            value={form.last_name}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
            placeholder="Last Name"
            required
          />

          <input
            name="specialization"
            value={form.specialization}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
            placeholder="Specialization"
          />

          <input
            name="license_number"
            value={form.license_number}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
            placeholder="License Number"
            required
          />

          <input
            type="number"
            name="years_of_experience"
            value={form.years_of_experience}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent outline-none"
            placeholder="Years of Experience"
          />

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-[#003554] text-[#003554] font-semibold rounded-lg hover:bg-[#003554] hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}