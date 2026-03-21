 
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GuestOrderItems = sequelize.define("GuestOrderItems", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    guest_order_id: {type: DataTypes.INTEGER, allowNull: false},
    product_id: {type: DataTypes.INTEGER, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    price: {type: DataTypes.DECIMAL(10,2), allowNull: false}
}, {
    tableName: "guest_order_items",
    timestamps: false
});

export default GuestOrderItems;
    