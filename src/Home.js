import React, { useState, useEffect } from 'react';
import PhotographerCard from './PhotographerCard';

const Home = () => {
  const [photographers, setPhotographers] = useState([]);
  const [error, setError] = useState(null);

  const fetchPhotographers = async () => {
    try {
      const response = await fetch('http://localhost:5000/photographers');
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();


      const filteredPhotographers = data.filter(photographer => 
        photographer.name && 
        photographer.location && 
        photographer.price && 
        photographer.contact && 
        photographer.image
      );

      setPhotographers(filteredPhotographers); // Update state with filtered data
    } catch (error) {
      console.error('Error fetching photographers:', error);
      setError(error.message); // Set error message for display
    }
  };

  useEffect(() => {
    fetchPhotographers(); // Call the function when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1 style={styles.heading}>Photographers List</h1>
      {error && <p>Error: {error}</p>} {/* Display error message if any */}
      <div style={styles.listContainer}>
        {photographers.map(photographer => (
          <PhotographerCard
            key={photographer._id} 
            id={photographer._id} // Assuming _id is the unique identifier
            image={`http://localhost:5000/${photographer.image}`} // Adjust if necessary
            name={photographer.name}
            location={photographer.location}
            price={photographer.price}
            contact={photographer.contact}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  heading: {
    color: 'red', // Set the text color to red
    fontSize: '36px', // Increase the font size
    textAlign: 'center', // Center the heading
  },
};

export default Home;
