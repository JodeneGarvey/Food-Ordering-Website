import React, {useState, useEffect} from 'react'
import "./CSS/FoodDetails.css";
import { useNavigate, useParams } from 'react-router-dom';

const FoodDetails = () => {
  
   const { id } = useParams();

   const navigate = useNavigate();

  const [food, setFood] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => {
  setQuantity(prev => prev + 1);
};

const decreaseQty = () => {
  if (quantity > 1) {
    setQuantity(prev => prev - 1);
  }
};

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    try {
      const res = await fetch(
        `https://localhost:7156/api/Food/getFoodById/${id}`
      );
      const data = await res.json();

      console.log("FOOD DETAILS:", data);

      setFood(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    return;
  }

  const price = Number(food.price || food.Price);

  const payload = {
    CustomerID: user.id || user.ID,
    FoodID: food.id || food.ID,
    Price: price,
    Quantity: quantity,
    TotalPrice: price * quantity
  };

  console.log("FINAL PAYLOAD:", payload);

  try {
    const res = await fetch(
      "https://localhost:7156/api/Food/addToCart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await res.json();

    alert(result.statusMessage);
    window.dispatchEvent(new Event("cartUpdated"));

    let currentCount = Number(localStorage.getItem("cartCount")) || 0;
    localStorage.setItem("cartCount", currentCount + quantity);

    // 🔥 trigger UI update
    window.dispatchEvent(new Event("cartUpdated"));

  } catch (err) {
    console.error(err);
    alert("Error adding to cart");
  }
};
  if (!food) return <h2>Loading...</h2>;

  return (
    <div className="food-details">

     
      <div className="food-card">

        <img
          src={`https://localhost:7156${food.imageUrl || food.ImageUrl}`}
          alt={food.foodName}
        />

        <div className="food-info">
          <h1>{food.foodName || food.FoodName}</h1>

          <p className="description">
            {food.description || food.Description}
          </p>

          <h2>${food.price || food.Price}</h2>

          <div className="quantity-container">
            <button onClick={decreaseQty}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQty}>+</button>
          </div>

          <button className="add-cart-btn" onClick={addToCart} disabled={!localStorage.getItem("user")}>
            Add to Cart
          </button>
        </div>

        
      </div>
        <div className='backmenu'>
          <button className='backtomenubutton' onClick={() => navigate("/menu")}>Back to Menu</button>
        </div>
           
    </div>
  )
}

export default FoodDetails