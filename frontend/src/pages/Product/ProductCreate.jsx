
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import categoryApi from "../../api/categoryApi"; 

const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null); 
  

  const [formData, setFormData] = useState({
    category_id: "", 
    brand_name: "",
    model_name: "",
    product_description: "",
    long_description: "",
    price: "",
    discounted_price: "",
    stock_quantity: "",
    first_name:"", 
    last_name:"",
    company_name:"", 
    supplier_phone:"", 
    supplier_email:""
  });

 

  
  const authData = JSON.parse(localStorage.getItem("user"));
  if (!authData || authData.user.role !== 'admin') {
    return <div>You do not have permission to access this page.</div>;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("An error occurred while loading categories:", error);
      }
    };
    fetchCategories();
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert("Please select a category!");
      return;
    }

    setLoading(true);

    const data = new FormData();
    
    
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      await productApi.createProduct(data);
      alert("Product added successfully!");
      navigate("/"); 
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during the insertion process: " + (error.response?.data?.message || "Server error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-container" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Category:</label>
          <select 
            name="category_id" 
            value={formData.category_id} 
            onChange={handleChange} 
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select a Category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Brand Name:</label>
          <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Model Name:</label>
          <input type="text" name="model_name" value={formData.model_name} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Product Description:</label>
          <input type="text" name="product_description" value={formData.product_description} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Long Description:</label>
          <textarea name="long_description" value={formData.long_description} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Supplier First Name:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Supplier Last Name:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Supplier Company Name:</label>
          <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Supplier Phone:</label>
          <input type="text" name="supplier_phone" value={formData.supplier_phone} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Supplier E-mail:</label>
          <input type="text" name="supplier_email" value={formData.supplier_email} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block" }}>Price:</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block" }}>Stock Amount:</label>
            <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Product Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#27ae60", 
            color: "white", 
            border: "none", 
            cursor: loading ? "not-allowed" : "pointer" 
          }}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;