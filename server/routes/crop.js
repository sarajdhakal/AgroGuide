import express from "express";

import { create, deleteCrop, getAllCrops, getCropById, update } from "../controller/cropController.js";

const routeCrop = express.Router();

routeCrop.post("/crop", create);
routeCrop.get("/crops", getAllCrops);
routeCrop.get("/crop/:id", getCropById);
routeCrop.put("/update/crop/:id", update);
routeCrop.delete("/delete/crop/:id", deleteCrop);

export default routeCrop; 
