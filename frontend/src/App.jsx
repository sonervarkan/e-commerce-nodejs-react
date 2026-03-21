 // frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";

import ProductMainPage from "./pages/Product/ProductMainPage";

import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

import ProductDetail from "./pages/Product/ProductDetail";
import ProductList from "./pages/Product/ProductList";
import ProductCreate from "./pages/Product/ProductCreate";
import ProductEdit from "./pages/Product/ProductEdit";

import Cart from "./pages/Cart";
import Checkout from "./pages/Payment/Checkout";
import OrderHistory from "./pages/OrderHistory";

export default function App() {

  const authData = JSON.parse(localStorage.getItem("user"));

  const isAdmin = authData?.role === "admin" || authData?.user?.role_id === 1;

  const isUser = authData?.token;

  return (

    <Router>

      {isAdmin ? <AdminNavbar /> : <Navbar />}

      <div className="container" style={{ padding: "20px" }}>

        <Routes>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {isAdmin ? (

            <>
              <Route path="/" element={<ProductList />} />

              <Route path="/create" element={<ProductCreate />} />

              <Route path="/edit/:id" element={<ProductEdit />} />

              <Route path="/cart" element={<Navigate to="/" />} />

            </>

          ) : (

            <>
              <Route path="/" element={<ProductMainPage />} />

              <Route path="/cart" element={<Cart />} />

              <Route path="/product-detail/:id" element={<ProductDetail />} />
              
              <Route path="/checkout" element={<Checkout />} />

              <Route path="/my-orders" element={isUser ? <OrderHistory /> : <Navigate to="/login" />} />

              <Route path="/create" element={<Navigate to="/" />} />

              <Route path="/edit/:id" element={<Navigate to="/" />} />

            </>

          )}

          <Route path="*" element={<h2>404 - Page Not Found</h2>} />

        </Routes>

      </div>

    </Router>

  );

}