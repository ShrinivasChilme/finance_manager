import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [downloading, setDownloading] = useState(false);
  const [downloadingMonthly, setDownloadingMonthly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(true);
  const [currency, setCurrency] = useState("INR"); // Default to INR
  const API_BASE_URL = 'http://localhost:5012';

  // Currency conversion rates
  const currencyRates = {
    USD: 0.012, // 1 INR = 0.012 USD
    INR: 1,     // 1 INR = 1 INR
    EUR: 0.011, // 1 INR = 0.011 EUR
    GBP: 0.0095 // 1 INR = 0.0095 GBP
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

  // Currency conversion function
  const convertCurrency = (amount, targetCurrency = currency) => {
    const numAmount = parseFloat(amount) || 0;
    const rate = currencyRates[targetCurrency] || 1;
    return Math.round(numAmount * rate * 100) / 100;
  };

  // Enhanced currency formatting with conversion
  const formatCurrency = (amount, targetCurrency = currency) => {
    const convertedAmount = convertCurrency(amount, targetCurrency);
    
    const formatOptions = {
      style: 'currency',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    switch (targetCurrency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          ...formatOptions,
          currency: 'USD'
        }).format(convertedAmount);
      case 'EUR':
        return new Intl.NumberFormat('de-DE', {
          ...formatOptions,
          currency: 'EUR'
        }).format(convertedAmount);
      case 'GBP':
        return new Intl.NumberFormat('en-GB', {
          ...formatOptions,
          currency: 'GBP'
        }).format(convertedAmount);
      case 'INR':
      default:
        return new Intl.NumberFormat('en-IN', {
          ...formatOptions,
          currency: 'INR'
        }).format(convertedAmount);
    }
  };

  // Download functions with currency conversion
  const downloadCSV = async (useINR = false) => {
    setDownloading(true);
    setShowDownloadMenu(false);
    try {
      const token = localStorage.getItem('token');
      const endpoint = useINR 
        ? `${API_BASE_URL}/transactions/export/csv/inr`
        : `${API_BASE_URL}/transactions/export/csv`;
      
      const response = await fetch(endpoint, {
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
        let filename = useINR ? 'transactions_inr.csv' : 'transactions.csv';
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
        downloadCSVFrontend(useINR);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      downloadCSVFrontend(useINR);
    } finally {
      setDownloading(false);
    }
  };

  const downloadJSON = async (useINR = false) => {
    setDownloading(true);
    setShowDownloadMenu(false);
    try {
      const token = localStorage.getItem('token');
      const endpoint = useINR 
        ? `${API_BASE_URL}/transactions/export/json/inr`
        : `${API_BASE_URL}/transactions/export/json`;
      
      const response = await fetch(endpoint, {
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
        let filename = useINR ? 'transactions_inr.json' : 'transactions.json';
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
        downloadJSONFrontend(useINR);
      }
    } catch (error) {
      console.error('Error downloading JSON:', error);
      downloadJSONFrontend(useINR);
    } finally {
      setDownloading(false);
    }
  };

  // Updated download functions to force INR for monthly downloads
  const downloadMonthlyCSV = async () => {
    setDownloadingMonthly(true);
    setShowDownloadMenu(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/transactions/export/csv/inr`, {
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
        let filename = 'monthly_transactions_inr.csv';
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
        console.error('Failed to download monthly CSV');
        downloadMonthlyCSVFrontend();
      }
    } catch (error) {
      console.error('Error downloading monthly CSV:', error);
      downloadMonthlyCSVFrontend();
    } finally {
      setDownloadingMonthly(false);
    }
  };

  const downloadMonthlyJSON = async () => {
    setDownloadingMonthly(true);
    setShowDownloadMenu(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/transactions/export/json/inr`, {
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
        let filename = 'monthly_transactions_inr.json';
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
        console.error('Failed to download monthly JSON');
        downloadMonthlyJSONFrontend();
      }
    } catch (error) {
      console.error('Error downloading monthly JSON:', error);
      downloadMonthlyJSONFrontend();
    } finally {
      setDownloadingMonthly(false);
    }
  };

  const downloadAllCSV = async () => {
    await downloadCSV(false); // Use selected currency for all transactions
  };

  const downloadAllJSON = async () => {
    await downloadJSON(false); // Use selected currency
  };

  // Frontend fallback functions with currency conversion
  const downloadCSVFrontend = (useINR = false) => {
    const targetCurrency = useINR ? 'INR' : currency;
    const headers = ['Date', 'Type', 'Category', `Amount (${targetCurrency})`, 'Notes'];
    
    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        transaction.date ? transaction.date.split('T')[0] : 'N/A',
        transaction.type || 'EXPENSE',
        `"${(transaction.category || 'Uncategorized').replace(/"/g, '""')}"`,
        convertCurrency(transaction.amount, targetCurrency),
        `"${(transaction.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const currencySuffix = useINR ? '_inr' : `_${currency.toLowerCase()}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions${currencySuffix}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSONFrontend = (useINR = false) => {
    const targetCurrency = useINR ? 'INR' : currency;
    const data = {
      exportedAt: new Date().toISOString(),
      totalTransactions: transactions.length,
      currency: targetCurrency,
      exchangeRate: currencyRates[targetCurrency],
      transactions: transactions.map(transaction => ({
        ...transaction,
        amount: convertCurrency(transaction.amount, targetCurrency)
      }))
    };
    
    const currencySuffix = useINR ? '_inr' : `_${currency.toLowerCase()}`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions${currencySuffix}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Frontend fallback functions for monthly download (always in INR)
  const downloadMonthlyCSVFrontend = () => {
    const currentMonth = new Date();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= firstDay && transactionDate <= lastDay;
    });

    const headers = ['Date', 'Type', 'Category', 'Amount (₹)', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...monthlyTransactions.map(transaction => [
        transaction.date ? transaction.date.split('T')[0] : 'N/A',
        transaction.type || 'EXPENSE',
        `"${(transaction.category || 'Uncategorized').replace(/"/g, '""')}"`,
        convertCurrency(transaction.amount, 'INR'), // Always INR for monthly
        `"${(transaction.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const monthName = currentMonth.toLocaleString('default', { month: 'long' }).toLowerCase();
    const year = currentMonth.getFullYear();
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${monthName}_${year}_inr.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadMonthlyJSONFrontend = () => {
    const currentMonth = new Date();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= firstDay && transactionDate <= lastDay;
    });

    const monthName = currentMonth.toLocaleString('default', { month: 'long' }).toLowerCase();
    const year = currentMonth.getFullYear();
    
    const data = {
      exportedAt: new Date().toISOString(),
      period: `${monthName} ${year}`,
      currency: "INR", // Always INR for monthly
      totalTransactions: monthlyTransactions.length,
      transactions: monthlyTransactions.map(transaction => ({
        ...transaction,
        amount: convertCurrency(transaction.amount, 'INR') // Always INR for monthly
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${monthName}_${year}_inr.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadMonthlyPDF = async () => {
    setDownloadingMonthly(true);
    setShowDownloadMenu(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/transactions/export/pdf/monthly`, {
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
        let filename = 'monthly_transactions_inr.pdf';
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
        console.error('Failed to download monthly PDF');
        downloadMonthlyPDFFrontend();
      }
    } catch (error) {
      console.error('Error downloading monthly PDF:', error);
      downloadMonthlyPDFFrontend();
    } finally {
      setDownloadingMonthly(false);
    }
  };

  const downloadMonthlyPDFFrontend = () => {
    const currentMonth = new Date();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= firstDay && transactionDate <= lastDay;
    });

    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();
    
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Monthly Transactions Report - ${monthName} ${year}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
            .period { font-size: 16px; font-weight: bold; color: #333; }
            .currency { font-family: Arial; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Money Manager - Monthly Transactions Report</h1>
            <p class="period">${monthName} ${year}</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <p><strong>Total Transactions:</strong> ${monthlyTransactions.length}</p>
            <p><strong>Total Income:</strong> <span class="currency">${formatCurrency(monthlyTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0), 'INR')}</span></p>
            <p><strong>Total Expenses:</strong> <span class="currency">${formatCurrency(monthlyTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0), 'INR')}</span></p>
            <p><strong>Net Balance:</strong> <span class="currency">${formatCurrency(monthlyTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) - monthlyTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0), 'INR')}</span></p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount (₹)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyTransactions.map(transaction => `
                <tr>
                  <td>${transaction.date ? transaction.date.split('T')[0] : 'N/A'}</td>
                  <td>${transaction.type || 'EXPENSE'}</td>
                  <td>${transaction.category || 'Uncategorized'}</td>
                  <td class="currency">${formatCurrency(transaction.amount, 'INR')}</td>
                  <td>${transaction.notes || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Report generated by Money Manager - All amounts in Indian Rupees (₹)</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const downloadPDF = () => {
    setDownloading(true);
    setShowDownloadMenu(false);
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
              .currency { font-family: Arial; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Money Manager - Transactions Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <div class="summary">
                <p><strong>Total Transactions:</strong> ${transactions.length}</p>
                <p><strong>Total Income:</strong> <span class="currency">${formatCurrency(transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0))}</span></p>
                <p><strong>Total Expenses:</strong> <span class="currency">${formatCurrency(transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0))}</span></p>
                <p><strong>Current Balance:</strong> <span class="currency">${formatCurrency(transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) - transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0))}</span></p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount (${currency})</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${transactions.map(transaction => `
                  <tr>
                    <td>${transaction.date ? transaction.date.split('T')[0] : 'N/A'}</td>
                    <td>${transaction.type || 'EXPENSE'}</td>
                    <td>${transaction.category || 'Uncategorized'}</td>
                    <td class="currency">${formatCurrency(transaction.amount)}</td>
                    <td>${transaction.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
              <p>All amounts in ${currency}</p>
            </div>
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

  // Get last 6 months data for chart
  const getLastSixMonthsData = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      months.push({ 
        name: `${monthName} ${year}`,
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    
    return months.map(month => {
      const monthIncome = transactions
        .filter(t => t.type === 'INCOME' && 
          new Date(t.date).getMonth() === month.month && 
          new Date(t.date).getFullYear() === month.year)
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        
      const monthExpense = transactions
        .filter(t => t.type === 'EXPENSE' && 
          new Date(t.date).getMonth() === month.month && 
          new Date(t.date).getFullYear() === month.year)
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        
      return {
        ...month,
        income: Math.round(monthIncome * 100) / 100,
        expense: Math.round(monthExpense * 100) / 100
      };
    });
  };

  const monthlyData = getLastSixMonthsData();
  const maxAmount = Math.max(...monthlyData.map(m => Math.max(m.income, m.expense)), 1);

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
    'Food': 'bg-rose-500',
    'Transport': 'bg-sky-500',
    'Entertainment': 'bg-violet-500',
    'Bills': 'bg-amber-500',
    'Shopping': 'bg-fuchsia-500',
    'Healthcare': 'bg-emerald-500',
    'Education': 'bg-indigo-500',
    'Other Expense': 'bg-slate-500',
    'Salary': 'bg-teal-600',
    'Freelance': 'bg-cyan-500',
    'Investment': 'bg-amber-500',
    'Business': 'bg-blue-500',
    'Other Income': 'bg-lime-500',
    'Uncategorized': 'bg-gray-400'
  };

  // Currency Selector Component
  const CurrencySelector = () => (
    <div className="relative">
      <select 
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
      >
        <option value="INR">₹ INR</option>
        <option value="USD">$ USD</option>
        <option value="EUR">€ EUR</option>
        <option value="GBP">£ GBP</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-700 text-lg font-medium">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header with Currency Selector */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                💰 Money Manager
              </h1>
              <p className="text-sm text-slate-600 mt-1 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                {transactions.length} transactions • Last refresh: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            
            {/* Action Buttons with Currency Selector */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center">
              {/* Currency Selector */}
              <CurrencySelector />
              
              {/* Download Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  disabled={transactions.length === 0 || downloading || downloadingMonthly}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-medium transition-all duration-200 disabled:from-blue-400 disabled:to-indigo-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
                >
                  {(downloading || downloadingMonthly) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download</span>
                    </>
                  )}
                </button>
                
                {/* Download Menu */}
                {showDownloadMenu && (
                  <>
                    <div 
                      className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
                      onClick={() => setShowDownloadMenu(false)}
                    ></div>
                    
                    <div className="fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-auto sm:right-0 sm:mt-2 w-full sm:w-80 bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 z-50 sm:z-10 transform transition-all duration-200">
                      <div className="p-4">
                        {/* Mobile Header */}
                        <div className="flex justify-between items-center mb-4 sm:hidden">
                          <h3 className="text-lg font-bold text-slate-900">Download Options</h3>
                          <button 
                            onClick={() => setShowDownloadMenu(false)}
                            className="text-slate-500 hover:text-slate-700 p-1"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Currency Options */}
                        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs font-semibold text-slate-600 mb-2">Download Currency</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                downloadAllCSV();
                                setShowDownloadMenu(false);
                              }}
                              disabled={transactions.length === 0}
                              className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Current ({currency})
                            </button>
                            <button
                              onClick={() => {
                                downloadMonthlyCSV();
                                setShowDownloadMenu(false);
                              }}
                              disabled={transactions.length === 0}
                              className="bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Always ₹ INR
                            </button>
                          </div>
                        </div>
                        
                        {/* All Transactions Section */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">All Transactions</p>
                          
                          <button 
                            onClick={() => {
                              downloadAllCSV();
                              setShowDownloadMenu(false);
                            }}
                            disabled={transactions.length === 0}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 disabled:text-slate-400 disabled:hover:bg-white flex items-center rounded-xl transition-colors mb-2"
                          >
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Download as CSV</div>
                              <div className="text-xs text-slate-500">In {currency} format</div>
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => {
                              downloadAllJSON();
                              setShowDownloadMenu(false);
                            }}
                            disabled={transactions.length === 0}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 disabled:text-slate-400 disabled:hover:bg-white flex items-center rounded-xl transition-colors mb-2"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Download as JSON</div>
                              <div className="text-xs text-slate-500">In {currency} format</div>
                            </div>
                          </button>
                          
                          <button 
                            onClick={downloadPDF}
                            disabled={transactions.length === 0}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 disabled:text-slate-400 disabled:hover:bg-white flex items-center rounded-xl transition-colors"
                          >
                            <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Print as PDF</div>
                              <div className="text-xs text-slate-500">In {currency} format</div>
                            </div>
                          </button>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-slate-200 my-4"></div>

                        {/* Monthly Download Section */}
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Monthly Export (₹ INR)</p>
                          
                          <button 
                            onClick={() => {
                              downloadMonthlyCSV();
                              setShowDownloadMenu(false);
                            }}
                            disabled={transactions.length === 0}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 disabled:text-slate-400 disabled:hover:bg-white flex items-center rounded-xl transition-colors mb-2"
                          >
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Monthly CSV</div>
                              <div className="text-xs text-slate-500">Always in Indian Rupees (₹)</div>
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => {
                              downloadMonthlyJSON();
                              setShowDownloadMenu(false);
                            }}
                            disabled={transactions.length === 0}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 disabled:text-slate-400 disabled:hover:bg-white flex items-center rounded-xl transition-colors mb-2"
                          >
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Monthly JSON</div>
                              <div className="text-xs text-slate-500">Always in Indian Rupees (₹)</div>
                            </div>
                          </button>
                          
                          <button 
                            onClick={downloadMonthlyPDF}
                            disabled={transactions.length === 0}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 disabled:text-slate-400 disabled:hover:bg-white flex items-center rounded-xl transition-colors"
                          >
                            <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Monthly PDF</div>
                              <div className="text-xs text-slate-500">Always in Indian Rupees (₹)</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={refreshData}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex-1 sm:flex-none justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex-1 sm:flex-none justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Stats Grid - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Income Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Income</h3>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-emerald-600 break-words">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-xs text-slate-500 mt-2">{incomeCount} income transactions</p>
          </div>
          
          {/* Total Expenses Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-rose-500 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Expenses</h3>
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-rose-600 break-words">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-slate-500 mt-2">{expenseCount} expense transactions</p>
          </div>
          
          {/* Current Balance Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Current Balance</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className={`text-2xl lg:text-3xl font-bold break-words ${
              currentBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {formatCurrency(currentBalance)}
            </p>
            <p className="text-xs text-slate-500 mt-2">Net financial position</p>
          </div>
          
          {/* Transactions Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-violet-500 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Transactions</h3>
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total:</span>
                <span className="font-bold text-lg text-slate-900">{transactions.length}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600">
                <span>Income:</span>
                <span className="font-bold text-lg">{incomeCount}</span>
              </div>
              <div className="flex justify-between items-center text-rose-600">
                <span>Expenses:</span>
                <span className="font-bold text-lg">{expenseCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Income & Expense Chart Section - Compact Version */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Income vs Expenses</h3>
              <p className="text-xs text-slate-600 mt-1">Last 6 months overview</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                <span className="text-xs text-slate-600">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full mr-1"></div>
                <span className="text-xs text-slate-600">Expenses</span>
              </div>
            </div>
          </div>
          
          {/* Chart Container - Smaller */}
          <div className="h-40">
            {monthlyData.length > 0 ? (
              <div className="flex items-end justify-between h-full space-x-1 lg:space-x-2">
                {monthlyData.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                    {/* Bars */}
                    <div className="flex items-end justify-center space-x-1 w-full h-32">
                      {/* Income Bar */}
                      <div 
                        className="w-1/2 bg-emerald-500 rounded-t transition-all duration-500 hover:bg-emerald-600 relative group"
                        style={{ height: `${(month.income / maxAmount) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Income: {formatCurrency(month.income)}
                        </div>
                      </div>
                      
                      {/* Expense Bar */}
                      <div 
                        className="w-1/2 bg-rose-500 rounded-t transition-all duration-500 hover:bg-rose-600 relative group"
                        style={{ height: `${(month.expense / maxAmount) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Expense: {formatCurrency(month.expense)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Month Label */}
                    <div className="text-xs text-slate-500 font-medium text-center h-6 flex items-center justify-center">
                      {month.name.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-1 text-sm">No data available</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Summary Stats - Compact */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <p className="text-xs text-slate-600">Total Income</p>
              <p className="text-sm font-bold text-emerald-600">
                {formatCurrency(monthlyData.reduce((sum, month) => sum + month.income, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-600">Total Expenses</p>
              <p className="text-sm font-bold text-rose-600">
                {formatCurrency(monthlyData.reduce((sum, month) => sum + month.expense, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-600">Net Balance</p>
              <p className={`text-sm font-bold ${
                monthlyData.reduce((sum, month) => sum + month.income - month.expense, 0) >= 0 
                  ? 'text-emerald-600' 
                  : 'text-rose-600'
              }`}>
                {formatCurrency(monthlyData.reduce((sum, month) => sum + month.income - month.expense, 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions Table Section - Enhanced Design */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Recent Transactions</h3>
              <p className="text-sm text-slate-600 mt-1">Your latest financial activities</p>
            </div>
            <button 
              onClick={handleAddTransaction}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Transaction
            </button>
          </div>
          
          {/* Transactions Table - Responsive */}
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions yet</h3>
                <p className="text-slate-500 mb-6">Start tracking your income and expenses</p>
                <button 
                  onClick={handleAddTransaction}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Add Your First Transaction
                </button>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="sm:hidden p-4 space-y-4">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id || transaction._id} className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-4 border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 ${
                            categoryColors[transaction.category] || 'bg-slate-400'
                          }`}></div>
                          <span className="text-sm font-semibold text-slate-900">
                            {transaction.category || 'Uncategorized'}
                          </span>
                        </div>
                        <span className={`text-base font-bold ${
                          transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-500 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {transaction.date ? transaction.date.split('T')[0] : 'N/A'} • 
                        <span className={`ml-1 font-medium ${
                          transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {transaction.type || 'EXPENSE'}
                        </span>
                      </div>
                      
                      {transaction.notes && (
                        <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">{transaction.notes}</p>
                      )}
                      
                      <div className="flex justify-between pt-3 border-t border-slate-200">
                        <button 
                          onClick={() => handleEditTransaction(transaction.id || transaction._id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(transaction.id || transaction._id)}
                          className="text-rose-600 hover:text-rose-800 text-sm font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="hidden sm:table min-w-full divide-y divide-slate-200">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {transactions.slice(0, 10).map((transaction) => (
                      <tr key={transaction.id || transaction._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {transaction.date ? transaction.date.split('T')[0] : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.type === 'INCOME' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {transaction.type || 'EXPENSE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${
                              categoryColors[transaction.category] || 'bg-slate-400'
                            }`}></div>
                            {transaction.category || 'Uncategorized'}
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                          transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                          {transaction.notes ? (
                            <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                              {transaction.notes}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => handleEditTransaction(transaction.id || transaction._id)}
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteTransaction(transaction.id || transaction._id)}
                              className="text-rose-600 hover:text-rose-800 font-medium flex items-center transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;