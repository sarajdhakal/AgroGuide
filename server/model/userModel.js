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
    },
    subscription: {
        plan: {
            type: String,
            enum: ["free", "pro", "enterprise"],
            default: "free"
        },
        billingCycle: {
            type: String,
            enum: ["monthly", "yearly"]
        },
        status: {
            type: String,
            enum: ["active", "expired"],
            default: "active"
        },
        transactionId: String,
        transactionRef: String,     // ✅ Added
        paymentMethod: String,      // ✅ Added
        amount: Number,
        startDate: Date,
        endDate: Date,
        verifiedAt: Date            // ✅ Added
    },
});

export default mongoose.model("Users", userSchema);
