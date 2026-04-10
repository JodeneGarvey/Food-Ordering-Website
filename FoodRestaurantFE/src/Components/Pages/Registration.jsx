import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
} from "react-icons/fa";
import "../Pages/CSS/Registration.css";
import { Navigate } from "react-router-dom";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData,SetFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    type:"User"
  })

  const changeHandler = (e) =>{
    SetFormData({...formData,[e.target.name]:e.target.value})
  }

  

  const [message, setMessage] = useState("");

  
    const Signup = async (e) => {
  e.preventDefault(); // 🔥 THIS STOPS PAGE RELOAD

  try {
    const response = await fetch('https://localhost:7156/api/Customers/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        Password: formData.password
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.statusCode === 200) {
      setMessage("Registration successful");
      window.location.replace("/login");
    } else {
      setMessage(data.statusMessage);
    }
  } catch (error) {
    console.error(error);
    setMessage("Something went wrong");
  }
};
  Navigate("/login");
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="brand">
            <FaShoppingBag className="brand-icon" />
            <h1>LET'S EAT</h1>
          </div>
          <h2>Create Account</h2>
          <p>
            Join us to explore amazing products, save your favorites, and enjoy
            a smooth shopping experience.
          </p>
        </div>

        <div className="register-right">
          <form className="register-form" onSubmit={Signup}>
            <h2>Registration</h2>

            <div className="input-group">
              <FaUser className="input-icon" />
              <input type="text" name="firstName" value={formData.firstName} placeholder="First Name" required onChange={changeHandler}/>
            </div>

            <div className="input-group">
              <FaUser className="input-icon" />
              <input type="text" name="lastName" value={formData.lastName} placeholder="Last Name" required onChange={changeHandler} />
            </div>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input type="email" name="email" value={formData.email} placeholder="Email Address" required onChange={changeHandler}/>
            </div>

            <div className="input-group password-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="Password"
                required
                onChange={changeHandler}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="input-group password-group">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                required onChange={changeHandler}
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="register-options">
              <label>
                <input type="checkbox" required />
                I agree to the terms and conditions
              </label>
            </div>

            <button type="submit" className="register-btn">
              Create Account
            </button>

            <p className="login-text">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </form>
           <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Registration;