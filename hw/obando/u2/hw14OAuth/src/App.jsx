import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/customer/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>)

}

export default App
