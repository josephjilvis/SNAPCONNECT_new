import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaTrashAlt, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import './manage-bookings.css'; // Ensure this CSS file is styled as needed

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch the photographer's bookings
  useEffect(() => {
    const fetchBookings = async () => {
        const photographerId = localStorage.getItem('photographerId');
        const authToken = localStorage.getItem('token');
      
        if (!photographerId) {
          console.error('Photographer ID not found in local storage');
          return;
        }
      
        try {
          console.log('Fetching bookings with token:', authToken); // Debugging log
          const response = await fetch(`http://localhost:5000/photographer-bookings/${photographerId}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            setBookings(data); // Store bookings
          } else {
            console.log('No bookings found or unauthorized:', response.status);
            setBookings([]);
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      };

    fetchBookings();
  }, []);

  // Function to handle booking acceptance, rejection, or cancellation
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/update-booking-status/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(bookings.map((booking) =>
          booking._id === bookingId ? updatedBooking : booking
        ));
        alert(`Booking ${newStatus.toLowerCase()} successfully!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update booking status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status.');
    }
  };

  return (
    <div className="manage-bookings-container">
      <h1 className="page-title">Manage Bookings</h1>
      {bookings.length > 0 ? (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <div className="booking-info">
                <h2>{booking.userId.name}</h2>
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
                  <strong>Status:</strong> {booking.status}
                </p>
              </div>
              <div className="booking-actions">
                {booking.status === 'Pending' && (
                  <div className="status-buttons">
                    <button className="status-button accept-button" onClick={() => handleStatusUpdate(booking._id, 'Accepted')}>
                      <FaCheck /> Accept
                    </button>
                    <button className="status-button reject-button" onClick={() => handleStatusUpdate(booking._id, 'Rejected')}>
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}
                {booking.status !== 'Pending' && (
                  <button className="delete-button" onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}>
                    <FaTrashAlt /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-bookings-message">No booking requests at the moment.</p>
      )}
    </div>
  );
};

export default ManageBookings;
