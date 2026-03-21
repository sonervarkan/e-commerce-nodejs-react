 
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Customer = sequelize.define("Customer", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING(40), allowNull: false },
  last_name: { type: DataTypes.STRING(50), allowNull: false },
  phone: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  address: { type: DataTypes.STRING(200), allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  is_phone_verified: { type: DataTypes.TINYINT, defaultValue: 0 },
  created_at: { type: DataTypes.DATE }
}, {
  tableName: "customers",
  timestamps: false
});

export default Customer;