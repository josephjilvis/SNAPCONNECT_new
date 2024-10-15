import React, { useState, useEffect } from 'react';
import PhotographerCard from './PhotographerCard'; // Import the PhotographerCard component

const SearchPage = () => {
  const [photographers, setPhotographers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchPhotographers = async () => {
    try {
      const queryString = Object.entries(filters)
        .filter(([key, value]) => value) // Only include filters that have a value
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const response = await fetch(`http://localhost:5000/search-photographers?${queryString}`);
      const data = await response.json();
      setPhotographers(data);
    } catch (error) {
      console.error('Error fetching photographers:', error);
    }
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSearch = () => {
    fetchPhotographers();
  };

  return (
    <div style={styles.container}>
      <h1>Find Photographers</h1>

      {/* Search by Name and Location */}
      <div className="search-section">
        <h2>Search</h2>
        <input
          type="text"
          name="name"
          placeholder="Search by Name"
          value={filters.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Search by Location"
          value={filters.location}
          onChange={handleInputChange}
        />
      </div>

      {/* Filter by Price */}
      <div className="filter-section">
        <h2>Filter by Price</h2>
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleInputChange}
        />
      </div>

      <button onClick={handleSearch}>Search</button>

      {/* Display Photographer Cards */}
      <div className="photographers-list" style={styles.photographersList}>
        {photographers.length > 0 ? (
          photographers.map((photographer) => (
            <PhotographerCard
              key={photographer._id}
              id={photographer._id}
              image={photographer.image} // Ensure the image source is valid
              name={photographer.name}
              location={photographer.location}
              price={photographer.price}
              contact={photographer.contact}
            />
          ))
        ) : (
          <p>No photographers found</p>
        )}
      </div>
    </div>
  );
};

const styles = {
    container: {
      width: '800px', // Set a fixed width (you can adjust this value as needed)
      margin: '0 auto', // Center the container horizontally
      border: '2px solid #d32f2f', // Overall red border around the entire component
      padding: '20px', // Padding inside the border for better spacing
      borderRadius: '10px', // Optional: rounded corners
      backgroundColor: '#fff', // Background color for the container
      marginTop: '100px', // Adjust margin to your preference
    },
    photographersList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '20px',
    },
  };

export default SearchPage;
