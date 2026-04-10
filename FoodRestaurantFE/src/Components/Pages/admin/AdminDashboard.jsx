import React, {useState, useEffect} from "react";
import "./CSS/AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("https://localhost:7156/api/Admin/dashboard");
      const result = await res.json();

      console.log("DASHBOARD:", result);

      if (result.statusCode === 200) {
        setData(result.dashboard);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [activeOrders, setActiveOrders] = useState([]);

useEffect(() => {
  fetchDashboard();
  fetchActiveOrders();
}, []);

const fetchActiveOrders = async () => {
  try {
    const res = await fetch("https://localhost:7156/api/Admin/activeOrders");
    const data = await res.json();

    console.log("ACTIVE ORDERS:", data);

    setActiveOrders(data);
  } catch (err) {
    console.error(err);
  }
};

  if (!data) return <h2>Loading dashboard...</h2>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-cards">
        
        <div className="card food">
          <h2>{data.totalFood}</h2>
          <p>Total Food Items</p>
        </div>

        <div className="card customers">
          <h2>{data.totalCustomers}</h2>
          <p>Total Customers</p>
        </div>

        <div className="card orders">
          <h2>{data.pendingOrders}</h2>
          <p>Pending Orders</p>
        </div>

        <div className="card sales">
          <h2>${data.totalSales}</h2>
          <p>Total Sales</p>
        </div>

      </div>

      <h2 className="orders-title">Active Orders</h2>

{activeOrders.length === 0 ? (
  <p>No active orders</p>
) : (
  <table className="orders-table">
    <thead>
      <tr>
        <th>Order No</th>
        <th>Total</th>
        <th>Status</th>
        <th>Type</th>
        <th>Address</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>
      {activeOrders.map((order) => (
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
            {new Date(order.orderDate).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}
    </div>

    
  );
};



export default AdminDashboard;