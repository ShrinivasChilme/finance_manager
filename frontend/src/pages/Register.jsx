import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) {
      setError('Username, email, and password are required');
      return;
    }
    try {
      await api.post('/auth/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      const backendError = err.response?.data;
      setError(
        typeof backendError === 'string'
          ? backendError
          : backendError?.message || 'Registration failed'
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4">Register</h2>
  <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="mb-2 p-2 w-full border rounded" />
  <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-2 p-2 w-full border rounded" />
  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="mb-2 p-2 w-full border rounded" />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Register</button>
        <div className="mt-2 text-sm">
          <a href="/login" className="text-blue-500">Login</a>
        </div>
      </form>
    </div>
  );
}
