namespace FoodRestarauntBE.Models
{
    public class Customers
    {
        public int ID { get; set; }
        public string? FirstName { get; set; }

        public string? LastName{ get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public string? Type { get; set; }

        public DateTime CreatedOn { get; set; }


    }
}
