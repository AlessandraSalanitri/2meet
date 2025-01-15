"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear existing errors before attempting login
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch custom claims from the user's ID token
      const idTokenResult = await user.getIdTokenResult();
      const isAdmin = idTokenResult.claims.isAdmin;

      // Redirect based on user role
      if (isAdmin) {
        navigate("/admindashboard");
      } else {
        navigate("/userdashboard");
      }
    } catch (err) {
      // Handle Firebase errors
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email. Please sign up first.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format. Please check your email.");
          break;
        case "auth/too-many-requests":
          setError(
            "Too many failed login attempts. Please try again later or reset your password."
          );
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
          console.error("Login error:", err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError(null); // Clear existing errors before attempting login
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/userdashboard");
    } catch (err) {
      // Handle errors during Google login
      setError("Failed to log in with Google. Please try again.");
      console.error("Google login error:", err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="button">
          Login
        </button>
      </form>

      {/* Google Login Button */}
      <button onClick={handleGoogleLogin} className="button google-login">
        Login with Google
      </button>

      <p>
        Don't have an account? <a href="/signup">Sign up</a>
        <br />
        <br />
        For security reasons, only one Admin can register another Admin.
        <br />
        If you'd like to test Admin functionalities, use the following credentials:
        <br />
        <b>Email:</b> admin@admin.com <b>Password:</b> Admin123
        <br />
        Otherwise, sign up as a new user (default: regular user).
      </p>
    </div>
  );
};

export default Login;
