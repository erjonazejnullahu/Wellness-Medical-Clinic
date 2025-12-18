import React, { useState } from 'react';
import EditDoctorModal from './EditDoctorModal';

export default function DoctorTable({ doctors, onDelete, onUpdated }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Specialization</th>
              <th className="p-3 text-left">License #</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="border-t">
                <td className="p-3">{doctor.first_name}</td>
                <td className="p-3">{doctor.last_name}</td>
                <td className="p-3">{doctor.specialization || '-'}</td>
                <td className="p-3">{doctor.license_number}</td>
                <td className="p-3">{doctor.years_of_experience} yrs</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => onDelete(doctor.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {doctors.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedDoctor && (
        <EditDoctorModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
}
