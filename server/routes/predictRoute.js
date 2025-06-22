import express from "express";
import { predictCrop } from "../controller/predictController.js";

const router = express.Router();
router.post("/predict", predictCrop);

export default router;
