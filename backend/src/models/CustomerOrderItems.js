 
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CustomerOrderItems = sequelize.define("CustomerOrderItems", {

  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  customer_order_id: {type: DataTypes.INTEGER, allowNull: false},
  product_id: {type: DataTypes.INTEGER, allowNull: false},
  quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
  price: {type: DataTypes.DECIMAL(10,2), allowNull: false}
}, {
  tableName: "customer_order_items",
  timestamps: false
});

export default CustomerOrderItems;