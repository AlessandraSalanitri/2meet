import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import SubNavBarEvents from "../components/SubNavBarEvents";
import ViewOnMap from "../components/ViewOnMap";
import Booking from "../components/Booking";
import AddEvent from "../components/AddEvent";
import "../styles/ViewOnMapPage.css";

const ViewOnMapPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
  const [newEventPosition, setNewEventPosition] = useState(null); // Position for new event
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false); // Modal visibility for admin only

  // Fetch events and determine user role
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
        setFilteredEvents(eventsList);

        // Determine admin status
        const user = auth.currentUser;
        if (user) {
          const usersSnapshot = await getDocs(collection(db, "users"));
          const userData = usersSnapshot.docs.find((doc) => doc.id === user.uid)?.data();
          setIsAdmin(userData?.isAdmin || false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle map click for adding events (admin-only feature)
  const handleMapClick = (latlng) => {
    if (!isAdmin) return; // Prevent non-admin users from triggering the modal
    console.log("Map clicked at:", latlng);
    setNewEventPosition(latlng); // Update state with clicked position
    setShowAddPopup(true); // Show the Add Event modal
  };

  // Add a new event to Firestore
  const handleAddEvent = async (eventData) => {
    try {
      const eventDoc = await addDoc(collection(db, "events"), eventData);
      const newEvent = { id: eventDoc.id, ...eventData };
      setEvents((prev) => [...prev, newEvent]);
      setFilteredEvents((prev) => [...prev, newEvent]);
      setNewEventPosition(null); // Clear map click position
      setShowAddPopup(false); // Close modal
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Marker click handler
  const handleMarkerClick = (event) => {
    setSelectedEvent(event);
    setIsBookingPopupOpen(false);
  };

  // Booking actions
  const handleBookButtonClick = () => setIsBookingPopupOpen(true);
  const handleConfirmBooking = async (event) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You need to log in to book an event!");
        return;
      }
  
      // Check if the user has already booked the event
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid),
        where("eventId", "==", event.id)
      );
      const existingBookingsSnapshot = await getDocs(bookingsQuery);
  
      if (!existingBookingsSnapshot.empty) {
        alert("You have already booked this event.");
        setSelectedEvent(null); // Close the popup
        return;
      }
  
      // Reduce availability count by 1
      const updatedAvailability = event.availability - 1;
  
      if (updatedAvailability < 0) {
        alert("Sorry, this event is fully booked!");
        setSelectedEvent(null); // Close the popup
        return;
      }
  
      // Update Firestore with the new availability count
      const eventDocRef = doc(db, "events", event.id);
      await updateDoc(eventDocRef, { availability: updatedAvailability });
  
      // Save the booking to Firestore
      const bookingData = {
        bookingDate: new Date().toISOString(),
        date: event.date,
        eventId: event.id,
        location: event.location,
        time: event.time,
        title: event.title,
        userId: user.uid,
      };
      await addDoc(collection(db, "bookings"), bookingData);
  
      // Update local state to reflect the change
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === event.id ? { ...ev, availability: updatedAvailability } : ev
        )
      );
  
      // Show success message with QR code
      setSelectedEvent({ ...event, confirmed: true });
    } catch (err) {
      alert("Failed to confirm booking. Please try again.");
      console.error(err);
    }
  };
  
  const handleCancelBooking = () => setIsBookingPopupOpen(false);

  return (
    <div className="view-on-map-page">
      {/* Navigation Bar */}
        <SubNavBarEvents />
      
      <div className="map-and-sidebar-container">
        {/* Map Section */}
        <ViewOnMap
          events={filteredEvents}
          onMarkerClick={handleMarkerClick}
          onEventAdded={(newEvent) => {
            setEvents((prev) => [...prev, newEvent]);
            setFilteredEvents((prev) => [...prev, newEvent]);
          }}
          isAdmin={isAdmin} // Pass admin status to ensure only admins can add events
          onMapClick={handleMapClick} // Handle map click for adding events
        />

        {/* Admin: Add Event Modal */}
        {isAdmin && showAddPopup && (
          <AddEvent
            event={{
              title: "",
              description: "",
              date: "",
              time: "",
              location: "",
              latitude: newEventPosition?.lat || "", // Pass clicked latitude
              longitude: newEventPosition?.lng || "", // Pass clicked longitude
              imageURL: "",
              eventType: "",
              availability: "",
            }}
            onClose={() => setShowAddPopup(false)} // Close modal
            onEventAdded={handleAddEvent}
          />
        )}

        {/* Event Details Sidebar */}
        {selectedEvent && (
          <div className="event-details-sidebar">
            <button
              className="close-sidebar"
              onClick={() => setSelectedEvent(null)}
            >
              &times; {/* Close Button */}
            </button>
            <h2>{selectedEvent.title}</h2>
            <img
              src={selectedEvent.imageURL}
              alt={selectedEvent.title}
              className="event-image"
            />
            <p>{selectedEvent.description}</p>
            <p>📍 Location: {selectedEvent.location}</p>
            <p>📅 Date: {selectedEvent.date}</p>
            <p>⏰ Time: {selectedEvent.time}</p>
            <p>🔒 Availability: {selectedEvent.availability}</p>
            {!isAdmin && (
              <button className="book-button" onClick={handleBookButtonClick}>
                Book Now
              </button>
            )}
          </div>
        )}

        {/* Booking Confirmation */}
        {!isAdmin && isBookingPopupOpen && selectedEvent && (
          <Booking
            selectedEvent={selectedEvent}
            onConfirm={handleConfirmBooking}
            onCancel={handleCancelBooking}
          />
        )}
      </div>
    </div>
  );
};

export default ViewOnMapPage;
