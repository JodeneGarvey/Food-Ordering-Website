namespace FoodRestarauntBE.Models
{
    public class OrderItems
    {
        public int ID { get; set; }
        public int OrderID { get; set; }
        public int FoodID { get; set; }

        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }

        // ✅ ADD THESE
        public string FoodName { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
    }
}
