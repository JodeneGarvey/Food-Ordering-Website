using FoodRestaurantBE.Models;

namespace FoodRestarauntBE.Models
{
    public class Response
    {
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }

        public List<Customers> listCustomers { get; set; }

        public Customers customer { get; set; }

        public List<Food> listfood { get; set; }

        public Food food { get; set; }

        public List<Cart> listCart { get; set; }


        public List<Orders> listOrders { get; set; }

        public Orders orders { get; set; }

        public List<OrderItems> listOrdersItems { get; set; }

        public OrderItems ordersItems { get; set; }

        public Dashboard dashboard { get; set; }


    }
}
