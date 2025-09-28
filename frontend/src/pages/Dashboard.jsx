




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [transactions, setTransactions] = useState([]);
//   const [lastRefresh, setLastRefresh] = useState(new Date());

//   const API_BASE_URL = 'http://localhost:5012';

//   const fetchUserTransactions = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       console.log('Fetching transactions from:', `${API_BASE_URL}/transactions`);
      
//       const response = await fetch(`${API_BASE_URL}/transactions`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('API Response data:', data);
        
//         let transactionsData = [];
        
//         if (Array.isArray(data)) {
//           transactionsData = data;
//         } else if (data.transactions && Array.isArray(data.transactions)) {
//           transactionsData = data.transactions;
//         } else if (data.data && Array.isArray(data.data)) {
//           transactionsData = data.data;
//         }
        
//         console.log('Processed transactions:', transactionsData);
//         setTransactions(transactionsData);
//       } else {
//         console.error('Failed to fetch transactions. Status:', response.status);
//         setTransactions([]);
//       }
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       setTransactions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserTransactions();
//   }, [lastRefresh, navigate]);

//   const refreshData = () => {
//     setLoading(true);
//     setLastRefresh(new Date());
//     console.log('Manual refresh triggered');
//   };

//   useEffect(() => {
//     const handleRouteChange = () => {
//       refreshData();
//     };

//     window.addEventListener('popstate', handleRouteChange);
    
//     return () => {
//       window.removeEventListener('popstate', handleRouteChange);
//     };
//   }, []);

//   const handleDeleteTransaction = async (id) => {
//     const token = localStorage.getItem('token');
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         console.log('Transaction deleted, refreshing data...');
//         refreshData();
//       } else {
//         console.error('Failed to delete transaction');
//       }
//     } catch (error) {
//       console.error('Error deleting transaction:', error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   const handleAddTransaction = () => {
//     navigate('/transactions/add');
//   };

//   const handleEditTransaction = (id) => {
//     navigate(`/transactions/edit/${id}`);
//   };

//   // FIXED: Proper decimal handling for calculations
//   const totalIncome = transactions
//     .filter(t => t.type === 'INCOME')
//     .reduce((sum, t) => {
//       const amount = parseFloat(t.amount) || 0;
//       return Math.round((sum + amount) * 100) / 100;
//     }, 0);
  
//   const totalExpenses = transactions
//     .filter(t => t.type === 'EXPENSE')
//     .reduce((sum, t) => {
//       const amount = parseFloat(t.amount) || 0;
//       return Math.round((sum + amount) * 100) / 100;
//     }, 0);
  
//   const currentBalance = Math.round((totalIncome - totalExpenses) * 100) / 100;

//   const expenseDistribution = transactions
//     .filter(t => t.type === 'EXPENSE')
//     .reduce((acc, t) => {
//       const category = t.category || 'Uncategorized';
//       const amount = parseFloat(t.amount) || 0;
//       acc[category] = Math.round(((acc[category] || 0) + amount) * 100) / 100;
//       return acc;
//     }, {});

//   const expenseCount = transactions.filter(t => t.type === 'EXPENSE').length;
//   const incomeCount = transactions.filter(t => t.type === 'INCOME').length;

//   const totalExpenseAmount = Object.values(expenseDistribution).reduce((sum, amount) => sum + amount, 0);
//   const expenseCategories = Object.entries(expenseDistribution).map(([category, amount]) => ({
//     category,
//     amount,
//     percentage: totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0
//   }));

//   const categoryColors = {
//     'Food': 'bg-red-500',
//     'Transport': 'bg-blue-500',
//     'Entertainment': 'bg-purple-500',
//     'Bills': 'bg-yellow-500',
//     'Shopping': 'bg-pink-500',
//     'Healthcare': 'bg-green-500',
//     'Education': 'bg-indigo-500',
//     'Other Expense': 'bg-gray-500',
//     'Salary': 'bg-green-600',
//     'Freelance': 'bg-teal-500',
//     'Investment': 'bg-amber-500',
//     'Business': 'bg-cyan-500',
//     'Other Income': 'bg-lime-500',
//     'Uncategorized': 'bg-gray-400'
//   };

