"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, RefreshCw, Home, AlertTriangle, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function PaymentFailure() {
    const searchParams = useSearchParams()
    const [failureDetails, setFailureDetails] = useState(null)

    useEffect(() => {
        // Extract failure details from URL parameters
        const details = {
            pid: searchParams.get("pid"),
            reason: searchParams.get("reason") || "Payment was cancelled or failed",
            productName: searchParams.get("product_name"),
            billingCycle: searchParams.get("billing_cycle"),
        }
        setFailureDetails(details)
    }, [searchParams])

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />

            <div className="pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="h-10 w-10 text-red-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Payment <span className="text-red-400">Unsuccessful</span>
                        </h1>
                        <p className="text-xl text-gray-300">Don't worry, your AgroGuide subscription is still available</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Failure Details */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Payment Details
                                </CardTitle>
                                <CardDescription className="text-gray-400">Information about the failed transaction</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {failureDetails && (
                                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-300">Plan:</span>
                                            <span className="text-gray-300">{failureDetails.productName || "AgroGuide Pro"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-300">Transaction ID:</span>
                                            <span className="text-sm text-gray-300 font-mono">{failureDetails.pid}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-300">Status:</span>
                                            <span className="text-red-400 font-medium">Failed</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-300">Reason:</span>
                                            <span className="text-sm text-red-400">{failureDetails.reason}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/20">
                                    <div className="flex items-center gap-2 text-yellow-400 mb-3">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="font-medium">Common Payment Issues:</span>
                                    </div>
                                    <ul className="text-sm text-gray-300 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                            Insufficient balance in eSewa account
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                            Network connectivity issues
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                            Payment cancelled by user
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                            Invalid payment credentials
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                            Transaction timeout
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Next Steps */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">What's Next?</CardTitle>
                                <CardDescription className="text-gray-400">Choose how you'd like to proceed</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                                    size="lg"
                                    asChild
                                >
                                    <Link href="/pricing">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Try Payment Again
                                    </Link>
                                </Button>

                                <Button
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/contact">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Contact Support
                                    </Link>
                                </Button>

                                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                                    <h3 className="text-blue-400 font-semibold mb-2">💡 Pro Tip</h3>
                                    <p className="text-sm text-gray-300 mb-3">
                                        Make sure you have sufficient balance in your eSewa account and a stable internet connection.
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        You can also try using a different payment method or contact our support team for assistance.
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-700">
                                    <p className="text-sm text-gray-400 mb-3">Still want to explore AgroGuide?</p>
                                    <div className="space-y-2">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
                                            asChild
                                        >
                                            <Link href="/predict">🌱 Try Free Predictions</Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700"
                                            asChild
                                        >
                                            <Link href="/features">✨ Explore Features</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-12">
                        <Button variant="ghost" className="text-gray-400 hover:text-white" asChild>
                            <Link href="/pricing">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Pricing
                            </Link>
                        </Button>
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
