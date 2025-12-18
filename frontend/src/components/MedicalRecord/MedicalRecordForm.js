import { useState, useEffect } from 'react';

export default function MedicalRecordForm({ initialData, onSave }) {
  const safeInitialData = initialData || {};

  const [form, setForm] = useState({
    diagnosis: safeInitialData.diagnosis || '',
    symptoms: safeInitialData.symptoms || '',
    medication: safeInitialData.medication || '',
    treatment_notes: safeInitialData.treatment_notes || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        diagnosis: initialData.diagnosis || '',
        symptoms: initialData.symptoms || '',
        medication: initialData.medication || '',
        treatment_notes: initialData.treatment_notes || ''
      });
    }
  }, [initialData]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  function handleBlur(e) {
    setTouched({ ...touched, [e.target.name]: true });
    validateField(e.target.name, e.target.value);
  }

  function validateField(name, value) {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [name]: 'This field is required' }));
      return false;
    }
    return true;
  }

  function validateForm() {
    const newErrors = {};
    let isValid = true;

    Object.keys(form).forEach(key => {
      if (!form[key].trim()) {
        newErrors[key] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched to show errors
    setTouched({
      diagnosis: true,
      symptoms: true,
      medication: true,
      treatment_notes: true
    });
    
    return isValid;
  }

  function handleSave() {
    if (validateForm()) {
      onSave(form);
    }
  }

  const fieldLabels = {
    diagnosis: 'Diagnosis',
    symptoms: 'Symptoms',
    medication: 'Medication',
    treatment_notes: 'Treatment Notes'
  };

  return (
    <div className="space-y-6">
      {['diagnosis', 'symptoms', 'medication', 'treatment_notes'].map(f => (
        <div key={f} className="space-y-2">
          <label className="block text-[#13315C] font-medium">
            {fieldLabels[f]}
          </label>
          <textarea
            name={f}
            value={form[f]}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder={`Enter ${fieldLabels[f].toLowerCase()}`}
            rows={f === 'treatment_notes' ? 4 : 3}
            className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors resize-none
              ${errors[f] && touched[f] 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-[#3D9DA4]'
              }`}
          />
          {errors[f] && touched[f] && (
            <p className="text-red-600 text-sm">{errors[f]}</p>
          )}
        </div>
      ))}
      
      <button
        onClick={handleSave}
        className="w-full p-3 bg-gradient-to-r from-[#3D9DA4] to-[#3F89A9] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md"
      >
        Save Medical Record
      </button>
    </div>
  );
}