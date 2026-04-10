import React from 'react'
import "./OpeningHours.css";

const OpeningHours = () => {
   return (
    <div className="hours-banner">
      <div className="hours-content">
        
        <h2>🕒 Opening Hours</h2>

        <div className="hours-grid">
          <div className="day">
            <span>Monday - Friday</span>
            <p>10:00 AM - 10:00 PM</p>
          </div>

          <div className="day">
            <span>Saturday</span>
            <p>11:00 AM - 11:00 PM</p>
          </div>

          <div className="day">
            <span>Sunday</span>
            <p>12:00 PM - 9:00 PM</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OpeningHours;
