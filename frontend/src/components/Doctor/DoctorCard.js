import React from 'react';

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-[#3D9DA4] w-full">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-[#99C5FF] to-[#3D9DA4] text-white text-3xl font-bold shadow-md">
            {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
          </div>
        </div>
        
        {/* Doctor Info */}
        <div className="flex-grow min-w-0">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#003554] mb-1">
              Dr. {doctor.first_name} {doctor.last_name}
            </h2>
            
            <div className="mb-3">
              <span className="inline-block px-4 py-1.5 bg-[#99C5FF]/20 text-[#003554] font-semibold rounded-full text-sm">
                {doctor.specialization || "General Practitioner"}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-gray-700">
              <span className="text-[#3F89A9] mr-3 text-lg">🩺</span>
              <div>
                <div className="text-sm text-gray-500">License</div>
                <div className="font-medium truncate">{doctor.license_number}</div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <span className="text-[#3F89A9] mr-3 text-lg">📅</span>
              <div>
                <div className="text-sm text-gray-500">Experience</div>
                <div className="font-medium">{doctor.years_of_experience} years</div>
              </div>
            </div>
            
            {doctor.hospital && (
              <div className="flex items-center text-gray-700">
                <span className="text-[#3F89A9] mr-3 text-lg">🏥</span>
                <div>
                  <div className="text-sm text-gray-500">Hospital</div>
                  <div className="font-medium truncate">{doctor.hospital}</div>
                </div>
              </div>
            )}
            
            {doctor.consultation_fee && (
              <div className="flex items-center text-gray-700">
                <span className="text-[#3F89A9] mr-3 text-lg">💰</span>
                <div>
                  <div className="text-sm text-gray-500">Consultation Fee</div>
                  <div className="font-medium">${doctor.consultation_fee}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}