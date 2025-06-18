import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap';
import { FaHome, FaUser, FaPlus, FaHeart, FaSearch, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../src/Styles/Navbarcomponent.css'; // Make sure this path is correct
import logo from "../../src/assets/logo.png"
function Navbarcomponent( { searchTerm, setSearchTerm  }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid");
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
  const username = userDetails.username || "User";
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/homelanding?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  const logout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("userid");
    navigate("/loginpage");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-main">
      <Container fluid>
        <Link to="/homelanding" className="navbar-brand d-flex align-items-center">
          <img
            alt="logo"
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
          />
          <span className="soul-text">Soul</span>
          <span className="sync-text">Sync</span>
        </Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/homelanding" className="nav-link">
              <FaHome className="me-1" /> Home
            </Link>
            <Link to="/myblogs" className="nav-link">
              <FaUser className="me-1" /> My Blogs
            </Link>
            <Link to="/addblogs" className="nav-link">
              <FaPlus className="me-1" /> Add Blogs
            </Link>
            <Link to="/favorites" className="nav-link">
              <FaHeart className="me-1" /> Favorites
            </Link>
          </Nav>

          <div className="d-flex align-items-center ">
            <div className="search-container me-3">
              
             <input
  type="text"
  placeholder="Search blogs"
 value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}

/><FaSearch className="search-icon" />


            </div>

            <div className="notification-icon me-3">
              <FaBell />
              <Badge pill bg="danger" className="notification-badge">
                3
              </Badge>
            </div>

            <NavDropdown
              title={
                <div className="profile-dropdown-toggle">
                  <div className="avatar-circle">
                      <img
                  src={`http://localhost:5000/${userDetails.profileImage}`}
                      style={{ borderRadius: "50%", cursor: "pointer" }}
                      height={"30rem"}
                      width={"30rem"}
                />
                  </div>
                  <span className="username">{userDetails.fullname}</span>
                </div>
              }
              align="end"
            >

              <Link to={`/profile/${userId}`} className="dropdown-item">
                <NavDropdown.Item href="#settings">
                  <FaUser className="me-2" />Profile
                </NavDropdown.Item></Link>
              <NavDropdown.Item href="#settings">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>
                <FaSignOutAlt className="me-2" /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarcomponent;