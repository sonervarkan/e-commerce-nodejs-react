import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Stock = sequelize.define("Stock", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false }  
}, {
  tableName: "stocks",
  timestamps: false
});

export default Stock;