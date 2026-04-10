namespace FoodRestaurantBE.Models
{
    public class AddToCartDTO
    {
        public int CustomerID { get; set; }
        public int FoodID { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
