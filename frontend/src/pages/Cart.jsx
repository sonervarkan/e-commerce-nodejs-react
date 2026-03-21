 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../api/cartApi";
import orderApi from "../api/orderApi";

const Cart = () => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {

    try {

      setLoading(true);

      const userStr = localStorage.getItem("user");
      let data;

      if (userStr) {data = await cartApi.getCustomerCart();} 

      else {const sessionId = localStorage.getItem("guest_session_id");
        if (sessionId) {data = await cartApi.getGuestCart(sessionId);} 
        else {data = [];}
      }

      setCartItems(data || []);
    } 
    catch (err) { console.error("Failed to fetch cart:", err);} 
    finally {setLoading(false);}

  };

  const calculateTotal = () => {

    return cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0 );

  };

  const handleCheckout = async () => {
  if (cartItems.length === 0) return;
  setIsProcessing(true);
  
  try {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    let orderId;
    let isGuest = true;

    if (user && user.token) {
      isGuest = false;
      const orderData = {
        total_price: calculateTotal(),
        items: cartItems.map((item) => ({
          product_id: item.product_id || item.Product?.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      console.log("Sending order data:", orderData);  
      const res = await orderApi.createCustomerOrder(orderData);
      orderId = res.data.order.id;
    } else {
      
      const firstName = prompt("Please enter your first name:");
      const lastName = prompt("Please enter your last name:");
      const email = prompt("Your email address:");
      const phone = prompt("Your phone number:");  
      const address = prompt("Delivery address:");
      
      if (!firstName || !lastName || !email || !phone || !address) {
        alert("All information is required to create an order.");
        setIsProcessing(false);
        return;
      }

      
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.product_id || item.Product?.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: calculateTotal(),
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        address: address
      };
      
      console.log("Sending guest order data:", orderData); 
      const res = await orderApi.createGuestOrder(orderData);
      orderId = res.data.order.id;
      isGuest = true;
    }

    navigate("/checkout", { 
      state: { 
        orderId, 
        isGuest, 
        totalAmount: calculateTotal() 
      } 
    });
  } catch (err) {
    console.error("Order creation error:", err);
    console.error("Error response:", err.response?.data);  
    alert(`An error occurred while creating the order: ${err.response?.data?.message || err.message}`);
  } finally {
    setIsProcessing(false);
  }
};

  if (loading) {

    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Your cart is loading...
      </div>
    );

  }

  return (

    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>

      <h1>My cart ({cartItems.length} Product)</h1>

      {cartItems.length === 0 ? (

        <div style={{ textAlign: "center", marginTop: "50px" }}>

          <p>Your shopping cart is currently empty.</p>

          <button
            style={emptyButtonStyle}
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>

        </div>

      ) : (

        <>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {cartItems.map((item) => (

              <div key={item.id} style={itemStyle}>

                <img
                  src={`${BACKEND_URL}${item.Product?.image_url}`}
                  width="100"
                  alt={item.Product?.product_description}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover"
                  }}
                />

                <div style={{ flex: 1 }}>

                  <h3 style={{ margin: "0 0 10px 0" }}>
                    {item.Product?.product_description || "Product"}
                  </h3>

                  <p style={{ margin: 0, color: "#666" }}>
                    {item.price} TL x {item.quantity}
                  </p>

                </div>

                <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} TL
                </div>

              </div>

            ))}

          </div>

          <div
            style={{
              marginTop: "30px",
              borderTop: "2px solid #eee",
              paddingTop: "20px",
              textAlign: "right"
            }}
          >

            <h2 style={{ marginBottom: "20px" }}>
              Grand Total: {calculateTotal().toFixed(2)} TL
            </h2>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              style={{
                ...checkoutButtonStyle,
                opacity: isProcessing ? 0.7 : 1,
                cursor: isProcessing ? "not-allowed" : "pointer"
              }}
            >

              {isProcessing ? "Preparing..." : "Complete Shopping"}

            </button>

          </div>

        </>

      )}

    </div>

  );

};

const itemStyle = {
  display: "flex",
  border: "1px solid #ddd",
  padding: "15px",
  alignItems: "center",
  gap: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
};

const checkoutButtonStyle = {
  backgroundColor: "#28a745",
  color: "white",
  padding: "15px 40px",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  fontWeight: "bold",
  transition: "all 0.3s ease"
};

const emptyButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Cart;