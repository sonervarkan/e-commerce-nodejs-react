import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand_model_map_id: { type: DataTypes.INTEGER },
  product_description: { type: DataTypes.STRING(250) },
  long_description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  image_url: { type: DataTypes.STRING(100) },
  discounted_price: { type: DataTypes.DECIMAL(10,2) },
  created_at: { type: DataTypes.DATE }
}, {
  tableName: "products",
  timestamps: false
});

export default Product;