import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './photographer-login.css';  // Ensure to create and style this CSS file

const PhotographerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate(); // Use navigate for redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const { email, password } = formData;
    let errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError('');
    } else {
      try {
        const response = await fetch('http://localhost:5000/photographer-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Store token and photographerId in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('photographerId', data.photographerId);

        setErrors({});
        setSubmitError('');
        navigate('/photographer-dashboard'); // Redirect to photographer dashboard or another page
      } catch (error) {
        console.error('Error:', error.message);
        setSubmitError('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Photographer Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
      {submitError && <p className="error">{submitError}</p>}
      <p>
        New photographer? <Link to="/photographer-register">Register here</Link>
      </p>
      <p>
        Not a photographer? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default PhotographerLogin;
