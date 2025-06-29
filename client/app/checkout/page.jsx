"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Smartphone, Crown, Sparkles, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/components/AuthProvider"

export default function CheckoutPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, isLoading } = useAuth()

    const [paymentData, setPaymentData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
    })
    const [isProcessing, setIsProcessing] = useState(false)

    // Get plan details from URL params
    const planId = searchParams.get("plan") || "pro"
    const billingCycle = searchParams.get("billing") || "monthly"

    // Plan configurations
    const plans = {
        pro: {
            id: "pro",
            name: "Pro",
            description: "Best for individual farmers and small operations",
            price: { monthly: 100, yearly: 1000 }, // Using higher amounts for testing
            icon: Crown,
            color: "emerald",
            features: [
                "Unlimited crop predictions",
                "Advanced soil analysis",
                "Weather & climate insights",
                "Yield optimization tips",
                "Market price predictions",
                "Priority email support",
                "Export reports (PDF/CSV)",
                "Historical data (2 years)",
            ],
        },
        enterprise: {
            id: "enterprise",
            name: "Enterprise",
            description: "For large farms and agricultural businesses",
            price: { monthly: 500, yearly: 5000 },
            icon: Sparkles,
            color: "purple",
            features: [
                "Everything in Pro",
                "Multi-farm management",
                "Team collaboration tools",
                "Advanced analytics dashboard",
                "Custom reporting",
                "API access",
                "Phone & chat support",
                "Historical data (10 years)",
            ],
        },
    }

    const selectedPlan = plans[planId] || plans.pro
    const amount = selectedPlan.price[billingCycle]
    const PlanIcon = selectedPlan.icon

    // eSewa v2 configuration
    const ESEWA_CONFIG = {
        productCode: "EPAYTEST",
        successUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/payment/success`,
        failureUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/payment/failure`,
        paymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    }

    // Auto-fill user data if logged in
    useEffect(() => {
        if (user && !isLoading) {
            setPaymentData({
                customerName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "",
                customerEmail: user.email || "",
                customerPhone: user.phone || "",
            })
        }
    }, [user, isLoading])

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.push(`/login?redirect=/checkout?plan=${planId}&billing=${billingCycle}`)
        }
    }, [user, isLoading, router, planId, billingCycle])

    const handleInputChange = (field, value) => {
        setPaymentData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleEsewaPayment = async () => {
        if (!paymentData.customerName || !paymentData.customerEmail || !paymentData.customerPhone) {
            alert("Please fill in all required details")
            return
        }

        setIsProcessing(true)

        try {
            // Generate a simpler, more predictable transaction UUID
            const timestamp = Date.now()
            const transactionUuid = `AGR${timestamp}`

            // Calculate amounts according to eSewa v2 API
            const productAmount = amount
            const taxAmount = 0
            const productServiceCharge = 0
            const productDeliveryCharge = 0
            const totalAmount = productAmount + taxAmount + productServiceCharge + productDeliveryCharge

            // Store payment data BEFORE submitting to eSewa
            const paymentInfo = {
                transaction_uuid: transactionUuid,
                amount: productAmount,
                total_amount: totalAmount,
                customer_name: paymentData.customerName,
                customer_email: paymentData.customerEmail,
                customer_phone: paymentData.customerPhone,
                product_name: `AgroGuide ${selectedPlan.name} Plan - ${billingCycle}`,
                plan_id: selectedPlan.id,
                billing_cycle: billingCycle,
                user_id: user?.id || "",
                timestamp: timestamp,
            }

            // Store in localStorage AND send to backend for persistence
            localStorage.setItem("esewa_payment_data", JSON.stringify(paymentInfo))

            // Also store in backend for verification
            try {
                await fetch("/api/store-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(paymentInfo),
                })
            } catch (error) {
                console.warn("Failed to store payment intent:", error)
            }

            // eSewa v2 API parameters
            const esewaParams = {
                amount: productAmount.toString(),
                tax_amount: taxAmount.toString(),
                total_amount: totalAmount.toString(),
                transaction_uuid: transactionUuid,
                product_code: "EPAYTEST",
                product_service_charge: productServiceCharge.toString(),
                product_delivery_charge: productDeliveryCharge.toString(),
                success_url: ESEWA_CONFIG.successUrl,
                failure_url: ESEWA_CONFIG.failureUrl,
                signed_field_names: "total_amount,transaction_uuid,product_code",
            }

            // Generate signature
            const message = `total_amount=${esewaParams.total_amount},transaction_uuid=${esewaParams.transaction_uuid},product_code=${esewaParams.product_code}`
            const signature = await generateSignature(message)
            esewaParams.signature = signature

            console.log("🚀 Submitting to eSewa:", esewaParams)

            // Create form and submit to eSewa v2 API
            const form = document.createElement("form")
            form.method = "POST"
            form.action = ESEWA_CONFIG.paymentUrl

            // Add all parameters as hidden inputs
            Object.entries(esewaParams).forEach(([key, value]) => {
                const input = document.createElement("input")
                input.type = "hidden"
                input.name = key
                input.value = value
                form.appendChild(input)
            })

            // Submit form to eSewa
            document.body.appendChild(form)
            form.submit()
            document.body.removeChild(form)
        } catch (error) {
            console.error("Payment error:", error)
            alert("Payment initialization failed. Please try again.")
            setIsProcessing(false)
        }
    }

    const generateSignature = async (message) => {
        try {
            const response = await fetch("http://localhost:8000/api/esewa/signature/generate-signature", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            })

            const result = await response.json()
            return result.signature
        } catch (error) {
            console.error("Signature generation error:", error)
            return "demo_signature_replace_with_actual"
        }
    }


    const getDiscountPercentage = () => {
        if (billingCycle === "yearly" && selectedPlan.price.monthly > 0) {
            return Math.round(
                ((selectedPlan.price.monthly * 12 - selectedPlan.price.yearly) / (selectedPlan.price.monthly * 12)) * 100,
            )
        }
        return 0
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />

            <div className="pt-20 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Button
                        onClick={() => router.push("/pricing")}
                        variant="ghost"
                        className="mb-6 text-gray-300 hover:text-white hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Pricing
                    </Button>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Complete Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                AgroGuide
                            </span>{" "}
                            Subscription
                        </h1>
                        <p className="text-xl text-gray-300">Secure payment powered by eSewa</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Order Summary */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <PlanIcon
                                        className={`h-6 w-6 ${selectedPlan.color === "emerald" ? "text-emerald-400" : "text-purple-400"}`}
                                    />
                                    Order Summary
                                </CardTitle>
                                <CardDescription className="text-gray-400">Review your subscription details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Plan Details */}
                                <div className="bg-slate-700/50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">AgroGuide {selectedPlan.name}</h3>
                                            <p className="text-gray-400 text-sm">{selectedPlan.description}</p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className={`${selectedPlan.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" : "bg-purple-500/20 text-purple-400"}`}
                                        >
                                            {billingCycle}
                                        </Badge>
                                    </div>

                                    {/* Features Preview */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-300">Key Features:</p>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                            {selectedPlan.features.slice(0, 4).map((feature, idx) => (
                                                <li key={idx} className="flex items-center">
                                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                            {selectedPlan.features.length > 4 && (
                                                <li className="text-emerald-400 text-xs">+{selectedPlan.features.length - 4} more features</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                <Separator className="bg-slate-700" />

                                {/* Pricing Breakdown */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Product Amount</span>
                                        <span>NPR {amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Delivery Charge</span>
                                        <span>NPR 0</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Service Charge</span>
                                        <span>NPR 0</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Tax Amount</span>
                                        <span>NPR 0</span>
                                    </div>
                                    <Separator className="bg-slate-700" />
                                    <div className="flex justify-between font-bold text-lg text-white">
                                        <span>Total Amount</span>
                                        <span>NPR {amount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Security Badge */}
                                <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/20">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                        <Shield className="h-4 w-4" />
                                        <span className="font-medium">Secure Payment</span>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Your payment is secured by eSewa's advanced encryption and fraud protection
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Form */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Smartphone className="h-5 w-5 text-emerald-400" />
                                    Payment Details
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Complete your information to proceed with eSewa
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Customer Information */}
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="customerName" className="text-gray-300">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="customerName"
                                            placeholder="Enter your full name"
                                            value={paymentData.customerName}
                                            onChange={(e) => handleInputChange("customerName", e.target.value)}
                                            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-emerald-500"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="customerEmail" className="text-gray-300">
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="customerEmail"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            value={paymentData.customerEmail}
                                            onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                                            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-emerald-500"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="customerPhone" className="text-gray-300">
                                            Phone Number *
                                        </Label>
                                        <Input
                                            id="customerPhone"
                                            placeholder="98XXXXXXXX"
                                            value={paymentData.customerPhone}
                                            onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                                            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-emerald-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <Separator className="bg-slate-700" />

                                {/* eSewa Payment Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center">
                                        <img src="/placeholder.svg?height=40&width=120" alt="eSewa Logo" className="h-10 opacity-90" />
                                    </div>

                                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                                        <h4 className="text-blue-400 font-medium mb-2">Payment Information</h4>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            <li>• You will be redirected to eSewa's secure payment gateway</li>
                                            <li>• Complete payment using your eSewa account or bank transfer</li>
                                            <li>• You'll be redirected back after payment completion</li>
                                        </ul>
                                    </div>

                                    <Button
                                        onClick={handleEsewaPayment}
                                        disabled={
                                            isProcessing ||
                                            !paymentData.customerName ||
                                            !paymentData.customerEmail ||
                                            !paymentData.customerPhone
                                        }
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 text-lg"
                                        size="lg"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Redirecting to eSewa...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="h-5 w-5 mr-2" />
                                                Pay NPR {amount.toLocaleString()} with eSewa
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-xs text-gray-400 text-center space-y-1">
                                        <p>By proceeding, you agree to eSewa's terms and conditions.</p>
                                        <p className="text-yellow-400">🧪 Test Environment: Use test credentials for payment</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
