import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Supplier = sequelize.define("Supplier", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING(40) },
  last_name: { type: DataTypes.STRING(40) },
  company_name: { type: DataTypes.STRING(50) },
  phone: { type: DataTypes.STRING(40) },
  email: { type: DataTypes.STRING(40) }
}, {
  tableName: "suppliers",
  timestamps: false
});

export default Supplier;