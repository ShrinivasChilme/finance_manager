import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import TransactionTable from '../components/TransactionTable';
import ExpensesPieChart from '../components/PieChart';

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    api.get('/dashboard/summary').then(res => {
      setSummary(res.data);
      if (res.data.expensesByCategory) {
        setPieData(
          Object.entries(res.data.expensesByCategory).map(([category, value]) => ({ category, value }))
        );
      }
    });
    api.get('/transactions').then(res => {
      setTransactions(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg">Total Income</div>
            <div className="text-2xl font-bold text-green-600">₹{summary.income}</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg">Total Expense</div>
            <div className="text-2xl font-bold text-red-600">₹{summary.expense}</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg">Balance</div>
            <div className="text-2xl font-bold">₹{summary.balance}</div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Expenses by Category</h2>
          <ExpensesPieChart data={pieData} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
          <TransactionTable transactions={transactions.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
}
