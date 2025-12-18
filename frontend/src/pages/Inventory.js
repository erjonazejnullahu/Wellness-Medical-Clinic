import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    expiry_date: '',
    price: '',
    description: ''
  });

  // API base URL
  const API_URL = '/api/medicines';

  // Fetch medicines from backend
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setMedicines(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError('Could not load medicines. Check if backend is running at http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  // Load medicines on component mount
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Submit form (add or update medicine)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.quantity || !formData.expiry_date || !formData.price) {
        alert('Please fill all required fields');
        return;
      }

      if (editingId) {
        // Update existing medicine
        const response = await axios.put(`${API_URL}/${editingId}`, formData);
        alert(response.data.message || 'Medicine updated successfully!');
      } else {
        // Add new medicine
        const response = await axios.post(API_URL, formData);
        alert(response.data.message || 'Medicine added successfully!');
      }
      
      // Reset form
      resetForm();
      
      // Refresh medicines list
      fetchMedicines();
      
    } catch (err) {
      console.error('Error saving medicine:', err);
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  // Edit medicine
  const handleEdit = (medicine) => {
    setEditingId(medicine.id);
    setFormData({
      name: medicine.name,
      quantity: medicine.quantity,
      expiry_date: medicine.expiry_date.split('T')[0], // Format date for input
      price: medicine.price,
      description: medicine.description || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete medicine
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert('Medicine deleted successfully!');
        fetchMedicines();
      } catch (err) {
        console.error('Error deleting medicine:', err);
        alert('Error deleting medicine: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      expiry_date: '',
      price: '',
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Get expiry status
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return '';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays <= 30) return 'Expiring Soon';
    return 'Valid';
  };

  // Get status color
  const getStatusColor = (expiryDate) => {
    const status = getExpiryStatus(expiryDate);
    if (status === 'Expired') return 'bg-red-50 text-red-700 border border-red-200';
    if (status === 'Expiring Soon') return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    return 'bg-green-50 text-green-700 border border-green-200';
  };

  // Get quantity color
  const getQuantityColor = (quantity) => {
    if (quantity < 20) return 'bg-red-50 text-red-700 border border-red-200';
    if (quantity < 50) return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    return 'bg-green-50 text-green-700 border border-green-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFDFF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D9DA4] mx-auto"></div>
          <p className="mt-4 text-[#003554]">Loading medicines from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFDFF] p-4 md:p-8">
          {/* Navbar*/}
              <Navbar scrollToSection={scrollToSection} />
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Updated (teksti i hequr) */}
        <header className="mb-8">
          <div className="bg-gradient-to-r from-[#003554] to-[#13315C] rounded-2xl p-6 mb-6 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">🏥 Medicine Inventory Management</h1>
            {/* Teksti "Full CRUD Operations..." është hequr */}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                ⚠️ {error}
              </div>
            </div>
          )}
        </header>

        {/* Add/Edit Medicine Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#13315C]">
                {editingId ? '✏️ Edit Medicine' : '➕ Add New Medicine'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-[#003554] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-medium text-[#13315C] mb-2">
                    Medicine Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-[#3D9DA4] transition-all bg-white"
                    placeholder="Enter medicine name"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-[#13315C] mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-[#3D9DA4] transition-all bg-white"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-[#13315C] mb-2">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-[#3D9DA4] transition-all bg-white"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-[#13315C] mb-2">
                    Price (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-[#3D9DA4] transition-all bg-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#13315C] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D9DA4] focus:border-[#3D9DA4] transition-all bg-white"
                  placeholder="Enter description..."
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105 flex-1 flex items-center justify-center gap-2"
                >
                  {editingId ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Medicine
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Medicine
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 border-2 border-[#003554] text-[#003554] font-medium rounded-lg hover:bg-[#003554] hover:text-white transition-all duration-300 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Action Buttons */}
        {!showForm && (
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Medicine
            </button>
            
            <button
              onClick={fetchMedicines}
              className="px-6 py-3 border-2 border-[#003554] text-[#003554] font-medium rounded-lg hover:bg-[#003554] hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh List
            </button>
          </div>
        )}

        {/* Medicines Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#F8FBFF] to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#13315C]">Medicines List</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {medicines.length} medicines • Click Edit or Delete to manage
                </p>
              </div>
              <div className="text-sm font-medium text-[#003554] bg-[#99C5FF]/20 px-3 py-1 rounded-full">
                Total: {medicines.length} items
              </div>
            </div>
          </div>

          {/* Table Content */}
          {medicines.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#13315C] mb-2">No medicines found</h3>
              <p className="text-gray-500">Click "Add New Medicine" to add your first medicine</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003554] uppercase tracking-wider">
                      Medicine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003554] uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003554] uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003554] uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003554] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#003554] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {medicines.map((medicine) => (
                    <tr key={medicine.id} className="hover:bg-[#F8FBFF] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#13315C]">{medicine.name}</div>
                        {medicine.description && (
                          <div className="text-sm text-gray-500 mt-1">{medicine.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getQuantityColor(medicine.quantity)}`}>
                          {medicine.quantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#13315C]">{formatDate(medicine.expiry_date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-[#13315C]">
                          €{parseFloat(medicine.price).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(medicine.expiry_date)}`}>
                          {getExpiryStatus(medicine.expiry_date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(medicine)}
                            className="px-3 py-1 bg-[#99C5FF]/20 text-[#003554] hover:bg-[#99C5FF]/40 rounded-md text-sm font-medium transition-colors flex items-center gap-1 border border-[#99C5FF]/40"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(medicine.id, medicine.name)}
                            className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-sm font-medium transition-colors flex items-center gap-1 border border-red-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💊 Inventory updated in real-time • All data stored securely in MySQL</p>
        </div>

      </div>
      {/* Footer*/}
          <Footer scrollToSection={scrollToSection} />
    </div>
    
  );
};

export default Inventory;