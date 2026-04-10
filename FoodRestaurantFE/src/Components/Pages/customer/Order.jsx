import React, { useEffect, useState } from "react";
import "./CSS/Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showItems, setShowItems] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?.ID;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://localhost:7156/api/Customers/orderList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ID: userId,
          Type: user?.type | user?.Type || "User"

          
        })
      });

      console.log("USER:", user);
console.log("PAYLOAD:", {
  ID: userId,
  Type: user?.type || user?.Type
});

      const data = await res.json();
      console.log("ORDER REQUEST:", data);

      setOrders(data.listOrders || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH ORDER ITEMS
  const viewItems = async (orderId) => {
    try {
      const res = await fetch(
        `https://localhost:7156/api/Customers/getOrderItems/${orderId}`
      );

      const data = await res.json();

      console.log("ORDER ITEMS:", data);

      setSelectedItems(data);
      setShowItems(true);
    } catch (err) {
      console.error(err);
    }
  };

  const removeOrder = async (id) => {
    await fetch(
      `https://localhost:7156/api/Customers/deleteOrder/${id}`,
      {
        method: "DELETE"
      }
    );

    fetchOrders(); // refresh
  };


  return (
    <div className="orders">
      <h1>Your Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Total</th>
              <th>Status</th>
              <th>Delivery Method</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNo}</td>
                <td>${order.orderTotal}</td>
                <td>{order.orderStatus}</td>
                <td>{order.deliveryType}</td>
                
                <td>
                    {order.deliveryType === "Pickup"
                    ? "Kingston, Jamaica"
                    : order.deliveryAddress}
                </td>
               
                <td>
                    <div className="action-buttons">
                    <button
                    className="viewitemsbutton"
                    onClick={() => viewItems(order.id)}
                    >
                    View Items
                    </button>

                    <button
                    className="deletebutton"
                    onClick={() => removeOrder(order.id)}
                    >
                    Delete Order
                    </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ ORDER ITEMS MODAL */}
      {showItems && (
        <div className="items-modal">
          <div className="items-content">
            <h2>Order Items</h2>

            <table>
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.foodName}</td>
                    <td>${item.price}</td>
                    <td>{item.quantity}</td>
                    <td>${item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={() => setShowItems(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;