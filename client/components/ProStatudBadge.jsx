"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function ProStatusBadge({ isProUser, variant = "default", showGetProButton = true }) {
    const router = useRouter()

    if (isProUser) {
        return (
            <Badge
                className={`
          bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold
          ${variant === "large" ? "text-sm px-3 py-1" : "text-xs px-2 py-1"}
        `}
            >
                <Crown className={`${variant === "large" ? "h-4 w-4" : "h-3 w-3"} mr-1`} />
                PRO
            </Badge>
        )
    }

    if (showGetProButton) {
        return (
            <Button
                onClick={() => router.push("/pricing")}
                size={variant === "large" ? "default" : "sm"}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <Sparkles className={`${variant === "large" ? "h-4 w-4" : "h-3 w-3"} mr-2`} />
                Get Pro
            </Button>
        )
    }

    return null
}

export function ProFeatureGate({ isProUser, children, fallback }) {
    if (isProUser) {
        return children
    }

    return (
        fallback || (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="mb-4">
                    <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Pro Feature</h3>
                    <p className="text-gray-400 mb-4">This feature is available for Pro subscribers only.</p>
                </div>
                <ProStatusBadge isProUser={false} variant="large" />
            </div>
        )
    )
}
