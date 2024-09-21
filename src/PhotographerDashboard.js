import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaCalendarCheck } from 'react-icons/fa'; // Import icons
import './photographer-dashboard.css'; // Ensure this CSS file exists and is styled

const PhotographerDashboard = () => {
  const navigate = useNavigate();

  // Retrieve photographerId from localStorage
  const photographerId = localStorage.getItem('photographerId'); // Get the photographer ID from localStorage

  const handleEditProfile = () => {
    navigate(`/edit-profile/${photographerId}`); // Redirect to the edit profile page
  };

  const handleManageBookings = () => {
    navigate('/manage-bookings'); // Redirect to the manage bookings page
  };

  return (
    <div className="dashboard-container">
      <h2>Photographer Dashboard</h2>
      <div className="dashboard-options">
        <div className="dashboard-option" onClick={handleEditProfile}>
          <FaUserEdit className="dashboard-icon" />
          <p>Edit Profile</p>
        </div>
        <div className="dashboard-option" onClick={handleManageBookings}>
          <FaCalendarCheck className="dashboard-icon" />
          <p>Manage Bookings</p>
        </div>
      </div>
    </div>
  );
};

export default PhotographerDashboard;
