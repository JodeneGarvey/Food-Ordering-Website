using FoodRestarauntBE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace FoodRestarauntBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AdminController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpPost]
        [Route("addUpdateFood")]
        public Response addUppdateFood(Food foods)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            Response response = dal.addUpdateFood(foods, connection);
            return response;

        }

        [HttpGet]
        [Route("customerList")]
        public Response customerList()
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            Response response = dal.customerList(connection);
            return response;

        }

        [HttpGet]
        [Route("getCustomer")]

        public List<Customers> GetCustomers()
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.getUsers(connection);
        }

        [HttpGet]
        [Route("getCustomerById/{id}")]
        public Customers getCustomerById(int id)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            return dal.getCustomerById(id, connection);
        }

        [HttpPost]
        [Route("updateCustomer")]
        public Response updateCustomer([FromForm] Customers customer)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));

            return dal.updateCustomer(customer, connection);
        }

        [HttpGet]
        [Route("getOrderById/{id}")]
        public Orders getOrderById(int id)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            return dal.getOrderById(id, connection);
        }
        [HttpPost]
        [Route("updateOrder")]
        public Response updateOrder([FromBody] Orders order)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            Response response = dal.updateOrder(order, connection);
            return response;

        }

        [HttpGet]
        [Route("dashboard")]
        public Response dashboard()
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(
                _configuration.GetConnectionString("Restaraunt")
            );

            return dal.getDashboard(connection);
        }

        [HttpGet]
        [Route("activeOrders")]
        public List<Orders> activeOrders()
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.getActiveOrders(connection);
        }

    }
}
