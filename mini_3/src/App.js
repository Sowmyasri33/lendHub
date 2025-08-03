import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from './pages/Register/Register';
import ShareKnowledge from "./pages/shareKnowledge/ShareKnowledge";
import UserProfile from './pages/UserProfile';
import VideoUpload from "./pages/videoUpload/videoUpload";
import UploadHistory from "./pages/uploadHistory/uploadHistory";
import Sidebar from "./components/sideBar/sideBar";
import LogOut from "./components/logOut/logOut";
import Navbar from "./components/navBar/Navbar";
import FileUpload from "./pages/fileUpload/fileUpload";
import FileUploadHistory from "./pages/fileUploadHistory/fileUploadHistory";
import ChangePassword from './pages/ChangePassword/ChangePassword';

// ✅ Protected route wrapper
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

// ✅ Redirect based on login status
const RedirectToDefault = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Redirect root to login or home */}
        <Route path="/" element={<RedirectToDefault />} />

        {/* ✅ Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected routes */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/shareKnowledge" element={<ProtectedRoute element={<ShareKnowledge />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="/videoUpload" element={<ProtectedRoute element={<VideoUpload />} />} />
        <Route path="/fileUpload" element={<ProtectedRoute element={<FileUpload />} />} />
        <Route path="/uploadHistory" element={<ProtectedRoute element={<UploadHistory />} />} />
        <Route path="/fileUploadHistory" element={<ProtectedRoute element={<FileUploadHistory />} />} />
        <Route path="/changePassword" element={<ProtectedRoute element={<ChangePassword />} />} />

        {/* Optional standalone components */}
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/logOut" element={<LogOut />} />
        <Route path="/navbar" element={<Navbar />} />
      </Routes>
    </Router>
  );
}

export default App;
