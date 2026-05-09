import { useState } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />  

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Thêm các route khác ở đây */}

        </Routes>
      </main>


      <Footer />
    </div>
  )
}

export default App
