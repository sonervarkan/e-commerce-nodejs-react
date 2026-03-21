 
import cartService from "../services/cart.service.js";

const addCustomerCart = async (req, res) => {

  try {

    const { product_id, price, quantity } = req.body;
    const customer_id = req.user.customer_id;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID required." });
    }

    const item = await cartService.addCustomerCart(customer_id, product_id, price, quantity);

    res.status(201).json({
      message: "Product added to cart.",
      item
    });

  } catch (error) {

    res.status(500).json({
      message: "Error adding to cart.",
      error: error.message
    });

  }

};

const getCustomerCart = async (req, res) => {

  try {

    const customer_id = req.user.customer_id;

    const items = await cartService.getCustomerCart(customer_id);

    res.status(200).json(items);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching cart."
    });

  }

};

const removeCustomerCart = async (req, res) => {

  try {

    const { product_id } = req.params;
    const customer_id = req.user.customer_id;

    await cartService.removeCustomerCart(customer_id, product_id);

    res.status(200).json({
      message: "Item removed from cart."
    });

  } catch (error) {

    res.status(500).json({
      message: "Error removing item."
    });

  }

};

const clearCustomerCart = async (req, res) => {

  try {

    const customer_id = req.user.customer_id;

    await cartService.clearCustomerCart(customer_id);

    res.status(200).json({
      message: "Cart cleared."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Cart could not be cleared."
    });

  }

};

const mergeGuestCart = async (req, res) => {

  try {

    const { session_id } = req.body;
    const customer_id = req.user.customer_id;

    if (!session_id) {
      return res.status(400).json({ message: "Session ID required." });
    }

    await cartService.mergeGuestCart(session_id, customer_id);

    res.status(200).json({
      message: "Cart merged."
    });

  } catch (error) {

    res.status(500).json({
      message: "Error merging carts.",
      error: error.message
    });

  }

};


const addGuestCart = async (req, res) => {

  try {

    const { session_id, product_id, price, quantity } = req.body;

     console.log("🔴 Backend addGuestCart - Gelen veri:", {
      session_id,
      product_id,  
      price,
      quantity,
      body: req.body
    });

    if (!session_id || !product_id) {
      return res.status(400).json({
        message: "Session ID and Product ID required."
      });
    }

    const item = await cartService.addGuestCart(session_id, product_id, price, quantity);

   
    const cartItems = await cartService.getGuestCart(session_id);
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.status(201).json({
      message: "Added to guest cart.",
      item,
      cartCount: totalCount  
    });

  } catch (error) {
    console.error("🔴 Backend addGuestCart hatası:", error);
    res.status(500).json({
      message: "Error adding to guest cart.",
      error: error.message
    });

  }

};

const getGuestCart = async (req, res) => {

  try {

    const { session_id } = req.params;

    const items = await cartService.getGuestCart(session_id);

    res.status(200).json(items);

  } catch (error) {

    console.error("Get guest cart error:", error);  
    res.status(500).json({
      message: "Error fetching guest cart.",
      error: error.message
    });

  }

};

 
const clearGuestCart = async (req, res) => {

  try {

    const { session_id } = req.params;

    await cartService.clearGuestCart(session_id);

    res.status(200).json({
      message: "Guest cart cleared.",
      cartCount: 0   
    });

  } catch (error) {

    res.status(500).json({
      message: "Error clearing guest cart."
    });

  }

};

 
const getGuestCartCount = async (req, res) => {

  try {

    const { session_id } = req.params;

    const items = await cartService.getGuestCart(session_id);
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({ count: totalCount });

  } catch (error) {

    console.error("Get guest cart count error:", error);
    res.status(500).json({
      message: "Error fetching cart count.",
      count: 0
    });

  }

};


export default {
  addCustomerCart,
  getCustomerCart,
  removeCustomerCart,
  clearCustomerCart,
  mergeGuestCart,
  addGuestCart,
  getGuestCart,
  clearGuestCart,
  getGuestCartCount
};