 
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CustomerOrder = sequelize.define("CustomerOrder", {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  customer_id: {type: DataTypes.INTEGER, allowNull: false},
  total_price: {type: DataTypes.DECIMAL(10,2), allowNull: false},
  payment_status: {type: DataTypes.STRING, defaultValue: "Pending"}
}, {
  tableName: "customer_orders",
  timestamps: true
});

export default CustomerOrder;