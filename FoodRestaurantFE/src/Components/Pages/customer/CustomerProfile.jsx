import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CSS/CustomerProfile.css";

const CustomerProfile = () => {

  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?.ID;

  useEffect(() => {
    if (userId) {
      fetchCustomer();
    }
  }, [userId]);

  const fetchCustomer = async () => {
    try {
      const res = await fetch(
        `https://localhost:7156/api/Customers/getProfile/${userId}`
      );

      const data = await res.json();

      console.log("PROFILE DATA:", data);

      setCustomer(data);

    } catch (err) {
      console.error(err);
    }
  };

  const deleteCustomer = async (id) => {
  try {
    const res = await fetch(
      `https://localhost:7156/api/Customers/deleteCustomer/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) throw new Error("Delete failed");

    // ✅ CLEAR USER SESSION    
    localStorage.removeItem("user");

    // ✅ NOTIFY NAVBAR
    window.dispatchEvent(new Event("userChanged"));

    // ✅ REDIRECT TO REGISTER PAGE
    navigate("/registration");

  } catch (err) {
    console.error(err);
    alert("Error deleting account");
  }
};

  const editCustomerCredentials = () => {
    navigate(`/updateprofile/${userId}`);
  };

  if (!customer) return <h2>Loading...</h2>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="title">Customer Profile</h2>

        <div className="profile-body">
          <div className="info">
            <span>First Name:</span>
            <p>{customer.firstName || customer.FirstName}</p>
          </div>

          <div className="info">
            <span>Last Name:</span>
            <p>{customer.lastName || customer.LastName}</p>
          </div>

          <div className="info">
            <span>Email:</span>
            <p>{customer.email || customer.Email}</p>
          </div>
        </div>

        <div className="button-group">
            <button className="edit-btn" onClick={editCustomerCredentials}>
            Change Credentials
            </button>

            <button className="delete-btn" onClick={() => deleteCustomer(customer.id || customer.ID)} >
            Delete Account
            </button>
        </div>

       
      </div>
    </div>
  );
};

export default CustomerProfile;