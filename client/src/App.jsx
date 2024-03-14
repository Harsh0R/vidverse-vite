import './App.css'
import Home from "./Pages/Home/home.jsx";
import About from "./Pages/About/aboute.jsx";
import Myaccount from "./Pages/MyAccount/myaccount.jsx";
import Livestreams from "./Pages/Livestream/livestream.jsx";
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
