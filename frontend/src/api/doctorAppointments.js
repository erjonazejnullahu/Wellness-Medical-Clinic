const BASE = 'http://localhost:5003/api/appointments';

export function getDoctorAppointments(token) {
  return fetch(`${BASE}/doctor`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json());
}

export function confirmAppointment(id, token) {
  return fetch(`${BASE}/${id}/confirm`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json());
}

export function completeAppointment(id, token) {
  return fetch(`${BASE}/${id}/complete`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json());
}
