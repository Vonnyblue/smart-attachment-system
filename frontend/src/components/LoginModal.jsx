import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";


function LoginModal ({ onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {setUser} = useContext(AuthContext);

    const handleLogin = async () => {
    try {
        const response = await api.post("/auth/login", null, {
        params: { email, password }
        });

        const token = response.data.access_token;
        localStorage.setItem("token", token);

        const userRes = await api.get("/user/me", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setUser(userRes.data);
        onClose();
                
    } catch (error) {
        alert("Invalid credentials");
    }
    };

    return(
        <div style={overlay} onClick={onClose}>
            <div style={modal} onClick={(e) => e.stopPropagation()}>
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}                
                />
                <button onClick={handleLogin}>Login</button>
                <button onClick={onClose}>close</button>                

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

export default LoginModal;