 
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuestCart = sequelize.define("guest_cart", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  session_id: {type: DataTypes.STRING, allowNull: false},
  product_id: {type: DataTypes.INTEGER, allowNull: false},
  quantity: {type: DataTypes.INTEGER, defaultValue: 1},
  price: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
  added_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
}, {
  tableName: "guest_cart",
  timestamps: false,
});

export default GuestCart;