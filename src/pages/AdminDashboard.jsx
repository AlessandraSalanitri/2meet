import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css"; // Add styles for the dashboard

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);


  return (
    <div className="admin-dashboard">
      <h1>Welcome to Admin Features</h1>

      {error && <p className="error">{error}</p>}

      <div className="dashboard-cards">
        {/* Card 1: Go to Admin Dashboard */}
        <div className="dashboard-card" onClick={() => navigate("/adminusers")}>
          <h2> Users </h2>
          <p>View All Users, Create New Ones, and manage Credential</p>
        </div>

        {/* Card 2: Go to Events */}
        <div className="dashboard-card" onClick={() => navigate("/adminevents")}>
          <h2> Go to Events</h2>
          <p>View All Events, Create New Ones, Modify or Delete an Event</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
