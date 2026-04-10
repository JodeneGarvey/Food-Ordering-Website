import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserShield
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  
    const userId = user?.id || user?.ID;
  
    useEffect(() => {
      if (userId) {
        fetchCustomer();
      }
    }, [userId]);

  

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`https://localhost:7156/api/Customers/getProfile/${userId}`) ;
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

 useEffect(() => {
  const loadCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch(
        `https://localhost:7156/api/Customers/getCart/${user.id || user.ID}`
      );

      const data = await res.json();

      const totalQty = data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalQty);

    } catch (err) {
      console.error(err);
      setCartCount(0);
    }
  };

  loadCart();

  window.addEventListener("cartUpdated", loadCart);
  window.addEventListener("userChanged", loadCart);

  return () => {
    window.removeEventListener("cartUpdated", loadCart);
    window.removeEventListener("userChanged", loadCart);
  };
}, []);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  setUser(storedUser);

  

  // ✅ LISTEN FOR USER CHANGES
  const handleUserChange = () => {
    const updatedUser = JSON.parse(localStorage.getItem("user"));
    setUser(updatedUser);
  };

  window.addEventListener("userChanged", handleUserChange);

  return () => {
    window.removeEventListener("userChanged", handleUserChange);
  };
}, []);

  const logout = () => {
    localStorage.removeItem("user");

    // ✅ CLEAR CART COUNT
    setCartCount(0); 

  // trigger UI update
  window.dispatchEvent(new Event("cartUpdated"));


  // ✅ UPDATE NAVBAR INSTANTLY
  window.dispatchEvent(new Event("userChanged"));

  navigate("/login");
  };
  

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <div className="logo">LET'S EAT</div>
        <div className="nav-links desktop-links">
          {user?.type !== "Admin" && (
          <>
            <a href="/">Home</a>
            <a href="/menu">Menu</a>
            <a href="/about">About</a>
          </>
          )}
          
          {/* USER LINKS */}
          {user?.type === "User" && (
            <>
            <a href="/orders">Orders</a>
            <a href="/viewcustomer">Profile</a>
           </>
          )}

          {/* ADMIN LINKS */}
          {user?.type === "Admin" && (
            <>
              <a href="/admindashboard">Dashboard</a>
              <a href="/viewfood">Food</a>
              <a href="/adminorders">Orders</a>
              <a href="/listcustomers">Customers</a>
            </>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="nav-right desktop-links">
        {!user ? (
          <>
            <a href="/login" className="icon-link">
              <FaSignInAlt className="nav-icon" />
              Login
            </a>
          </>
        ) : (
          <>
            {/* USER CART */}
            {user.type === "User" && (
              <a href="/cart" className="icon-link">
                <div className="cart-wrapper">
                  <FaShoppingCart className="nav-icon" size={25} />

                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
            </div>
              Cart
              </a>
            )}

            {/* ADMIN ICON */}
            {user.type === "Admin" && (
              <span className="icon-link">
                <FaUserShield className="nav-icon" />
                Admin
              </span>
            )}

            <span className="username">
              {user.firstName}
            </span>

            <button onClick={logout} className="logout-btn">
              <FaSignOutAlt />
            </button>
          </>
        )}
      </div>

      {/* MOBILE ICON */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          {user?.type !== "Admin" && (
          <>
            <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="/menu" onClick={() => setMenuOpen(false)}>Menu</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          </>
          )}
          {!user && (
            <a href="/login" onClick={() => setMenuOpen(false)}>
              <FaSignInAlt /> Login
            </a>
          )}

          {/* USER MOBILE */}
          {user?.type === "User" && (
            <>
              <a href="/orders" onClick={() => setMenuOpen(false)}>Orders</a>
              <a href="/cart" onClick={() => setMenuOpen(false)}>
                <FaShoppingCart /> Cart
              </a>
            </>
          )}

          {/* ADMIN MOBILE */}
          {user?.type === "Admin" && (
            <>
              <a href="/admindashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
              <a href="/viewfood" onClick={() => setMenuOpen(false)}>Food</a>
              <a href="/adminorders" onClick={() => setMenuOpen(false)}>Orders</a>
            </>
          )}

          {user && (
            <button onClick={logout} className="logout-btn mobile-logout">
              <FaSignOutAlt /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;