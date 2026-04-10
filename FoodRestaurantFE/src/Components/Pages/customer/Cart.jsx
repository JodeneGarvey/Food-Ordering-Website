import React, {useState, useEffect} from 'react'
import "./CSS/Cart.css";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [deliveryType, setDeliveryType] = useState("Pickup");
    const [address, setAddress] = useState("");
    const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?.ID;

  useEffect(() => {
    if (userId) {
      fetchCart();
      updateCartCount();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await fetch(
        `https://localhost:7156/api/Customers/getCart/${userId}`
      );

const data = await res.json();
      setCart(data);

    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (item, newQty) => {
  if (newQty < 1) return;

  try {
    await fetch(
      "https://localhost:7156/api/Customers/updateCartQuantity",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: item.id,
          quantity: newQty,
          totalPrice: item.price * newQty
        })
      }
    );

    fetchCart(); // refresh cart

  } catch (err) {
    console.error(err);
  }
};

const updateCartCount = async () => {
  try {
    const res = await fetch(
      `https://localhost:7156/api/Customers/getCart/${userId}`
    );

    const data = await res.json();

    const totalQty = data.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    localStorage.setItem("cartCount", totalQty);

    window.dispatchEvent(new Event("cartUpdated"));
  } catch (err) {
    console.error(err);
  }
};

  // ✅ REMOVE ITEM
  const removeItem = async (id) => {
    await fetch(
      `https://localhost:7156/api/Customers/removeFromCart/${id}`,
      {
        method: "DELETE"
      }
    );

    fetchCart(); // refresh

     // ✅ UPDATE COUNT AFTER REMOVE
  updateCartCount();
  };

   


  // ✅ TOTAL CALCULATION
  const grandTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  

const placeOrder = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    return;
  }

  if (deliveryType === "Delivery" && address.trim() === "") {
    alert("Please enter delivery address");
    return;
  }

  const payload = {
    CustomerID: user.id || user.ID,
    DeliveryType: deliveryType,
    DeliveryAddress: deliveryType === "Delivery" ? address : ""
  };

  console.log("PLACE ORDER PAYLOAD:", payload);

  try {
    const res = await fetch(
  "https://localhost:7156/api/Customers/placeOrder",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);

let result = null;

try {
  result = await res.json();
} catch {
  result = { statusMessage: "No response from server" };
}

alert(result.statusMessage);

    if (result.statusCode === 200) {
      setCart([]);

      localStorage.removeItem("cartCount"); // optional
      window.dispatchEvent(new Event("cartUpdated")); 
    }

  } catch (err) {
    console.error(err);
    alert("Error placing order");
  }
};

  return (
    

     <div className="cart">

      
  <h1>Your Cart</h1>

  {cart.length === 0 ? (
    <div>
    <p>Your cart is empty</p>

    <button
        className="continue-btn"
        onClick={() => navigate("/menu")}
        >
        Continue Shopping
        </button>
      </div>

  ) : (
    <>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Food</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={`https://localhost:7156${item.imageUrl}`}
                  alt={item.foodName}
                />
              </td>

              <td>{item.foodName}</td>
              <td>${item.price}</td>
              <td>
                <button onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
  
                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
  
                <button onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
              </td>
              <td>${item.totalPrice}</td>

              <td>
                <button onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-total">
        <h2>Grand Total: ${grandTotal}</h2>

        <div className="delivery-section">

  <h3>Delivery Options</h3>

  <select
    value={deliveryType}
    onChange={(e) => setDeliveryType(e.target.value)}
  >
    <option value="Pickup">Pickup</option>
    <option value="Delivery">Delivery</option>
  </select>

  {deliveryType === "Delivery" && (
    <input
      type="text"
      placeholder="Enter delivery address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  )}

</div>
    <div className='cart-buttons' >
        <button
        className="continue-btn"
        onClick={() => navigate("/menu")}
        >
        Continue Shopping
        </button>

        <button className="place-order-btn" onClick={placeOrder}>
        Place Order
        </button>
    </div>
        
      </div>
    </>
  )}
</div>
  )
}

export default Cart