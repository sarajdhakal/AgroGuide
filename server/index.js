
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import routeCrop from "./routes/crop.js";
import cors from "cors";
import routeTimeline from "./routes/timeline.js";
import predictRoute from "./routes/predictRoute.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import selectedCropRoutes from "./routes/selectedCropRoutes.js"
import esewaRoutes from "./routes/esewaroute.js"
import esewaSignatureRoute from "./routes/esewasignature.js"
import adminRoutes from "./routes/adminRoutes.js"



const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
app.use(express.json());



const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("DB connected successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port :${PORT} `);
        });
    })
    .catch((error) => console.log(error));

app.use("/api", route);
app.use("/api", routeCrop);
app.use("/api", routeTimeline);
app.use("/api/crops", predictRoute);
app.use("/api/predictions", predictionRoutes);
app.use("/api/selected-crops", selectedCropRoutes)
app.use("/api/esewa", esewaRoutes)
app.use("/api/esewa/signature", esewaSignatureRoute)
app.use("/api/admin", adminRoutes)


const PORT2 = process.env.PORT || 5000;
app.listen(PORT2, () => console.log(`Server running on port ${PORT2}`));


const PORT1 = 8000;
app.listen(PORT1, () => {
    console.log(`Server running at http://localhost:${PORT1}`);
});
