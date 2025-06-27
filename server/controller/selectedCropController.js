import SelectedCrop from "../model/SelectedCrop.js"
import mongoose from "mongoose"




// GET all selected crops
export const getAllSelectedCrops = async (req, res) => {
    try {
        const crops = await SelectedCrop.find().sort({ selectedAt: -1 })
        res.json(crops)
    } catch (error) {
        console.error("Error fetching selected crops:", error)
        res.status(500).json({ error: "Failed to fetch selected crops" })
    }
}

// GET by prediction ID
export const getSelectedCropByPrediction = async (req, res) => {
    try {
        const { predictionId } = req.params
        console.log("Frontend is using predictionId:", predictionId)

        if (!mongoose.Types.ObjectId.isValid(predictionId)) {
            console.warn("⚠️ Invalid ObjectId")
            return res.status(400).json({ error: "Invalid prediction ID format" })
        }

        const crop = await SelectedCrop.findOne({
            predictionId: new mongoose.Types.ObjectId(predictionId),
        }).sort({ selectedAt: -1 })

        if (!crop) {
            console.warn("🚫 No crop found for predictionId:", predictionId)
            return res.status(404).json({ error: "Selected crop not found" })
        }

        console.log("✅ Crop found:", crop)
        res.json(crop)
    } catch (error) {
        console.error("❌ Error fetching selected crop:", error.message)
        res.status(500).json({ error: "Failed to fetch selected crop" })
    }
}

// UPDATE selected crop
export const updateSelectedCrop = async (req, res) => {
    try {
        const { id } = req.params
        const { cropName, scientificName } = req.body

        const updated = await SelectedCrop.findByIdAndUpdate(
            id,
            { cropName, scientificName, selectedAt: new Date() },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ error: "Selected crop not found" })
        }

        res.json({ message: "Selected crop updated", updated })
    } catch (error) {
        console.error("Error updating selected crop:", error)
        res.status(500).json({ error: "Failed to update selected crop" })
    }
}

// DELETE selected crop
export const deleteSelectedCrop = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await SelectedCrop.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(404).json({ error: "Selected crop not found" })
        }

        res.json({ message: "Selected crop deleted" })
    } catch (error) {
        console.error("Error deleting selected crop:", error)
        res.status(500).json({ error: "Failed to delete selected crop" })
    }
}
