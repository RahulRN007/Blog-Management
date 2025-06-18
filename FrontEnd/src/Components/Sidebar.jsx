import React, { useState } from 'react';
import { FaHome, FaUser, FaBlog, FaBars } from 'react-icons/fa';
import '../../src/Styles/Sidebar.css';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <FaBars size={24} />
      </button>

      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-logo">
          <img
            alt="logo"
            src="../../src/assets/logo.png"
            width="90"
            height="90"
            className="d-inline-block align-top"
          />
          <span className="logoname-soul">Soul</span>
          <span className="logoname-sync">Sync</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/admindashboard">
              <li>
                <FaHome className="sidebar-icon" size={20} />
                <span className='sidebar-options'>Home</span>
              </li>
            </Link>
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/adminuserdetails">
              <li>
                <FaUser className="sidebar-icon" size={20} />
                <span className='sidebar-options'>Profiles</span>
              </li>
            </Link>
            <Link style={{ textDecoration: "none", color: "inherit" }} to="/adminblogdetails">
              <li>
                <FaBlog className="sidebar-icon" size={20} />
                <span className='sidebar-options'>Blogs</span>
              </li>
            </Link>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
