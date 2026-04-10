import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShoppingBag } from "react-icons/fa";
import "../Pages/CSS/Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

   


   const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7156/api/Customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: user.email,
          Password: user.password,
        }),
      });

      const result = await response.json();
       if (result.statusCode === 200) {
  localStorage.setItem("user", JSON.stringify(result.customer));

  if (result.customer.type === "Admin") {
    window.location.href = "/admindashboard";
  } else {
    window.location.href = "/";
  }
}

      if (result.statusCode === 200) {
        setMessage("Login successful");
        
        

        // store user
        localStorage.setItem("user", JSON.stringify(result.customer));


// ✅ FETCH REAL CART COUNT
const res = await fetch(`/api/Customers/getCart/${result.customer.id}`);
const data = await res.json();

const totalQty = data.reduce((sum, item) => sum + item.quantity, 0);

localStorage.setItem("cartCount", totalQty);
window.dispatchEvent(new Event("cartUpdated"));
      } else {
        setMessage(result.statusMessage);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };


  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="brand">
            <FaShoppingBag className="brand-icon" />
            <h1>LET'S EAT</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>
            Sign in to continue shopping, track your orders, and manage your account.
          </p>
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={submitHandler}>
            <h2>Login</h2>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input type="email" name="email" placeholder="Email Address" required  onChange={changeHandler}/>
            </div>

            <div className="input-group password-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required onChange={changeHandler}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="/forgotpassword">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>

            <p className="signup-text">
              Don’t have an account? <a href="/registration">Create one</a>
            </p>
          </form>
           <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;