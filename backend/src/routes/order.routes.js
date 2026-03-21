 
import express from "express";
import orderController from "../controllers/order.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/customer-order",
  verifyToken,
  orderController.createCustomerOrder
);

router.post(
  "/guest-order",
  orderController.createGuestOrder
);

router.post(
  "/complete-payment",
  orderController.completePayment
);

router.get(
  "/history",
  verifyToken,
  orderController.getCustomerOrders
);

export default router;