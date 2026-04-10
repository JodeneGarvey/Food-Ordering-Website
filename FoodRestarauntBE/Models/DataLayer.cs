using System.Data.SqlClient;
using System.Data;
using FoodRestaurantBE.Models;

namespace FoodRestarauntBE.Models
{
    public class DataLayer
    {
        public Response register(Customers customers, SqlConnection connection)
        {
            Response response = new Response();

            try
            {
                SqlCommand cmd = new SqlCommand("sp_register", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FirstName", customers.FirstName);
                cmd.Parameters.AddWithValue("@LastName", customers.LastName);
                cmd.Parameters.AddWithValue("@Email", customers.Email);
                cmd.Parameters.AddWithValue("@Password", customers.Password);
                cmd.Parameters.AddWithValue("@Type", "User");
                cmd.Parameters.AddWithValue("@CreatedOn", customers.CreatedOn);

                connection.Open();
                cmd.ExecuteNonQuery();
                connection.Close();

                response.StatusCode = 200;
                response.StatusMessage = "Customer registered successfully";
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("Email already exists"))
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Email already exists";
                }
                else
                {
                    response.StatusCode = 500;
                    response.StatusMessage = "Database error";
                }
            }

            return response;
        }
        public Response login(Customers customers, SqlConnection connection)
        {
            SqlDataAdapter da = new SqlDataAdapter("sp_login", connection);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@Email", customers.Email);
            da.SelectCommand.Parameters.AddWithValue("@Password", customers.Password);
            DataTable dt = new DataTable();
            da.Fill(dt);
            Response response = new Response();
            Customers customer = new Customers();
            if (dt.Rows.Count > 0 && dt.Rows[0]["ID"] != DBNull.Value)
            {
                customer.ID = Convert.ToInt32(dt.Rows[0]["ID"]);
                customer.FirstName = Convert.ToString(dt.Rows[0]["FirstName"]);
                customer.LastName = Convert.ToString(dt.Rows[0]["LastName"]);
                customer.Email = Convert.ToString(dt.Rows[0]["Email"]);
                customer.Type = Convert.ToString(dt.Rows[0]["Type"]);

                response.StatusCode = 200;
                response.StatusMessage = "Valid Customer";
                response.customer = customer;
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Invalid Email or Password";
                response.customer = null;
            }
            return response;

        }

        public Response resetPassword(Customers customer, SqlConnection connection)
        {
            Response response = new Response();

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(customer.Password);

            SqlCommand cmd = new SqlCommand(
                "UPDATE Customers SET Password=@Password WHERE Email=@Email",
                connection
            );

            cmd.Parameters.AddWithValue("@Email", customer.Email);
            cmd.Parameters.AddWithValue("@Password", hashedPassword);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Password reset successfully";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Email not found";
            }

