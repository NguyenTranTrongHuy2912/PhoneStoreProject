import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <div>
        Nội dunng chính nằm ở đây nè!!!
      </div>
      <Footer />
    </>
  )
}

export default App
