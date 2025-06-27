"use client"

import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"

export default function Home({ onNavigate }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      <div className="absolute inset-0 bg-slate-900/70" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          AgroGuide:{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Your Farming Future
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
          Discover the perfect crops for your land with our innovative AI-powered platform.
        </p>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Maximize yield, and minimize risk, and grow smarter with data-driven insights.
        </p>
        <Button
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
          onClick={() => onNavigate("predict")}
        >
          <Rocket className="w-5 h-5 mr-2" />
          Get Started Today
        </Button>
      </div>
    </section>
  )
}
