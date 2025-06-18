import React, { useState, useEffect } from "react";
import "../../Styles/HomeLandingpage.css";
import { MdVisibility } from "react-icons/md";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import API from "../../config";
function HomeLandingpage({ searchTerm }) {
  const [values, setValues] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
   const navigate = useNavigate();  

const searchQuery = searchTerm?.toLowerCase() || "";

const filteredBlogs = values.filter((item) =>
  
  item.title.toLowerCase().includes(searchQuery),
  // item.user.category.toLowerCase().includes(searchQuery)
);


  const displayMyBlogs = async () => {
    try {
      const userId = localStorage.getItem("userid");
      const res = await axios.get(`${API}/displayhomeblogs?userId=${userId}`);
      setValues(res.data.data);

      // Extract which blogs are already liked
      const liked = res.data.data
        .filter(blog => blog.isLiked)
        .map(blog => blog._id);

      setLikedBlogs(liked); // 💡 Initialize from server
    } catch (error) {
      console.log("display homeblogs frontend issue");
    }
  };


  useEffect(() => {
    displayMyBlogs();
    console.log(values)
    const user = localStorage.getItem("userDetails");
    if (!user) {
      navigate("/loginpage");
    }
  }, []);

  const toggleLike = async (e, blogId) => {
    e.preventDefault(); // prevent link navigation
    const userId = localStorage.getItem("userid");
    try {
      await axios.post(`${API}/updatelikecount`, {
        blogId,
        userId,
      });

      // update local UI
      setValues((prev) =>
        prev.map((item) =>
          item._id === blogId
            ? {
              ...item,
              likes: likedBlogs.includes(blogId)
                ? item.likes - 1
                : item.likes + 1,
            }
            : item
        )
      );

      if (likedBlogs.includes(blogId)) {
        setLikedBlogs(likedBlogs.filter((id) => id !== blogId));
      } else {
        setLikedBlogs([...likedBlogs, blogId]);
      }
    } catch (err) {
      console.log("Like toggle failed", err);
    }
  };

  const handleBlogClick = async (blogId) => {
    const userId = localStorage.getItem("userid");
    try {
      await axios.post(`${API}/updateviewcount`, {
        blogId,
        userId,
      });
      navigate(`/blog/${blogId}`);
    } catch (error) {
      console.log("Error updating view count", error);
      navigate(`/blog/${blogId}`);
    }
  };

  return (
    <div className="HomeLandingpage-main">
      <div className="HomeLandingpage-sub">
        {filteredBlogs.map((item, index) => {
          const isLiked = likedBlogs.includes(item._id);



          return (
            <div className="HomeLandingpage-card" key={index}>
              <div
                style={{ textDecoration: "none", cursor: "pointer" }}
                onClick={() => handleBlogClick(item._id)}
              >
                <img
                  className="HomeLandingpage-card-img"
                  src={`${API}/${item.image}`}

                />
              </div>
              <div className="HomeLandingpage-card-content">
                <div
                  style={{ textDecoration: "none", cursor: "pointer" }}
                  onClick={() => handleBlogClick(item._id)}
                >
                  <h4 className="HomeLandingpage-card-title">{item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title}</h4>
                </div>
                <div className="HomeLandingpage-card-footer">
                  {/* ❤️ Like */}
                  <div
                    className="HomeLandingpage-like"
                    onClick={(e) => toggleLike(e, item._id)}
                  >
                    {isLiked ? (
                      <AiFillHeart
                        key="liked"
                        className="HomeLandingpage-like-icon liked"
                      />
                    ) : (
                      <AiOutlineHeart
                        key="unliked"
                        className="HomeLandingpage-like-icon"
                      />
                    )}
                    <span style={{ marginLeft: "6px" }}>{item.likes || 0}</span>
                  </div>

                  {/* 👁️ Views */}
                  <div className="HomeLandingpage-views">
                    <MdVisibility className="HomeLandingpage-view-icon" />
                    <span>{item.views}</span>
                  </div>

                  {/* ✍️ Author */}
                  
                  <div
                    className="HomeLandingpage-author"
                    onClick={() => navigate(`/profile/${item.user._id}`)}
                  >
                    <img
                      src={`${API}/${item.user.profileImage}`}
                      style={{ borderRadius: "50%", cursor: "pointer" }}
                      height={"30rem"}
                      width={"30rem"}
                    />
                    &nbsp;{item.user?.fullname || "Unknown"}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomeLandingpage;
