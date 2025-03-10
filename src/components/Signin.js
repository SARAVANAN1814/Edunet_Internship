import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signin.css';

function Signin({ setIsAuthenticated, setUsername }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5001/signin', formData);
      
      if (res.data.message === 'Login successful') {
        // Store authentication data
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('username', formData.username);
        
        // Update app state
        setIsAuthenticated(true);
        setUsername(formData.username);

        // Show success message
        toast.success('✔ Successfully signed in!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {
            navigate('/dashboard');
          }
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="signin-container">
      <ToastContainer />
      <div className="signin-form">
        <h2>Sign In</h2>
        <form onSubmit={handleSignin}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
