"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/Logo.png";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(""); // Track user role
  const navigate = useNavigate();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
  
      if (currentUser) {
        try {
          // Fetch Firestore user document by UID
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Document Data:", userData);
            setUserRole(userData.isAdmin ? "admin" : "regular");
          } else {
            console.warn(`No document found for UID: ${currentUser.uid}`);
            setUserRole("regular"); // Default role
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(""); // Reset role on logout
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to login after logout
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="logo-container">
        <Link to="/"> {/* Link to the homepage */}
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>

      <nav>
        {user ? (
          <div className="user-actions">
            {/* Redirect to the correct dashboard based on role */}
            {userRole === "admin" ? (
              <Link to="/admindashboard">Admin Dashboard</Link>
            ) : (
              <Link to="/userdashboard">My Account</Link>
            )}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;