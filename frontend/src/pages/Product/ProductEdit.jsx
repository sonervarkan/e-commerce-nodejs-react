
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import categoryApi from "../../api/categoryApi";

const ProductEdit = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);


  const [formData, setFormData] = useState({
    category_id: "",
    brand_name: "",
    model_name: "",
    product_description: "",
    long_description: "",
    price: "",
    discounted_price: "",
    stock_quantity: ""
  });


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryApi.getCategories(),
          productApi.getProducts()
        ]);
        setCategories(catRes.data);

        
        const product = prodRes.data.find((p) => p.id === parseInt(id));
        
        if (product) {
          setFormData({
            category_id: product.BrandModelMap?.Brand?.category_id || "",
            brand_name: product.BrandModelMap?.Brand?.brand_name || "",
            model_name: product.BrandModelMap?.Model?.model_name || "",
            product_description: product.product_description || "",
            long_description: product.long_description || "",
            price: product.price || "",
            discounted_price: product.discounted_price || "",
            stock_quantity: product.Stock?.quantity || ""
          });
          setPreviewImage(product.image_url);
        }
      } catch (error) {
        console.error("Loading error:", error);
        alert("Data could not be loaded.");
      }
    };
    loadInitialData();
  }, [id]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value 
    }));
  };

  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
   
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
   
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      await productApi.updateProduct(id, data);
      alert("The product has been successfully updated!");
      navigate("/");  
    } catch (error) {
      console.error("Update error:", error);
      alert("Error: " + (error.response?.data?.message || "Could not be updated."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>← Go back</button>
      <h2>Edit Product (ID: {id})</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Category:</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} required style={styles.input}>
            <option value="">Select a Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.category_name}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Brand Name:</label>
          <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label>Model Name:</label>
          <input type="text" name="model_name" value={formData.model_name} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label>Product Description:</label>
          <input type="text" name="product_description" value={formData.product_description} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label>Long Description:</label>
          <textarea name="long_description" value={formData.long_description} onChange={handleChange} rows="4" style={styles.input} />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>Price (TL):</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Stock Quantity:</label>
            <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required style={styles.input} />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label>Product Image:</label>
          <div style={{ marginBottom: "10px" }}>
            {previewImage && !selectedFile && (
              <div style={{ marginBottom: "5px" }}>
                <small>Current Image:</small><br />
                <img src={`http://localhost:5000${previewImage}`} alt="mevcut" style={{ width: "80px", borderRadius: "4px" }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "Saving..." : "Apply changes"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  formGroup: { marginBottom: "15px" },
  input: { width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" },
  submitBtn: { backgroundColor: "#2980b9", color: "white", padding: "12px 25px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }
};

export default ProductEdit;