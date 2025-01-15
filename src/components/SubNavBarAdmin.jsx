import React from "react";
import "../styles/SubNavBarAdmin.css";

const SubNavBarAdmin = ({ currentView, onChangeView, isAddEventMode, toggleAddEventMode }) => {
  return (
    <div className="subnav-admin">
      <button
        className={currentView === "table" ? "active" : ""}
        onClick={() => onChangeView("table")}
      >
        View Events Table
      </button>
      <button
        className={currentView === "dashboard" ? "active" : ""}
        onClick={() => onChangeView("dashboard")}
      >
        View as User
      </button>
      <button
        className={currentView === "map" ? "active" : ""}
        onClick={() => onChangeView("map")}
      >
        View on Map
      </button>
      {/* {currentView === "map" && (
        <button
          className={isAddEventMode ? "active" : ""}
          onClick={toggleAddEventMode} // Now this will toggle the state in the parent
        >
          {isAddEventMode ? "Disable Add Event On Map" : "Add Event On Map"}
        </button>
      )} */}
      <button
        className={currentView === "events" ? "active" : ""}
        onClick={() => onChangeView("events")}
      >
        View Events Booking
      </button>
    </div>
  );
};

export default SubNavBarAdmin;
