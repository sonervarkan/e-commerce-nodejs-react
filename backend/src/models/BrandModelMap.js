import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BrandModelMap = sequelize.define("BrandModelMap", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand_id: { type: DataTypes.INTEGER },
  model_id: { type: DataTypes.INTEGER }
}, {
  tableName: "brand_model_map",
  timestamps: false
});

export default BrandModelMap;