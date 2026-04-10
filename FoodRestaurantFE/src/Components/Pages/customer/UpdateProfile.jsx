import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/Profile.css";

const UpdateProfile = () => {
  const { id } = useParams(); // ✅ get ID from URL
  const navigate = useNavigate();

  const [cus, setCus] = useState({
    email: "",
    password: ""

  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
     console.log("Fetching ID:", id); // ✅ debug

    const res = await fetch(`https://localhost:7156/api/Customers/getProfile/${id}`);
    const data = await res.json();

    console.log("API DATA:", data); // ✅ debug

    setCus({
      
      email: data.Email || "",
      password: ""
      
    });

    setLoading(false);
  } catch (err) {
    console.error(err);
    alert("Error loading customer");
  }
};


  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCus({
      ...cus,
      [name]: value
    });
  };

  

  // ✅ UPDATE Credentials
  const updateCredentials = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "https://localhost:7156/api/Customers/updateProfile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ID: parseInt(id),
          Email: cus.email,
          Password: cus.password
        })
      }
    );

    const result = await response.json();

    console.log("UPDATE RESULT:", result);

    if (result.statusCode === 200) {
      alert("Customer updated successfully!");
      navigate("/login");
    } else {
      alert(result.statusMessage);
    }

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
};



  if (loading) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Update Profile</h1>

        <form onSubmit={updateCredentials}>
          
         

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={cus.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={cus.password}
            onChange={handleChange}
          />

          <button type="submit">Update Profile</button>
        </form>

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
};

export default UpdateProfile;

