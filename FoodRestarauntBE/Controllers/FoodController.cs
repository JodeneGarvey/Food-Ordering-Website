using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using FoodRestarauntBE.Models;
using System.Data.SqlClient;
using FoodRestaurantBE.Models;

namespace FoodRestarauntBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public FoodController(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;

        }

        [HttpPost]
        [Route("addToCart")]
        public Response addToCart([FromBody] AddToCartDTO cart)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));

            // map DTO → Cart
            Cart newCart = new Cart
            {
                CustomerID = cart.CustomerID,
                FoodID = cart.FoodID,
                Price = cart.Price,
                Quantity = cart.Quantity,
                TotalPrice = cart.TotalPrice
            };

            return dal.addToCart(newCart, connection);
        }

        

        [HttpPost]
        [Route("addUpdateFood")]
        public async Task<Response> addUpdateFood([FromForm] FoodUpload foodUpload)
        {
            Response response = new Response();

            try
            {
                if (!ModelState.IsValid)
                {
                    response.StatusCode = 400;
                    response.StatusMessage = "Invalid model state: " +
                        string.Join("; ", ModelState.Values
                            .SelectMany(v => v.Errors)
                            .Select(e => e.ErrorMessage));
                    return response;
                }
                string imagePath = foodUpload.ExistingImageUrl;
                



                // ✅ ONLY change if new image uploaded
                if (foodUpload.Image != null && foodUpload.Image.Length > 0)
                {
                    string uploadFolder = Path.Combine(_environment.WebRootPath, "FoodImages");

                    if (!Directory.Exists(uploadFolder))
                    {
                        Directory.CreateDirectory(uploadFolder);
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(foodUpload.Image.FileName);
                    string filePath = Path.Combine(uploadFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await foodUpload.Image.CopyToAsync(stream);
                    }

                    imagePath = "/FoodImages/" + uniqueFileName;
                }

                Food food = new Food
                {
                    ID = foodUpload.Id, // ✅ VERY IMPORTANT
                    FoodName = foodUpload.FoodName,
                    Price = foodUpload.Price,
                    Quantity = foodUpload.Quantity,
                    Available = foodUpload.Available,
                    Type = foodUpload.Type,
                    Description = foodUpload.Description,
                    ImageUrl = imagePath
                };

                DataLayer dal = new DataLayer();
                SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));

                response = dal.addUpdateFood(food, connection);
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.StatusMessage = ex.Message;
            }
            

            return response;
        }

        [HttpGet]
        [Route("getFood")]
        public List<Food> getFood()
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.getFood(connection);
        }

        [HttpDelete]
        [Route("deleteFood/{id}")]
        public Response deleteFood(int id)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.deleteFood(id, connection);
        }

        [HttpGet]
        [Route("getFoodById/{id}")]
        public Food getFoodById(int id)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt").ToString());
            return dal.getFoodById(id, connection);
        }

        [HttpGet]
        [Route("getFoodByType/{type}")]
        public List<Food> getFoodByType(string type)
        {
            DataLayer dal = new DataLayer();
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("Restaraunt"));
            return dal.getFoodByType(type, connection);
        }

         
    }
}
