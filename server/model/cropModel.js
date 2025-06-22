import mongoose from 'mongoose'

const cropSchema = new mongoose.Schema({

    cropName: { type: String, required: true },
    scientificName: { type: String },
    category: { type: String },
    season: { type: String },
    growthPeriod: { type: String },
    nitrogenRequired: { type: String },
    phosphorusRequired: { type: String },
    potassiumRequired: { type: String },
    weather: { type: String },
    temperature: { type: String },
    rainfall: { type: String },
    humidity: { type: String },
    soilpH: { type: String },
    marketValue: { type: Number },
    soilType: { type: String },
    climate: { type: String },
    fertilizer: { type: String },
    pestControl: { type: String },
    harvesting: { type: String },
    storage: { type: String },
    spacing: { type: String },
    sunlight: { type: String },
    description: { type: String },
    tips: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Crop', cropSchema);