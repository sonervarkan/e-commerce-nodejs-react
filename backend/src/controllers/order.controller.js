 
import orderService from "../services/order.service.js";

const createCustomerOrder = async (req, res) => {
  try {
  
    const orderData = {
      ...req.body,
      customer_id: req.user.customer_id  
    };
    const order = await orderService.createCustomerOrder(orderData);
    res.status(201).json({ message: "Your order has been successfully created.", order });
  } catch (error) {
    console.error("Order creation error:", error); 
    res.status(500).json({ message: "Order error", error: error.message });
  }
};

const createGuestOrder = async (req, res) => {
  try {
    const order = await orderService.createGuestOrder(req.body);
    res.status(201).json({ message: "Guest order successfully created.", order });
  } catch (error) {
    console.error("Guest order error:", error);
    res.status(500).json({ message: "Error while creating the order.", error: error.message });
  }
};

const completePayment = async (req, res) => {
  const { orderId, isGuest } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: "Order ID required." });
  }
  try {
    const result = await orderService.updatePaymentStatus(orderId, isGuest);
    res.status(200).json({ message: "Successful", details: result });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.customer_id; 
    const orders = await orderService.getCustomerOrders(customerId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Order history error:", error);
    res.status(500).json({ message: "Order history could not be loaded.", error: error.message });
  }
};

export default {
  createCustomerOrder,
  createGuestOrder,
  completePayment,
  getCustomerOrders
};