 
import { Product, GuestOrder,  GuestOrderItems, CustomerOrder, 
  CustomerOrderItems, sequelize } from "../models/index.js";

const createCustomerOrder = async (orderData) => {
  const t = await sequelize.transaction();
  try {
    const order = await CustomerOrder.create({
      customer_id: orderData.customer_id,
      total_price: orderData.total_price,
      payment_status: "Pending"
    }, { transaction: t });

    const orderItems = orderData.items.map(item => ({
      customer_order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    await CustomerOrderItems.bulkCreate(orderItems, { transaction: t });
    
    await t.commit();

    return order;
  } catch (error) {
    await t.rollback();
    console.error("Customer order creation error:", error);
    throw error;
  }
};

const getCustomerOrders = async (customerId) => {
  try {
    const orders = await CustomerOrder.findAll({
      where: { customer_id: customerId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: CustomerOrderItems,
          as: 'CustomerOrderItems',
          include: [
            {
              model: Product,
              attributes: ["id", "product_description", "image_url"]
            }
          ]
        }
      ]
    });

    return orders;
  } catch (error) {
    console.error("Get customer orders error:", error);
    throw error;
  }
};

const createGuestOrder = async (orderData) => {
  const t = await sequelize.transaction();
  
  try {
 
    const newOrder = await GuestOrder.create({
      first_name: orderData.first_name,
      last_name: orderData.last_name,
      phone: orderData.phone,
      email: orderData.email,
      address: orderData.address,
      order_date: new Date(),
      total_price: orderData.total_price || orderData.total_amount,
      payment_status: "Pending"
    }, { transaction: t });

  
    if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
      const orderItems = orderData.items.map(item => ({
        guest_order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      await GuestOrderItems.bulkCreate(orderItems, { transaction: t });
    } 
 
    else if (orderData.product_id) {
      await GuestOrderItems.create({
        guest_order_id: newOrder.id,
        product_id: orderData.product_id,
        quantity: orderData.quantity || 1,
        price: orderData.price || 0
      }, { transaction: t });
    }

    await t.commit();
    
    const completedOrder = await GuestOrder.findByPk(newOrder.id, {
      include: [{
        model: GuestOrderItems,
        as: 'GuestOrderItems' 
      }]
    });
    
    console.log("Guest order created with items:", completedOrder.id);
    return completedOrder;
    
  } catch (error) {
    await t.rollback();
    console.error("Guest order creation error:", error);
    throw error;
  }
};


const getGuestOrders = async (email) => {
  try {
    const orders = await GuestOrder.findAll({
      where: { email: email },
      order: [["order_date", "DESC"]],
      include: [
        {
          model: GuestOrderItems,
          as: 'GuestOrderItems',  
          include: [
            {
              model: Product,
              attributes: ["id", "product_description", "image_url", "product_name"]
            }
          ]
        }
      ]
    });
    return orders;
  } catch (error) {
    console.error("Get guest orders error:", error);
    throw error;
  }
};


const updatePaymentStatus = async (orderId, isGuest) => {
  const t = await sequelize.transaction();
  try {
    if (isGuest) {
      const order = await GuestOrder.findByPk(orderId, { transaction: t });
      if (!order) {
        throw new Error("Guest order not found");
      }
      
      await GuestOrder.update(
        { payment_status: "Payment received" },
        { where: { id: orderId }, transaction: t }
      );
      
      
      const updatedOrder = await GuestOrder.findByPk(orderId, {
        include: [{
          model: GuestOrderItems,
          as: 'GuestOrderItems'
        }],
        transaction: t
      });
      
      await t.commit();
      return updatedOrder;
      
    } else {
      const order = await CustomerOrder.findByPk(orderId, { transaction: t });
      if (!order) {
        throw new Error("Order not found");
      }
      
      await CustomerOrder.update(
        { payment_status: "Payment received" },
        { where: { id: orderId }, transaction: t }
      );
      
      const updatedOrder = await CustomerOrder.findByPk(orderId, {
        include: [{
          model: CustomerOrderItems,
          as: 'CustomerOrderItems'
        }],
        transaction: t
      });
      
      await t.commit();
      return updatedOrder;
    }
  } catch (error) {
    await t.rollback();
    console.error("Payment status update error:", error);
    throw error;
  }
};

export default {
  createCustomerOrder,
  getCustomerOrders,
  createGuestOrder,
  getGuestOrders ,
  updatePaymentStatus
};