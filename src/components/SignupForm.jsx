"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import "../styles/Auth.css";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null); // Clear any existing errors

    try {
      // Step 1: Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Save the user in Firestore with the UID as the document ID
      const isAdmin = email === "admin@admin.com"; // Example for admin check
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Store the UID explicitly as a field in Firestore
        email: user.email,
        isAdmin: isAdmin,
        createdAt: new Date().toISOString(),
      });

      // Step 3: Navigate to the appropriate dashboard
      navigate(isAdmin ? "/admindashboard" : "/userdashboard");
    } catch (err) {
      // Handle specific Firebase Auth errors
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
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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

export default SignupForm;
