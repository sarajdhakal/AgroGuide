import express from "express"
import fetch from "node-fetch"
import { updateUserSubscription } from "../controller/updateuser.js" // optional, or inline the logic

const router = express.Router()

router.post("/verify", async (req, res) => {
    try {
        const { token, amount, userId, planId, billingCycle } = req.body

        const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
            method: "POST",
            headers: {
                Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, amount }),
        })

        const result = await response.json()

        if (response.ok && result.state?.name === "Completed") {
            // You can move this to a separate file (updateUserSubscription)
            // or keep it here

            await updateUserSubscription({
                userId,
                plan: planId,
                billingCycle,
                transactionId: result.idx,
                amount: result.amount,
            })

            return res.status(200).json({
                success: true,
                message: "Payment verified and subscription activated",
                transactionId: result.idx,
                amount: result.amount,
                subscription: {
                    plan: planId,
                    billingCycle,
                    status: "active",
                },
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Khalti payment verification failed",
                result,
            })
        }
    } catch (error) {
        console.error("❌ Khalti payment verification error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
});

router.get("/public-key", (req, res) => {
    return res.status(200).json({
        publicKey: process.env.KHALTI_PUBLIC_KEY,
    })
})
export default router
