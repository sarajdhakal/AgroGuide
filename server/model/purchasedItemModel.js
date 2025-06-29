import mongoose from "mongoose"

const schema = new mongoose.Schema({
    userId: String,
    planId: String,
    billingCycle: String,
    transactionId: String,
    amount: Number,
    provider: String
}, { timestamps: true })

export default mongoose.model("PurchasedItem", schema)
