
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PhotographerCard = ({ id, image, name, location, price, contact, portfolio }) => {
  const navigate = useNavigate();

  const handleLocationClick = () => {
    const query = encodeURIComponent(location);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapUrl, '_blank');
  };

  const handleBookClick = () => {
    navigate(`/photographer/${id}`); // Navigate to the photographer's detail page
  };

  return (
    <div style={styles.cardContainer}>
      <img src={image} alt={`${name}`} style={styles.image} />
      <h3>{name}</h3>
      <p style={styles.location} onClick={handleLocationClick}>
        {location}
      </p>
      <p>Price: ${price} per day</p>
      <p>Contact: <a href={`mailto:${contact}`}>{contact}</a></p>
      {portfolio && (
        <p>
          Portfolio: <a href={portfolio} target="_blank" rel="noopener noreferrer">{portfolio}</a>
        </p>
      )}
      <button style={styles.bookButton} onClick={handleBookClick}>
        Book
      </button>
    </div>
  );
};

const styles = {
  cardContainer: {
    width: '300px',
    margin: '20px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    backgroundColor: '#fff',
    border: '1px solid #d32f2f',
    overflow: 'hidden', // Ensure content stays within the card
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
  },
  location: {
    color: 'blue',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  bookButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none', // Changed to 'none' for cleaner look
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default PhotographerCard;