            return response;
        }

        public void updatePasswordHash(int id, string hashedPassword, SqlConnection connection)
        {
            SqlCommand cmd = new SqlCommand(
                "UPDATE Customers SET Password=@Password WHERE ID=@ID",
                connection
            );

            cmd.Parameters.AddWithValue("@ID", id);
            cmd.Parameters.AddWithValue("@Password", hashedPassword);

            connection.Open();
            cmd.ExecuteNonQuery();
            connection.Close();
        }
        public Customers getCustomerByEmail(string email, SqlConnection connection)
        {
            Customers customer = null;

            SqlCommand cmd = new SqlCommand(
                "SELECT * FROM Customers WHERE Email=@Email", connection);

            cmd.Parameters.AddWithValue("@Email", email);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                customer = new Customers
                {
                    ID = Convert.ToInt32(reader["ID"]),
                    FirstName = reader["FirstName"].ToString(),
                    LastName = reader["LastName"].ToString(),
                    Email = reader["Email"].ToString(),
                    Password = reader["Password"].ToString(),
                    Type = reader["Type"].ToString()
                };
            }

            connection.Close();
            return customer;
        }

        public Response viewCustomer(Customers customers, SqlConnection connection)
        {
            SqlDataAdapter da = new SqlDataAdapter("p_viewUser", connection);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@ID", customers.ID);
            DataTable dt = new DataTable();
            da.Fill(dt);
            Response response = new Response();
            Customers customer = new Customers();
            if (dt.Rows.Count > 0)
            {
                customer.ID = Convert.ToInt32(dt.Rows[0]["ID"]);
                customer.FirstName = Convert.ToString(dt.Rows[0]["FirstName"]);
                customer.LastName = Convert.ToString(dt.Rows[0]["LastName"]);
                customer.Email = Convert.ToString(dt.Rows[0]["Email"]);
                customer.Type = Convert.ToString(dt.Rows[0]["Type"]);
                customer.CreatedOn = Convert.ToDateTime(dt.Rows[0]["CreatedOn"]);
                customer.Password = Convert.ToString(dt.Rows[0]["Password"]);
                response.StatusCode = 200;
                response.StatusMessage = "Customer exist.";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Customer does not exist.";
            }
            response.customer = customer;
            return response;

        }

        public Response updateProfile(Customers customers, SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand(
                "UPDATE Customers SET Email=@Email , Password=@Password WHERE ID=@ID",
                connection
            );

            cmd.Parameters.AddWithValue("@ID", customers.ID);
            cmd.Parameters.AddWithValue("@Email", customers.Email);
            cmd.Parameters.AddWithValue("@Password", customers.Password);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Customer updated successfully";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Update failed";
            }

            return response;
        }



        public Response addToCart(Cart cart, SqlConnection connection)
        {
            Response response = new Response();
            SqlCommand cmd = new SqlCommand("sp_AddToCart", connection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@CustomerID", cart.CustomerID);
            cmd.Parameters.AddWithValue("@FoodId", cart.FoodID);
            cmd.Parameters.AddWithValue("@Price", cart.Price);
            cmd.Parameters.AddWithValue("@Quantity", cart.Quantity);
            cmd.Parameters.AddWithValue("@TotalPrice", cart.TotalPrice);
            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();
            
            
                response.StatusCode = 200;
                response.StatusMessage = "Added to Cart Successfully";
            
            return response;
        }

        public Response updateCartQuantity(Cart cart, SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand(
                "UPDATE Cart SET Quantity=@Quantity, TotalPrice=@TotalPrice WHERE ID=@ID",
                connection
            );

            cmd.Parameters.AddWithValue("@Quantity", cart.Quantity);
            cmd.Parameters.AddWithValue("@TotalPrice", cart.TotalPrice);
            cmd.Parameters.AddWithValue("@ID", cart.ID);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Cart updated successfully";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Failed to update cart";
            }

            return response;
        }

        public Response placeOrder(Orders order, SqlConnection connection)
        {
            Response response = new Response();

            try
            {
                SqlCommand cmd = new SqlCommand("sp_PlaceOrder", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CustomerID", order.CustomerID);
                cmd.Parameters.AddWithValue("@DeliveryType", order.DeliveryType);
                cmd.Parameters.AddWithValue("@DeliveryAddress", order.DeliveryAddress ?? "");

                connection.Open();
                cmd.ExecuteNonQuery();
                connection.Close();

                response.StatusCode = 200;
                response.StatusMessage = "Order Placed Successfully";
            }
            catch (Exception ex)
            {
                response.StatusCode = 500;
                response.StatusMessage = ex.Message;
            }

            return response;
        }
        public Response orderList(Customers customers, SqlConnection connection)
        {
            Response response = new Response();
            List<Orders> listOrder = new List<Orders>();
            SqlDataAdapter da = new SqlDataAdapter("sp_OrderList", connection);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@Type", customers.Type);
            da.SelectCommand.Parameters.AddWithValue("@ID", customers.ID);
            DataTable dt = new DataTable();
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Orders order = new Orders();
                    order.ID = Convert.ToInt32(dt.Rows[i]["ID"]);
                    order.OrderNo = Convert.ToString(dt.Rows[i]["OrderNo"]);
                    order.OrderTotal = Convert.ToDecimal(dt.Rows[i]["OrderTotal"]);
                    order.OrderStatus = Convert.ToString(dt.Rows[i]["OrderStatus"]);
                    order.DeliveryType = Convert.ToString(dt.Rows[i]["DeliveryType"]);
                    order.DeliveryAddress = Convert.ToString(dt.Rows[i]["DeliveryAddress"]);
                    listOrder.Add(order);

                }
                if (listOrder.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Order details fetched";
                    response.listOrders = listOrder;
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Order details are not available";
                    response.listOrders = null;
                }
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Order details are not available";
                response.listOrders = null;
            }
            return response;

        }

        public Response addUpdateFood(Food foods, SqlConnection connection)
        {
            Response response = new Response();
            SqlCommand cmd = new SqlCommand("sp_addUpdateFood", connection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@ID", foods.ID);
            cmd.Parameters.AddWithValue("@FoodName", foods.FoodName);
            cmd.Parameters.AddWithValue("@ImageUrl", foods.ImageUrl);
            cmd.Parameters.AddWithValue("@Price", foods.Price);
            cmd.Parameters.AddWithValue("@Quantity", foods.Quantity);
            cmd.Parameters.AddWithValue("@Available", foods.Available ? 1 : 0);
            cmd.Parameters.AddWithValue("@Type", foods.Type);
            cmd.Parameters.AddWithValue("@Description", foods.Description);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();
            if(i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Food Added Successfully";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Food not Added Successfully";
            }
            return response;
        }

        public Response customerList(SqlConnection connection)
        {
            Response response = new Response();
            List<Customers> listCustomers = new List<Customers>();
            SqlDataAdapter da = new SqlDataAdapter("sp_CustomerList", connection);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            DataTable dt = new DataTable();
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    Customers customer = new Customers();
                    customer.ID = Convert.ToInt32(dt.Rows[i]["ID"]);
                    customer.FirstName = Convert.ToString(dt.Rows[i]["FirstName"]);
                    customer.LastName = Convert.ToString(dt.Rows[i]["LastName"]);
                    customer.Email = Convert.ToString(dt.Rows[i]["Email"]);
                    customer.Password = Convert.ToString(dt.Rows[i]["Password"]);
                    customer.CreatedOn = Convert.ToDateTime(dt.Rows[i]["CreatedOn"]);

                    listCustomers.Add(customer);

                }
                if (listCustomers.Count > 0)
                {
                    response.StatusCode = 200;
                    response.StatusMessage = "Customer details fetched";
                    response.listCustomers = listCustomers;
                }
                else
                {
                    response.StatusCode = 100;
                    response.StatusMessage = "Customer details are not available";
                    response.listCustomers = null;
                }
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Customer details are not available";
                response.listCustomers = null;
            }
            return response;

        }

        public List<Customers> getUsers(SqlConnection connection)
        {
            List<Customers> customerList = new List<Customers>();
            SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM Customers", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            foreach (DataRow row in dt.Rows)
            {
                customerList.Add(new Customers
                {
                    ID = Convert.ToInt32(row["ID"]),
                    FirstName = row["FirstName"].ToString(),
                    LastName = row["LastName"].ToString(),
                    Email = row["Email"].ToString(),
                    Type = row["Type"].ToString(),
                });
            }
            return customerList;


        }

        public List<Food> getFood(SqlConnection connection)
        {
            List<Food> foodList = new List<Food>();

            SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM Food", connection);
            DataTable dt = new DataTable();
            da.Fill(dt);

            foreach (DataRow row in dt.Rows)
            {
                foodList.Add(new Food
                {
                    ID = Convert.ToInt32(row["ID"]),
                    FoodName = row["FoodName"].ToString(),
                    ImageUrl = row["ImageUrl"].ToString(),
                    Price = Convert.ToDecimal(row["Price"]),
                    Quantity = Convert.ToInt32(row["Quantity"]),
                    Available = Convert.ToBoolean(row["Available"]),
                    Type = row["Type"].ToString(),
                    Description = row["Description"].ToString()
                });
            }

            return foodList;
        }

        public Response deleteFood(int id, SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand("DELETE FROM Food WHERE ID=@ID", connection);
            cmd.Parameters.AddWithValue("@ID", id);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Deleted";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Not deleted";
            }

            return response;
        }
        public Food getFoodById(int id, SqlConnection connection)
        {
            Food food = new Food();

            SqlCommand cmd = new SqlCommand("SELECT * FROM Food WHERE ID=@ID", connection);
            cmd.Parameters.AddWithValue("@ID", id);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                food.ID = Convert.ToInt32(reader["ID"]);
                food.FoodName = reader["FoodName"].ToString();
                food.ImageUrl = reader["ImageUrl"].ToString();
                food.Price = Convert.ToDecimal(reader["Price"]);
                food.Quantity = Convert.ToInt32(reader["Quantity"]);
                food.Available = Convert.ToBoolean(reader["Available"]);
                food.Type = reader["Type"].ToString();
                food.Description = reader["Description"].ToString();
            }

            connection.Close();
            return food;
        }
        public Customers getCustomerById(int id, SqlConnection connection)
        {
            Customers customer = new Customers();

            SqlCommand cmd = new SqlCommand("SELECT * FROM Customers WHERE ID=@ID", connection);
            cmd.Parameters.AddWithValue("@ID", id);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                customer.ID = Convert.ToInt32(reader["ID"]);
                customer.Type = reader["Type"].ToString();
            }

            connection.Close();
            return customer;
        }
        public Response updateCustomer(Customers customer, SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand(
                "UPDATE Customers SET Type=@Type WHERE ID=@ID",
                connection
            );

            cmd.Parameters.AddWithValue("@ID", customer.ID);
            cmd.Parameters.AddWithValue("@Type", customer.Type);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Customer updated successfully";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Update failed";
            }

            return response;
        }

        public Response deleteCustomer(int id, SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand("DELETE FROM Customers WHERE ID=@ID", connection);
            cmd.Parameters.AddWithValue("@ID", id);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Deleted";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Not deleted";
            }

            return response;
        }

        public List<Food> getFoodByType(string type, SqlConnection connection)
        {
            List<Food> foods = new List<Food>();

            SqlCommand cmd = new SqlCommand("SELECT * FROM Food WHERE Type=@Type", connection);
            cmd.Parameters.AddWithValue("@Type", type);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read()) // ✅ LOOP instead of if
            {
                Food food = new Food();

                food.ID = Convert.ToInt32(reader["ID"]);
                food.FoodName = reader["FoodName"].ToString();
                food.ImageUrl = reader["ImageUrl"].ToString();
                food.Price = Convert.ToDecimal(reader["Price"]);
                food.Quantity = Convert.ToInt32(reader["Quantity"]);
                food.Available = Convert.ToBoolean(reader["Available"]);
                food.Type = reader["Type"].ToString();
                food.Description = reader["Description"].ToString();

                foods.Add(food);
            }

            connection.Close();
            return foods;

            }

        public List<Cart> getCart(int customerId, SqlConnection connection)
        {
            List<Cart> list = new List<Cart>();

            SqlCommand cmd = new SqlCommand(
                @"SELECT c.ID, c.FoodID, c.Quantity, c.Price, c.TotalPrice,
                 f.FoodName, f.ImageUrl, f.Description
          FROM Cart c
          JOIN Food f ON c.FoodID = f.ID
          WHERE c.CustomerID = @CustomerID",
                connection
            );

            cmd.Parameters.AddWithValue("@CustomerID", customerId);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new Cart
                {
                    ID = Convert.ToInt32(reader["ID"]),
                    FoodID = Convert.ToInt32(reader["FoodID"]),
                    Quantity = Convert.ToInt32(reader["Quantity"]),
                    Price = Convert.ToDecimal(reader["Price"]),
                    TotalPrice = Convert.ToDecimal(reader["TotalPrice"]),
                    FoodName = reader["FoodName"].ToString(),
                    ImageUrl = reader["ImageUrl"].ToString(),
                    Description = reader["Description"].ToString()
                });
            }

            connection.Close();
            return list;
        }

        public Response removeFromCart(int id, SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand("DELETE FROM Cart WHERE ID=@ID", connection);
            cmd.Parameters.AddWithValue("@ID", id);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Item removed";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Remove failed";
            }

            return response;
        }

        public Response orderListWithItems(int customerId, SqlConnection connection)
        {
            Response response = new Response();
            List<Orders> orders = new List<Orders>();
            List<OrderItems> items = new List<OrderItems>();

            SqlCommand cmd = new SqlCommand("sp_OrderListWithItems", connection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@CustomerID", customerId);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            // ✅ FIRST RESULT → Orders
            while (reader.Read())
            {
                orders.Add(new Orders
                {
                    ID = Convert.ToInt32(reader["ID"]),
                    OrderNo = reader["OrderNo"].ToString(),
                    OrderTotal = Convert.ToDecimal(reader["OrderTotal"]),
                    OrderStatus = reader["OrderStatus"].ToString(),
                    Items = new List<OrderItems>()
                });
            }

            // ✅ SECOND RESULT → Items
            if (reader.NextResult())
            {
                while (reader.Read())
                {
                    items.Add(new OrderItems
                    {
                        ID = Convert.ToInt32(reader["ID"]),
                        OrderID = Convert.ToInt32(reader["OrderID"]),
                        FoodID = Convert.ToInt32(reader["FoodID"]),
                        FoodName = reader["FoodName"].ToString(),
                        ImageUrl = reader["ImageUrl"].ToString(),
                        Description = reader["Description"].ToString(),
                        Price = Convert.ToDecimal(reader["Price"]),
                        Quantity = Convert.ToInt32(reader["Quantity"]),
                        TotalPrice = Convert.ToDecimal(reader["TotalPrice"])
                    });
                }
            }

            connection.Close();

            // ✅ MAP ITEMS TO ORDERS
            foreach (var order in orders)
            {
                order.Items = items.Where(i => i.OrderID == order.ID).ToList();
            }

            response.StatusCode = 200;
            response.listOrders = orders;

            return response;
        }

        public List<Cart> getOrderItems(int orderId, SqlConnection connection)
        {
            List<Cart> list = new List<Cart>();

            SqlCommand cmd = new SqlCommand(
                @"SELECT oi.*, f.FoodName 
          FROM OrderItems oi
          INNER JOIN Food f ON oi.FoodID = f.ID
          WHERE oi.OrderID = @OrderID", connection);

            cmd.Parameters.AddWithValue("@OrderID", orderId);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                Cart item = new Cart();

                item.ID = Convert.ToInt32(reader["ID"]);
                item.FoodName = reader["FoodName"].ToString();
                item.Price = Convert.ToDecimal(reader["Price"]);
                item.Quantity = Convert.ToInt32(reader["Quantity"]);
                item.TotalPrice = Convert.ToDecimal(reader["TotalPrice"]);

                list.Add(item);
            }

            connection.Close();

            return list;
        }

        public Response deleteOrder(int id, SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand("DELETE FROM Orders WHERE ID=@ID", connection);
            cmd.Parameters.AddWithValue("@ID", id);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Order Deleted";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Order not deleted";
            }

            return response;
        }


        public Orders getOrderById(int id, SqlConnection connection)
        {
            Orders order = new Orders();

            SqlCommand cmd = new SqlCommand("SELECT * FROM Orders WHERE ID=@ID", connection);
            cmd.Parameters.AddWithValue("@ID", id);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                order.ID = Convert.ToInt32(reader["ID"]);
                order.OrderStatus = reader["OrderStatus"].ToString();

                order.DeliveryType = reader["DeliveryType"].ToString();
                order.DeliveryAddress = reader["DeliveryAddress"].ToString();
            }

            connection.Close();
            return order;
        }
        public Response updateOrder(Orders order, SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand(
                "UPDATE Orders SET OrderStatus=@OrderStatus WHERE ID=@ID",
                connection
            );

            cmd.Parameters.AddWithValue("@ID", order.ID);
            cmd.Parameters.AddWithValue("@OrderStatus", order.OrderStatus);

            connection.Open();
            int i = cmd.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                response.StatusCode = 200;
                response.StatusMessage = "Order updated successfully";
            }
            else
            {
                response.StatusCode = 100;
                response.StatusMessage = "Update failed";
            }

            return response;
        }

        public Response getDashboard(SqlConnection connection)
        {
            Response response = new Response();

            SqlCommand cmd = new SqlCommand("sp_AdminDashboard", connection);
            cmd.CommandType = CommandType.StoredProcedure;

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                response.StatusCode = 200;
                response.dashboard = new Dashboard
                {
                    TotalFood = Convert.ToInt32(reader["TotalFood"]),
                    TotalCustomers = Convert.ToInt32(reader["TotalCustomers"]),
                    PendingOrders = Convert.ToInt32(reader["PendingOrders"]),
                    TotalSales = Convert.ToDecimal(reader["TotalSales"])
                };
            }

            connection.Close();
            return response;
        }

        public List<Orders> getActiveOrders(SqlConnection connection)
        {
            List<Orders> list = new List<Orders>();

            SqlCommand cmd = new SqlCommand(@"
        SELECT * FROM Orders 
        WHERE OrderStatus IN ('Pending', 'In Route', 'Ready')
        ORDER BY OrderDate DESC
    ", connection);

            connection.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                Orders order = new Orders
                {
                    ID = Convert.ToInt32(reader["ID"]),
                    OrderNo = reader["OrderNo"].ToString(),
                    OrderTotal = Convert.ToDecimal(reader["OrderTotal"]),
                    OrderStatus = reader["OrderStatus"].ToString(),
                    DeliveryType = reader["DeliveryType"].ToString(),
                    DeliveryAddress = reader["DeliveryAddress"].ToString(),
                    OrderDate = Convert.ToDateTime(reader["OrderDate"])
                };

                list.Add(order);
            }

            connection.Close();
            return list;
        }
    }
}
