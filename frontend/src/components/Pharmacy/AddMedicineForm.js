import React, { useState, useEffect } from 'react';

const AddMedicineForm = ({ addMedicine, updateMedicine, editingMedicine, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Tableta',
    quantity: '',
    price: '',
    expiryDate: '',
    supplier: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // Plotëso formën nëse po editojmë
  useEffect(() => {
    if (editingMedicine) {
      setFormData(editingMedicine);
    }
  }, [editingMedicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Pastro error-in kur përdoruesi fillon të shkruajë
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Emri i barnës është i detyrueshëm';
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = 'Sasia duhet të jetë pozitive';
    if (!formData.price || formData.price < 0) newErrors.price = 'Çmimi duhet të jetë pozitiv';
    if (!formData.expiryDate) newErrors.expiryDate = 'Data e skadimit është e detyrueshme';
    if (new Date(formData.expiryDate) < new Date()) newErrors.expiryDate = 'Data e skadimit nuk mund të jetë në të kaluarën';
    if (!formData.supplier.trim()) newErrors.supplier = 'Furnizuesi është i detyrueshëm';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingMedicine) {
      updateMedicine(formData);
    } else {
      addMedicine(formData);
    }
  };

  const medicineTypes = ['Tableta', 'Kapsulë', 'Sirup', 'Injektim', 'Krem', 'Ungjent', 'Pluhur'];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#13315C] flex items-center gap-2">
          {editingMedicine ? '✏️ Editoni Barnën' : '➕ Shto Barnë të Re'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emri i Barnës */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emri i Barnës *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent`}
              placeholder="Shkruani emrin e barnës"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Lloji i Barnës */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lloji i Barnës
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent"
            >
              {medicineTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Sasia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sasia *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-3 rounded-lg border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent`}
              placeholder="Shkruani sasinë"
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
          </div>

          {/* Çmimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Çmimi (€) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-3 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent`}
              placeholder="Shkruani çmimin"
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          {/* Data e Skadimit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data e Skadimit *
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent`}
            />
            {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
          </div>

          {/* Furnizuesi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Furnizuesi *
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.supplier ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent`}
              placeholder="Shkruani emrin e furnizuesit"
            />
            {errors.supplier && <p className="mt-1 text-sm text-red-500">{errors.supplier}</p>}
          </div>
        </div>

        {/* Përshkrimi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Përshkrimi (Opsionale)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3D9DA4] focus:border-transparent"
            placeholder="Shkruani një përshkrim të barnës..."
          />
        </div>

        {/* Butonat */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
          >
            {editingMedicine ? '💾 Ruani Ndryshimet' : '➕ Shtoni Barnën'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-[#003554] text-[#003554] font-semibold rounded-lg hover:bg-[#003554] hover:text-white transition-colors"
          >
            ❌ Anulo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicineForm;