import React from "react";
import "./CSS/About.css";
import { FaUtensils, FaTruck, FaStar } from "react-icons/fa";
import AboutImage from "../../../assets/About Image.jpeg";

const About = () => {
  return (
    <div className="about-page">

      {/* HERO SECTION */}
      <div className="about-hero">
        <h1>About LET'S EAT</h1>
        <p>
          Your favorite place to discover, order, and enjoy delicious meals anytime.
        </p>
      </div>

      {/* ABOUT CONTENT */}
      <div className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            LET'S EAT was created to connect food lovers with amazing meals from
            the best kitchens. Whether you're craving something quick or planning
            a special dinner, we make ordering food simple, fast, and enjoyable.
          </p>
          <p>
            Our mission is to deliver quality meals with convenience while giving
            customers a seamless online experience.
          </p>
        </div>

        <div className="about-image">
          <img
            src={AboutImage}
            alt="food"
          />
        </div>
      </div>

      {/* FEATURES */}
      <div className="about-features">
        <h2>Why Choose Us</h2>

        <div className="features-grid">
          <div className="feature-card">
            <FaUtensils className="feature-icon" />
            <h3>Delicious Meals</h3>
            <p>Wide variety of tasty dishes made with quality ingredients.</p>
          </div>

          <div className="feature-card">
            <FaTruck className="feature-icon" />
            <h3>Fast Delivery</h3>
            <p>Get your food delivered quickly and fresh to your doorstep.</p>
          </div>

          <div className="feature-card">
            <FaStar className="feature-icon" />
            <h3>Top Quality</h3>
            <p>We ensure the best service and customer satisfaction every time.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2>Ready to Order?</h2>
        <p>Explore our menu and enjoy your favorite meals today.</p>
        <a href="/menu" className="cta-btn">Browse Menu</a>
      </div>

    </div>
  );
};

export default About;