import express from "express";

import { create, getAllTimeline, getTimelineById, update, deleteTimeline } from "../controller/timelineController.js";

const routeTimeline = express.Router();

routeTimeline.post("/timeline", create);
routeTimeline.get("/timelines", getAllTimeline);
routeTimeline.get("/timeline/:id", getTimelineById);
routeTimeline.put("/update/timeline/:id", update);
routeTimeline.delete("/delete/timeline/:id", deleteTimeline);

export default routeTimeline; 
