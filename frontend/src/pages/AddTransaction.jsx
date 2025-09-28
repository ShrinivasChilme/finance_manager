
// import React, { useState, useEffect } from 'react';
// import api from '../api/api';
// import { useParams, useNavigate } from 'react-router-dom';

// export default function AddTransaction() {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     type: 'EXPENSE',  
//     category: '',
//     amount: '',
//     date: new Date().toISOString().split('T')[0],
//     notes: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const categories = {
//     INCOME: ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'],
//     EXPENSE: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other Expense']
//   };

//   useEffect(() => {
//     if (id) {
//       setIsEditing(true);
//       fetchTransaction();
//     }
//   }, [id]);

//   const fetchTransaction = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/transactions/${id}`);
//       const transaction = response.data;
      
//       setFormData({
//         type: transaction.type || 'EXPENSE',
//         category: transaction.category || '',
//         amount: transaction.amount || '',
//         date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
//         notes: transaction.notes || ''
//       });
//     } catch (err) {
//       console.error('Error fetching transaction:', err);
//       setError('Failed to load transaction data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (error) setError('');
//     if (success) setSuccess(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     // Fixed the syntax error here - missing closing brace
//     if (!formData.category) {
//       setError('Please select a category');
//       setLoading(false);
//       return;
//     }

//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       setError('Please enter a valid amount');
//       setLoading(false);
//       return;
//     } // ← This closing brace was missing

//     if (!formData.date) {
//       setError('Please select a date');
//       setLoading(false);
//       return;
//     }

//     try {
//       const transactionData = {
//         amount: formData.amount,
//         type: formData.type,
//         category: formData.category,
//         date: formData.date,
//         notes: formData.notes || '',
//       };

//       console.log('Sending transaction data:', transactionData);

//       let response;
//       if (isEditing) {
//         response = await api.put(`/transactions/${id}`, transactionData);
//         console.log('Transaction updated successfully:', response.data);
//         setSuccess('Transaction updated successfully!');
//       } else {
//         response = await api.post('/transactions', transactionData);
//         console.log('Transaction added successfully:', response.data);
//         setSuccess('Transaction added successfully!');
//       }
      
//       // Reset form only if not editing
//       if (!isEditing) {
//         setFormData({
//           type: 'EXPENSE',
//           category: '',
//           amount: '',
//           date: new Date().toISOString().split('T')[0],
//           notes: ''
//         });
//       }
      
//       // Navigate to dashboard after success
//       setTimeout(() => {
//         navigate('/dashboard', { state: { refresh: true } }); // Pass refresh state
//       }, 1500);
      
//     } catch (err) {
//       console.error('API Error details:', err);
      
//       if (err.response) {
//         if (err.response.status === 400) {
//           setError('Invalid data. Please check your inputs.');
//         } else if (err.response.status === 401) {
//           setError('Please login again.');
//         } else if (err.response.status === 404) {
//           setError('Transaction not found.');
//         } else if (err.response.status === 500) {
//           setError('Server error. Please try again later.');
//         } else {
//           setError(err.response.data?.message || `Error: ${err.response.status}`);
//         }
//       } else if (err.request) {
//         setError('Network error. Please check your connection.');
//       } else {
//         setError('An unexpected error occurred.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.delete(`/transactions/${id}`);
//       setSuccess('Transaction deleted successfully!');
      
//       setTimeout(() => {
//         navigate('/transactions'); // Redirect to transactions list
//       }, 1500);
      
//     } catch (err) {
//       console.error('Error deleting transaction:', err);
//       setError('Failed to delete transaction');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/transactions'); // Go back to transactions list
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//         <div className="flex justify-between items-center mb-2">
//           <h1 className="text-2xl font-bold text-gray-900">
//             {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
//           </h1>
//           {isEditing && (
//             <button
//               onClick={handleDelete}
//               disabled={loading}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
//             >
//               Delete
//             </button>
//           )}
//         </div>
        
//         <p className="text-gray-600 mb-6">
//           {isEditing ? 'Update your transaction details' : 'Record your income or expense to keep track of your finances'}
//         </p>

//         <form onSubmit={handleSubmit}>
//           {/* Transaction Type */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-3">Transaction Type</label>
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME', category: '' }))}
//                 className={`p-4 rounded-lg border-2 text-left transition-colors ${
//                   formData.type === 'INCOME' 
//                     ? 'border-green-500 bg-green-50' 
//                     : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
//                 }`}
//               >
//                 <div className="font-medium text-gray-900">Income</div>
//                 <div className="text-sm text-gray-600 mt-1">Money received</div>
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE', category: '' }))}
//                 className={`p-4 rounded-lg border-2 text-left transition-colors ${
//                   formData.type === 'EXPENSE' 
//                     ? 'border-red-500 bg-red-50' 
//                     : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
//                 }`}
//               >
//                 <div className="font-medium text-gray-900">Expense</div>
//                 <div className="text-sm text-gray-600 mt-1">Money spent</div>
//               </button>
//             </div>
//           </div>

//           {/* Category */}
//           <div className="mb-4">
//             <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
//               Category
//             </label>
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Select a category</option>
//               {categories[formData.type].map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>

