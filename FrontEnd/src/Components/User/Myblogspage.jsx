import React, { useEffect, useState } from "react";
import "../../Styles/Myblogspage.css";
import { MdVisibility } from "react-icons/md";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbarcomponent from "../Navbarcomponent"; // ✅ Import navbar
import API from "../../config";
function Myblogspage() {
  const [values, setValues] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const navigate = useNavigate();

  const userid = localStorage.getItem("userid");
  const userData = JSON.parse(localStorage.getItem("userDetails"));

  const displayMyBlogs = async () => {
    try {
      const response = await axios.get(`${API}/displaymyblogs/${userid}`);
      setValues(response.data.data);
    } catch (error) {
      console.log("displaymyblogs frontend issue");
    }
  };

  useEffect(() => {
    displayMyBlogs();
  }, []);

  const toggleLike = (e, blogId) => {
    e.preventDefault();
    if (likedBlogs.includes(blogId)) {
      setLikedBlogs(likedBlogs.filter(id => id !== blogId));
    } else {
      setLikedBlogs([...likedBlogs, blogId]);
    }
  };

  return (
    <>
      <Navbarcomponent /> {/* ✅ Navbar placed here */}

      <div className="Myblogspage-main">
        <div className="Myblogspage-sub">
          {values.map((blog, index) => {
            const isLiked = likedBlogs.includes(blog._id);
            return (
              <Link to={`/blog/${blog._id}`} key={index} style={{ textDecoration: "none" }}>
                <div className="Myblogspage-card">
                  <img
                    className="Myblogspage-card-img"
                    src={`${API}/${blog.image}`}
                    alt=""
                    height={"30rem"}
                    width={"30rem"}
                  />
                  <div className="Myblogspage-card-content">
                    <h4 className="Myblogspage-card-title">
                      {blog.title.length > 30 ? blog.title.slice(0, 30) + "..." : blog.title}
                    </h4>
                    <div className="Myblogspage-card-footer">
                      <div
                        className="Myblogspage-like"
                        onClick={(e) => toggleLike(e, blog._id)}
                      >
                        {isLiked ? (
                          <AiFillHeart className="Myblogspage-like-icon liked" />
                        ) : (
                          <AiOutlineHeart className="Myblogspage-like-icon" />
                        )}
                        <span>{blog.likes}</span>
                      </div>

                      <div className="Myblogspage-views">
                        <MdVisibility className="Myblogspage-view-icon" />
                        <span>{blog.views}</span>
                      </div>

                      <div className="Myblogspage-author">
                        <img
                          src={`${API}/${blog.user.profileImage}`}
                          style={{ borderRadius: "50%", cursor: "pointer" }}
                          height={"30rem"}
                          width={"30rem"}
                        />
                        {blog.user.fullname}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Myblogspage;
