const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function registerPatient(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// auth.js
export async function createDoctor(payload, token) {
  const res = await fetch(`${API_BASE}/auth/create-doctor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, // Correct header format
    body: JSON.stringify(payload)
  });
  return res.json();
}