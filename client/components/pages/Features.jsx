import { Card, CardContent } from "@/components/ui/card"
import { Shield, BarChart3, Globe, Leaf, Target, TrendingUp } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Assessment",
      description: "Comprehensive risk analysis for weather, pests, and market conditions",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Yield Prediction",
      description: "Accurate yield forecasting based on historical data and current conditions",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Climate Analysis",
      description: "Real-time climate data integration for optimal planting decisions",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Soil Optimization",
      description: "Soil health monitoring and improvement recommendations",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision Farming",
      description: "GPS-enabled field mapping and precision agriculture tools",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Insights",
      description: "Real-time market prices and demand forecasting for better profitability",
    },
  ]

  return (
    <section id="features" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Powerful Features</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Everything you need to make informed farming decisions and maximize your agricultural success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
