import express from "express"
import {
    getAllSelectedCrops,
    getSelectedCropByPrediction,
    updateSelectedCrop,
    deleteSelectedCrop,
} from "../controller/selectedCropController.js"

const router = express.Router()

router.get("/", getAllSelectedCrops)
router.get("/:predictionId", getSelectedCropByPrediction)
router.put("/:id", updateSelectedCrop)
router.delete("/:id", deleteSelectedCrop)

export default router
