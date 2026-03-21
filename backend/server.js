
import dotenv from "dotenv";
dotenv.config(); 
import app from "./src/app.js";
import { sequelize } from "./src/models/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await sequelize.sync({ alter:false});
    console.log("Models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();