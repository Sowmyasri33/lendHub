import React, { useState } from "react";
import "./ChangePassword.css";
import NewNavBar from "../../components/newNavBar/newNavBar";
const ChangePassword = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // ✅ Get token

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send JWT token for backend auth
        },
        body: JSON.stringify({ email: user.email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully.");
      } else {
        setMessage(data.message || "Failed to change password.");
      }
    } catch (err) {
      setMessage("Error occurred.");
    }
  };

  return (
    <>
    <NewNavBar />
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
    </>
  );
};

export default ChangePassword;
