import React, { useState } from 'react'
import api from '../api/api.js'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  
  try {
    console.log('Sending login request...')
    const response = await api.post('/auth/login', { username, password })
    
    console.log('Login successful:', response.data)
    
    // Store the token properly
    localStorage.setItem('token', response.data.token)
    
    // Navigate to dashboard
    navigate('/dashboard')
  } catch (err) {
    console.error('Login error:', err)
    setError(err.response?.data?.error || 'Login failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Login</h2>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Username</label>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            autoComplete="username"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            autoComplete="current-password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
          />
        </div>
        
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white p-3 rounded-lg font-bold text-lg shadow hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="mt-4 text-center text-sm">
          <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </div>
      </form>
    </div>
  )
}











// import React, { useState } from 'react';
// import api from '../api/api';
// import { useNavigate, Link } from 'react-router-dom';

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     if (!username || !password) {
//       setError('Username and password are required');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       const res = await api.post('/auth/login', { username, password });
      
//       if (res.data.token) {
//         localStorage.setItem('token', res.data.token);
//         navigate('/dashboard');
//       } else {
//         setError('No token received from server');
//       }
      
//     } catch (err) {
//       console.error('Login error:', err);
//       setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Login</h2>
//         <div className="mb-6">
//           <label className="block mb-2 font-medium">Username</label>
//           <input 
//             type="text" 
//             placeholder="Username" 
//             value={username} 
//             onChange={e => setUsername(e.target.value)} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block mb-2 font-medium">Password</label>
//           <input 
//             type="password" 
//             placeholder="Password" 
//             value={password} 
//             onChange={e => setPassword(e.target.value)} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
//           />
//         </div>
//         {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
//         <button 
//           type="submit" 
//           disabled={loading}
//           className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white p-3 rounded-lg font-bold text-lg shadow hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-50"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//         <div className="mt-4 text-center text-sm">
//           <Link to="/register" className="text-blue-500 hover:underline">Don't have an account? Register</Link>
//         </div>
//       </form>
//     </div>
//   );
// }