import React, { useState } from "react";
import AdminEventsTable from "../components/AdminEventsTable";
import EventDashboard from "../components/EventDashboard";
import ViewOnMapPage from "../pages/ViewOnMapPage";
import AdminViewBookings from "./AdminViewBookings";
import SubNavBarAdmin from "../components/SubNavBarAdmin";
import "../styles/AdminEvents.css";

const AdminEvents = () => {
  const [view, setView] = useState("table"); // Default to 'table'
  const [isAddEventMode, setIsAddEventMode] = useState(false); // Shared state

  const handleViewChange = (viewType) => setView(viewType);
  const toggleAddEventMode = () => setIsAddEventMode((prev) => !prev);

  // Add the console log here to track the state of isAddEventMode
  console.log("isAddEventMode:", isAddEventMode);

  return (
    <div className="admin-events">
      {/* Sub-navbar for toggling views */}
      <SubNavBarAdmin
        currentView={view}
        onChangeView={handleViewChange}
        isAddEventMode={isAddEventMode}
        toggleAddEventMode={toggleAddEventMode} // Pass shared toggle function
      />

      {/* Render selected view */}
      {view === "table" && <AdminEventsTable />}
      {view === "dashboard" && <EventDashboard />}
      {view === "map" && (
        <ViewOnMapPage
          isAdmin={true}
          isAddEventMode={isAddEventMode}
          toggleAddEventMode={toggleAddEventMode} // Pass toggle to child
        />
      )}
      {view === "events" && <AdminViewBookings />}
    </div>
  );
};

export default AdminEvents;
