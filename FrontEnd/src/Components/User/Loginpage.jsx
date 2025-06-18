import React, { useState } from 'react'
import "../../Styles/Loginpage.css";
import logo from "../../assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate()
  const [email,setEmail] = useState([])
 const [password,setPassword] = useState([])

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:5000/userloginverification", { email, password });
    const { msg, data, token } = response.data;

    if (msg === "Account Successfully found") {
      alert("Successfully Logged In");

      // ✅ Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("userid", data._id);
      localStorage.setItem("userDetails", JSON.stringify(data));

      navigate("/homelanding");
    } else {
      alert(msg);
    }
  } catch (error) {
    alert("Username or Password invalid");
  }
};



  return (
    <div className="loginpage-main">
      <div className="loginpage-sub">
        
        {/* Left Section */}
        <div className="loginpage-form">
           <img src={logo} className="loginpage-logo"
                 alt="logo" />
          <div className="loginpage-text-center">
            <h4>Welcome to <span className="loginpage-logoname-soul">Soul</span><span className="loginpage-logoname-sync">Sync</span></h4>
            <p>Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}} />
            <input type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <button className="loginpage-login-btn" type="submit">LOG IN</button>
            <p className="loginpage-forgot">Forgot password?</p>
          </form>

          <p className="loginpage-create-account">
            Don't have an account? <Link to="/signup"><button>CREATE NEW</button></Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="loginpage-right-section">
          <div className="loginpage-right-section-inner">
          <h4 className="loginpage-slogan">Where your words find rhythm</h4>
          <p>
SoulSync is your mindful space for managing blogs with ease and intention. Designed for creators who value clarity, connection, and creativity, SoulSync streamlines the blogging process — from drafting and editing to publishing and organizing.          </p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
