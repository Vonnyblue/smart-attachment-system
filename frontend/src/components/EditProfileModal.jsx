import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function EditProfileModal({ onClose }) {
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: user.name || "",
    field: user.field || "",
    skills: user.skills || "",
    preferred_location: user.preferred_location || "",
    notification_frequency: user.notification_frequency || "weekly",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.put("/user/update-profile", null, {
        params: { ...form },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, ...form });
      alert("Profile updated successfully!");
      onClose();
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2>Edit Profile</h2>

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Field of Study</label>
        <input
          name="field"
          placeholder="e.g. Computer Science"
          value={form.field}
          onChange={handleChange}
        />

        <label>Skills</label>
        <input
          name="skills"
          placeholder="e.g. Python, React, SQL"
          value={form.skills}
          onChange={handleChange}
        />

        <label>Preferred Location</label>
        <input
          name="preferred_location"
          placeholder="e.g. Nairobi, Remote"
          value={form.preferred_location}
          onChange={handleChange}
        />

        <label>Email Notifications</label>
        <select
          name="notification_frequency"
          value={form.notification_frequency}
          onChange={handleChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="fortnightly">Every 2 Weeks</option>
          <option value="off">Off</option>
        </select>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", top: 0, left: 0,
  width: "100%", height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex", justifyContent: "center", alignItems: "center",
  zIndex: 2000,
};
const modal = {
  background: "#fff", padding: "25px",
  borderRadius: "8px", width: "360px",
  display: "flex", flexDirection: "column", gap: "8px",
  maxHeight: "90vh", overflowY: "auto",   // handles small screens
};

export default EditProfileModal;