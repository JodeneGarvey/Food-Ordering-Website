import React from 'react'
import banner from "../../assets/banner.jpg";
import "../Banner/Banner.css";


const Banner = () => {
  return (
    <div className='banner'>
        <div className="banner-left">
            <div>
                <div className='banner-eat-icon'>
                    <h3>Good Food,</h3>
                </div>
                 <h3 className='banner-heading'>Great Moments</h3>
                <p> Your next meal is waiting.</p>
            </div>
            <div className="banner-menu-btn">
                <div><a href="/menu">Explore Menu</a></div>
               
            </div>
            
        </div>
        <div className="banner-right">
            <img src={banner} alt="banner-image" />

        </div>
    </div>
  );
};


export default Banner