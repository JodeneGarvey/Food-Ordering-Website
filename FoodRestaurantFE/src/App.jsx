import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Login from './Components/Pages/Login';
import Registration from './Components/Pages/Registration';
import AdminDashboard from './Components/Pages/admin/AdminDashboard';
import AdminOrders from './Components/Pages/admin/AdminOrders';
import Food from './Components/Pages/admin/Food';
import AdminFood from './Components/Pages/admin/AdminFood';
import Menu from './Components/Pages/customer/Menu';
import Restaurant from './Components/Pages/customer/Restaurant';
import EditFood from './Components/Pages/admin/EditFood';
import About from './Components/Pages/customer/About';
import CustomerList from './Components/Pages/admin/CustomerList';
import EditCustomer from './Components/Pages/admin/EditCustomer';
import UpdateProfile from './Components/Pages/customer/UpdateProfile';
import CustomerProfile from './Components/Pages/customer/CustomerProfile';
import Footer from './Components/Footer/Footer';
import FoodCategories from './Components/Pages/customer/FoodCategories';
import FoodDetails from './Components/Pages/customer/FoodDetails';
import Cart from './Components/Pages/customer/Cart';
import Order from './Components/Pages/customer/Order';
import UpdateOrder from './Components/Pages/admin/UpdateOrder';
import ForgotPassword from './Components/Pages/ForgotPassword';

function App() {
  const [count, setCount] = useState(0);
  return (
    <>

      
            <BrowserRouter>
              <Navbar />
            <Routes>
                <Route path="/" element={<Restaurant />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element ={<Registration />} />
                <Route path="/forgotpassword" element={<ForgotPassword/>}/>
                <Route path="/admindashboard" element ={<AdminDashboard />} />
                <Route path="/adminorders" element ={<AdminOrders/>} />
                <Route path="/editorder/:id" element={<UpdateOrder/>} />
                <Route path="/listcustomers" element={<CustomerList/>} />
                <Route path="/editcustomertype/:id" element={<EditCustomer/>}/>
                <Route path="/food" element={<Food />} />
                <Route path="/viewfood" element={<AdminFood />} />
                <Route path="/editfood/:id" element ={<EditFood />} />
                <Route path="/viewcustomer" element={<CustomerProfile />} />
                <Route path="/updateprofile/:id" element={<UpdateProfile />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/foodcategories/:type" element={<FoodCategories />} />
                <Route path="/food/:id" element={<FoodDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Order />}/>

                
            </Routes>
            <Footer />
        </BrowserRouter>

    </>
  )
}

export default App
