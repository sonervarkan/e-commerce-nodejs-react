 
import express from "express";
import cartController from "../controllers/cart.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

/* GUEST ROUTES */
router.post("/guest/add", cartController.addGuestCart);
router.get("/guest/:session_id", cartController.getGuestCart);
router.get("/guest/:session_id/count", cartController.getGuestCartCount);
router.delete("/guest/clear/:session_id", cartController.clearGuestCart);

/* AUTH REQUIRED ROUTES */
router.use(verifyToken);

router.get("/", cartController.getCustomerCart);
router.post("/add", cartController.addCustomerCart);
router.post("/merge", cartController.mergeGuestCart);
router.delete("/clear", cartController.clearCustomerCart);
router.delete("/:product_id", cartController.removeCustomerCart);

export default router;