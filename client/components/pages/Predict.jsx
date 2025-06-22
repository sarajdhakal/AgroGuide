import { Button } from "@/components/ui/button"
import { Play, Star, Shield, CheckCircle } from "lucide-react"

export default function Predict() {
  const stats = [
    { number: "10,000+", label: "Active Farmers" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "30%", label: "Average Yield Increase" },
  ]

  const trustIndicators = [
    {
      icon: <Star className="w-5 h-5 text-yellow-400 fill-current" />,
      text: "4.9/5 Rating",
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      text: "Enterprise Security",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      text: "24/7 Support",
    },
  ]

  return (
    <section id="predict" className="py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Transform Your Farming?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of farmers who are already using AgroGuide to make smarter, data-driven decisions and increase
          their yields.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
          >
            Start Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-full"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400">
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center gap-2">
              {indicator.icon}
              <span>{indicator.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
