import axios from "axios";

export const predictCrop = async (req, res) => {
    try {
        // 🔗 Flask model API
        const response = await axios.post("http://127.0.0.1:5000/predict", req.body);

        // Log to terminal
        console.log("User Input:", req.body);
        console.log("Predicted Crop:", response.data.recommended_crop);

        res.status(200).json(response.data);
    } catch (err) {
        console.error("Prediction error:", err.message);
        res.status(500).json({ error: "Prediction failed", details: err.message });
    }
};
