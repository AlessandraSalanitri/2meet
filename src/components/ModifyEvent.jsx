"use client";

import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/EventModal.css";

const ModifyEvent = ({ event, onClose, onEventModified }) => {
  const [updatedEvent, setUpdatedEvent] = useState(event);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleModify = async () => {
    setLoading(true);
    try {
      const eventRef = doc(db, "events", updatedEvent.id);

      // Update only modified fields
      const changes = Object.keys(updatedEvent).reduce((acc, key) => {
        if (updatedEvent[key] !== event[key]) {
          acc[key] = updatedEvent[key];
        }
        return acc;
      }, {});

      if (Object.keys(changes).length === 0) {
        alert("No changes made.");
        setLoading(false);
        return;
      }

      await updateDoc(eventRef, changes); // Update Firestore document
      alert("Event updated successfully!");
      onEventModified(); // Refresh parent events
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-modal">
      <div className="event-modal-content">
        <h3>Modify Event</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={updatedEvent.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={updatedEvent.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={updatedEvent.date}
          onChange={handleChange}
        />
        <input
          type="time"
          name="time"
          placeholder="Time"
          value={updatedEvent.time}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={updatedEvent.location}
          onChange={handleChange}
        />
        <input
          type="number"
          name="latitude"
          placeholder="Latitude"
          value={updatedEvent.latitude}
          onChange={handleChange}
        />
        <input
          type="number"
          name="longitude"
          placeholder="Longitude"
          value={updatedEvent.longitude}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imageURL"
          placeholder="Image URL"
          value={updatedEvent.imageURL}
          onChange={handleChange}
        />
        <select
          name="eventType"
          value={updatedEvent.eventType}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select Event Type
          </option>
          <option value="learning">Learning</option>
          <option value="festival">Festival</option>
          <option value="gigs">Gigs</option>
          <option value="clubs">Clubs</option>
          <option value="sport">Sport</option>
          <option value="seasonal">Seasonal</option>
        </select>
        <input
          type="number"
          name="availability"
          placeholder="Availability"
          value={updatedEvent.availability}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <button className="confirm-button" onClick={handleModify} disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyEvent;
