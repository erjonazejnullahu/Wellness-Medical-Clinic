export function getDoctorsWithAvailability(date, time) {
  return fetch(
    `http://localhost:5002/api/doctors/availability?date=${date}&time=${time}`
  ).then(res => res.json());
}
