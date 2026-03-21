// backend/seeders/seed-admin.js
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { User, Role, sequelize } from "../src/models/index.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") }); 

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("The database has been connected.");

    const [adminRole] = await Role.findOrCreate({
      where: { role_name: 'admin' }
    });

    const adminEmail = process.env.ADMIN_EMAIL; 
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [admin, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        username: "admin",
        password: hashedPassword,
        role_id: adminRole.id
      }
    });

    if (created) {
      console.log("Admin created successfully.");
    } else {
      console.log("The admin already exists.");
    }

  } catch (error) {
    console.error("Manual Seed Error:", error);
  } finally {
    await sequelize.close();
    process.exit();
  }
};

seedAdmin();