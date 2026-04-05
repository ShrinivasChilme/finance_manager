import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'Add Transaction', path: '/add-transaction', icon: '➕' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="bg-gradient-to-b from-blue-700 to-blue-500 text-white w-64 min-h-screen flex flex-col shadow-lg">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-blue-400">
        <span className="text-3xl">💰</span>
        <span className="font-bold text-2xl">Money Manager</span>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 text-lg hover:bg-blue-600 transition rounded-r-full mb-2 ${location.pathname === item.path ? 'bg-blue-600 font-semibold' : ''}`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-blue-400 flex items-center gap-3">
        <span className="bg-white text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">U</span>
        <span className="font-medium">User</span>
      </div>
    </aside>
  );
}
