import mongoose from "mongoose";
import Users from "./model/userModel.js"; // adjust if needed

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/mern";

async function removeNameField() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const result = await Users.updateMany({}, { $unset: { name: "" } });
        console.log(`🧹 Removed 'name' from ${result.modifiedCount} users.`);
    } catch (err) {
        console.error("❌ Error during cleanup:", err);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
}

removeNameField();
