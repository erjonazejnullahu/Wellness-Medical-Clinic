const AUTH_API = 'http://localhost:5000/api/auth';
const PATIENT_API = 'http://localhost:5001/api/patients';
const DOCTOR_API = 'http://localhost:5002/api/doctors';

export async function getMe(token) {
  const res = await fetch(`${AUTH_API}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getPatientByUserId(userId) {
  const res = await fetch(`${PATIENT_API}/user/${userId}`);
  return res.json();
}

export async function getDoctorByUserId(userId) {
  const res = await fetch(`${DOCTOR_API}/user/${userId}`);
  return res.json();
}