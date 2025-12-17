const BASE = 'http://localhost:5003/api/appointments';

export function bookAppointment(data, token) {
  return fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}
