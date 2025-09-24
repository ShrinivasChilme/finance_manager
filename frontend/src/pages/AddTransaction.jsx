import React, { useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'
];

export default function AddTransaction() {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || !date) {
      setError('Amount and date are required');
      return;
    }
    try {
      await api.post('/transactions', {
        type,
        category,
        amount: parseFloat(amount),
        date,
        notes,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Notes</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add Transaction</button>
        </form>
      </div>
    </div>
  );
}
