import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import "./CSS/CustomerList.css";


const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const res = await fetch("https://localhost:7156/api/Admin/getCustomer");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };
const editCustomerType = (id) => {
  navigate(`/editcustomertype/${id}`);
};
  


  return (
    <div className="admin-customer">
      <h1>Customer List</h1>

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.length > 0 ? (
            customers.map((item) => (
              <tr key={item.ID || item.id}>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{item.type}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => editCustomerType(item.id)}
                  
                >
                  <FaEdit /> Edit
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No customers found</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;