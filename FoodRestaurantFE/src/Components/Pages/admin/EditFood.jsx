import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/EditFood.css";

const EditFood = () => {
  
  const { id } = useParams(); // ✅ get ID from URL
  const navigate = useNavigate();

  const [food, setFood] = useState({
    foodName: "",
    price: "",
    type: "",
    available: false,
    quantity: "",
    description: "",
    imageUrl: "",
    imageFile: null
  });

  const [loading, setLoading] = useState(true);

  // ✅ FETCH FOOD BY ID
  useEffect(() => {
    if (id) {
      fetchFood();
    }
  }, [id]);

  const fetchFood = async () => {
    try {
     console.log("Fetching ID:", id); // ✅ debug

    const res = await fetch(`https://localhost:7156/api/Food/getFoodById/${id}`);
    const data = await res.json();

    console.log("API DATA:", data); // ✅ debug

    setFood({
      foodName: data.foodName || "",
      price: data.price || "",
      type: data.type || "",
      available: data.available || false,
      quantity: data.quantity || "",
      description: data.description || "",
      imageUrl: data.imageUrl || "",
      imageFile: null
    });

    setLoading(false);
  } catch (err) {
    console.error(err);
    alert("Error loading food");
  }
};


  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFood({
      ...food,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ✅ HANDLE IMAGE CHANGE
  const handleImageChange = (e) => {
    setFood({
      ...food,
      imageFile: e.target.files[0]
    });
  };

  // ✅ UPDATE FOOD
  const updateFood = async (e) => {
    e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("Id", id);
    formData.append("FoodName", food.foodName);
    formData.append("Price", parseFloat(food.price));
    formData.append("Quantity", parseInt(food.quantity));
    formData.append("Available", food.available.toString());
    formData.append("Type", food.type);
    formData.append("Description", food.description);

    // ✅ VERY IMPORTANT
    formData.append("ExistingImageUrl", food.imageUrl || "");

    if (food.imageFile) {
      formData.append("Image", food.imageFile);
    }

    const response = await fetch(
      "https://localhost:7156/api/Food/addUpdateFood",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.json();

    console.log("UPDATE RESULT:", result); // ✅ debug

    if (result.statusCode === 200) {
      alert("Food updated successfully!");
      navigate("/viewfood");
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
    <div className="edit-food">
      <h1>Edit Food</h1>

      <form className="edit-form" onSubmit={updateFood}>
        
        <div className="form-group">
          <label>Food Name</label>
          <input
            name="foodName"
            value={food.foodName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={food.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <input
            name="type"
            value={food.type}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="available"
              checked={food.available}
              onChange={handleChange}
            />
            Available
          </label>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={food.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={food.description}
            onChange={handleChange}
          />
        </div>

        {/* ✅ IMAGE PREVIEW */}
        <div className="form-group">
          <label>Current Image</label>
          {food.imageUrl && (
            <img
              src={`https://localhost:7156${food.imageUrl}`}
              alt="food"
              className="preview-img"
            />
          )}
        </div>

        {/* ✅ IMAGE UPLOAD */}
        <div className="form-group">
          <label>Change Image</label>
          <input
          type="file"
          onChange={(e) =>
          setFood({ ...food, imageFile: e.target.files[0] })
          }
/>
        </div>

        <button type="submit" className="update-btn">
          Update Food
        </button>
      </form>
    </div>
  );
};

export default EditFood;