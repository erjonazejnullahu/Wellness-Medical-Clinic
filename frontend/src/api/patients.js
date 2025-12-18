// Patient service runs on port 5001
const PATIENT_API_BASE = process.env.REACT_APP_PATIENT_API_BASE || 'http://localhost:5001/api';

export async function getAllPatients(token) {
  try {
    console.log('Fetching patients from:', `${PATIENT_API_BASE}/patients`);
    const res = await fetch(`${PATIENT_API_BASE}/patients`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server error response:', errorText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Patients data received:', data);
    return data;
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    throw error;
  }
}

export async function getPatientById(id, token) {
  try {
    const res = await fetch(`${PATIENT_API_BASE}/patients/${id}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    throw error;
  }
}

export async function updatePatient(id, data, token) {
  try {
    const res = await fetch(`${PATIENT_API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error updating patient ${id}:`, error);
    throw error;
  }
}

export async function deletePatient(id, token) {
  try {
    const res = await fetch(`${PATIENT_API_BASE}/patients/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error deleting patient ${id}:`, error);
    throw error;
  }
}