import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const [frequency, setFrequency] = useState(user?.notification_frequency);

  const updateFrequency = async () => {
    const token = localStorage.getItem("token");

    await api.put("/user/update-notification", null, {
      params: { frequency },
      headers: { Authorization: `Bearer ${token}` }
    });

    setUser({ ...user, notification_frequency: frequency });
    alert("Updated!");
  };

  return (
    <div>
      <h2>Settings</h2>

      <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="3days">Every 3 Days</option>
        <option value="weekly">Weekly</option>
      </select>

      <button onClick={updateFrequency}>Save</button>
    </div>
  );
}

export default Settings;