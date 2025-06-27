import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Admin', 'Moderator'],
        default: 'User'
    },
    phoneNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active'
    },
    farmLocation: {
        type: String
    },
    farmSize: {
        type: String,
    },
    experience: {
        type: String,
        min: 0
    },
    description: {
        type: String
    },
    password: {
        type: String,
        required: true,
        default: 'password'
    }
});

export default mongoose.model("Users", userSchema);
