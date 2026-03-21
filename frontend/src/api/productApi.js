 
import api from "./axios";

const productApi = {
  createProduct: (data) => api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  getProducts: () => api.get("/products"),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  getProductById: (productId) => api.get(`/products/${productId}`)
};

export default productApi;