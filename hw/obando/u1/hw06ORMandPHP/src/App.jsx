import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Formulario from './pages/Formulario'
import TableUser from './pages/TableUser'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Formulario />} />
          <Route path="/table" element={<TableUser />} />
        </Routes>
      </BrowserRouter>






    </>
  )
}

export default App
