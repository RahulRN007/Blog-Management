import React, { useState, useEffect } from "react";
import "../../Styles/Profilepage.css";
import defaultAvatar from "../../assets/bg4.jpg";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MdVisibility } from "react-icons/md";
import Navbarcomponent from "../Navbarcomponent"; // ✅ Make sure path is correct

function Profilepage() {
  const [profileImage, setProfileImage] = useState(defaultAvatar);
  const [activeTab, setActiveTab] = useState("MyBlogs");
  const [profiledetails, setProfileDetails] = useState(null);
  const [myBlogs, setMyBlogs] = useState([]);

  const navigate = useNavigate();
  const { id: profileUserId } = useParams();
  const loggedInUserId = localStorage.getItem("userid");
  const isOwnProfile = profileUserId === loggedInUserId;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
      const formData = new FormData();
      formData.append("profileImage", file);
      try {
        await axios.post(`http://localhost:5000/updateprofileimage/${loggedInUserId}`, formData);
      } catch (err) {
        console.log("Error uploading image:", err);
      }
    }
  };

  const displayUserProfileDetails = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/displayuserprofiledetails/${profileUserId}`);
      setProfileDetails(res.data.data);
    } catch (error) {
      console.log("Error fetching profile details:", error);
    }
  };

  const displayMyBlogsProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/displaymyblogs/${profileUserId}`);
      setMyBlogs(res.data.data);
    } catch (error) {
      console.log("Error fetching my blogs:", error);
    }
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  useEffect(() => {
    if (!loggedInUserId) {
      navigate("/loginpage");
      return;
    }
    displayUserProfileDetails();
    displayMyBlogsProfile();
  }, [profileUserId]);

  useEffect(() => {
    if (profiledetails?.profileImage) {
      setProfileImage(`http://localhost:5000/${profiledetails.profileImage}`);
    }
  }, [profiledetails]);

  return (
    <>
      <Navbarcomponent /> {/* ✅ Navbar included at top */}
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
           <div className="profile-header-row">
  <div className="profile-avatar-wrapper">
    <img src={profileImage} alt="Profile" className="profile-avatar" />
    {isOwnProfile && (
      <>
        <label htmlFor="avatarUpload" className="avatar-edit-icon" title="Upload new image">📷</label>
        <input
          type="file"
          id="avatarUpload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </>
    )}
  </div>

  <div className="profile-info-section">
    <h2 className="profile-name">{profiledetails?.fullname || "User"}</h2>
    

    <div className="follow-stats-box">
      <div className="follow-box">
        <span className="follow-count">{profiledetails?.followersCount || 0}</span>
        <span className="follow-label">Followers</span>
      </div>
      <div className="follow-box">
        <span className="follow-count">{profiledetails?.followingCount || 0}</span>
        <span className="follow-label">Following</span>
      </div>
    </div>

    <div className="tags">
      <span className="tag">User</span>
      {!isOwnProfile && (
        <button className="follow-button">
          <span className="follow-icon">+</span>
          Follow
        </button>
      )}
    </div>
  </div>
</div>



          </div>

          <div className="profile-tabs">
            {isOwnProfile && (
              <span
                className={activeTab === "Profile" ? "active" : ""}
                onClick={() => setActiveTab("Profile")}
              >
                Profile
              </span>
            )}
            <span
              className={activeTab === "MyBlogs" ? "active" : ""}
              onClick={() => setActiveTab("MyBlogs")}
            >
              MyBlogs
            </span>
          </div>

          {isOwnProfile && activeTab === "Profile" && (
            <div className="profile-form section-box">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={profiledetails?.fullname || ""} readOnly={!isOwnProfile} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={profiledetails?.email || ""} readOnly={!isOwnProfile} />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value="@Heythomas" readOnly={!isOwnProfile} />
              </div>
              {isOwnProfile && (
                <div className="form-buttons">
                  <button className="btn outline">Discard</button>
                  <button className="btn">Save Changes</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "MyBlogs" && (
            <div className="myblogs-grid">
              {myBlogs.length === 0 ? (
                <p>No blogs created by this user yet.</p>
              ) : (
                myBlogs.map((blog, index) => (
                  <div className="myblogs-card-wrapper" key={index}>
                    <div className="myblogs-card">
                      <div className="myblogs-image-wrapper" onClick={() => handleBlogClick(blog._id)}>
                        <img
                          className="myblogs-image"
                          src={`http://localhost:5000/${blog.image}`}
                          alt="Blog"
                        />
                      </div>
                      <div className="myblogs-content">
                        <h4 className="myblogs-title" onClick={() => handleBlogClick(blog._id)}>
                          {blog.title.length > 30 ? blog.title.slice(0, 30) + "..." : blog.title}
                        </h4>
                        <div className="myblogs-info">
                          <span className="myblogs-category">{blog.category}</span>
                          <span className="myblogs-views">
                            <MdVisibility className="myblogs-view-icon" />
                            {blog.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profilepage;
