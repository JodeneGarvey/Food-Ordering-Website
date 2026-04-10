import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCustomer = () => {
  
  const { id } = useParams(); // ✅ get ID from URL
  const navigate = useNavigate();

  const [cus, setCus] = useState({
    type: "",
  });

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
     console.log("Fetching ID:", id); // ✅ debug

    const res = await fetch(`https://localhost:7156/api/Admin/getCustomerById/${id}`);
    const data = await res.json();

    console.log("API DATA:", data); // ✅ debug

    setCus({
      
      type: data.type || "",
      
    });

    setLoading(false);
  } catch (err) {
    console.error(err);
    alert("Error loading customer");
  }
};


  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCus({
      ...cus,
      [name]: value
    });
  };

  

  // ✅ UPDATE Type
  const updateType = async (e) => {
    e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("Id", id)
    formData.append("Type", cus.type.trim());

    

    const response = await fetch(
      "https://localhost:7156/api/Admin/updateCustomer",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.json();

    console.log("UPDATE RESULT:", result); // ✅ debug

    if (result.statusCode === 200) {
      alert("Customer updated successfully!");
      navigate("/listcustomers");
    } else {
      alert(result.statusMessage);
    }

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
};

  if (loading) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="edit-food">
      <h1>Edit Type</h1>

      <form className="edit-form" onSubmit={updateType}>
        
        

        <div className="form-group">
          <label>Type</label>
          <input
            name="type"
            value={cus.type}
            onChange={handleChange}
          />
        
        </div>

        <button type="submit" className="update-btn">
          Update Customer
        </button>
      </form>
    </div>
  );
};

export default EditCustomer;