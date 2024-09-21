import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

// Function to check if user is logged in
const isLoggedIn = () => {
 
  return !!localStorage.getItem('authToken');
};

// Function to get the current user ID
const getCurrentUserId = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id; // Ensure this matches the payload structure
    }
    return null;
  };
  

const PhotographerDetails = () => {
  const { id } = useParams(); // Get the photographer's ID from the URL
  const [photographer, setPhotographer] = useState(null); // To store the photographer data
  const [error, setError] = useState(null); // To handle any errors
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLocation, setBookingLocation] = useState('');
  const navigate = useNavigate(); // For navigation

  const fetchPhotographerDetails = async () => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  
    try {
      const response = await fetch(`http://localhost:5000/photographer/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Add token to request headers
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch photographer details: ${errorText}`);
      }
  
      const data = await response.json();
      setPhotographer(data); // Store the photographer's details
    } catch (error) {
      console.error('Error fetching photographer details:', error);
      setError(error.message);
    }
  };;

  const handleBooking = async () => {
    if (!isLoggedIn()) {
      // Redirect to login page or show a login prompt
      alert('Please log in to make a booking.');
      navigate('/login'); // Assuming you have a route for login
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      alert('Unable to retrieve user information. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/book-photographer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add token to request headers
        },
        body: JSON.stringify({
          photographerId: photographer._id,
          userId: userId,
          bookingDate,
          location: bookingLocation,
          rate: photographer.price,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to confirm booking: ${errorText}`);
      }

      alert('Booking Request Submitted successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking.');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
    fetchPhotographerDetails(); // Fetch the photographer details when the component mounts
  }, [id]); // Re-run the effect if the ID changes

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!photographer) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.detailsContainer}>
      <h1>{photographer.name}</h1>
      <img
        src={`http://localhost:5000/${photographer.image}`}
        alt={photographer.name}
        style={styles.image}
      />
      <p><i className="fas fa-map-marker-alt" style={styles.icon}></i><strong> Location:</strong> {photographer.location}</p>
      <p><i className="fas fa-dollar-sign" style={styles.icon}></i><strong> Price:</strong> ${photographer.price} per day</p>
      <p><i className="fas fa-star" style={styles.icon}></i><strong> Specializations:</strong> {photographer.specializations}</p>
      <p><i className="fas fa-user" style={styles.icon}></i><strong> Bio:</strong> {photographer.bio}</p>
      <p><i className="fas fa-portfolio" style={styles.icon}></i><strong> Portfolio:</strong> <a href={photographer.portfolio} target="_blank" rel="noopener noreferrer">View Portfolio</a></p>
      <p><i className="fas fa-comments" style={styles.icon}></i><strong> Testimonials:</strong> {photographer.testimonials}</p>
      <p><i className="fas fa-calendar-alt" style={styles.icon}></i><strong> Availability:</strong> {photographer.availability}</p>
      <p><i className="fas fa-envelope" style={styles.icon}></i><strong> Contact:</strong> <a href={`mailto:${photographer.contact}`}>{photographer.contact}</a></p>

      <div style={styles.bookingContainer}>
        <h2>Book This Photographer</h2>
        <label>
          <i className="fas fa-calendar-day" style={styles.icon}></i>
          Booking Date:
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            style={styles.input}
          />
        </label>
        <label>
          <i className="fas fa-map-pin" style={styles.icon}></i>
          Booking Location:
          <input
            type="text"
            value={bookingLocation}
            onChange={(e) => setBookingLocation(e.target.value)}
            placeholder="Enter your location"
            style={styles.input}
          />
        </label>
        <button onClick={handleBooking} style={styles.bookButton}>
          <i className="fas fa-check-circle" style={styles.icon}></i> Confirm Booking
        </button>
      </div>
    </div>
  );
};

const styles = {
  detailsContainer: {
    // Adjust margin for header
    marginTop: '600px',
    maxWidth: '900px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '2px solid #d32f2f',
  },
  image: {
    width: '100%',
    maxWidth: '600px', // Make the image responsive
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  bookingContainer: {
    marginTop: '20px',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #d32f2f',
  },
  input: {
    display: 'block',
    margin: '10px 0',
    padding: '8px',
    border: '1px solid #d32f2f',
    borderRadius: '5px',
    width: '100%',
  },
  bookButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default PhotographerDetails;