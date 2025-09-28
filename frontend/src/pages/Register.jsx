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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Register</h2>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Username</label>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Email</label>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Password</label>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white p-3 rounded-lg font-bold text-lg shadow hover:from-green-600 hover:to-green-500 transition">Register</button>
        <div className="mt-4 text-center text-sm">
          <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
}












// import React, { useState } from 'react';
// import api from '../api/api';
// import { useNavigate, Link } from 'react-router-dom';

// export default function Register() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     if (!username || !email || !password) {
//       setError('All fields are required');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       await api.post('/auth/register', { username, email, password });
//       navigate('/login');
//     } catch (err) {
//       const backendError = err.response?.data;
//       setError(
//         typeof backendError === 'string'
//           ? backendError
//           : backendError?.message || 'Registration failed. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Register</h2>
//         <div className="mb-6">
//           <label className="block mb-2 font-medium">Username</label>
//           <input 
//             type="text" 
//             placeholder="Username" 
//             value={username} 
//             onChange={e => setUsername(e.target.value)} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" 
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block mb-2 font-medium">Email</label>
//           <input 
//             type="email" 
//             placeholder="Email" 
//             value={email} 
//             onChange={e => setEmail(e.target.value)} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" 
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block mb-2 font-medium">Password</label>
//           <input 
//             type="password" 
//             placeholder="Password" 
//             value={password} 
//             onChange={e => setPassword(e.target.value)} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" 
//           />
//         </div>
//         {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
//         <button 
//           type="submit" 
//           disabled={loading}
//           className="w-full bg-gradient-to-r from-green-500 to-green-400 text-white p-3 rounded-lg font-bold text-lg shadow hover:from-green-600 hover:to-green-500 transition disabled:opacity-50"
//         >
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//         <div className="mt-4 text-center text-sm">
//           <Link to="/login" className="text-blue-500 hover:underline">Already have an account? Login</Link>
//         </div>
//       </form>
//     </div>
//   );
// }