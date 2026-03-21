
import { Category } from "../models/index.js";

const getAllCategories = async () => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "category_name"],
      order: [["category_name", "ASC"]]
    });
    return categories;
  } catch (error) {
    throw new Error("Categories could not be retrieved from the database.: " + error.message);
  }
};

export default {
  getAllCategories
};