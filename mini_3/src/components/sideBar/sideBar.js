import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sideBar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <ul className="sidebar-menu">
        <li>
          <Link to="/changePassword">Change Password</Link> {/* ✅ Changed from /profile */}
        </li>
        <li>
          <Link to="/fileUploadHistory">File Upload History</Link>
        </li>
        <li>
          <span className="side-logout" onClick={handleLogout}>
            Logout
          </span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
