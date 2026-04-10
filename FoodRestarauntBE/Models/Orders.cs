namespace FoodRestarauntBE.Models
{
    public class Orders
    {
        public int ID { get; set; }
        public int CustomerID { get; set; }

        public string? OrderNo { get; set; }

        public decimal OrderTotal { get; set; }

        public string? OrderStatus { get; set; }

        public DateTime OrderDate { get; set; }

        public List<OrderItems>? Items { get; set; }

        public string? DeliveryType { get; set; }
        public string? DeliveryAddress { get; set; }
    }
}
