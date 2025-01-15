"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import qrCode from "../assets/qrcode.png"; // Import QR code image
import "../styles/MyAccount.css";

const MyAccount = () => {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null); // For toggling details
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const now = new Date();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        // Fetch bookings for the logged-in user
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsList = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Separate current and past bookings
        const current = bookingsList.filter(
          (booking) => new Date(booking.date) >= now
        );

        const past = bookingsList.filter(
          (booking) => new Date(booking.date) < now
        );

        setCurrentBookings(current);
        setPastBookings(past);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again.");
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      // Delete the booking from Firestore
      await deleteDoc(doc(db, "bookings", bookingId));
      // Update current bookings list
      setCurrentBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId)
      );
      alert("Booking canceled successfully.");
    } catch (err) {
      setError("Failed to cancel booking. Please try again.");
    }
  };

  const toggleBookingDetails = (bookingId) => {
    setExpandedBooking((prev) => (prev === bookingId ? null : bookingId));
  };

  return (
    <div className="my-account">
      <h1>My Account</h1>

      {error && <p className="error">{error}</p>}

      {/* Current Bookings */}
      <div className="bookings-section">
        <h2>Current Bookings</h2>
        {currentBookings.length === 0 ? (
          <p>No current bookings found.</p>
        ) : (
          <ul className="bookings-list">
            {currentBookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                {/* Title and Toggle Button */}
                <div className="booking-summary">
                  <span className="booking-title">{booking.title}</span>
                  <div className="booking-actions">
                    <button
                      className="toggle-details-button"
                      onClick={() => toggleBookingDetails(booking.id)}
                    >
                      {expandedBooking === booking.id ? "▲" : "▼"}
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>

                {/* Hidden Details */}
                {expandedBooking === booking.id && (
                  <div className="booking-details">
                    <p><strong>Event Date:</strong> {booking.date}</p>
                    <p><strong>Event Location:</strong> {booking.location}</p>
                    <p><strong>Event Time:</strong> {booking.time}</p><br></br>
                    <div className="qr-code-container">
                      <p><strong>Your QR Code:</strong></p>
                      <img
                        src={qrCode}
                        alt="QR Code for Booking"
                        className="qr-code"
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Past Bookings */}
      <div className="bookings-section">
        <h2>Past Bookings</h2>
        {pastBookings.length === 0 ? (
          <p>No past bookings found.</p>
        ) : (
          <ul className="bookings-list">
            {pastBookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                {/* Title and Toggle Button */}
                <div className="booking-summary">
                  <span className="booking-title">{booking.title}</span>
                  <button
                    className="toggle-details-button"
                    onClick={() => toggleBookingDetails(booking.id)}
                  >
                    {expandedBooking === booking.id ? "▲" : "▼"}
                  </button>
                </div>

                {/* Hidden Details */}
                {expandedBooking === booking.id && (
                  <div className="booking-details">
                    <p><strong>Event Date:</strong> {booking.date}</p>
                    <p><strong>Event Location:</strong> {booking.location}</p>
                    <p><strong>Event Time:</strong> {booking.time}</p><br></br>
                    <div className="qr-code-container">
                      <p><strong>Your QR Code:</strong></p>
                      <img
                        src={qrCode}
                        alt="QR Code for Booking"
                        className="qr-code"
                      />
                      <p> This QR code is expired</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Go Back to Events Button */}
      <button className="back-to-events" onClick={() => navigate("/events")}>
        Go Back to Events
      </button>
    </div>
  );
};

export default MyAccount;
