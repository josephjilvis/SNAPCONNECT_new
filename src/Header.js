
import React from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaSearch } from 'react-icons/fa'; // Import the search icon
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleIconClick = (path) => {
    if (path === 'logout') {
      localStorage.removeItem('authToken');
      navigate('/login'); // Redirect to the login page
    } else {
      navigate(path);
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>Welcome to SnapConnect</h1>
      </div>
      <div style={styles.icons}>
        <FaHome
          style={styles.icon}
          onClick={() => handleIconClick('/home')}
          title="Home"
        />
        <FaUser
          style={styles.icon}
          onClick={() => handleIconClick('/my-bookings')}
          title="My Bookings"
        />
        <FaSearch
          style={styles.icon}
          onClick={() => handleIconClick('/search')}
          title="Search"
        />
        <FaSignOutAlt
          style={styles.icon}
          onClick={() => handleIconClick('logout')}
          title="Logout"
        />
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    height: '70px',
    zIndex: 1000, // Ensures the header stays on top
    backgroundColor: '#fff',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #d32f2f', 
  },
  titleContainer: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    color: '#d32f2f',
    fontSize: '25px',
    margin: 0,
    lineHeight: '70px',
  },
  icons: {
    display: 'flex',
    gap: '15px',
    marginRight: '20px',
  },
  icon: {
    color: '#d32f2f',
    cursor: 'pointer',
    fontSize: '24px',
  },
};

export default Header;

