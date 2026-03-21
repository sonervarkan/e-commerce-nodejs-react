import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ProductSupplierDetail = sequelize.define("ProductSupplierDetail", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER },
  supplier_id: { type: DataTypes.INTEGER }
}, {
  tableName: "product_supplier_details",
  timestamps: false
});

export default ProductSupplierDetail;