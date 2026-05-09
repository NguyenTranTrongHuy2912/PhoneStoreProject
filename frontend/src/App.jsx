import { useState } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Thêm các route khác ở đây */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
        </Routes>
      </main>


      <Footer />
    </div>
  )
}

export default App
