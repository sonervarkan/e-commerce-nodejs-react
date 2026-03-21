 
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuestOrder = sequelize.define("GuestOrder", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING(255) },
  last_name: { type: DataTypes.STRING(255) },
  phone: { type: DataTypes.STRING(15) },
  email: { type: DataTypes.STRING(255) },
  address: { type: DataTypes.TEXT },
  order_date: { type: DataTypes.DATE },
  total_price: { type: DataTypes.DECIMAL(10,2) },
  payment_status: { type: DataTypes.STRING, defaultValue: "Pending" }
}, {
  tableName: "guest_orders",
  timestamps: false
});

export default GuestOrder;