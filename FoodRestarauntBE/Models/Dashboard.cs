namespace FoodRestaurantBE.Models
{
    public class Dashboard
    {
        public int TotalFood { get; set; }
        public int TotalCustomers { get; set; }
        public int PendingOrders { get; set; }
        public decimal TotalSales { get; set; }
    }
}
