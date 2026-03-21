 
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import productApi from '../../api/productApi'; 
import cartApi from '../../api/cartApi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError("Product ID not found");
          return;
        }

        const res = await productApi.getProductById(id);
        
        setProduct(res.data);
        
      } catch (err) {
        console.error("Product details could not be loaded:", err);
        setError(err.response?.data?.message || "An error occurred while uploading the product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const price = parseFloat(product.price);
      const notifyCartUpdate = () => window.dispatchEvent(new Event('cartUpdated'));

      console.log("Items to add to cart:", {
      productId: product.id,   
      brand_model_map_id: product.brand_model_map_id,  
      fullProduct: product
    });

      if (!user) {
        let sessionId = localStorage.getItem("guest_session_id");
        if (!sessionId) 
        {
          sessionId = uuidv4();
          localStorage.setItem("guest_session_id", sessionId);
        }

        await cartApi.addGuestCart(sessionId, product.id, price, quantity);

        notifyCartUpdate();
        
        alert(`${quantity} products have been added to your guest cart!`);
      } else {
        await cartApi.addCustomerCart(product.id, price, quantity);
        notifyCartUpdate();
        alert(`${quantity} products have been added to your cart!`);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("An error occurred while adding to the cart.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading product information...</h2>
        <p>Product ID: {id}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>Error!</h2>
        <p>{error}</p>
        <p>Ürün ID: {id}</p>
        <button onClick={() => navigate('/')}>Return to Homepage</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Product not found!</h2>
        <p>Product ID: {id}</p>
        <button onClick={() => navigate('/')}>Return to Homepage</button>
      </div>
    );
  }

  const totalPrice = (parseFloat(product.price) * quantity).toFixed(2);

  return (
    <div style={containerStyle}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <img 
          src={product.image_url ? `http://localhost:5000${product.image_url}` : 'https://via.placeholder.com/400'} 
          alt={product.product_description} 
          style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400';
          }}
        />
      </div>
      
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>{product.product_description}</h1>
        
        <div style={{ margin: '20px 0' }}>
          <p style={{ color: '#666', margin: 0 }}>Unit Price</p>
          <p style={{ fontSize: '32px', color: '#28a745', fontWeight: 'bold', margin: 0 }}>
            {product.price} TL
          </p>
        </div>

        <div style={{ margin: '20px 0' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Amount:
          </label>
          <div style={quantityContainerStyle}>
            <button onClick={decrement} style={qtyBtnStyle} disabled={quantity <= 1}>-</button>
            <span style={qtyTextStyle}>{quantity}</span>
            <button onClick={increment} style={qtyBtnStyle}>+</button>
          </div>
        </div>

        <div style={{ margin: '20px 0', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ color: '#666', margin: 0 }}>Total:</p>
          <h2 style={{ margin: 0, color: '#333' }}>{totalPrice} TL</h2>
        </div>

        <button onClick={handleAddToCart} style={buttonStyle}> Add to cart </button>

      </div>
    </div>
  );
};

 
const containerStyle = {
  display: 'flex',
  gap: '40px',
  padding: '40px',
  maxWidth: '1200px',
  margin: '0 auto',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const quantityContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  width: 'fit-content',
  color:'black'
};

const qtyBtnStyle = {
  padding: '10px 20px',
  backgroundColor: '#f5f5f5',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
  color:'black',
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};

const qtyTextStyle = {
  padding: '0 20px',
  fontSize: '18px',
  minWidth: '30px',
  textAlign: 'center'
};

const buttonStyle = {
  padding: '15px 30px',
  backgroundColor: '#ff9900',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '18px',
  fontWeight: 'bold',
  width: '100%',
  marginTop: '20px'
};

export default ProductDetail;