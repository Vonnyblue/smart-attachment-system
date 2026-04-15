import { useState } from "react";
import api from "../services/api";

function RegisterModal({ onClose }) {
    
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [notificationFrequency, setNotificationFrequency] = useState("daily")

  const handleRegister = async () => {
    try {
        await api.post("/auth/register", null, {
            params: {
                name,
                email, 
                password,
                notification_frequency: notificationFrequency
            }
        });
        alert("Registration successful");
        onClose();
    } catch (error){
        console.log("Full error:", error); 
        alert(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2>Register</h2>
        
        {/**Name */}
        <input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}        
        />

        {/**Email */}
        <input 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/**Password */}
        <input 
          type="password"
          placeholder=" Set Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/**Set Notification frequency */}
        <select value={notificationFrequency} onChange={(e) => setNotificationFrequency(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="3days">Every 3 Days</option>
            <option value="weekly">Weekly</option>
        </select>




        <button onClick={handleRegister}>Register</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "#fff",
  padding: "30px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "300px"
};

export default RegisterModal;