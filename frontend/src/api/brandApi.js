 
import api from "./axios";

export const getBrands = () => api.get("/brands");
export const getModelsByBrand = (brandId) => api.get(`/brands/${brandId}/models`);