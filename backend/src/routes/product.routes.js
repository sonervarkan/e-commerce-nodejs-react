 
import express from "express";
import { upload } from "../middlewares/upload.js";
import productController from "../controllers/product.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/:productId", productController.getProductById); 

router.get("/", productController.getProducts);  
router.post("/", verifyToken, roleMiddleware("admin"), upload.single("image"), productController.createProduct);
router.put("/:id", verifyToken,roleMiddleware("admin"), upload.single("image"), productController.updateProduct);
router.delete("/:id", verifyToken, roleMiddleware("admin"), productController.deleteProduct);

export default router;