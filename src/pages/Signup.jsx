"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for password toggle
import "../styles/Auth.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save the user in Firestore collection
      const isAdmin = email === "admin@admin.com"; // admin check
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Store UID field in Firestore
        email: user.email,
        isAdmin: isAdmin,
        createdAt: new Date().toISOString(),
      });

      // Step 3: Redirect to the appropriate dashboard
      navigate(isAdmin ? "/admindashboard" : "/userdashboard");
    } catch (err) {
      // Handle Firebase Authentication errors
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use. Please try a different one.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format. Please enter a valid email.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please enter at least 6 characters.");
          break;
        default:
          setError("An error occurred. Please try again.");
          console.error("Signup error:", err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="auth-form">
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
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};

export default Signup;
