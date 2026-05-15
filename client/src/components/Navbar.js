import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ♻️ Smart e-Waste Management
        </Link>
        <div className="navbar-menu">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="navbar-link">
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                  <Link to="/create-request" className="navbar-link">
                    New Request
                  </Link>
                </>
              )}
              <span className="navbar-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

