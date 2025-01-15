"use client";

import React from "react";
import { Link } from "react-router-dom"; // Add this import
import "../styles/Booking.css"; // Add styling for the booking popup
import QRCode from "../assets/qrcode.png"; // Path to the QR code image

const Booking = ({ selectedEvent, onConfirm, onCancel }) => {
  if (!selectedEvent) return null; // Do not render if no event is selected

  return (
    <div className="booking-overlay">
      <div className="booking-popup">
        {selectedEvent.confirmed ? (
          <div className="booking-confirmation">
            {/* Close Button for QR Code Modal */}
            <button
              className="close-modal"
              onClick={onCancel} // Close the modal
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h2>Fantastic! You're booked in for:</h2>
            <p>
              <strong>Event:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <img src={QRCode} alt="QR Code" className="qr-code" />
            <p>Present this QR code at the entrance.</p>
            <Link to="/account" className="profile-link">
              Go to Your Profile to See the Booking
            </Link>
          </div>
        ) : (
          <>
            <h2>Confirm Your Booking</h2>
            <p>
              <strong>Event:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <div className="booking-actions">
              <button
                className="confirm-button"
                onClick={() => onConfirm(selectedEvent)}
              >
                Yes, Confirm
              </button>
              <button className="cancel-button" onClick={onCancel}>
                No, Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
