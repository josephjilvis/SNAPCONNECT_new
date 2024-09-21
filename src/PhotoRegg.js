import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faMapMarkerAlt, faDollarSign, faInfoCircle, faLink, faStar, faCalendarAlt, faPhone, faTags, faImage } from '@fortawesome/free-solid-svg-icons';
import './photographer-register.css'; // Ensure this CSS file is styled accordingly

const PhotographerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    price: '',
    bio: '',
    portfolio: '',
    testimonials: '',
    availability: '',
    contact: '',
    specializations: '',
  });

  const [image, setImage] = useState(null); // State for file input
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the selected file
  };

  const validate = () => {
    const { name, email, password } = formData;
    let errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

// Handle the submit logic in PhotoRegg.js
const handleSubmit = async (event) => {
  event.preventDefault();
  
  try {
    // Log formData to ensure all fields are correct
    console.log('Form Data before submission:', formData);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('location', formData.location);
    formDataToSubmit.append('price', Number(formData.price)); // Convert price to a number
    formDataToSubmit.append('bio', formData.bio);
    formDataToSubmit.append('portfolio', formData.portfolio);
    formDataToSubmit.append('testimonials', formData.testimonials);
    formDataToSubmit.append('availability', formData.availability);
    formDataToSubmit.append('contact', formData.contact);
    formDataToSubmit.append('specializations', formData.specializations);
    if (image) formDataToSubmit.append('image', image);

    // Log formDataToSubmit to verify content
    for (let [key, value] of formDataToSubmit.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch('http://localhost:5000/register-photographer', {
      method: 'POST',
      body: formDataToSubmit,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);
   alert("Register Succesfull");
    navigate("/photographer-login")
  
  } catch (error) {
    console.error('Error:', error);
    setSubmitError('An error occurred while registering. Please try again.');
  }
};







  return (
    <div className="form-container">
      <h2>Photographer Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            <FontAwesomeIcon icon={faUser} /> Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email">
            <FontAwesomeIcon icon={faEnvelope} /> Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">
            <FontAwesomeIcon icon={faLock} /> Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="location">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price">
            <FontAwesomeIcon icon={faDollarSign} /> Price (in USD):
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="bio">
            <FontAwesomeIcon icon={faInfoCircle} /> Bio:
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="portfolio">
            <FontAwesomeIcon icon={faLink} /> Portfolio (URL):
          </label>
          <input
            type="url"
            id="portfolio"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="testimonials">
            <FontAwesomeIcon icon={faStar} /> Client Testimonials:
          </label>
          <textarea
            id="testimonials"
            name="testimonials"
            value={formData.testimonials}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="availability">
            <FontAwesomeIcon icon={faCalendarAlt} /> Availability:
          </label>
          <input
            type="text"
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="contact">
            <FontAwesomeIcon icon={faPhone} /> Contact Info (Email or Phone):
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="specializations">
            <FontAwesomeIcon icon={faTags} /> Specializations:
          </label>
          <select
            id="specializations"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
          >
            <option value="">Select Specialization</option>
            <option value="weddings">Weddings</option>
            <option value="portraits">Portraits</option>
            <option value="events">Events</option>
            <option value="commercial">Commercial</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
        <div>
          <label htmlFor="image">
            <FontAwesomeIcon icon={faImage} /> Profile Image:
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {submitError && <p className="error">{submitError}</p>}
      <p>
        Already registered? <Link to="/photographer-login">Login</Link>
      </p>
    </div>
  );
};

export default PhotographerRegister;
