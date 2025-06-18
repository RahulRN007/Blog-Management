import React, { useState, useEffect } from "react";
import "../../Styles/Favoritespage.css";
import { MdVisibility } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbarcomponent from "../Navbarcomponent"; // ✅ Imported Navbar
import API from "../../config";
function Favoritespage() {
  const [favblogs, setFavBlogs] = useState([]);
  const userid = localStorage.getItem("userid");
  const userData = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();

  const favoriteBlogs = async () => {
    try {
      const cat = await axios.get(`${API}/favorites/${userid}`);
      setFavBlogs(cat.data.data);
    } catch (error) {
      console.log("favoriteblogs frontend issue");
    }
  };

  useEffect(() => {
    favoriteBlogs();
  }, []);

  return (
    <>
      <Navbarcomponent /> {/* ✅ Navbar added here */}
      <div className="Favorites-main">
        <div className="Favorites-sub">
          {favblogs.map((blog, index) => (
            <div className="Favorites-card" key={index}>
              <Link
                to={`/blog/${blog._id}`}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="Favorites-card-img"
                  src={`${API}/${blog.image}`}
                  alt={blog.title}
                />
              </Link>
              <div className="Favorites-card-content">
                <Link
                  to={`/blog/${blog._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <h4 className="Favorites-card-title">
                    {blog.title.length > 30
                      ? blog.title.slice(0, 30) + "..."
                      : blog.title}
                  </h4>
                </Link>
                <div className="Favorites-card-footer">
                  {/* ❤️ Likes */}
                  <div className="Favorites-like">
                    <AiFillHeart className="Favorites-like-icon liked" size={22} />
                    <span>{blog.likes}</span>
                  </div>

                  {/* 👁️ Views */}
                  <div className="Favorites-views">
                    <MdVisibility className="Favorites-view-icon" />
                    <span>{blog.views}</span>
                  </div>

                  {/* ✍️ Author */}
                  <div
                    className="Favorites-author"
                    onClick={() => navigate(`/profile/${blog.user._id}`)}
                  >
                    <img
                      src={`${API}/${blog.user.profileImage}`}
                      style={{ borderRadius: "50%", cursor: "pointer" }}
                      height={"30rem"}
                      width={"30rem"}
                    />
                    {blog.user?.fullname || "Unknown Author"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Favoritespage;
