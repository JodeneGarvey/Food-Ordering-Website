namespace FoodRestarauntBE.Models
{
    public class Cart
    {
        public int ID { get; set; }

        public int CustomerID { get; set; }

        public int FoodID { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public decimal TotalPrice { get; set; }

        public string? FoodName { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
    }
}
