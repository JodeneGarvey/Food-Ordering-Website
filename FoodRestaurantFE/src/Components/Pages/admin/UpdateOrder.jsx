import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import "./CSS/UpdateOrder.css";

const UpdateOrder = () => {

    const { id } = useParams(); // ✅ get ID from URL
      const navigate = useNavigate();
    
      const [order, setOrder] = useState({
        orderStatus: "Pending",
        deliveryType: ""
      });
    
      const [loading, setLoading] = useState(true);
    
      
      useEffect(() => {
        if (id) {
          fetchOrder();
        }
      }, [id]);
    
      const fetchOrder = async () => {
        try {
         console.log("Fetching ID:", id); // ✅ debug
    
        const res = await fetch(`https://localhost:7156/api/Admin/getOrderById/${id}`);
        const data = await res.json();
    
        console.log("API DATA:", data); // ✅ debug
    
        setOrder({
          
          orderStatus: data.orderStatus || "Pending",
          deliveryType: data.deliveryType,
          deliveryAddress: data.deliveryAddress || "Kingston"
          
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
    
        setOrder({
          ...order,
          [name]: value
        });
      };
    
      
    
      // ✅ UPDATE Order Status
      const updateStatus = async (e) => {
        e.preventDefault();

  try {
    const payload = {
      ID: parseInt(id),
      OrderStatus: order.orderStatus,
      DeliveryType: order.deliveryType,
      DeliveryAddress: order.deliveryAddress
    };

    console.log("UPDATE PAYLOAD:", payload);

    const response = await fetch(
      "https://localhost:7156/api/Admin/updateOrder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // ✅ VERY IMPORTANT
        },
        body: JSON.stringify(payload) // ✅ send JSON
      }
    );

    const result = await response.json();

    console.log("UPDATE RESULT:", result);
    console.log("DELIVERY TYPE:", order.deliveryType);

    if (result.statusCode === 200) {
      alert("Order updated successfully!");
      navigate("/adminorders");
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
  <h1>Order Status</h1>

  <form className="edit-form" onSubmit={updateStatus}>
    <div className="form-group">
      <select
        name="orderStatus"
        value={order.orderStatus}
        onChange={handleChange}
        required
      >
        <option value="Pending">Pending</option>

        {order.deliveryType?.trim().toLowerCase() === "pickup" ? (
          <>
            <option value="Ready">Ready</option>
            <option value="Received by Customer">Received by Customer</option>
          </>
        ) : (
          <>
            <option value="In Route">In Route</option>
            <option value="Delivered">Delivered</option>
          </>
        )}
      </select>
    </div>

    <button type="submit" className="update-btn">
      Update Status
    </button>
  </form>

  {/* ✅ BACK BUTTON AT BOTTOM LEFT */}
  <button
    className="backtoorderbutton"
    onClick={() => navigate("/adminorders")}
  >
    ← Back to Orders
  </button>
</div>
  )
}

export default UpdateOrder