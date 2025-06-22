import Timeline from '../model/timelineModel.js';
import Crop from '../model/cropModel.js';

export const create = async (req, res) => {
    try {
        const { scientificName, tasks } = req.body;

        const crop = await Crop.findOne({ scientificName });
        if (!crop) {
            return res.status(404).json({ error: 'Crop not found' });
        }
        const cropExist = await Timeline.findOne({ scientificName });
        if (cropExist) {
            return res.status(400).json({ message: "Crop already exists." });
        }
        const timeline = new Timeline({ scientificName, tasks });
        await timeline.save();
        res.status(201).json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllTimeline = async (req, res) => {
    try {
        const timelines = await Timeline.find();
        res.status(200).json(timelines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTimelineById = async (req, res) => {
    try {
        const timeline = await Timeline.findById(req.params.id); // no populate
        if (!timeline) return res.status(404).json({ error: 'Timeline not found' });
        res.status(200).json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const update = async (req, res) => {
    try {
        const updated = await Timeline.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Timeline not found' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteTimeline = async (req, res) => {
    try {
        const deleted = await Timeline.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Timeline not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};