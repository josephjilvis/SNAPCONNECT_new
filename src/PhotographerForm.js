import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './photoform.css'; // Ensure this file is in the same directory or update the path accordingly

const PhotographerForm = () => {
  const { id } = useParams(); // Get the photographer ID from the URL parameters, if applicable
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    bio: '',
    portfolio: '',
    testimonials: '',
    availability: '',
    contact: '',
    specializations: '',
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch existing profile data if editing
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/get-photographer/${id}`); // Adjust the endpoint as needed
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFormData({
            name: data.name || '',
            location: data.location || '',
            price: data.price || '',
            bio: data.bio || '',
            portfolio: data.portfolio || '',
            testimonials: data.testimonials || '',
            availability: data.availability || '',
            contact: data.contact || '',
            specializations: data.specializations || '',
          });
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email); // Ensure email is included
    formDataToSend.append('password', formData.password); // Ensure password is included
    formDataToSend.append('location', formData.location);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('portfolio', formData.portfolio);
    formDataToSend.append('testimonials', formData.testimonials);
    formDataToSend.append('availability', formData.availability);
    formDataToSend.append('contact', formData.contact);
    formDataToSend.append('specializations', formData.specializations);
    if (image) {
      formDataToSend.append('image', image);
    }
  
    // Debugging: Log form data
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    try {
      const url = id
        ? `http://localhost:5000/update-photographer/${id}`
        : 'http://localhost:5000/add-photographer';
  
      const method = id ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status}: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      alert(id ? 'Photographer updated successfully!' : 'Photographer added successfully!');
      setFormData({
        name: '',
        location: '',
        price: '',
        bio: '',
        portfolio: '',
        testimonials: '',
        availability: '',
        contact: '',
        specializations: '',
      });
      setImage(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing request');
    }
  };
  
  return (
    <div className="form-container">
      <h2>{id ? 'Edit Photographer' : 'Add Photographer'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Price (in USD)</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="portfolio">Portfolio (URL)</label>
        <input
          type="url"
          id="portfolio"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleChange}
        />

        <label htmlFor="testimonials">Client Testimonials</label>
        <textarea
          id="testimonials"
          name="testimonials"
          value={formData.testimonials}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="availability">Availability</label>
        <input
          type="text"
          id="availability"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
        />

        <label htmlFor="contact">Contact Info (Email or Phone)</label>
        <input
          type="text"
          id="contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <label htmlFor="specializations">Specializations</label>
        <select
          id="specializations"
          name="specializations"
          value={formData.specializations}
          onChange={handleChange}
          required
        >
          <option value="">Select Specialization</option>
          <option value="weddings">Weddings</option>
          <option value="portraits">Portraits</option>
          <option value="events">Events</option>
          <option value="commercial">Commercial</option>
          <option value="landscape">Landscape</option>
        </select>

        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">{id ? 'Update' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default PhotographerForm;
