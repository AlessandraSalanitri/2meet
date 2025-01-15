"use client";

import React, { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/EventModal.css";

const CancelEvent = ({ eventId, onClose, onEventDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const eventRef = doc(db, "events", eventId);
      await deleteDoc(eventRef); // Delete from Firestore
      alert("Event deleted successfully!");
      onEventDeleted(); // Refresh parent events
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-modal">
      <div className="event-modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this event? This action cannot be undone.</p>
        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <button className="confirm-button" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Confirm"}
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelEvent;
