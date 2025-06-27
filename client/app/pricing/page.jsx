"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Star, Zap, Crown, BarChart3, ArrowRight, Sparkles } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/components/AuthProvider"

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState("monthly")
    const [selectedPlan, setSelectedPlan] = useState(null)
    const router = useRouter()
    const { user } = useAuth()

    const plans = [
        {
            id: "free",
            name: "Free",
            description: "Perfect for trying out AgroGuide",
            price: { monthly: 0, yearly: 0 },
            predictions: 3,
            badge: null,
            features: [
                "3 crop predictions per month",
                "Basic soil analysis",
                "Weather integration",
                "Email support",
                "Mobile app access",
            ],
            limitations: ["Limited historical data", "No advanced analytics", "No priority support", "No API access"],
            cta: "Get Started Free",
            popular: false,
            color: "border-gray-300",
        },
        {
            id: "pro",
            name: "Pro",
            description: "Best for individual farmers and small operations",
            price: { monthly: 29, yearly: 290 },
            predictions: "Unlimited",
            badge: "Most Popular",
            features: [
                "Unlimited crop predictions",
                "Advanced soil analysis",
                "Weather & climate insights",
                "Yield optimization tips",
                "Market price predictions",
                "Priority email support",
                "Mobile app access",
                "Export reports (PDF/CSV)",
                "Historical data (2 years)",
                "Risk assessment tools",
            ],
            limitations: [],
            cta: "Start Pro Trial",
            popular: true,
            color: "border-emerald-500",
        },
        {
            id: "enterprise",
            name: "Enterprise",
            description: "For large farms and agricultural businesses",
            price: { monthly: 99, yearly: 990 },
            predictions: "Unlimited",
            badge: "Best Value",
            features: [
                "Everything in Pro",
                "Multi-farm management",
                "Team collaboration tools",
                "Advanced analytics dashboard",
                "Custom reporting",
                "API access",
                "Phone & chat support",
                "Dedicated account manager",
                "Historical data (10 years)",
                "White-label options",
                "Integration support",
                "Custom ML models",
            ],
            limitations: [],
            cta: "Contact Sales",
            popular: false,
            color: "border-purple-500",
        },
    ]

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan.id)

        if (plan.id === "free") {
            // Redirect to signup for free plan
            router.push("/register?plan=free")
        } else if (plan.id === "enterprise") {
            // Redirect to contact sales
            router.push("/contact?plan=enterprise")
        } else {
            // Redirect to payment for pro plan
            router.push(`/checkout?plan=${plan.id}&billing=${billingCycle}`)
        }
    }

    const getDiscountPercentage = (monthly, yearly) => {
        if (monthly === 0) return 0
        return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100)
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />

            <div className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Choose Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Perfect Plan
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Unlock the power of AI-driven crop recommendations with flexible pricing options designed for every
                            farming operation.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center mb-12">
                            <div className="bg-slate-800 p-1 rounded-full flex items-center">
                                <button
                                    onClick={() => setBillingCycle("monthly")}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === "monthly" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle("yearly")}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === "yearly" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    Yearly
                                    <Badge className="ml-2 bg-emerald-600 text-white text-xs">Save 20%</Badge>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {plans.map((plan, index) => (
                            <Card
                                key={plan.id}
                                className={`relative bg-slate-800/50 backdrop-blur-sm ${plan.color} ${plan.popular ? "ring-2 ring-emerald-500 scale-105" : ""
                                    } hover:scale-105 transition-all duration-300`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-emerald-500 text-white px-4 py-1">
                                            <Star className="w-3 h-3 mr-1" />
                                            {plan.badge}
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-8">
                                    <div className="mb-4">
                                        {plan.id === "free" && <Zap className="w-12 h-12 text-gray-400 mx-auto" />}
                                        {plan.id === "pro" && <Crown className="w-12 h-12 text-emerald-400 mx-auto" />}
                                        {plan.id === "enterprise" && <Sparkles className="w-12 h-12 text-purple-400 mx-auto" />}
                                    </div>

                                    <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                                    <p className="text-gray-400 mb-6">{plan.description}</p>

                                    <div className="mb-6">
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-4xl font-bold text-white">${plan.price[billingCycle]}</span>
                                            <span className="text-gray-400 ml-2">/{billingCycle === "monthly" ? "month" : "year"}</span>
                                        </div>
                                        {billingCycle === "yearly" && plan.price.monthly > 0 && (
                                            <p className="text-emerald-400 text-sm mt-2">
                                                Save {getDiscountPercentage(plan.price.monthly, plan.price.yearly)}% annually
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-center text-emerald-400 font-semibold">
                                            <BarChart3 className="w-5 h-5 mr-2" />
                                            {typeof plan.predictions === "string" ? plan.predictions : `${plan.predictions} predictions`} per
                                            month
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <Button
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`w-full mb-6 ${plan.popular ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-700 hover:bg-slate-600"
                                            } text-white`}
                                        disabled={selectedPlan === plan.id}
                                    >
                                        {selectedPlan === plan.id ? "Processing..." : plan.cta}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-white font-semibold mb-3">What's included:</h4>
                                            <ul className="space-y-2">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start text-gray-300 text-sm">
                                                        <Check className="w-4 h-4 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {plan.limitations.length > 0 && (
                                            <div>
                                                <h4 className="text-gray-400 font-semibold mb-3">Limitations:</h4>
                                                <ul className="space-y-2">
                                                    {plan.limitations.map((limitation, idx) => (
                                                        <li key={idx} className="flex items-start text-gray-500 text-sm">
                                                            <X className="w-4 h-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                                                            {limitation}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Feature Comparison Table */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white text-center mb-8">Compare All Features</h2>
                        <div className="bg-slate-800/50 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-700">
                                        <tr>
                                            <th className="text-left p-4 text-white font-semibold">Features</th>
                                            <th className="text-center p-4 text-white font-semibold">Free</th>
                                            <th className="text-center p-4 text-white font-semibold">Pro</th>
                                            <th className="text-center p-4 text-white font-semibold">Enterprise</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-300">
                                        {[
                                            { feature: "Monthly Predictions", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
                                            { feature: "Soil Analysis", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
                                            { feature: "Weather Integration", free: "✓", pro: "✓", enterprise: "✓" },
                                            { feature: "Market Predictions", free: "✗", pro: "✓", enterprise: "✓" },
                                            { feature: "Historical Data", free: "6 months", pro: "2 years", enterprise: "10 years" },
                                            { feature: "API Access", free: "✗", pro: "✗", enterprise: "✓" },
                                            { feature: "Team Collaboration", free: "✗", pro: "✗", enterprise: "✓" },
                                            { feature: "Priority Support", free: "✗", pro: "✓", enterprise: "✓" },
                                            { feature: "Custom Reports", free: "✗", pro: "✓", enterprise: "✓" },
                                            { feature: "White-label", free: "✗", pro: "✗", enterprise: "✓" },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-t border-slate-700">
                                                <td className="p-4 font-medium">{row.feature}</td>
                                                <td className="p-4 text-center">{row.free}</td>
                                                <td className="p-4 text-center">{row.pro}</td>
                                                <td className="p-4 text-center">{row.enterprise}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    question: "What happens when I exceed my prediction limit?",
                                    answer:
                                        "Free users will be prompted to upgrade. Pro and Enterprise users have unlimited predictions.",
                                },
                                {
                                    question: "Can I change my plan anytime?",
                                    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                                },
                                {
                                    question: "Is there a free trial for Pro plans?",
                                    answer: "Yes, we offer a 14-day free trial for Pro plans with full access to all features.",
                                },
                                {
                                    question: "What payment methods do you accept?",
                                    answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
                                },
                                {
                                    question: "Do you offer refunds?",
                                    answer: "Yes, we offer a 30-day money-back guarantee for all paid plans.",
                                },
                                {
                                    question: "Is my data secure?",
                                    answer: "We use enterprise-grade security and never share your farming data with third parties.",
                                },
                            ].map((faq, idx) => (
                                <Card key={idx} className="bg-slate-800/50 border-slate-700">
                                    <CardContent className="p-6">
                                        <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
                                        <p className="text-gray-300">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-lg p-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Farming?</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of farmers who are already using AgroGuide to make smarter decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3"
                                onClick={() => router.push("/register?plan=pro")}
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3"
                                onClick={() => router.push("/contact")}
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
