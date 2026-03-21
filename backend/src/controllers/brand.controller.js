 
import brandService from "../services/brand.service.js";

const getAllBrands = async (req, res) => {
  try {
    const brands = await brandService.getAllBrands();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getModelsByBrandId = async (req, res) => {
  try {
    const { brandId } = req.params;

    const models = await brandService.getModelsByBrandId(brandId);

    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getAllBrands, getModelsByBrandId };