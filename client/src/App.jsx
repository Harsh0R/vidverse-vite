import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./Pages/home";
import About from "./Pages/aboute";
import Myaccount from "./Pages/myaccount";
import Livestreams from "./Pages/livestream";
import { VidverseProvider } from "./Context/VidverseContext.jsx";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {


  return (
    <div className='container'>
      <VidverseProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/myAccount" element={<Myaccount />} />
            <Route path="/livestream" element={<Livestreams />} />
          </Routes>
        </Router>
      </VidverseProvider>
    </div>
  )
}

export default App
