import React, { useState } from 'react';
import "../../Styles/Createaccountpage.css";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios" 
import { Navigate } from 'react-router-dom';
import API from "../../config";
function Createaccountpage() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prevData => ({
      ...prevData,
      [name]: value
    }));
    console.log(values);
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(values)
    try {
      const cat = await axios.post(`${API}/userdetailssave`, values)
      if (cat.data.msg == "User Data Saved successfully") {
        navigate("/loginpage")
      }

    }
    catch (error) {
      console.log('error', error)
    }
  }
  return (
    <div className="Createaccountpage-main">
      <div className="Createaccountpage-sub">

        {/* Left Section (Form) */}
        <div className="Createaccountpage-form">
          <img src={logo} className="Createaccountpage-login-logo" alt="logo" />
          <div className="Createaccountpage-text-center">
            <h4>Create your <span className="Createaccountpage-logoname-soul">Soul</span><span className="Createaccountpage-logoname-sync">Sync</span> Account</h4>
            <p>Join the rhythm of creativity</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Full Name" value={values.fullname} name='fullname' onChange={handleChange} />
            <input type="email" placeholder="Email" value={values.email} name='email' onChange={handleChange} />
            <input type="password" placeholder="Password" value={values.password} name='password' onChange={handleChange} />
            <input type="password" placeholder="Confirm Password" value={values.confirmpassword} name='confirmpassword' onChange={handleChange} />
            <button className="Createaccountpage-create-btn" type="submit">CREATE ACCOUNT</button>
          </form>

          <p className="Createaccountpage-login-link">
            Already have an account? <Link to="/loginpage"><button>LOG IN</button></Link>
          </p>
        </div>

        {/* Right Section (Info) */}
        <div className="Createaccountpage-right-section">
          <div className="Createaccountpage-right-section-inner">
            <h4 className="Createaccountpage-slogan">Start your blogging journey</h4>
            <p>
              SoulSync empowers writers and creators to express themselves with style and intention. Set up your account and start shaping your digital voice today.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Createaccountpage;
