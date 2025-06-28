import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    inputData: {
        location: { type: String },
        locationCoordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
        soilType: String,
        nitrogenRequired: String,
        phosphorousRequired: String,
        potassiumRequired: String,
        soilpH: String,
        temperature: String,
        humidity: String,
        rainfall: String,
        farmSize: String,
        climate: String,
        previousCrop: String,
        budget: String,
        experience: String,
        notes: String,
    },
    recommendedCrops: [
        {
            cropName: { type: String, required: true },
            scientificName: { type: String, required: true },
            suitability: { type: Number },
            risk: { type: String },
        },
    ],
    predictedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Prediction", predictionSchema);
