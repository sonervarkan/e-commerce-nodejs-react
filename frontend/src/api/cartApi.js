 
import api from './axios';

const cartApi = {

 
  getCustomerCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addCustomerCart: async (productId, price, quantity = 1) => {
    const response = await api.post('/cart/add', { 
      product_id: productId, 
      price,
      quantity 
    });
    return response.data;
  },

  removeCustomerCart: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },

  clearCustomerCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  mergeGuestCart: async (session_id) => {
    const response = await api.post('/cart/merge', { session_id });
    return response.data;
  },

 
  addGuestCart: async (sessionId, productId, price, quantity = 1) => {
    const response = await api.post('/cart/guest/add', { 
      session_id: sessionId,
      product_id: productId, 
      price,
      quantity 
    });
    return response.data;
  },

  getGuestCart: async (sessionId) => {
    const response = await api.get(`/cart/guest/${sessionId}`);
    return response.data;
  },

   
  getGuestCartCount: async (sessionId) => {
    try {
      const response = await api.get(`/cart/guest/${sessionId}/count`);
      return response.data.count || 0;
    } catch (error) {
      console.error("Get guest cart count error:", error);
      return 0;
    }
  },

  clearGuestCart: async (sessionId) => {
    const response = await api.delete(`/cart/guest/clear/${sessionId}`);
    return response.data;
  }

};

export default cartApi;