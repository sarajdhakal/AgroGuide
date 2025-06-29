import User from "../model/userModel.js"

export async function updateUserSubscription({ userId, plan, billingCycle, transactionId, amount }) {
    const duration = billingCycle === "yearly" ? 365 : 30
    const now = new Date()
    const endDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000)

    await User.findByIdAndUpdate(userId, {
        subscription: {
            plan,
            billingCycle,
            status: "active",
            transactionId,
            amount,
            startDate: now,
            endDate,
        },
    })
}
