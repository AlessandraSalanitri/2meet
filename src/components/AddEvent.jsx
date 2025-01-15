"use client";

import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/EventModal.css";

const AddEvent = ({ event, onClose, onEventAdded }) => {
  // Initialize state with provided event data (e.g., latitude, longitude)
  const [newEvent, setNewEvent] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    time: event?.time || "",
    location: event?.location || "",
    latitude: event?.latitude || "", // Pre-filled latitude
    longitude: event?.longitude || "", // Pre-filled longitude
    imageURL: event?.imageURL || "",
    eventType: event?.eventType || "",
    availability: event?.availability || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "events"), newEvent); // Add to Firestore
      alert("Event added successfully!");
      onEventAdded(newEvent); // Notify parent to refresh events
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error adding event:", err);
      setError("Failed to add the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-modal">
      <div className="event-modal-content">
        <h3>Add New Event</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newEvent.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newEvent.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="date"
          placeholder="yyyy-mm-dd"
          value={newEvent.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="time"
          placeholder="e.g : 10:00AM"
          value={newEvent.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleChange}
          required
        />

        {/* Latitude and Longitude Fields - Automatically Filled */}
        <input
          type="text"
          name="latitude"
          placeholder="Latitude"
          value={newEvent.latitude}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="longitude"
          placeholder="Longitude"
          value={newEvent.longitude}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="imageURL"
          placeholder="Image - paste the link here"
          value={newEvent.imageURL}
          onChange={handleChange}
          required
        />

        <select
          name="eventType"
          value={newEvent.eventType}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Event Type
          </option>
          <option value="learning">Learning</option>
          <option value="festival">Festival</option>
          <option value="gigs">Gigs</option>
          <option value="clubs">Clubs</option>
          <option value="sports">Sport</option>
          <option value="seasonal">Seasonal</option>
        </select>

        <input
          type="number"
          name="availability"
          placeholder="Availability"
          value={newEvent.availability}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <button className="confirm-button" onClick={handleAddEvent} disabled={loading}>
            {loading ? "Adding..." : "Add Event"}
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
