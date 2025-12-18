import React from 'react';

const MedicineTable = ({ medicines, editMedicine, deleteMedicine }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 30) {
      return { status: 'Soon', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'Valid', color: 'bg-green-100 text-green-800' };
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 10) {
      return { status: 'Low', color: 'bg-red-50 text-red-700 border border-red-200' };
    } else if (quantity <= 50) {
      return { status: 'Medium', color: 'bg-yellow-50 text-yellow-700 border border-yellow-200' };
    } else {
      return { status: 'High', color: 'bg-green-50 text-green-700 border border-green-200' };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#13315C]">
          📋 Lista e Barnave ({medicines.length})
        </h3>
        <span className="text-sm text-gray-500">
          Klikoni në butonat e veprimeve për të modifikuar
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Barna
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lloji & Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Çmimi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skadimi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Furnizuesi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veprime
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicines.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-lg font-medium">Nuk u gjet asnjë barnë</p>
                    <p className="text-sm">Shtoni barnë të reja për të filluar</p>
                  </div>
                </td>
              </tr>
            ) : (
              medicines.map((medicine) => {
                const expiryStatus = getExpiryStatus(medicine.expiryDate);
                const stockStatus = getStockStatus(medicine.quantity);

                return (
                  <tr key={medicine.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-[#003554]">
                          {medicine.name}
                        </div>
                        {medicine.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {medicine.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                          {medicine.type}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
                            {stockStatus.status} Stock
                          </div>
                          <span className="text-sm font-medium">
                            {medicine.quantity} copë
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#13315C]">
                        {medicine.price.toFixed(2)} €
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: {(medicine.price * medicine.quantity).toFixed(2)} €
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDate(medicine.expiryDate)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${expiryStatus.color}`}>
                          {expiryStatus.status}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {medicine.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editMedicine(medicine)}
                          className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 flex items-center gap-1"
                          title="Editoni"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMedicine(medicine.id)}
                          className="px-3 py-1 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-200 flex items-center gap-1"
                          title="Fshini"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer i Tabelës */}
      {medicines.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <div>
              Shfaqen <span className="font-semibold">{medicines.length}</span> barnë
            </div>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                <span>Stock i Lartë</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
                <span>Stock i Ulët</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 rounded-full"></div>
                <span>I Skaduar</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTable;