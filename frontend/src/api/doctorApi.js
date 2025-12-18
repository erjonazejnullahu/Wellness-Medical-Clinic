// frontend/src/api/doctorApi.js

const API_BASE_URL = 'http://localhost:4000'; // API Gateway URL

export const fetchDoctors = async () => {
  try {
    // Note: The /doctors path is automatically routed by the API Gateway
    const response = await fetch(`${API_BASE_URL}/doctors`);

    if (!response.ok) {
      // Handle HTTP errors
      const errorText = await response.text();
      throw new Error(`Failed to fetch doctors: ${response.status} - ${errorText}`);
    }

    const doctors = await response.json();
    return doctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    // You might want to throw the error or return an empty array/null
    throw error;
  }
};

export const fetchDoctorById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch doctor: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching doctor:", error);
    throw error;
  }
};

export const updateDoctor = async (id, doctorData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doctorData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update doctor: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete doctor: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
};
