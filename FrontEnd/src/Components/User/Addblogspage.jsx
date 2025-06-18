import React, { useState } from "react";
import axios from "axios";
import "../../Styles/Addblogspage.css";
import Navbarcomponent from "../Navbarcomponent"; // ✅ Import navbar

function Addblogspage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    content: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userid");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.content
    ) {
      setMessage("Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("content", formData.content);
      if (formData.image) data.append("image", formData.image);
      data.append("user", userId);

      const res = await axios.post(
        "http://localhost:5000/savecreatedblogs",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.msg || "Blog uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        content: "",
      });
      setImagePreview("");
    } catch (error) {
      console.error(error);
      setMessage("Error uploading blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbarcomponent /> {/* ✅ Navbar added here */}
      <div className="blogform-page-container">
        <div className="blogform-container">
          <form className="blogform-card" onSubmit={handleSubmit}>
            <h2>Create New Blog</h2>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short blog summary"
              required
            />

            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
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
                style={{
                  marginTop: "10px",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "0.75rem",
                  border: "1px solid #ccc",
                }}
              />
            )}

            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your full blog content here..."
              rows="6"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish"}
            </button>

            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Addblogspage;
