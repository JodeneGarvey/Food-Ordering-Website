namespace FoodRestarauntBE.Models
{
    public class FoodUpload
    {
        public int Id { get; set; }
        public string FoodName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool Available { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }

        public string? ExistingImageUrl { get; set; } // ✅ KEEP OLD IMAGE
    }
}
