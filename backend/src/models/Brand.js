import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Brand = sequelize.define("Brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand_name: { type: DataTypes.STRING(30) },
  category_id: { type: DataTypes.INTEGER }
}, {
  tableName: "brands",
  timestamps: false
});

export default Brand;