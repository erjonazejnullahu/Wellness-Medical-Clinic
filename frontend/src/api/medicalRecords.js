const BASE = 'http://localhost:5004/api/medical-records';

export function getRecordByAppointment(appointmentId, token) {
  return fetch(`${BASE}/appointment/${appointmentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
}

export function createRecord(data, token) {
  return fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

export function updateRecord(id, data, token) {
  return fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

export function deleteRecord(id, token) {
  return fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());
}
