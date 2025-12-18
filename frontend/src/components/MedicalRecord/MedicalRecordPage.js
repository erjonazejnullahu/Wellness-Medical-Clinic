import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getRecordByAppointment,
  createRecord,
  updateRecord
} from '../../api/medicalRecords';
import MedicalRecordForm from './MedicalRecordForm';

export default function MedicalRecordPage() {
  const { appointmentId } = useParams();
  const token = localStorage.getItem('token');
  const [record, setRecord] = useState(null);
  const navigate = useNavigate(); // Add this hook

  useEffect(() => {
    getRecordByAppointment(appointmentId, token).then(setRecord);
  }, []);

  async function save(data) {
    if (record?.id)
      await updateRecord(record.id, data, token);
    else
      await createRecord({ ...data, appointment_id: appointmentId }, token);

    const updated = await getRecordByAppointment(appointmentId, token);
    setRecord(updated);
    
    // Add redirect after successful save
    navigate('/doctor/appointments');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F6F0] to-[#E6F2FF]">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#01497C] p-6">
            <h2 className="text-2xl font-bold text-white text-center">Medical Record</h2>
            <p className="text-[#b4d4ff] text-center mt-2">
              {record?.id ? 'Edit medical record' : 'Create new medical record'}
            </p>
          </div>
          <div className="p-8">
            <MedicalRecordForm initialData={record} onSave={save} />
          </div>
        </div>
      </div>
    </div>
  );
}