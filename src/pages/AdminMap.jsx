"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import ViewOnMap from "../components/ViewOnMap";
import "../styles/AdminMap.css";

const AdminMap = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    latitude: "",
    longitude: "",
    eventType: "",
    availability: "",
    imageURL: "",
  });
  const [showAddEventPopup, setShowAddEventPopup] = useState(false);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Handle map click to set the new event location
  const handleMapClick = (latlng) => {
    setNewEvent({
      ...newEvent,
      latitude: latlng.lat,
      longitude: latlng.lng,
    });
    setShowAddEventPopup(true);
  };

  // Add a new event to Firestore
  const handleAddEvent = async () => {
    try {
      await addDoc(collection(db, "events"), newEvent);
      setEvents((prev) => [...prev, newEvent]);
      setShowAddEventPopup(false);
      alert("Event added successfully!");
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  return (
    <div className="admin-map">
      <h2>Admin Event Map</h2>
      <ViewOnMap
        events={events}
        onMarkerClick={(event) => alert(`Viewing event: ${event.title}`)}
        onMapClick={handleMapClick}
        allowAddMarker={true}
      />

      {/* Popup for adding a new event */}
      {showAddEventPopup && (
        <div className="add-event-popup">
          <div className="popup-content">
            <h3>Add New Event</h3>
            <input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            />
            <input
              type="text"
              placeholder="Event Type"
              value={newEvent.eventType}
              onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
            />
            <input
              type="number"
              placeholder="Availability"
              value={newEvent.availability}
              onChange={(e) => setNewEvent({ ...newEvent, availability: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newEvent.imageURL}
              onChange={(e) => setNewEvent({ ...newEvent, imageURL: e.target.value })}
            />

            {/* Coordinates from the map click */}
            <p>Latitude: {newEvent.latitude}</p>
            <p>Longitude: {newEvent.longitude}</p>

            <div className="buttons">
              <button onClick={handleAddEvent}>Confirm</button>
              <button onClick={() => setShowAddEventPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMap;
