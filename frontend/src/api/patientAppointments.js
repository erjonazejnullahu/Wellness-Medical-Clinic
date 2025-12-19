// patientAppointments.js - Complete updated file
import { getRecordByAppointment } from './medicalRecords';

export async function getPatientAppointments(token) {
  const res = await fetch(
    'http://localhost:5003/api/appointments/patient',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.json();
}

export async function getPatientAppointmentsWithMedicalRecords(token) {
  const appointments = await getPatientAppointments(token);
  
  if (appointments.message || !Array.isArray(appointments)) {
    return appointments;
  }
  
  const appointmentsWithRecords = await Promise.all(
    appointments.map(async (appointment) => {
      try {
        const medicalRecord = await getRecordByAppointment(appointment.id, token);
        
        // Check if medical record exists (has an id property)
        const hasRecord = medicalRecord && medicalRecord.id;
        
        return {
          ...appointment,
          medical_record: hasRecord ? medicalRecord : null
        };
      } catch (error) {
        // If error fetching medical record, return appointment without it
        return {
          ...appointment,
          medical_record: null
        };
      }
    })
  );
  
  return appointmentsWithRecords;
}