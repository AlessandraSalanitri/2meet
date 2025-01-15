"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AddEvent from "../components/AddEvent";
import ModifyEvent from "../components/ModifyEvent";
import CancelEvent from "../components/CancelEvent";
import "../styles/AdminEventsTable.css";

const AdminEventsTable = () => {
  const [events, setEvents] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);

  // Fetch all events from Firestore
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

  // Refresh the events list
  const refreshEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const eventsList = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
    } catch (err) {
      console.error("Error refreshing events:", err);
    }
  };

  return (
    <div className="admin-events-table">
      <h1>Manage Events</h1>

      {/* Add Event Button */}
      <button className="add-event-button" onClick={() => setShowAddPopup(true)}>
        Add New Event
      </button>

      {/* Events Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Image</th>
            <th>Event Type</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.date}</td>
              <td>{event.time}</td>
              <td>{event.location}</td>
              <td>{event.latitude}</td>
              <td>{event.longitude}</td>
              <td>
                {event.imageURL ? (
                  <img
                    src={event.imageURL}
                    alt={event.title}
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td>{event.eventType}</td>
              <td>{event.availability}</td>
              <td className="action-buttons">
                <button
                  className="modify-button"
                  onClick={() => setEditingEvent(event)}
                >
                  Modify
                </button>
                <button
                  className="delete-button"
                  onClick={() => setDeletingEventId(event.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Event Popup */}
      {showAddPopup && (
        <AddEvent
          onClose={() => setShowAddPopup(false)}
          onEventAdded={refreshEvents}
        />
      )}

      {/* Modify Event Popup */}
      {editingEvent && (
        <ModifyEvent
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventModified={refreshEvents}
        />
      )}

      {/* Delete Event Popup */}
      {deletingEventId && (
        <CancelEvent
          eventId={deletingEventId}
          onClose={() => setDeletingEventId(null)}
          onEventDeleted={refreshEvents}
        />
      )}
    </div>
  );
};

export default AdminEventsTable;
