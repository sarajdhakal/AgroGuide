import Crop from '../model/cropModel.js'

export const create = async (req, res) => {
    try {
        const newCrop = new Crop(req.body);
        const { scientificName } = newCrop;

        const cropExist = await Crop.findOne({ scientificName });
        if (cropExist) {
            return res.status(400).json({ message: "Crop already exists." });
        }
        const savedData = await newCrop.save();
        res.status(200).json({ message: "Crop created successfully." });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const getAllCrops = async (req, res) => {
    try {
        const cropData = await Crop.find();
        if (!cropData || cropData.length === 0) {
            return res.status(404).json({ message: "Crop data not found." });
        }
        res.status(200).json(cropData);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const getCropById = async (req, res) => {
    try {
        const id = req.params.id;
        const cropExist = await Crop.findById(id);
        if (!cropExist) {
            return res.status(404).json({ message: "Crop not found." });
        }
        res.status(200).json(cropExist);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const cropExist = await Crop.findById(id);
        if (!cropExist) {
            return res.status(404).json({ message: "Crop not found." });
        }
        const updatedData = await Crop.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        // res.status(200).json(updatedData);
        res.status(200).json({ message: "Crop Updated successfully." });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const deleteCrop = async (req, res) => {
    try {
        const id = req.params.id;
        const cropExist = await Crop.findById(id);
        if (!cropExist) {
            return res.status(404).json({ message: "Crop not found." });
        }
        await Crop.findByIdAndDelete(id);
        res.status(200).json({ message: "Crop deleted successfully." });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};