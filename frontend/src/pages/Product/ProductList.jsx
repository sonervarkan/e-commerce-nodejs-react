 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("An error occurred while uploading the products:", error);
      alert("Product list could not be retrieved.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? (Physical image and stock record will also be deleted)")) {
      try {
        await productApi.deleteProduct(id);
        alert("The product has been successfully deleted.");
         
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Deletion error:", error);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading data...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Product Management</h2>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ backgroundColor: "#2c3e50", color: "white", textAlign: "left" }}>
            <th style={styles.th}>Image</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Brand</th>
            <th style={styles.th}>Model</th>
            <th style={styles.th}>Product Description</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={styles.td}>
                  {product.image_url ? (
                    <img 
                      src={`http://localhost:5000${product.image_url}`} 
                      alt="Ürün" 
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} 
                    />
                  ) : (
                    <div style={{ width: "50px", height: "50px", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>No image</div>
                  )}
                </td>
                <td style={styles.td}>{product.BrandModelMap?.Brand?.Category?.category_name || "---"}</td>
                <td style={styles.td}>{product.BrandModelMap?.Brand?.brand_name || "---"}</td>
                <td style={styles.td}>{product.BrandModelMap?.Model?.model_name || "---"}</td>
                <td style={styles.td}>{product.product_description}</td>
                <td style={styles.td}>{product.price} TL</td>
                <td style={styles.td}>{product.Stock?.quantity || 0}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => navigate(`/edit/${product.id}`)}
                    style={{ ...styles.btn, backgroundColor: "#3498db" }}
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    style={{ ...styles.btn, backgroundColor: "#e74c3c" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No products have been added yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

 
const styles = {
  th: { padding: "12px 15px" },
  td: { padding: "12px 15px" },
  btn: {
    marginRight: "5px",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "13px"
  }
};

export default ProductList;