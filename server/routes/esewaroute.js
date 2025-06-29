import express from "express"
import fetch from "node-fetch"
import crypto from "crypto"
import User from "../model/userModel.js"

const router = express.Router()

// Signature generation
router.post("/signature", (req, res) => {
    try {
        const { message } = req.body
        const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q"
        const signature = crypto.createHmac("sha256", secretKey).update(message).digest("base64")
        res.status(200).json({ success: true, signature })
    } catch (err) {
        console.error("Signature generation error:", err)
        res.status(500).json({ success: false, message: "Signature generation failed" })
    }
})

// Verification
router.post("/verify", async (req, res) => {
    try {
        const { transaction_uuid, total_amount, userId, planId, billingCycle } = req.body

        const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`

        const response = await fetch(verificationUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })

        const result = await response.json()
        console.log("✅ eSewa verification response:", result)

        if (result.status === "COMPLETE") {
            // Update the user's subscription status
            try {
                const startDate = new Date();
                const endDate = new Date(
                    billingCycle === "yearly"
                        ? startDate.getTime() + 365 * 24 * 60 * 60 * 1000
                        : startDate.getTime() + 30 * 24 * 60 * 60 * 1000
                );

                await User.findByIdAndUpdate(userId, {
                    $set: {
                        subscription: {
                            plan: planId,
                            billingCycle: billingCycle,
                            status: "active",
                            transactionId: result.transaction_uuid,
                            transactionRef: result.transaction_code || "", // eSewa ref code
                            paymentMethod: "esewa",
                            amount: Number(total_amount),
                            startDate,
                            endDate,
                            verifiedAt: new Date()
                        }
                    }
                });

                console.log("✅ User updated with Pro subscription.")
            } catch (updateErr) {
                console.error("❌ Failed to update user:", updateErr)
            }

            return res.status(200).json({
                success: true,
                message: "Payment verified and subscription activated",
                esewaTransactionCode: result.transaction_code,
                esewaStatus: result.status,
                transactionUuid: transaction_uuid,
                totalAmount: total_amount,
                subscription: {
                    plan: planId,
                    billingCycle,
                    status: "active",
                    verifiedAt: new Date().toISOString(),
                },
            })
        } else {
            return res.status(400).json({
                success: false,
                message: `Verification failed. Status: ${result.status}`,
                details: result,
            })
        }
    } catch (error) {
        console.error("❌ Server error during verification:", error)
        res.status(500).json({ success: false, message: "Server error", error: error.message })
    }
})

export default router