//   // FIXED: Better currency formatting
//   const formatCurrency = (amount) => {
//     const numAmount = parseFloat(amount) || 0;
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(numAmount);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Money Manager</h1>
//             <p className="text-gray-600">
//               {transactions.length} transactions loaded • Last refresh: {lastRefresh.toLocaleTimeString()}
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={refreshData}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Refresh Data
//             </button>
//             <button 
//               onClick={handleLogout}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-sm text-yellow-800">
//             <strong>Debug Info:</strong> {transactions.length} transactions loaded | 
//             Income: {incomeCount} | Expenses: {expenseCount}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Total Income</h3>
//             <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Total Expenses</h3>
//             <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Current Balance</h3>
//             <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//               {formatCurrency(currentBalance)}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Transactions</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between"><span>Total:</span><span>{transactions.length}</span></div>
//               <div className="flex justify-between text-green-600"><span>Income:</span><span>{incomeCount}</span></div>
//               <div className="flex justify-between text-red-600"><span>Expenses:</span><span>{expenseCount}</span></div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//             <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
//             <button 
//               onClick={handleAddTransaction}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
//             >
//               Add Transaction
//             </button>
//           </div>
          
//           <div className="overflow-x-auto">
//             {transactions.length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No transactions found.</p>
//                 <button 
//                   onClick={handleAddTransaction}
//                   className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//                 >
//                   Add Your First Transaction
//                 </button>
//               </div>
//             ) : (
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {transactions.slice(0, 10).map((transaction) => (
//                     <tr key={transaction.id || transaction._id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {transaction.date ? transaction.date.split('T')[0] : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {transaction.type || 'EXPENSE'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <div className="flex items-center">
//                           <div className={`w-3 h-3 rounded-full mr-2 ${
//                             categoryColors[transaction.category] || 'bg-gray-400'
//                           }`}></div>
//                           {transaction.category || 'Uncategorized'}
//                         </div>
//                       </td>
//                       <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
//                         transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {formatCurrency(transaction.amount)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {transaction.notes || '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex space-x-2">
//                           <button 
//                             onClick={() => handleEditTransaction(transaction.id || transaction._id)}
//                             className="text-blue-600 hover:text-blue-900"
//                           >
//                             Edit
//                           </button>
//                           <button 
//                             onClick={() => handleDeleteTransaction(transaction.id || transaction._id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [downloading, setDownloading] = useState(false);

  const API_BASE_URL = 'http://localhost:5012';

  const fetchUserTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Fetching transactions from:', `${API_BASE_URL}/transactions`);
      
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        
        let transactionsData = [];
        
        if (Array.isArray(data)) {
          transactionsData = data;
        } else if (data.transactions && Array.isArray(data.transactions)) {
          transactionsData = data.transactions;
        } else if (data.data && Array.isArray(data.data)) {
          transactionsData = data.data;
        }
        
        console.log('Processed transactions:', transactionsData);
        setTransactions(transactionsData);
      } else {
        console.error('Failed to fetch transactions. Status:', response.status);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTransactions();
  }, [lastRefresh, navigate]);

  const refreshData = () => {
    setLoading(true);
    setLastRefresh(new Date());
    console.log('Manual refresh triggered');
  };

  useEffect(() => {
    const handleRouteChange = () => {
      refreshData();
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Download functions using backend API
  const downloadCSV = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/transactions/export/csv`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from content-disposition header or use default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'transactions.csv';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch) filename = filenameMatch[1];
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download CSV');
        // Fallback to frontend generation if backend fails
        downloadCSVFrontend();
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      // Fallback to frontend generation
      downloadCSVFrontend();
    } finally {
      setDownloading(false);
    }
  };

  const downloadJSON = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/transactions/export/json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'transactions.json';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch) filename = filenameMatch[1];
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download JSON');
        downloadJSONFrontend();
      }
    } catch (error) {
      console.error('Error downloading JSON:', error);
      downloadJSONFrontend();
    } finally {
      setDownloading(false);
    }
  };

  // Frontend fallback functions
  const downloadCSVFrontend = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        transaction.date ? transaction.date.split('T')[0] : 'N/A',
        transaction.type || 'EXPENSE',
        `"${(transaction.category || 'Uncategorized').replace(/"/g, '""')}"`,
        transaction.amount || 0,
        `"${(transaction.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSONFrontend = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalTransactions: transactions.length,
      transactions: transactions
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    setDownloading(true);
    try {
      const printWindow = window.open('', '_blank');
      const printContent = `
        <html>
          <head>
            <title>Transactions Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
              .summary { margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Money Manager - Transactions Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <div class="summary">
                <p><strong>Total Transactions:</strong> ${transactions.length}</p>
                <p><strong>Total Income:</strong> ${formatCurrency(transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0))}</p>
                <p><strong>Total Expenses:</strong> ${formatCurrency(transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0))}</p>
                <p><strong>Current Balance:</strong> ${formatCurrency(transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) - transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0))}</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${transactions.map(transaction => `
                  <tr>
                    <td>${transaction.date ? transaction.date.split('T')[0] : 'N/A'}</td>
                    <td>${transaction.type || 'EXPENSE'}</td>
                    <td>${transaction.category || 'Uncategorized'}</td>
                    <td>${formatCurrency(transaction.amount)}</td>
                    <td>${transaction.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Transaction deleted, refreshing data...');
        refreshData();
      } else {
        console.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddTransaction = () => {
    navigate('/transactions/add');
  };

  const handleEditTransaction = (id) => {
    navigate(`/transactions/edit/${id}`);
  };

  // FIXED: Proper decimal handling for calculations
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount) || 0;
      return Math.round((sum + amount) * 100) / 100;
    }, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount) || 0;
      return Math.round((sum + amount) * 100) / 100;
    }, 0);
  
  const currentBalance = Math.round((totalIncome - totalExpenses) * 100) / 100;

  const expenseDistribution = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      const category = t.category || 'Uncategorized';
      const amount = parseFloat(t.amount) || 0;
      acc[category] = Math.round(((acc[category] || 0) + amount) * 100) / 100;
      return acc;
    }, {});

  const expenseCount = transactions.filter(t => t.type === 'EXPENSE').length;
  const incomeCount = transactions.filter(t => t.type === 'INCOME').length;

  const totalExpenseAmount = Object.values(expenseDistribution).reduce((sum, amount) => sum + amount, 0);
  const expenseCategories = Object.entries(expenseDistribution).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0
  }));

  const categoryColors = {
    'Food': 'bg-red-500',
    'Transport': 'bg-blue-500',
    'Entertainment': 'bg-purple-500',
    'Bills': 'bg-yellow-500',
    'Shopping': 'bg-pink-500',
    'Healthcare': 'bg-green-500',
    'Education': 'bg-indigo-500',
    'Other Expense': 'bg-gray-500',
    'Salary': 'bg-green-600',
    'Freelance': 'bg-teal-500',
    'Investment': 'bg-amber-500',
    'Business': 'bg-cyan-500',
    'Other Income': 'bg-lime-500',
    'Uncategorized': 'bg-gray-400'
  };

  // FIXED: Better currency formatting
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Money Manager</h1>
            <p className="text-gray-600">
              {transactions.length} transactions loaded • Last refresh: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Download Dropdown */}
            <div className="relative group">
              <button 
                disabled={transactions.length === 0 || downloading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </>
                )}
              </button>
              
              {/* Download Options Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button 
                    onClick={downloadCSV}
                    disabled={transactions.length === 0}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download as CSV
                  </button>
                  
                  <button 
                    onClick={downloadJSON}
                    disabled={transactions.length === 0}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download as JSON
                  </button>
                  
                  <button 
                    onClick={downloadPDF}
                    disabled={transactions.length === 0}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-white flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Print as PDF
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={refreshData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
            
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Debug Info:</strong> {transactions.length} transactions loaded | 
            Income: {incomeCount} | Expenses: {expenseCount}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Income</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current Balance</h3>
            <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(currentBalance)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Transactions</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Total:</span><span>{transactions.length}</span></div>
              <div className="flex justify-between text-green-600"><span>Income:</span><span>{incomeCount}</span></div>
              <div className="flex justify-between text-red-600"><span>Expenses:</span><span>{expenseCount}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
            <button 
              onClick={handleAddTransaction}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              Add Transaction
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found.</p>
                <button 
                  onClick={handleAddTransaction}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Add Your First Transaction
                </button>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id || transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date ? transaction.date.split('T')[0] : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type || 'EXPENSE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            categoryColors[transaction.category] || 'bg-gray-400'
                          }`}></div>
                          {transaction.category || 'Uncategorized'}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.notes || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditTransaction(transaction.id || transaction._id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTransaction(transaction.id || transaction._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;