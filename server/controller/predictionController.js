import Prediction from "../model/Prediction.js";

export const createPrediction = async (req, res) => {
    try {
        const { userId, inputData, recommendedCrops } = req.body;

        const prediction = await Prediction.create({
            userId,
            inputData,
            recommendedCrops,
        });

        res.status(201).json({ message: "Prediction saved", prediction });
    } catch (error) {
        console.error("Error creating prediction:", error);
        res.status(500).json({ error: "Failed to save prediction" });
    }
};

import SelectedCrop from "../model/SelectedCrop.js"

// CREATE selected crop
export const createSelectedCrop = async (req, res) => {
    try {
        const { predictionId, cropName, scientificName } = req.body

        if (!predictionId || !cropName || !scientificName) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const selected = await SelectedCrop.create({
            predictionId,
            cropName,
            scientificName,
        })

        res.status(201).json({ message: "Selected crop saved", selected })
    } catch (error) {
        console.error("Error creating selected crop:", error)
        res.status(500).json({ error: "Failed to create selected crop" })
    }
}


export const getAllPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.find().populate("userId", "name email");
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch predictions" });
    }
};

// Get predictions by user
export const getPredictionsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const predictions = await Prediction.find({ userId });
        res.json(predictions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user predictions" });
    }
};

// Update a prediction
export const updatePrediction = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const prediction = await Prediction.findByIdAndUpdate(id, updatedData, { new: true });
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: "Failed to update prediction" });
    }
};
//get prediction by id 
export const getPredictionById = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            return res.status(404).json({ error: "Prediction not found" });
        }
        res.json(prediction);
    } catch (error) {
        console.error("Error fetching prediction by ID:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a prediction
export const deletePrediction = async (req, res) => {
    const { id } = req.params;
    try {
        await Prediction.findByIdAndDelete(id);
        res.json({ message: "Prediction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete prediction" });
    }
};
