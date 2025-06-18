import React, { useEffect, useState } from 'react';
import "../../Styles/Admin/Adminblogdetails.css";
import Sidebar from '../Sidebar'; // Adjust path if needed
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const blogData = [
    {
        profile: "https://via.placeholder.com/40",
        title: "The Rise of React",
        category: "Frontend",
        owner: "Rahul Nath",
    },
    {
        profile: "https://via.placeholder.com/40",
        title: "Backend Scaling Tips",
        category: "Backend",
        owner: "Krishna R",
    },
    {
        profile: "https://via.placeholder.com/40",
        title: "UX Design Basics",
        category: "UI/UX",
        owner: "Sara Thomas",
    },
];

function Adminblogdetails() {
    const [blogdetails, setBlogdetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredBlogs = blogdetails.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) // add optional chaining
    );


    const [modal, setModal] = useState({});
    const [show, setShow] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);






    const fetchDetails = async () => {
        try {
            const cat = await axios.get("http://localhost:5000/fetchblogdetails");
            setBlogdetails(cat.data.data);
        } catch (error) {
            console.log("fetch user details failed frontend");
        }
    };


    const handleDelete = async () => {
        setShow(false)
        try {
            const cat = await axios.post("http://localhost:5000/deleteblog", { id: selectedBlogId });
            console.log(cat.data.data)
             if (cat.data.msg == "Blog Deleted successfully") {
                alert("successfully deleted")
                fetchDetails();
            }
        } catch (error) {
            console.log("fetch user details failed frontend");
        }

    }

    useEffect(() => {
        fetchDetails()
    }, [])

    return (
        <div className='Adminblogdetails-container'>
            <Sidebar />

            <div className='Adminblogdetails-main'>
                <div className='Adminblogdetails-sub'>

                    {/* Styled Search Bar (like Adminuserdetails) */}
                    <div className="searchBox">
                        <form className="Adminblogdetails-form" onSubmit={(e) => e.preventDefault()}>
                            <input
                                className="searchInput"
                                type="text"
                                placeholder="Search by title, category, or owner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="searchButton" type="submit">🔍</button>
                        </form>
                    </div>

                    {/* Blog Table */}
                    <table className='Adminblogdetails-table'>
                        <thead className='Adminblogdetails-table-heading'>
                            <tr>
                                <th>Profile</th>
                                <th>Blog Title</th>
                                <th>Category</th>
                                <th>Owner</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBlogs.length > 0 ? (
                                filteredBlogs.map((blog, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img
                                                src={`http://localhost:5000/${blog.user.profileImage}`}
                                                alt="profile"
                                                style={{ borderRadius: "50%" ,backgroundSize:"contain"}}
                                                height={"30rem"}
                                                width={"30rem"}
                                                
                                            /><span></span>
                                        </td>
                                        <td>{blog.title}</td>
                                        <td>{blog.category}</td>
                                        <td>{blog.user.fullname}</td>
                                        <td><Button
                                            className='Adminblogdetails-table-body-buttons'
                                            onClick={() => {
                                                setSelectedBlogId(blog._id);
                                                setShow(true);
                                            }}
                                        >
                                            Delete
                                        </Button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No blogs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Modal show={show} onHide={handleClose} animation={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Blog Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure? Delete the blog?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                No
                            </Button>
                            <Button variant="primary" onClick={handleDelete}>
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Adminblogdetails;
