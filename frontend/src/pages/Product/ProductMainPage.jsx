 
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../../api/categoryApi";
import { getBrands, getModelsByBrand } from "../../api/brandApi.js";
import productApi from "../../api/productApi";  

const ProductMainPage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [allProducts, setAllProducts] = useState([]);  
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const BACKEND_URL = "http://localhost:5000";
  const navigate = useNavigate();

   
  useEffect(() => {
 
    categoryApi.getCategories()
      .then((res) => setCategories(res.data))
      .catch(err => console.error("Categories could not be loaded.", err));
    
  
    productApi.getProducts()
      .then((res) => {
        setAllProducts(res.data);
      })
      .catch(err => console.error("The products could not be loaded.", err));
  }, []);

 
  const handleCategoryClick = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      setSelectedBrand(null);
      setModels([]); 
      
      const res = await getBrands(); 
      const filteredBrands = res.data.filter(b => b.category_id === categoryId);
      
      setBrands(filteredBrands);
    } catch (err) {
      console.error("Brands could not be loaded.", err);
    } finally {
      setLoading(false);
    }
  };

   
  const handleBrandClick = async (brandId) => {
    try {
      setLoading(true);
      setSelectedBrand(brandId);
      
      const res = await getModelsByBrand(brandId);
      setModels(res.data);
    } catch (err) {
      console.error("Models could not be loaded.", err);
    } finally {
      setLoading(false);
    }
  };

 
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setModels([]);
    setBrands([]);
  };

 
  const handleProductClick = (item, isBrandSelected) => {
    let productId;

    if (isBrandSelected) {
      productId = item.product_id;
      
      if (!productId) {
        alert("The product details page could not be found.");
        return;
      }
    } else {
     
      productId = item.id;
    }

  
    navigate(`/product-detail/${productId}`);
  };

 
  const getDisplayItems = () => {
    if (selectedBrand) {
      return models;
    }
    return allProducts;
  };

  const displayItems = getDisplayItems();

  return (
    <div style={layoutStyle}>
      
      <aside style={sidebarStyle}>
        <h3 style={sidebarTitleStyle}>Filter</h3>
        
       
        <div style={filterGroupStyle}>
          <h4 style={filterLabelStyle}>Categories</h4>
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.id)} 
              style={{
                ...filterButtonStyle, 
                backgroundColor: selectedCategory === cat.id ? "#3498db" : "transparent",
                color: selectedCategory === cat.id ? "white" : "#2c3e50",
                fontWeight: selectedCategory === cat.id ? "bold" : "normal"
              }}
              disabled={loading}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

       
        {selectedCategory && (
          <div style={filterGroupStyle}>
            <h4 style={filterLabelStyle}>Brands</h4>
            {loading ? (
              <p style={{fontSize:"12px", color:"#95a5a6"}}>Loading...</p>
            ) : brands.length > 0 ? (
              brands.map((brand) => (
                <button 
                  key={brand.id} 
                  onClick={() => handleBrandClick(brand.id)} 
                  style={{
                    ...filterButtonStyle, 
                    backgroundColor: selectedBrand === brand.id ? "#2ecc71" : "transparent",
                    color: selectedBrand === brand.id ? "white" : "#2c3e50"
                  }}
                  disabled={loading}
                >
                  {brand.brand_name}
                </button>
              ))
            ) : (
              <p style={{fontSize:"12px", color:"#95a5a6"}}>Brand not found</p>
            )}
          </div>
        )}

       
        {(selectedCategory || selectedBrand) && (
          <button 
            onClick={handleClearFilters}
            style={resetButtonStyle}
            disabled={loading}
          >
            Clear Filters
          </button>
        )}
      </aside>

     
      <main style={mainContentStyle}>
        <h2 style={contentTitleStyle}>
          {selectedBrand 
            ? "Models from the Selected Brand" 
            : selectedCategory
              ? "Products Belonging to the Selected Category"
              : "Products in Stock"}
        </h2>
        
        {displayItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#95a5a6" }}>
            {loading ? "Loading products..." : "No products found to display."}
          </div>
        ) : (
          <div style={productGridStyle}>
            {displayItems.map((item) => (
              <div 
                key={item.id} 
                style={productCardStyle}
                onClick={() => handleProductClick(item, !!selectedBrand)}
              >
                <div style={imageWrapperStyle}>
                  {item.image_url ? (
                    <img 
                      src={`${BACKEND_URL}${item.image_url}`} 
                      alt={item.model_name || item.product_description} 
                      style={imageStyle}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="font-size:40px;">🖼️</div>';
                      }}
                    />
                  ) : (
                    <div style={noImageStyle}>🖼️</div>
                  )}
                </div>
                
                <div style={infoWrapperStyle}>
                  <h4 style={productNameStyle}>
                    {item.model_name || item.product_description}
                  </h4>
                  <p style={priceTagStyle}>{item.price || 0} USD</p>
                  <button style={viewBtnStyle}>
                    {selectedBrand ? "View Model" : "View Product"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

 
const layoutStyle = {
  display: "flex",
  gap: "30px",
  padding: "20px",
  maxWidth: "1400px",
  margin: "0 auto"
};

const sidebarStyle = {
  width: "250px",
  flexShrink: 0,
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "12px",
  height: "fit-content",
  position: "sticky",
  top: "20px",
  border: "1px solid #eee"
};

const mainContentStyle = {
  flexGrow: 1
};

const sidebarTitleStyle = { 
  marginBottom: "20px", 
  fontSize: "1.2rem", 
  color: "#34495e" 
};

const filterGroupStyle = { 
  marginBottom: "25px", 
  display: "flex", 
  flexDirection: "column", 
  gap: "5px" 
};

const filterLabelStyle = { 
  fontSize: "14px", 
  color: "#7f8c8d", 
  marginBottom: "10px", 
  textTransform: "uppercase" 
};

const filterButtonStyle = {
  textAlign: "left",
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.2s"
};

const resetButtonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px"
};

const contentTitleStyle = { 
  marginBottom: "25px", 
  borderBottom: "2px solid #eee", 
  paddingBottom: "10px" 
};

const productGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "25px"
};

const productCardStyle = {
  border: "1px solid #eee",
  borderRadius: "12px",
  overflow: "hidden",
  cursor: "pointer",
  backgroundColor: "#fff",
  transition: "box-shadow 0.3s"
};

const imageWrapperStyle = { 
  width: "100%", 
  height: "200px", 
  backgroundColor: "#fdfdfd", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center" 
};

const imageStyle = { 
  width: "100%", 
  height: "100%", 
  objectFit: "contain", 
  padding: "10px" 
};

const noImageStyle = { 
  fontSize: "40px" 
};

const infoWrapperStyle = { 
  padding: "15px", 
  textAlign: "center" 
};

const productNameStyle = { 
  fontSize: "16px", 
  marginBottom: "10px", 
  color: "#2c3e50", 
  height: "40px", 
  overflow: "hidden" 
};

const priceTagStyle = { 
  fontSize: "18px", 
  fontWeight: "bold", 
  color: "#27ae60", 
  marginBottom: "12px" 
};

const viewBtnStyle = { 
  width: "100%", 
  padding: "8px", 
  backgroundColor: "#34495e", 
  color: "white", 
  border: "none", 
  borderRadius: "6px",
  cursor: "pointer"
};

export default ProductMainPage;