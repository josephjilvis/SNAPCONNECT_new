import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCamera, FaLocationArrow, FaDollarSign, FaInfoCircle, FaLink, FaQuoteLeft, FaCalendarAlt, FaPhoneAlt, FaTag, FaImage } from 'react-icons/fa'; // Import icons

const EditProfile = () => {
  const { id } = useParams();
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
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/photographer/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setFormData(data);

        // Only set the image preview if the profile already has an image
        if (data.image) {
          setImagePreview(`http://localhost:5000/uploads/${data.image}`); // Existing image preview
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      }
    };
    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file)); // Show the new image preview
    }
  };

  const validate = () => {
    let errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.price) errors.price = 'Price is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError('');
    } else {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/update-photographer/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Profile updated successfully:', data);
        navigate('/photographer-dashboard'); // Redirect to dashboard after successful update
      } catch (error) {
        console.error('Error:', error.message);
        setSubmitError('Failed to update profile. Please try again.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Profile</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaImage style={styles.icon} /> Profile Image</h3>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
          />
          {/* Show existing image preview unless a new image is selected */}
          {imagePreview && <img src={imagePreview} alt="Profile Preview" style={styles.imagePreview} />}
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaCamera style={styles.icon} /> Name</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            style={styles.input}
          />
          {errors.name && <p style={styles.error}>{errors.name}</p>}
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaLocationArrow style={styles.icon} /> Location</h3>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            style={styles.input}
          />
          {errors.location && <p style={styles.error}>{errors.location}</p>}
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaDollarSign style={styles.icon} /> Price</h3>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            style={styles.input}
          />
          {errors.price && <p style={styles.error}>{errors.price}</p>}
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaInfoCircle style={styles.icon} /> Bio</h3>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaLink style={styles.icon} /> Portfolio</h3>
          <input
            type="text"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            placeholder="Portfolio"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaQuoteLeft style={styles.icon} /> Testimonials</h3>
          <textarea
            name="testimonials"
            value={formData.testimonials}
            onChange={handleChange}
            placeholder="Testimonials"
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaCalendarAlt style={styles.icon} /> Availability</h3>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="Availability"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaPhoneAlt style={styles.icon} /> Contact</h3>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <h3 style={styles.subheading}><FaTag style={styles.icon} /> Specializations</h3>
          <input
            type="text"
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            placeholder="Specializations"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Update Profile</button>
      </form>
      {submitError && <p style={styles.error}>{submitError}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '2em',
    border: '2px solid #d32f2f',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginTop: '60rem',
    width: '600px',
  },
  heading: {
    marginBottom: '1.5em',
    color: '#d32f2f',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5em',
    width: '100%',
  },
  subheading: {
    marginBottom: '0.5em',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '0.5em',
    border: '1px solid #d32f2f',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    padding: '0.5em',
    border: '1px solid #d32f2f',
    borderRadius: '4px',
    resize: 'vertical',
  },
  fileInput: {
    width: '100%',
    marginBottom: '1em',
  },
  imagePreview: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '1em',
  },
  button: {
    backgroundColor: '#d32f2f',
    color: 'white',
    padding: '0.75em 1.5em',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
};

export default EditProfile;
