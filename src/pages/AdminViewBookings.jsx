import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/AdminViewBookings.css";

const AdminViewBookings = () => {
  const [bookingsSummary, setBookingsSummary] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const bookingsList = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Summarize bookings by event
        const summary = bookingsList.reduce((acc, booking) => {
          const eventKey = booking.eventId; // Use eventId as a unique identifier
          if (!acc[eventKey]) {
            acc[eventKey] = {
              title: booking.title,
              date: booking.date,
              time: booking.time,
              location: booking.location,
              bookingsCount: 0,
            };
          }
          acc[eventKey].bookingsCount += 1;
          return acc;
        }, {});

        setBookingsSummary(Object.values(summary));
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="admin-view-bookings">
        
      <h1>User Bookings Summary</h1>
      {bookingsSummary.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Event Date</th>
              <th>Event Time</th>
              <th>Location</th>
              <th>Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            {bookingsSummary.map((event, index) => (
              <tr key={index}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.time}</td>
                <td>{event.location}</td>
                <td>{event.bookingsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminViewBookings;
