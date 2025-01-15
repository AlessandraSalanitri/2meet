"use client"; 

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import backgroundImage from "../assets/1back.png";
import { auth } from "../firebase/firebaseConfig"; // Import auth from Firebase
import "../styles/HomePage.css";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check the authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set true if a user is logged in
    });
    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate("/events"); // Redirect to events page if logged in
    } else {
      navigate("/login"); // Redirect to login page if not logged in
    }
  };

  return (
    <div
      className="page-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header />
      <main className="main-content">
        <div className="heading">Discover. Connect. Explore.</div> <br />

        <p className="sub-text">
          Meet like-minded souls, <br />
          explore new places, <br />
          and make <br />
          unforgettable memories.
        </p>

        <p className="description">
          Ready to meet, mingle, and make it <br />
          <span className="special-text">UNFORGETTABLE?</span> <br />
        </p>

        <div className="description">
          <button onClick={handleButtonClick} className="link">
            Let’s get social.
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
