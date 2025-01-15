import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import SubNavBarEvents from "../components/SubNavBarEvents";
import Booking from "../components/Booking";
import "../styles/EventDashboard.css";

const EventDashboard = () => {
  const [events, setEvents] = useState([]); // Store all events
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null); // Track the selected event
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch events from Firestore on component mount
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
        setError("Failed to fetch events. Please try again.");
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on search, filters, and category
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory
      ? event.eventType === selectedCategory
      : true;

    const matchesLocation = filters.location
      ? event.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const matchesDate = filters.date ? event.date === filters.date : true;

    const matchesSearchTerm = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesLocation && matchesDate && matchesSearchTerm;
  });

  // Sort events based on selected sort option
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filters.sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (filters.sortBy === "location") {
      return a.location.localeCompare(b.location);
    } else if (filters.sortBy === "availability") {
      return b.availability - a.availability;
    }
    return 0;
  });

  // Handle booking confirmation
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

  // Handle cancel booking popup
  const handleCancelBooking = () => {
    setSelectedEvent(null); // Close the popup
  };



  return (
    <div className="event-dashboard">
      {/* SubNavBar for filters, categories, and view toggle */}
      <SubNavBarEvents
      onCategoryClick={(filterType, value) => {
        if (value === "all") {
          setSelectedCategory("");
          setFilters({});
          setSearchTerm("");
        } else if (filterType === "location") {
          setFilters((prev) => ({ ...prev, location: value }));
        } else if (filterType === "date") {
          setFilters((prev) => ({ ...prev, date: value }));
        } else if (filterType === "eventType") {
          setSelectedCategory(value);
        } else if (filterType === "map") {
          navigate("/view-on-map"); // Redirect to the map page
        }
      }}
      onApplyFilters={(appliedFilters) => {
        setFilters((prev) => ({
          ...prev,
          sortBy: appliedFilters.sortBy,
        }));
      }}
    />

        <>
          <div className="dynamic-search-container">
            <input
              type="text"
              placeholder="Search events..."
              className="dynamic-search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="event-list">
          {sortedEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            sortedEvents.map((event) => (
              <div key={event.id} className="event-card">
                <img src={event.imageURL} alt={event.title} className="event-image" />
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p>📍 Location: {event.location}</p>
                <p>📅 Date: {event.date}</p>
                <p>⏰ Time: {event.time}</p> 
                <p>🔒 Availability: {event.availability}</p>
                <button
                  className="book-button"
                  onClick={() => setSelectedEvent(event)}
                >
                  Book
                </button>
              </div>
            ))
          )}
        </div>

        </>

      {/* Booking Modal */}
      <Booking
        selectedEvent={selectedEvent}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />
    </div>
  );
};

export default EventDashboard;
