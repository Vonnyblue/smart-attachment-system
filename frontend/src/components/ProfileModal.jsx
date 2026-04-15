import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import EditProfileModal from "./EditProfileModal";

function ProfileModal({ onClose }) {
    
  const { user } = useContext(AuthContext);
  const [showEdit, setShowEdit] = useState(false);

  if (!user) return null;

  return (
    <>
      <div style={overlay} onClick={onClose}>
        <div style={modal} onClick={(e) => e.stopPropagation()}>
          <h2>My Profile</h2>

          <p><strong>Name:</strong> {user.name || "—"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Field of Study:</strong> {user.field || "Not set"}</p>
          <p><strong>Skills:</strong> {user.skills || "Not set"}</p>
          <p><strong>Preferred Location:</strong> {user.preferred_location || "Not set"}</p>
          <p><strong>Notifications:</strong> {user.notification_frequency || "Off"}</p>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button onClick={() => setShowEdit(true)}>Edit Profile</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>

      {showEdit && <EditProfileModal onClose={() => setShowEdit(false)} />}
    </>
  );
}

const overlay = {
  position: "fixed", top: 0, left: 0,
  width: "100%", height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex", justifyContent: "center", alignItems: "center",
  zIndex: 1000,
};
const modal = {
  background: "#fff", padding: "30px",
  borderRadius: "8px", width: "370px",
  display: "flex", flexDirection: "column", gap: "10px",
};

export default ProfileModal;