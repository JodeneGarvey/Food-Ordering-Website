import React, {useState} from 'react'
import "./CSS/ForgotPassword.css";

const ForgotPassword = () => {
  
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();

        if (!email || !newPassword) {
        setMessage("Please fill all fields");
        return;
        }

        try {
        const res = await fetch(
            "https://localhost:7156/api/Customers/forgotPassword",
            {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: newPassword
          })
        }
      );

      const result = await res.json();

      setMessage(result.statusMessage);

    } catch (err) {
      console.error(err);
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleReset}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">Reset Password</button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword