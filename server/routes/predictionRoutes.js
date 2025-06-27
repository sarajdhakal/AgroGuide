import express from "express";
import {
    createPrediction, createSelectedCrop,
    getAllPredictions,
    getPredictionsByUser,
    updatePrediction,
    deletePrediction,
    getPredictionById
} from '../controller/predictionController.js';

const router = express.Router();

router.post("/", createPrediction); // POST /api/predictions
router.post("/select", createSelectedCrop); // POST /api/predictions/select
router.get("/", getAllPredictions);                    // GET /api/predictions
router.get("/:id", getPredictionById);
router.get("/user/:userId", getPredictionsByUser);     // GET /api/predictions/user/:userId
router.put("/:id", updatePrediction);                  // PUT /api/predictions/:id
router.delete("/:id", deletePrediction);   // DELETE /api/predictions/:id

export default router;
