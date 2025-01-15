import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDashboard.css"; // Add styles for the dashboard

const UserDashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);


  return (
    <div className="user-dashboard">
      <h1>Welcome to 2meet</h1>

      {error && <p className="error">{error}</p>}

      <div className="dashboard-cards">
        {/* Card 1: Go to Your Account */}
        <div className="dashboard-card" onClick={() => navigate("/account")}>
          <h2> Your Booking</h2>
          <p>Manage your bookings</p>
        </div>

        {/* Card 2: Go to Events */}
        <div className="dashboard-card" onClick={() => navigate("/events")}>
          <h2> Go to Events</h2>
          <p>Explore and book your favorite events.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
