 
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import cartApi from "../../api/cartApi";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, isGuest, totalAmount } = location.state || {};
  
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '' });

  const handlePayment = async (e) => {
  e.preventDefault();
  try {
    await orderApi.completePayment({ orderId, isGuest });

    if (isGuest) {
      const session_id = localStorage.getItem("guest_session_id");

      await cartApi.clearGuestCart(session_id); 
      localStorage.removeItem("guest_session_id");
    } else {
      await cartApi.clearCustomerCart();
    }

    window.dispatchEvent(new Event('cartUpdated'));

    alert("Payment successful! Your order is being prepared.");
    navigate("/"); 
  } catch (err) {
    console.error("Payment error:", err);
    alert("An error occurred while confirming the payment.");
  }
};

  if (!orderId) return <div>Incorrect access.</div>;

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Payment Panel</h2>
      <p>Amount to be Paid: <strong>{totalAmount} TL</strong></p>
      <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder="Cart Number" maxLength="16" required onChange={e => setCardInfo({...cardInfo, number: e.target.value})} />
        <div style={{ display: 'flex', gap: '5px' }}>
          <input placeholder="AA/YY" required style={{ flex: 2 }} />
          <input placeholder="CVV" maxLength="3" required style={{ flex: 1 }} />
        </div>
        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', fontWeight: 'bold' }}>
          Complete Payment
        </button>
      </form>
    </div>
  );
};

export default Checkout;