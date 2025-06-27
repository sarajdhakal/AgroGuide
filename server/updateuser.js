import mongoose from "mongoose";
import Users from "./model/userModel.js"; // adjust if needed

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/mern";

async function updateExistingUsers() {
    await mongoose.connect("mongodb://localhost:27017/your-db-name");

    await Users.updateMany(
        { password: { $exists: false } },
        { $set: { password: "password" } }
    );


    console.log("All existing users updated with default password.");
    await mongoose.disconnect();
}

updateExistingUsers();