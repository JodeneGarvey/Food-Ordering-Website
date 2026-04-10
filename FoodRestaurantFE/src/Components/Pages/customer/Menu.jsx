import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Menu.css";

const Menu = () => {
  const [foods, setFoods] = useState([]);
   const navigate = useNavigate();

  useEffect(() => {
    fetchFood();
  }, []);

  const fetchFood = async () => {
    const res = await fetch("https://localhost:7156/api/Food/getFood");
    const data = await res.json();
    setFoods(data);
  };

  return (
    <div className="menu">
      <h1>Our Menu</h1>

      <div className="menu-grid">
        {foods.map((item) => (
          <div className="menu-card" key={item.id}>
            <img src={`https://localhost:7156${item.imageUrl}`} />

            <h3>{item.foodName}</h3>
            

            <div className="menu-footer">
              
              <button onClick={() => navigate(`/food/${item.id}`)}>View Item</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;