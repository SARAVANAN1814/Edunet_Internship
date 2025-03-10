import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PostAuction.css';

function PostAuction() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    startingBid: '',
    closingTime: '',
    category: '',
    condition: 'new'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please sign in to post an auction');
      navigate('/signin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const validateForm = () => {
    if (!formData.itemName.trim()) {
      toast.error('Item name is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.startingBid || parseFloat(formData.startingBid) <= 0) {
      toast.error('Starting bid must be greater than 0');
      return false;
    }
    if (!formData.closingTime) {
      toast.error('Closing time is required');
      return false;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.condition) {
      toast.error('Condition is required');
      return false;
    }

    const selectedDate = new Date(formData.closingTime);
    if (selectedDate <= new Date()) {
      toast.error('Closing time must be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (image) {
        formDataToSend.append('image', image);
      }

      formDataToSend.append('username', localStorage.getItem('username'));

      const response = await axios.post('http://localhost:5001/auction', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('✔ Auction posted successfully!', {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate('/dashboard')
        });
      } else {
        toast.error(response.data.message || 'Failed to post auction');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to post auction';
      toast.error(errorMessage);
      console.error('Post auction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-auction-container">
      <ToastContainer />
      <div className="post-auction-card">
        <div className="post-auction-header">
          <h2>Post New Auction</h2>
          <p>Fill in the details to create your auction</p>
        </div>

        <form onSubmit={handleSubmit} className="post-auction-form">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  className="form-control"
                  placeholder="Enter item name"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                  <option value="art">Art & Collectibles</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Item Condition</label>
                <select
                  name="condition"
                  className="form-control"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Starting Bid (₹)</label>
                <input
                  type="number"
                  name="startingBid"
                  className="form-control"
                  placeholder="Enter starting bid in INR"
                  value={formData.startingBid}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Auction End Date & Time</label>
                <input
                  type="datetime-local"
                  name="closingTime"
                  className="form-control"
                  value={formData.closingTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Item Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="image-upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label>Item Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Describe your item in detail"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="post-auction-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Posting...
              </>
            ) : (
              'Post Auction'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostAuction;