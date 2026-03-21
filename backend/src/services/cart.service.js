 
import { CustomerCart, Product, GuestCart } from "../models/index.js";

const addCustomerCart = async (customer_id, product_id, price, quantity = 1) => {

  const existingItem = await CustomerCart.findOne({
    where: { customer_id, product_id }
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = price;
    return await existingItem.save();
  }

  return await CustomerCart.create({
    customer_id,
    product_id,
    quantity,
    price
  });

};

const getCustomerCart = async (customer_id) => {

  return await CustomerCart.findAll({
    where: { customer_id },
    include: [{
      model: Product,
      attributes: ['id','product_description','price','image_url']
    }]
  });

};

const removeCustomerCart = async (customer_id, product_id) => {

  return await CustomerCart.destroy({
    where: { customer_id, product_id }
  });

};

const clearCustomerCart = async (customer_id) => {

  if (!customer_id) throw new Error("Customer_id not found");

  return await CustomerCart.destroy({
    where: { customer_id }
  });

};

const mergeGuestCart = async (session_id, customer_id) => {

  const guestItems = await GuestCart.findAll({ where: { session_id } });

  for (const item of guestItems) {

    const existingItem = await CustomerCart.findOne({
      where: { customer_id, product_id: item.product_id }
    });

    if (existingItem) {

      existingItem.quantity += item.quantity;
      await existingItem.save();
    } else {

      await CustomerCart.create({
        customer_id,
        product_id: item.product_id,
        price: item.price,
        quantity: item.quantity
      });
    }
  }
  await GuestCart.destroy({ where: { session_id } });

  return { message: "Cart merged successfully." };
};

const addGuestCart = async (session_id, product_id, price, quantity = 1) => {

  const existingItem = await GuestCart.findOne({
    where: { session_id, product_id }
  });

  if (existingItem) {

    existingItem.quantity += parseInt(quantity);
    return await existingItem.save();

  }

  return await GuestCart.create({
    session_id,
    product_id,
    price,
    quantity
  });

};

const getGuestCart = async (session_id) => {

  return await GuestCart.findAll({
    where: { session_id },
    include: [{
      model: Product,
      attributes: ['id','product_description','image_url','price']
    }]
  });

};

const clearGuestCart = async (session_id) => {

  return await GuestCart.destroy({
    where: { session_id }
  });

};

export default {
  addCustomerCart,
  getCustomerCart,
  removeCustomerCart,
  clearCustomerCart,
  mergeGuestCart,
  addGuestCart,
  getGuestCart,
  clearGuestCart
};