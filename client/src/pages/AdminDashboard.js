import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    pickupDate: '',
    assignedPersonnel: '',
    adminNotes: ''
  });
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      const url = filterStatus 
        ? `/api/admin/requests?status=${filterStatus}`
        : '/api/admin/requests';
      const res = await axios.get(url);
      setRequests(res.data.requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axios.patch(`/api/admin/requests/${requestId}/status`, {
        status: newStatus
      });
      fetchRequests();
      fetchStats();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleSchedule = async () => {
    try {
      await axios.patch(`/api/admin/requests/${selectedRequest._id}/schedule`, scheduleData);
      setShowScheduleModal(false);
      setSelectedRequest(null);
      setScheduleData({ pickupDate: '', assignedPersonnel: '', adminNotes: '' });
      fetchRequests();
      fetchStats();
      alert('Pickup scheduled successfully! Email notification sent.');
    } catch (error) {
      alert('Failed to schedule pickup');
    }
  };

  const openScheduleModal = (request) => {
    setSelectedRequest(request);
    setScheduleData({
      pickupDate: request.pickupDate || '',
      assignedPersonnel: request.assignedPersonnel || '',
      adminNotes: request.adminNotes || ''
    });
    setShowScheduleModal(true);
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalRequests || 0}</h3>
          <p>Total Requests</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingRequests || 0}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{stats.scheduledRequests || 0}</h3>
          <p>Scheduled</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedRequests || 0}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalUsers || 0}</h3>
          <p>Total Users</p>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <label>Filter by Status: </label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="requests-grid">
        {requests.map((request) => (
          <div key={request._id} className="request-card admin-card">
            <div className="request-header">
              <h3>{request.deviceName}</h3>
              <span className={getStatusClass(request.status)}>
                {request.status}
              </span>
            </div>

            <div className="request-details">
              <p><strong>User:</strong> {request.user?.name}</p>
              <p><strong>Email:</strong> {request.user?.email}</p>
              <p><strong>Phone:</strong> {request.user?.phone}</p>
              <p><strong>Address:</strong> {request.user?.address}</p>
              <p><strong>Category:</strong> {request.deviceCategory}</p>
              <p><strong>Condition:</strong> {request.condition}</p>
              <p><strong>Description:</strong> {request.description}</p>
              {request.pickupDate && (
                <p><strong>Pickup Date:</strong> {new Date(request.pickupDate).toLocaleDateString()}</p>
              )}
              {request.assignedPersonnel && (
                <p><strong>Assigned To:</strong> {request.assignedPersonnel}</p>
              )}
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

            <div className="admin-actions">
              {request.status === 'Pending' && (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusChange(request._id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => openScheduleModal(request)}
                  >
                    Schedule Pickup
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusChange(request._id, 'Cancelled')}
                  >
                    Cancel
                  </button>
                </>
              )}
              {request.status === 'Approved' && (
                <button
                  className="btn btn-primary"
                  onClick={() => openScheduleModal(request)}
                >
                  Schedule Pickup
                </button>
              )}
              {request.status === 'Scheduled' && (
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusChange(request._id, 'Completed')}
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Schedule Pickup</h2>
            <div className="form-group">
              <label>Pickup Date</label>
              <input
                type="datetime-local"
                value={scheduleData.pickupDate}
                onChange={(e) => setScheduleData({ ...scheduleData, pickupDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Assigned Personnel</label>
              <input
                type="text"
                value={scheduleData.assignedPersonnel}
                onChange={(e) => setScheduleData({ ...scheduleData, assignedPersonnel: e.target.value })}
                required
                placeholder="Enter personnel name"
              />
            </div>
            <div className="form-group">
              <label>Admin Notes</label>
              <textarea
                value={scheduleData.adminNotes}
                onChange={(e) => setScheduleData({ ...scheduleData, adminNotes: e.target.value })}
                placeholder="Optional notes"
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSchedule}>
                Schedule
              </button>
              <button className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

