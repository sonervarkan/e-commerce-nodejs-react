 
import api from "./axios";

const orderApi = {

  createCustomerOrder: (orderData) => {
    return api.post("/orders/customer-order", orderData);
  },

  createGuestOrder: (orderData) => {
    return api.post("/orders/guest-order", orderData);
  },

  completePayment: (paymentData) => {
    return api.post("/orders/complete-payment", paymentData);
  },

  getOrderHistory: () => {
    return api.get("/orders/history");
  }

};

export default orderApi;