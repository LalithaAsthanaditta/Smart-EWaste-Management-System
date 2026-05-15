import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const UserDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/requests/my-requests');
      setRequests(res.data.requests);
    } catch (error) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading your requests..." />;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>My E-Waste Requests</h1>
        <Link to="/create-request" className="btn btn-primary">
          + New Request
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {requests.length === 0 ? (
        <div className="card">
          <p>No requests yet. Create your first e-waste pickup request!</p>
          <Link to="/create-request" className="btn btn-primary">
            Create Request
          </Link>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <h3>{request.deviceName}</h3>
                <span className={getStatusClass(request.status)}>
                  {request.status}
                </span>
              </div>
              
              <div className="request-details">
                <p><strong>Category:</strong> {request.deviceCategory}</p>
                <p><strong>Condition:</strong> {request.condition}</p>
                <p><strong>Description:</strong> {request.description}</p>
                {request.pickupDate && (
                  <p><strong>Pickup Date:</strong> {new Date(request.pickupDate).toLocaleDateString()}</p>
                )}
                {request.assignedPersonnel && (
                  <p><strong>Assigned To:</strong> {request.assignedPersonnel}</p>
                )}
                <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              </div>

              {request.images && request.images.length > 0 && (
                <div className="request-images">
                  {request.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.startsWith('http') ? img : `${img}`}
                      alt={`Device ${idx + 1}`}
                      className="request-image"
                    />
                  ))}
                </div>
              )}

              {request.adminNotes && (
                <div className="admin-notes">
                  <strong>Admin Notes:</strong> {request.adminNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

