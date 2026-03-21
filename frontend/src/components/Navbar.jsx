 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cartApi from '../api/cartApi';

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const updateCartCount = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || user?.token;
      const sessionId = localStorage.getItem("guest_session_id");

      if (token) {
      
        const data = await cartApi.getCustomerCart();
        if (Array.isArray(data)) {
          const total = data.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(total);
        }
      } else if (sessionId) {
        
        const count = await cartApi.getGuestCartCount(sessionId);
        setCartCount(count);
      } else {
        
        const newSessionId = crypto.randomUUID();
        localStorage.setItem("guest_session_id", newSessionId);
        setCartCount(0);
      }
    } catch (err) {
      console.error("Cart count update error:", err);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    
    const handleStorageChange = (e) => {
      if (e.key === 'guest_session_id' || e.key === 'token' || e.key === 'user') {
        updateCartCount();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);  
  
  useEffect(() => {
    updateCartCount();
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
     
    const newSessionId = crypto.randomUUID();
    localStorage.setItem("guest_session_id", newSessionId);
    
    
    window.dispatchEvent(new Event('cartUpdated'));
    
    navigate("/");
    window.location.reload();
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ color: '#8a3535', textDecoration: 'none', fontWeight: 'bold' }}>
        AUTO ESSENTIALS MARKET
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        <Link to="/cart" style={cartContainerStyle}>
          <span role="img" aria-label="cart" style={{ fontSize: '22px' }}>🛒</span>
          {!loading && cartCount > 0 && (
            <span style={badgeStyle}>{cartCount}</span>
          )}
        </Link>

        {user && user.customer ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>
              Welcome <strong>{user.customer.first_name} {user.customer.last_name}</strong>
            </span>

            <Link to="/my-orders" style={orderLinkStyle}>
              My Orders
            </Link>

            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'inline' }}>
            <Link to="/login" style={{ color: '#fff', marginRight: '10px' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

 
const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  padding: '15px 30px', 
  background: "darkblue", 
  color: '#fff',
  alignItems: 'center',
  gap: '20px'
};

const orderLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '14px',
  padding: '5px 10px',
  border: '1px solid #555',
  borderRadius: '4px',
  backgroundColor: '#444',
  transition: 'background 0.3s'
};

const cartContainerStyle = { 
  position: 'relative', 
  textDecoration: 'none', 
  color: '#fff',
  display: 'flex',
  alignItems: 'center'
};

const badgeStyle = { 
  position: 'absolute', 
  top: '-8px', 
  right: '-12px', 
  backgroundColor: '#ff4444', 
  color: 'white', 
  borderRadius: '50%', 
  padding: '2px 7px', 
  fontSize: '11px', 
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
};

const logoutBtnStyle = { 
  cursor: 'pointer', 
  padding: '5px 10px', 
  backgroundColor: '#555', 
  color: '#fff', 
  border: '1px solid #777',
  borderRadius: '4px' 
};

export default Navbar;