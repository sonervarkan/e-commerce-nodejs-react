 
import { Brand, Model, BrandModelMap, Product } from "../models/index.js";

const getAllBrands = async () => {
  return await Brand.findAll({ 
    order: [['brand_name', 'ASC']] 
  });
};

const getModelsByBrandId = async (brandId) => {
  const brandModels = await BrandModelMap.findAll({
    where: { brand_id: brandId },
    include: [
      { 
        model: Model, 
        attributes: ['id', 'model_name'] 
      },
      { 
        model: Product, 
        attributes: ['id', 'image_url', 'price']  
      }
    ]
  });

  return brandModels.map(item => ({
    id: item.Model?.id,
    model_name: item.Model?.model_name,
    product_id: item.Products?.[0]?.id, 
    image_url: item.Products?.[0]?.image_url || null,
    price: item.Products?.[0]?.price || 0
  }));
};

export default {
  getAllBrands,
  getModelsByBrandId
};