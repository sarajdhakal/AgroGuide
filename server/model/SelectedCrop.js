import mongoose from 'mongoose';

const selectedCropSchema = new mongoose.Schema({
    predictionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prediction',
        required: true,
    },
    cropName: { type: String, required: true },
    scientificName: { type: String, required: true },
    selectedAt: {
        type: Date,
        default: Date.now,
    },

});

export default mongoose.model("SelectedCrop", selectedCropSchema);
