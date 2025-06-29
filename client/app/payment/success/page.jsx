"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home, Crown, ArrowRight, Sparkles, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function PaymentSuccess() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [paymentDetails, setPaymentDetails] = useState(null)
    const [isVerifying, setIsVerifying] = useState(true)
    const [verificationStatus, setVerificationStatus] = useState(null)

    useEffect(() => {
        // First, try to get data from URL parameters (eSewa callback)
        const urlParams = {
            transaction_uuid: searchParams.get("transaction_uuid"),
            total_amount: searchParams.get("total_amount"),
            transaction_code: searchParams.get("transaction_code"),
        }

        // Then get stored data from localStorage
        const storedData = localStorage.getItem("esewa_payment_data")
        const localData = storedData ? JSON.parse(storedData) : {}

        // Combine both sources of data
        const combinedData = { ...localData, ...urlParams }

        console.log("🔍 URL Params:", urlParams)
        console.log("💾 Local Storage:", localData)
        console.log("🔗 Combined Data:", combinedData)

        if (combinedData.transaction_uuid && combinedData.total_amount) {
            setPaymentDetails(combinedData)
            verifyPayment(combinedData)
        } else {
            // If no transaction data, check if we have stored payment intent
            if (localData.transaction_uuid) {
                setPaymentDetails(localData)
                verifyPayment(localData)
            } else {
                console.error("❌ No transaction data found")
                setVerificationStatus("error")
                setIsVerifying(false)
            }
        }
    }, [searchParams])

    const verifyPayment = async (data) => {
        try {
            console.log("🔍 Verifying payment with data:", data)

            const verificationPayload = {
                transaction_uuid: data.transaction_uuid,
                total_amount: data.total_amount || data.amount,
                userId: data.user_id,
                planId: data.plan_id,
                billingCycle: data.billing_cycle,
            }

            console.log("📤 Sending verification request:", verificationPayload)

            const response = await fetch("http://localhost:8000/api/esewa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(verificationPayload),
            })

            const result = await response.json()
            console.log("📥 Verification response:", result)

            if (result.success) {
                setVerificationStatus("success")
                localStorage.removeItem("esewa_payment_data")
            } else {
                console.error("❌ Verification failed:", result.message)
                setVerificationStatus("failed")
            }
        } catch (error) {
            console.error("💥 Verification error:", error)
            setVerificationStatus("error")
        } finally {
            setIsVerifying(false)
        }
    }

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header />
                <div className="pt-20 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">Verifying Payment...</h1>
                            <p className="text-gray-300">Please wait while we confirm your payment with eSewa</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (verificationStatus === "failed" || verificationStatus === "error") {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header />
                <div className="pt-20 pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="h-10 w-10 text-red-400" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Payment <span className="text-red-400">Verification Failed</span>
                            </h1>
                            <p className="text-xl text-gray-300">There was an issue verifying your payment</p>

                            {/* Debug Information */}
                            <div className="mt-8 bg-slate-800/50 rounded-lg p-4 max-w-2xl mx-auto">
                                <h3 className="text-white font-medium mb-2">Debug Information:</h3>
                                <div className="text-left text-sm text-gray-300 space-y-1">
                                    <p>Transaction UUID: {paymentDetails?.transaction_uuid || "Not found"}</p>
                                    <p>Total Amount: {paymentDetails?.total_amount || paymentDetails?.amount || "Not found"}</p>
                                    <p>Status: {verificationStatus}</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <Button
                                className="bg-emerald-500 hover:bg-emerald-600 text-white mr-4"
                                onClick={() => router.push("/contact")}
                            >
                                Contact Support
                            </Button>
                            <Button
                                variant="outline"
                                className="border-gray-600 text-gray-300 bg-transparent"
                                onClick={() => router.push("/pricing")}
                            >
                                Back to Pricing
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />

            <div className="pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-emerald-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Welcome to{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                AgroGuide Pro!
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300">Your subscription is now active and ready to use</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Payment Confirmation */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-emerald-400 flex items-center gap-2">
                                    <Crown className="h-5 w-5" />
                                    Payment Confirmed
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Your payment has been processed and verified successfully
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {paymentDetails && (
                                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-300">Plan:</span>
                                            <span className="text-emerald-400 font-medium">
                                                {paymentDetails.product_name || "AgroGuide Pro"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-300">Amount:</span>
                                            <span className="text-white font-semibold">
                                                NPR{" "}
                                                {Number.parseInt(paymentDetails.total_amount || paymentDetails.amount || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-300">Transaction UUID:</span>
                                            <span className="text-sm text-gray-300 font-mono">{paymentDetails.transaction_uuid}</span>
                                        </div>
                                        {paymentDetails.transaction_code && (
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-300">eSewa Transaction:</span>
                                                <span className="text-sm text-gray-300 font-mono">{paymentDetails.transaction_code}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-300">Status:</span>
                                            <span className="text-emerald-400 font-medium">Verified ✓</span>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/20">
                                    <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        What's Next?
                                    </h3>
                                    <ul className="text-sm text-gray-300 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                            Access unlimited crop predictions
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                            Get advanced soil analysis reports
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                            Receive market price insights
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                            Export detailed PDF reports
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Get Started</CardTitle>
                                <CardDescription className="text-gray-400">Start using your new AgroGuide Pro features</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                                    size="lg"
                                    asChild
                                >
                                    <Link href="/predict">
                                        <Crown className="h-4 w-4 mr-2" />
                                        Start Predicting Crops
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>

                                <Button
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/dashboard">View Dashboard</Link>
                                </Button>

                                <Button
                                    className="w-full bg-transparent border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                                    variant="outline"
                                    onClick={() => window.print()}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Receipt
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-12">
                        <Button variant="ghost" className="text-gray-400 hover:text-white" asChild>
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
