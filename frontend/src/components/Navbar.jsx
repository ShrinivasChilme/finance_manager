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
    <nav className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
      <div className="font-bold text-xl">Money Manager</div>
      {token && (
        <div className="flex gap-4 items-center">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/add-transaction" className="hover:underline">Add Transaction</Link>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      )}
    </nav>
  );
}