//           {/* Date */}
//           <div className="mb-4">
//             <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
//               Date
//             </label>
//             <input
//               type="date"
//               id="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Amount */}
//           <div className="mb-4">
//             <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
//               Amount (₹)
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
//               <input
//                 type="number"
//                 id="amount"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 placeholder="0"
//                 min="0"
//                 step="0.01"
//                 required
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Notes */}
//           <div className="mb-6">
//             <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
//               Notes (Optional)
//             </label>
//             <textarea
//               id="notes"
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               placeholder="Add any notes..."
//               rows="3"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-700 text-sm flex items-center">
//                 <span className="mr-2">⚠️</span>
//                 {error}
//               </p>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-green-700 text-sm flex items-center">
//                 <span className="mr-2">✅</span>
//                 {success}
//               </p>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-3">
//             {isEditing && (
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 disabled={loading}
//                 className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 transition-colors"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
//                 loading 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : formData.type === 'INCOME' 
//                     ? 'bg-green-600 hover:bg-green-700' 
//                     : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//             >
//               {loading 
//                 ? (isEditing ? 'Updating...' : 'Adding...') 
//                 : (isEditing ? 'Update Transaction' : `Add ${formData.type === 'INCOME' ? 'Income' : 'Expense'}`)
//               }
//             </button>
//           </div>
//         </form>

//         {/* Debug Info (remove in production) */}
//         <div className="mt-6 p-3 bg-gray-100 rounded-lg">
//           <p className="text-xs text-gray-600">Debug Info:</p>
//           <p className="text-xs text-gray-600">Mode: {isEditing ? 'Editing' : 'Adding'}</p>
//           <p className="text-xs text-gray-600">ID: {id || 'New transaction'}</p>
//           <p className="text-xs text-gray-600">Type: {formData.type}</p>
//           <p className="text-xs text-gray-600">Category: {formData.category}</p>
//           <p className="text-xs text-gray-600">Amount: ₹{formData.amount}</p>
//           <p className="text-xs text-gray-600">Date: {formData.date}</p>
//           <p className="text-xs text-gray-600">Notes: {formData.notes}</p>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: 'EXPENSE',  
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const categories = {
    INCOME: ['Salary', 'Freelance', 'Investment', 'Business', 'Other Income'],
    EXPENSE: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other Expense']
  };

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchTransaction();
    }
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/transactions/${id}`);
      const transaction = response.data;
      
      setFormData({
        type: transaction.type || 'EXPENSE',
        category: transaction.category || '',
        amount: transaction.amount || '',
        date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: transaction.notes || ''
      });
    } catch (err) {
      console.error('Error fetching transaction:', err);
      setError('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    if (!formData.date) {
      setError('Please select a date');
      setLoading(false);
      return;
    }

    try {
      // FIXED: Send as number with proper decimal handling
      const transactionData = {
        amount: parseFloat(formData.amount), // Convert to number
        type: formData.type,
        category: formData.category,
        date: formData.date,
        notes: formData.notes || '',
      };

      console.log('Sending transaction data:', transactionData);

      let response;
      if (isEditing) {
        response = await api.put(`/transactions/${id}`, transactionData);
        console.log('Transaction updated successfully:', response.data);
        setSuccess('Transaction updated successfully!');
      } else {
        response = await api.post('/transactions', transactionData);
        console.log('Transaction added successfully:', response.data);
        setSuccess('Transaction added successfully!');
      }
      
      if (!isEditing) {
        setFormData({
          type: 'EXPENSE',
          category: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }
      
      setTimeout(() => {
        navigate('/dashboard', { state: { refresh: true } });
      }, 1500);
      
    } catch (err) {
      console.error('API Error details:', err);
      
      if (err.response) {
        if (err.response.status === 400) {
          setError('Invalid data. Please check your inputs.');
        } else if (err.response.status === 401) {
          setError('Please login again.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response.data?.message || `Error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/transactions/${id}`);
      setSuccess('Transaction deleted successfully!');
      
      setTimeout(() => {
        navigate('/transactions');
      }, 1500);
      
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </h1>
          {isEditing && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          {isEditing ? 'Update your transaction details' : 'Record your income or expense to keep track of your finances'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Transaction Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME', category: '' }))}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  formData.type === 'INCOME' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-gray-900">Income</div>
                <div className="text-sm text-gray-600 mt-1">Money received</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE', category: '' }))}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  formData.type === 'EXPENSE' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-gray-900">Expense</div>
                <div className="text-sm text-gray-600 mt-1">Money spent</div>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories[formData.type].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm flex items-center">
                <span className="mr-2">✅</span>
                {success}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : formData.type === 'INCOME' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading 
                ? (isEditing ? 'Updating...' : 'Adding...') 
                : (isEditing ? 'Update Transaction' : `Add ${formData.type === 'INCOME' ? 'Income' : 'Expense'}`)
              }
            </button>
          </div>
        </form>

        <div className="mt-6 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600">Debug Info:</p>
          <p className="text-xs text-gray-600">Amount being sent: {formData.amount} (as number: {parseFloat(formData.amount)})</p>
        </div>
      </div>
    </div>
  );
}








