import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Styles/Admin/BlogDetailBlogExpansion.css"; // ✅ updated CSS file name
import Sidebar from "../Sidebar";

function Adminuserblogexpansion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/blog/${id}`);
        setBlog(res.data.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div className="blogdetail-loading">Loading blog...</div>;



  return (
    <div className="BlogDetailBlogExpansion">
      <div className="blogdetail-container">
        <Sidebar />
        <div className="blogdetail-content">
          <div className="blogdetail-header">
            <h1>{blog.title}</h1>
          </div>

          <img
            src={`http://localhost:5000/${blog.image}`}
            alt="Blog"
            className="blogdetail-image"
          />

          <div className="blogdetail-meta">
            <span>
              Author: <strong>{blog.user?.fullname || "Unknown"}</strong>
            </span>
            <span>
              Views: <strong>{blog.views}</strong>
            </span>
          </div>

          <p className="blogdetail-description">{blog.description}</p>
          <p className="blogdetail-content-text">{blog.content}</p>
        </div>
      </div>
    </div>
  );
}

export default Adminuserblogexpansion;
