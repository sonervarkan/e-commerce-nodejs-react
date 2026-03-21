
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  
  const authData = JSON.parse(localStorage.getItem("user"));
  const isAdmin = authData?.user?.role === 'admin'; 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: 'bold' }}>E-Commerce Panel</div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={linkStyle}>Home Page</Link>

        {isAdmin && (
          <>
            <Link to="/" style={adminLinkStyle}>Product List</Link>
            <Link to="/create" style={adminLinkStyle}>New Product</Link>
          </>
        )}

        {authData ? (
          <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
        ) : (
          <Link to="/login" style={linkStyle}>Login</Link>
        )}
      </div>
    </nav>
  );
};


const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 50px', backgroundColor: '#2c3e50', color: 'white', alignItems: 'center' };
const linkStyle = { color: 'white', textDecoration: 'none' };
const adminLinkStyle = { color: '#27ae60', textDecoration: 'none', fontWeight: 'bold' };
const logoutBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' };

export default AdminNavbar;