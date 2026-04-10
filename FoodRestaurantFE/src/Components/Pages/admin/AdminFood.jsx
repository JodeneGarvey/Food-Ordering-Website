import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./CSS/AdminFood.css";


const AdminFood = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFood();
  }, []);

  const fetchFood = async () => {
    const res = await fetch("https://localhost:7156/api/Food/getFood");
    const data = await res.json();
    setFoods(data);
  };

  

  const deleteFood = async (id) => {
    await fetch(`https://localhost:7156/api/Food/deleteFood/${id}`, {
      method: "DELETE",
    });
    fetchFood();
  };

  const navigate = useNavigate();

const editFood = (id) => {
  navigate(`/editfood/${id}`);
};
  

  return (
  
    <div className="admin-food">
      <h1>Food Items</h1>
      <a href="/food" className="add-food-btn">+ Add Food</a>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Type</th>
            <th>Availability</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {foods.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={`https://localhost:7156${item.imageUrl}`}
                  alt={item.foodName}
                />
              </td>
              <td>{item.foodName}</td>
              <td>${item.price}</td>
              <td>{item.type}</td>
              <td>{item.available ? "Available" : "Out of Stock"}</td>
              <td className="action-buttons">
                <button 
                  className="edit-btn" 
                  onClick={() => editFood(item.id)}
                >
                  <FaEdit /> Edit
                </button>

                <button 
                  className="delete-btn" 
                  onClick={() => deleteFood(item.id)}
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFood;