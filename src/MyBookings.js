import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt } from 'react-icons/fa'; // Correct import statement
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch the user's bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/my-bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data); // Store bookings
        } else {
          console.log('No bookings found');
          setBookings([]);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  // Function to handle booking deletion
  const handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this booking?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/delete-booking/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        alert('Booking deleted successfully!');
      } else {
        alert('Failed to delete the booking.');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Error deleting booking.');
    }
  };

  return (
    <div className="my-bookings-container">
      <h1 className="page-title">My Bookings</h1>
      {bookings.length > 0 ? (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <div className="photographer-image">
                <img
                  src={`http://localhost:5000/${booking.photographerId.image}`}
                  alt={booking.photographerId.name}
                />
              </div>
              <div className="booking-info">
                <h2>{booking.photographerId.name}</h2>
                <p>
                  <FaCalendarAlt /> <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
                <p>
                  <FaMapMarkerAlt /> <strong>Location:</strong> {booking.location}
                </p>
                <p>
                  <FaDollarSign /> <strong>Rate:</strong> ${booking.rate}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status} {/* Display booking status */}
                </p>
              </div>
              <div className="booking-actions">
                <button className="delete-button" onClick={() => handleDelete(booking._id)}>
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-bookings-message">You have no bookings yet.</p>
      )}
    </div>
  );
};

export default MyBookings;
