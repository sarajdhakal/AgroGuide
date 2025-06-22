import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    scientificName: {
        type: String,
        required: true,
        ref: "Crop"
    },
    tasks: [
        {
            day: { type: Number, required: true },
            title: { type: String, required: true },
            details: { type: String, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Timeline", timelineSchema);
