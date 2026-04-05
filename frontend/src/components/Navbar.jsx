import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-blue-200 px-8 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl text-blue-600">💰</span>
        <span className="font-bold text-2xl text-blue-700">Money Manager</span>
      </div>
      {token && (
        <div className="flex gap-6 items-center">
          <Link to="/dashboard" className="text-blue-600 font-medium hover:underline">Dashboard</Link>
          <Link to="/add-transaction" className="text-blue-600 font-medium hover:underline">Add Transaction</Link>
          <button onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-red-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-red-600 hover:to-red-500 transition">Logout</button>
        </div>
      )}
    </nav>
  );
}
