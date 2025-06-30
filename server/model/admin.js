import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "Admin User",
    },
}, {
    timestamps: true,
})

const Admin = mongoose.model("Admin", adminSchema)
export default Admin
