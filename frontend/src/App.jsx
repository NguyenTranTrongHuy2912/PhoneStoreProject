import { useState } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProductCard from './components/products/ProductCard';

function App() {
  // Tạo dữ liệu giả (Mock Data) khớp với Schema Mongoose của Huy
  const mockProduct = {
    name: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
    brand: "Apple",
    specifications: {
      chip: "A17 Pro",
      screen: "6.7 inch, OLED",
    },
    variants: [
      {
        price: 29990000,
        storage: "256GB",
        color: "Titan"
      }
    ],
    images: ["https://www.google.com/imgres?q=iphone%2017&imgurl=https%3A%2F%2Fcdn2.cellphones.com.vn%2Fx%2Fmedia%2Fcatalog%2Fproduct%2Fi%2Fp%2Fiphone-17-pro-max_3_1_1_1_1_1_1.jpg&imgrefurl=https%3A%2F%2Fcellphones.com.vn%2Fiphone-17-pro-max-ch-cu-da-kich-hoat.html&docid=JUfuFGXkQWPu1M&tbnid=7rmOUtXbyyF_EM&vet=12ahUKEwi488Py2bGUAxXPp1YBHYhHPHAQnPAOegQIGhAB..i&w=1200&h=1200&hcb=2&ved=2ahUKEwi488Py2bGUAxXPp1YBHYhHPHAQnPAOegQIGhAB"],
    ratings: {
      average: 4.9,
      count: 150
    }
  };

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />  

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>

        {/* Khu vực test hiển thị ProductCard */}
        <div className="p-10 flex justify-center bg-gray-50">
          <ProductCard product={mockProduct} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App