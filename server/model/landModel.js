import mongoose from 'mongoose'

const landSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    areaSize: { type: Number, required: true },
    unit: { type: String, enum: ['kattha', 'ropani', 'hectare'], required: true },
    soilType: { type: String },
    ph: { type: Number },
    n_level: { type: Number },
    p_level: { type: Number },
    k_level: { type: Number },
    temperature: { type: Number },
    rainfall: { type: Number },
    humidity: { type: Number },
    irrigated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Land', landSchema);