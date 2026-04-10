using FoodRestarauntBE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace FoodRestarauntBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CustomersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("registration")]
        public Response register (Customers customers)
        {
            customers.Type = "User";
            customers.CreatedOn = DateTime.Now;

            customers.Password = BCrypt.Net.BCrypt.HashPassword(customers.Password);

            Response response = new Response();
            DataLayer dal = new DataLayer();
            SqlConnection  connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            response = dal.register(customers, connection);
            return response;
        }
        [HttpPost]
        [Route("login")]

        public Response login(Customers customers)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(
                _configuration.GetConnectionString("Restaraunt").ToString()
            );

            Customers dbUser = dal.getCustomerByEmail(customers.Email, connection);

            Response response = new Response();

            if (dbUser != null)
            {
                bool isMatch = false;

                // ✅ CHECK IF PASSWORD IS HASHED
                if (dbUser.Password.StartsWith("$2"))
                {
                    // 🔐 BCrypt password
                    isMatch = BCrypt.Net.BCrypt.Verify(customers.Password, dbUser.Password);
                }
                else
                {
                    // ⚠️ OLD plain text password
                    isMatch = customers.Password == dbUser.Password;

                    // 🔥 OPTIONAL: upgrade to hashed password automatically
                    if (isMatch)
                    {
                        string hashed = BCrypt.Net.BCrypt.HashPassword(customers.Password);
                        dal.updatePasswordHash(dbUser.ID, hashed, connection);
                    }
                }

                if (isMatch)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Login successful";
                    response.customer = dbUser;
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Invalid email or password";
                }
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "User not found";
            }

            return response;
        }

        [HttpPost]
        [Route("forgotPassword")]
        public Response forgotPassword([FromBody] Customers customer)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(
                _configuration.GetConnectionString("Restaraunt")
            );

            return dal.resetPassword(customer, connection);
        }


        [HttpPost]
        [Route("viewCustomer")]
        public Response viewCustomer(Customers customers)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            Response response = dal.viewCustomer(customers, connection);
            return response;
        }

        [HttpPost]
        [Route("updateProfile")]
        public Response updateProfile([FromBody] Customers customers)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            Response response = dal.updateProfile(customers, connection);
            return response;

        }

        [HttpGet]
        [Route("getProfile/{id}")]
        public Customers getProfile(int id)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));

            Customers customers = new Customers();
            customers.ID = id;

            Response res = dal.viewCustomer(customers, connection);

            return res.customer; // ✅ RETURN FULL DATA
        }

        [HttpDelete]
        [Route("deleteCustomer/{id}")]
        public Response deleteFood(int id)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.deleteCustomer(id, connection);
        }

        [HttpGet]
        [Route("getCart/{customerId}")]
        public List<Cart> getCart(int customerId)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.getCart(customerId, connection);
        }

        [HttpDelete]
        [Route("removeFromCart/{id}")]
        public Response removeFromCart(int id)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.removeFromCart(id, connection);
        }

        [HttpPut]
        [Route("updateCartQuantity")]
        public Response updateCartQuantity([FromBody] Cart cart)
        {
            DataLayer dal = new DataLayer();

            SqlConnection connection = new SqlConnection(
                _configuration.GetConnectionString("Restaraunt").ToString()
            );

            return dal.updateCartQuantity(cart, connection);
        }

        [HttpGet]
        [Route("getOrderItems/{orderId}")]
        public List<Cart> getOrderItems(int orderId)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.getOrderItems(orderId, connection);
        }

        [HttpGet]
        [Route("orderListWithItems/{customerId}")]
        public Response orderListWithItems(int customerId)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.orderListWithItems(customerId, connection);
        }

        [HttpPost]
        [Route("placeOrder")]
        public IActionResult placeOrder([FromBody] Orders order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // 🔥 THIS SHOWS EXACT ERROR
            }

            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));

            var response = dal.placeOrder(order, connection);

            return Ok(response);
        }

        [HttpPost]
        [Route("orderList")]

        public Response orderList(Customers customers)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            Response response = dal.orderList(customers, connection);
            return response;
        }

        [HttpDelete]
        [Route("deleteOrder/{id}")]
        public Response deleteOrder(int id)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.deleteOrder(id, connection);
        }


    }
}
