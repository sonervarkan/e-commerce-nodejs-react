 
import express from "express";
import brandController from "../controllers/brand.controller.js";

const router = express.Router();

router.get("/", brandController.getAllBrands);
router.get("/:brandId/models", brandController.getModelsByBrandId);

export default router;