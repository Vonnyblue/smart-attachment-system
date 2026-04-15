import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";



function NavBar ({onLogin, onRegister}) {

    const [showProfile, setShowProfile] = useState(false);
    const token = localStorage.getItem("token");
    const {user} = useContext(AuthContext);

    return (
        <>
        <nav style={navStyle}>
            <h2>InternMatch</h2>
    
        {!user ? (
        <>
            <button onClick={onLogin}>Login</button>
            <button onClick={onRegister}>Register</button>
        </>
        ) : (
            <>
                <button onClick={() => setShowProfile(true)}>
                Profile
                </button>

                <button onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
                }}>
                Logout
                </button>
            </>
        )}

        {showProfile && (
           <ProfileModal onClose={() => setShowProfile(false)}/>
           //<div>Profile coming soon</div>
        )}
        </nav>
        </>
    );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 30px",
  background: "#111",
  color: "#fff"
};

export default NavBar;