import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Model = sequelize.define("Model", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  model_name: { type: DataTypes.STRING(30) }
}, {
  tableName: "models",
  timestamps: false
});

export default Model;