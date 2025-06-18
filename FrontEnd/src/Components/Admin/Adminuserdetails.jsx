import React, { useEffect, useState } from 'react';
import "../../Styles/Admin/Adminuserdetails.css";
import axios from 'axios';
import Sidebar from '../Sidebar'; // Adjust path if needed
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { MdVisibility } from "react-icons/md";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function Adminuserdetails() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userdetails, setUserDetails] = useState([]);
  const [selecteduser, setSelectedUser] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [userblogdetails, setUserBlogDetails] = useState([]);
  const navigate = useNavigate()

  // New states for Profile Popup
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileUser, setProfileUser] = useState(null);


  // Fetch all users
  const fetchDetails = async () => {
    try {
      const cat = await axios.get("http://localhost:5000/fetchuserdetails");
      setUserDetails(cat.data.data);
    } catch (error) {
      console.log("fetch user details failed frontend");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // Show Edit Modal with user data
  const handleShowEdit = async (id) => {
    setShowEditModal(true);
    try {
      const res = await axios.get(`http://localhost:5000/edituserdetails/${id}`);
      setSelectedUser(res.data.data);
    } catch (error) {
      console.log("Fetch user details failed frontend", error);
    }
  };

  // Update user status
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/updateuserdetails/${selecteduser._id}`, selecteduser);
      console.log("Updated:", res.data);
      fetchDetails();
      setShowEditModal(false);
    } catch (error) {
      console.log("Update failed", error);
    }
  };

  // Show Profile Popup with user data
  const handleProfileShow = async (user) => {
    try {
      setProfileUser(user);
      setShowProfilePopup(true);

      const cat = await axios.get(`http://localhost:5000/userblogdetails/${user._id}`);
      setUserBlogDetails(cat.data.data);
    } catch (error) {
      console.error("Error loading profile blogs:", error);
    }
  };


  // Close profile popup
  const handleProfileClose = () => {
    setShowProfilePopup(false);
    setProfileUser(null);
  };

  // Filter users for search
  const filteredUsers = userdetails.filter(user =>
    user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleBlogDisplay = (id) => {
    const blogId = id
    try {

      // navigate(`/adminuserblogdetails/${blogId}`);
    }
    catch (error) {

    }}
    return (
      <div className='Adminuserdetails-container'>
        <Sidebar />

        <div className='Adminuserdetails-main'>
          <div className='Adminuserdetails-sub'>

            {/* Search Bar */}
            <div className="searchBox">
              <form className="Adminuserdetails-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="searchInput"
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="searchButton" type="submit">🔍</button>
              </form>
            </div>

            {/* Users Table */}
            <table className='Adminuserdetails-table'>
              <thead className='Adminuserdetails-table-heading'>
                <tr>
                  <th>Profile</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Edit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className='Adminuserdetails-table-body'>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <img
                        src={`http://localhost:5000/${user.profileImage}`}
                        alt="profile"
                        style={{ borderRadius: "50%", cursor: "pointer" }}
                        height={"30rem"}
                        width={"30rem"}
                        onClick={() => handleProfileShow(user)}
                      />
                    </td>
                    <td>{user.email}</td>
                    <td>{user.fullname}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleShowEdit(user._id)}>
                        Edit
                      </Button>
                    </td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Edit Modal */}
 <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="emailInput">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    autoFocus
                    name="email"
                    value={selecteduser.email || ""}
                    onChange={(e) => setSelectedUser({ ...selecteduser, email: e.target.value })}
                    disabled={true}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="nameInput">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    value={selecteduser.fullname || ""}
                    onChange={(e) => setSelectedUser({ ...selecteduser, fullname: e.target.value })}
                    disabled={true}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="statusSelect">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={selecteduser.status || ""}
                    onChange={(e) => setSelectedUser({ ...selecteduser, status: e.target.value })}
                  >
                    <option value="active">active</option>
                    <option value="deactive">deactive</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>


            {/* Profile Popup */}
            {showProfilePopup && profileUser && (
              <div className="profile-popup-overlay" onClick={handleProfileClose} style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 1000,
              }}>
                <div className="profile-popup" onClick={e => e.stopPropagation()} style={{
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  width: '50rem',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }}>
                  <button style={{ float: 'right', cursor: 'pointer' }} onClick={handleProfileClose}>X</button>
                  <div className="profile-container">
                    <div className="profile-header" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <img
                        src={`http://localhost:5000/${profileUser.profileImage}`}
                        alt="Profile"
                        className="profile-avatar"
                        style={{ width: 80, height: 80, borderRadius: '50%' }}
                      />
                      <div className="profile-details">
                        <h2>{profileUser.fullname || "User"}</h2>
                        <p className="email">{profileUser.email}</p>
                        <div className="tags">
                          <span className="tag">User</span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-tabs" style={{ marginTop: 20, display: 'flex', gap: 20, justifyContent: 'center' }}>

                      <span>
                        MyBlogs
                      </span>
                    </div>


                    <div className="myblogs-grid">
                      {userblogdetails.length === 0 ? (
                        <p>No blogs created by you yet.</p>
                      ) : (
                        userblogdetails.map((blog, index) => (
                          <div className="myblogs-card-wrapper" key={index}>
                            <div className="myblogs-card" onClick={handleBlogDisplay(blog._id)}>
                              <div
                                className="myblogs-image-wrapper"
                                onClick={() => handleBlogClick(blog._id)}
                              >
                                <img
                                  className="myblogs-image"
                                  src={`http://localhost:5000/${blog.image}`}
                                  alt="Blog"
                                />
                              </div>

                              <div className="myblogs-content">
                                <h4
                                  className="myblogs-title"
                                  onClick={() => handleBlogClick(blog._id)}
                                >
                                  {blog.title.length > 30
                                    ? blog.title.slice(0, 30) + "..."
                                    : blog.title}
                                </h4>

                                <div className="myblogs-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <span className="myblogs-category">{blog.category}</span>

                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div
                                      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                                      onClick={() => toggleLike(blog._id)}
                                    >
                                      {blog.isLiked ? (
                                        <AiFillHeart style={{ color: "red" }} />
                                      ) : (
                                        <AiOutlineHeart />
                                      )}
                                      <span style={{ marginLeft: "4px" }}>{blog.likes || 0}</span>
                                    </div>

                                    <span className="myblogs-views">
                                      <MdVisibility className="myblogs-view-icon" />
                                      {blog.views || 0}
                                    </span>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    );
  }

export default Adminuserdetails;







