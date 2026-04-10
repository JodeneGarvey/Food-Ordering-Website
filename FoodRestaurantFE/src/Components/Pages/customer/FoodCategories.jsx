import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./CSS/FoodCategories.css";

const FoodCategories = () => {

   const navigate = useNavigate();

    const { type } = useParams(); // ✅ GET TYPE FROM URL

    const [foods, setFoods] = useState([]);

    useEffect(() => {
        if (type) {
        fetchFood();
        }
    }, [type]);
    
      const fetchFood = async () => {
        try {
         console.log("Fetching Type:", type); // ✅ debug
    
        const res = await fetch(`https://localhost:7156/api/Food/getFoodByType/${type}`);
        const data = await res.json();
    
        console.log("API DATA:", data); // ✅ debug
    
        setFoods(data);
    
      } catch (err) {
        console.error(err);
        alert("Error loading food");
      }
    };
    
  return (
    <div className="cat">
      <h1>Our {type} Dishes</h1>

      <div className="cat-grid">
  {foods.length > 0 ? (
    foods.map((item) => (
      <div className="cat-card" key={item.id}>
        
        <img
          src={`https://localhost:7156${item.imageUrl}`}
          alt={item.foodName}
        />

        <h3>{item.foodName}</h3>
        

        <div className="cat-footer">
          <button onClick={() => navigate(`/food/${item.id}`)}>View Item</button>
        </div>

      </div>
    ))
  ) : (
    <p>No food found</p>
  )}
</div>

      </div>
  )
}

export default FoodCategories