import axios from "axios";
import Users from "../model/userModel.js"; // Make sure it's the correct model path

export const verifyKhaltiPayment = async (req, res) => {
    const { token, amount } = req.body;
    const userId = req.user.id; // Assume authentication middleware sets this

    try {
        const khaltiResponse = await axios.post(
            "https://khalti.com/api/v2/payment/verify/",
            { token, amount },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
            }
        );

        if (khaltiResponse.data?.idx) {
            await Users.findByIdAndUpdate(userId, {
                subscription: "Pro",
                subscriptionExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });

            return res.json({ success: true });
        }

        res.status(400).json({ success: false, message: "Payment verification failed" });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ success: false, error: "Server error during payment verification" });
    }
};
