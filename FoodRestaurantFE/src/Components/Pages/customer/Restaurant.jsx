import React from 'react'
import Banner from '../../Banner/Banner'
import Categories from '../../Categories/Categories'
import Contact from '../../Contact/Contact'
import OpeningHours from '../../OpeningHours/OpeningHours'


const Restaurant = () => {
  return (
    <div>
      <Banner />
      <OpeningHours />
      <Categories />
      
      <Contact />
    
    </div>
  )
}

export default Restaurant