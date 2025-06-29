import express from "express"
import crypto from "crypto"

const router = express.Router()

router.post("/generate-signature", async (req, res) => {
    try {
        const { message } = req.body

        const secretKey = process.env.ESEWA_SECRET_KEY
        if (!secretKey) {
            return res.status(500).json({ success: false, message: "Missing secret key" })
        }

        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(message)
            .digest("base64")

        return res.status(200).json({ success: true, signature })
    } catch (err) {
        console.error("Signature error:", err)
        return res.status(500).json({ success: false, message: "Server error during signature generation" })
    }
})

export default router
