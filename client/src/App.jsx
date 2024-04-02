import './App.css'
import Home from "./Pages/Home/home.jsx";
import About from "./Pages/About/aboute.jsx";
import Myaccount from "./Pages/MyAccount/myaccount.jsx";
import Livestreams from "./Pages/Livestream/livestream.jsx";
import { VidverseProvider } from "./Context/VidverseContext.jsx";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './Pages/Register/Register.jsx';
import WatchVideos from './Pages/WatchVideos/WatchVideos.jsx';
import UserPage from './Pages/UserPage/UserPage.jsx';
import ChatRoom from './Pages/ChatRoom/ChatRoom.jsx';
import VideoChat from './Components/VideoChat/VideoChat.jsx';


function App() {


  return (
    <div className='container'>
      <VidverseProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/myAccount" element={<Myaccount />} />
            <Route path="/livestream" element={<Livestreams />} />
            <Route path="/chatroom" element={<ChatRoom />} />
            <Route path="/callroom" element={<VideoChat />} />
            <Route
              path="/watch/:id"
              element={<WatchVideos />}
            />
            <Route
              path="/creator/:id"
              element={<UserPage />}
            />
          </Routes>
        </Router>
      </VidverseProvider>
    </div>
  )
}

export default App
