import mongoose from "mongoose";
import Users from "./model/userModel.js";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/mern";

async function check() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const users = await Users.find({}, { name: 1, firstName: 1, lastName: 1 });
        console.log("📋 Found Users:");
        users.forEach(u => {
            console.log(`- name: "${u.name}", firstName: "${u.firstName}", lastName: "${u.lastName}"`);
        });

        console.log(`📦 Total: ${users.length}`);
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected");
    }
}

check();
