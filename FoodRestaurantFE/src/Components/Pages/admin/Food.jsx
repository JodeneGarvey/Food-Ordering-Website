import React, { useState } from 'react'
import "./CSS/Food.css";
import {useNavigate} from "react-router-dom";

const Food = () => {
const [food, setFood] = useState({
    foodName: "",
    price: "",
    quantity: "",
    available: false,
    type: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;

  setFood({
    ...food,
    [name]: type === "checkbox" ? checked : value
  });
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("Id", 0); // for insert
  formData.append("FoodName", food.foodName);
  formData.append("Price", parseFloat(food.price || 0));
  formData.append("Quantity", parseInt(food.quantity || 0));
  formData.append("Available", food.available); // ✅ boolean
  formData.append("Type", food.type);
  formData.append("Description", food.description);
  formData.append("ExistingImageUrl", "");

  if (image) {
    formData.append("Image", image);
  }

  try {
    const response = await fetch("https://localhost:7156/api/Food/addUpdateFood", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);

    if (result.statusCode === 200) {
      setMessage("Food added successfully");
       navigate("/viewfood");
      setFood({
        foodName: "",
        price: "",
        quantity: 0,
        available: false,
        type: "",
        description: "",
      });
      setImage(null);
    } else {
      setMessage(result.statusMessage);
    }
  } catch (error) {
    setMessage("Something went wrong");
    console.error(error);
  }
};

  return (
    <>
    <div className="food-display-page">
      <div className="food-display-card">
        <h1>Add Food Item</h1>
        <p>Upload food details and image</p>

        <form className="food-form" onSubmit={submitHandler}>
          <input
            type="text"
            name="foodName"
            placeholder="Food Name"
            value={food.foodName}
            onChange={changeHandler}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={food.price}
            onChange={changeHandler}
            required
          />

        
        <select name="type" value={food.type} onChange={changeHandler} required>
          <option value="">-- Select Category --</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Side">Side</option>
          <option value="Main">Main</option>
        </select>
         
          <textarea
            name="description"
            placeholder="Description"
            value={food.description}
            onChange={changeHandler}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={imageHandler}
            required
          />

          <label>Availability</label>
          <input
            type="checkbox"
            name="available"
            checked={food.available}
            onChange={changeHandler}
          />

          <button type="submit">Save Food</button>
        </form>

        {message && <p className="food-message">{message}</p>}
      </div>
    </div>
    </>
  );
};

export default Food;