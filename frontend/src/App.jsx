// import React from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom' // ← Remove BrowserRouter import
// import Login from './pages/Login.jsx'
// import Register from './pages/Register.jsx'
// import Dashboard from './pages/Dashboard.jsx'
// import AddTransaction from './pages/AddTransaction.jsx'

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem('token')
//   return token ? children : <Navigate to="/login" />
// }

// function App() {
//   return (
//     <div className="App">
//       {/* Remove <Router> wrapper - it's already in main.jsx */}
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route 
//           path="/dashboard" 
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/transactions/add" 
//           element={
//             <PrivateRoute>
//               <AddTransaction />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/transactions/edit/:id" 
//           element={
//             <PrivateRoute>
//               <AddTransaction />
//             </PrivateRoute>
//           } 
//         />
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </div>
//   )
// }

// export default App;




import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddTransaction from './pages/AddTransaction.jsx'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard key={location.key} /> {/* Add key to force re-render */}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/transactions/add" 
          element={
            <PrivateRoute>
              <AddTransaction />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/transactions/edit/:id" 
          element={
            <PrivateRoute>
              <AddTransaction />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App;