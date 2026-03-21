import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CustomerCart = sequelize.define("CustomerCart", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2) },
  added_at: { type: DataTypes.DATE }
}, {
  tableName: "customer_cart",
  timestamps: false
});

export default CustomerCart;