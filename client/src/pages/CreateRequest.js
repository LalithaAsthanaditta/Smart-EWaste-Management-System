import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateRequest.css';

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    deviceName: '',
    deviceCategory: '',
    condition: '',
    description: ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages(files);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('deviceName', formData.deviceName);
      formDataToSend.append('deviceCategory', formData.deviceCategory);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('description', formData.description);
      
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const res = await axios.post('/api/requests', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Request created successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Pickup Request</h2>
        <p className="subtitle">Submit your e-waste device for pickup</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Device Name</label>
            <input
              type="text"
              name="deviceName"
              value={formData.deviceName}
              onChange={handleChange}
              required
              placeholder="e.g., iPhone 12, Dell Laptop"
            />
          </div>
          
          <div className="form-group">
            <label>Device Category</label>
            <select
              name="deviceCategory"
              value={formData.deviceCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Mobile">Mobile</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Tablet">Tablet</option>
              <option value="TV">TV</option>
              <option value="Monitor">Monitor</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select condition</option>
              <option value="Working">Working</option>
              <option value="Damaged">Damaged</option>
              <option value="Dead">Dead</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your device, any issues, etc."
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label>Images (Max 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
            {images.length > 0 && (
              <div className="image-preview">
                {images.map((img, idx) => (
                  <span key={idx} className="image-name">{img.name}</span>
                ))}
              </div>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;

