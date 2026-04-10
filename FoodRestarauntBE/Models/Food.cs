namespace FoodRestarauntBE.Models
{
    public class Food
    {
        public int ID { get; set; }
        public string FoodName { get; set; }

        public decimal Price { get; set; }

        public int? Quantity { get; set; }

        public string ImageUrl { get; set; }

        public bool Available { get; set; }

        public string Type { get; set; }

        public string Description { get; set; }
    }
}
