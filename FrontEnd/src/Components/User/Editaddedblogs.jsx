import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Styles/Editaddedblogs.css";
import Navbarcomponent from "../Navbarcomponent"; // ✅ adjust path if needed
import API from "../../config";
function Editaddedblogs() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    content: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API}/blog/${id}`);
        const blog = res.data.data;
        setFormData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
          content: blog.content,
        });
        setImagePreview(`${API}/${blog.image}`);
      } catch (error) {
        console.error("Error fetching blog for edit:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const updatedBlog = new FormData();
    updatedBlog.append("title", formData.title);
    updatedBlog.append("description", formData.description);
    updatedBlog.append("category", formData.category);
    updatedBlog.append("content", formData.content);
    if (imageFile) updatedBlog.append("image", imageFile);

    try {
      await axios.post(`${API}/blog/update/${id}`, updatedBlog, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Blog updated successfully!");
      setTimeout(() => navigate(`/blog/${id}`), 1500);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbarcomponent /> {/* ✅ Navbar added */}
      <div className="Editaddedblogs-container">
        <form className="Editaddedblogs-card" onSubmit={handleSubmit}>
          <h2>Edit Blog</h2>

          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Tech">Tech</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Anime">Anime</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Health">Health</option>
            <option value="Fitness">Fitness</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Fashion">Fashion</option>
            <option value="Personal">Personal</option>
            <option value="Photography">Photography</option>
            <option value="DIY">DIY</option>
            <option value="Parenting">Parenting</option>
            <option value="Gaming">Gaming</option>
            <option value="Politics">Politics</option>
            <option value="Environment">Environment</option>
            <option value="Spirituality">Spirituality</option>
            <option value="Books">Books</option>
            <option value="News">News</option>
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>

          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="edit-image-preview"
            />
          )}

          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Blog"}
          </button>

          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </form>
      </div>
    </>
  );
}

export default Editaddedblogs;
