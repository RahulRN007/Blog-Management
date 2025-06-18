import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Styles/Blogdetailspage.css";
import Navbarcomponent from "../Navbarcomponent"; // ✅ adjust path if needed

function Blogdetailspage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const loggedInUserId = localStorage.getItem("userid");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/blog/${id}`);
        setBlog(res.data.data);
        setComments(res.data.data.comments || []);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  const isOwner = blog?.user && blog.user._id === loggedInUserId;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/blog/comment", {
        blogId: id,
        userId: loggedInUserId,
        commentText: newComment.trim(),
      });

      setComments((prev) => [...prev, response.data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  if (!blog) return <div className="loading">Loading blog...</div>;

  return (
    <>
      <Navbarcomponent /> {/* ✅ Navbar shown on blog details */}
      <div className="BlogDetailPage">
        <div className="blog-header">
          <h1>{blog.title}</h1>
          {isOwner && (
            <button
              className="edit-button"
              onClick={() => navigate(`/editOwnBlog/${blog._id}`)}
            >
              Edit ✏️
            </button>
          )}
        </div>

        <img
          src={`http://localhost:5000/${blog.image}`}
          alt="Blog"
          className="blog-detail-img"
        />

        <div className="blog-detail-meta">
          <span>
            Author:&nbsp;
            <img
              src={`http://localhost:5000/${blog.user?.profileImage}`}
              style={{ borderRadius: "50%", cursor: "pointer" }}
              height="30rem"
              width="30rem"
              alt="Profile"
            />{" "}
            <strong>{blog.user?.fullname || "Unknown"}</strong>
          </span>
          <span>
            Views: <strong>{blog.views}</strong>
          </span>
        </div>

        <p className="blog-description">{blog.description}</p>
        <p className="blog-content">{blog.content}</p>

        {/* 🗨️ Comment Section */}
        <div className="blog-comments-section">
          <h3>Comments</h3>

          <div className="comment-list">
            {comments.length === 0 && <p>No comments yet.</p>}
            {comments.map((cmt, index) => (
              <div className="comment-item" key={index}>
                <img
                  src={`http://localhost:5000/${cmt.user?.profileImage}`}
                  style={{ borderRadius: "50%", cursor: "pointer" }}
                  height="30rem"
                  width="30rem"
                  alt="Profile"
                />{" "}
                &nbsp;<strong>{cmt.user?.fullname || "Anonymous"}:</strong>{" "}
                {cmt.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Blogdetailspage;
