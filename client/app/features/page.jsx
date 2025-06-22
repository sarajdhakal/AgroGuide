import { Card, CardContent } from "@/components/ui/card"
import { Shield, BarChart3, Globe, Leaf, Target, TrendingUp, Cloud, Smartphone, Database, Zap } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Features() {
  const mainFeatures = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Assessment",
      description: "Comprehensive risk analysis for weather, pests, and market conditions",
      details: [
        "Weather pattern analysis",
        "Pest and disease prediction",
        "Market volatility assessment",
        "Insurance recommendations",
      ],
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Yield Prediction",
      description: "Accurate yield forecasting based on historical data and current conditions",
      details: [
        "Historical yield analysis",
        "Seasonal trend prediction",
        "Crop performance modeling",
        "Harvest timing optimization",
      ],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Climate Analysis",
      description: "Real-time climate data integration for optimal planting decisions",
      details: [
        "Satellite weather data",
        "Microclimate monitoring",
        "Seasonal forecasting",
        "Climate change adaptation",
      ],
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Soil Optimization",
      description: "Soil health monitoring and improvement recommendations",
      details: [
        "Nutrient level analysis",
        "pH optimization",
        "Organic matter assessment",
        "Fertilizer recommendations",
      ],
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision Farming",
      description: "GPS-enabled field mapping and precision agriculture tools",
      details: [
        "Field boundary mapping",
        "Variable rate application",
        "Equipment integration",
        "Precision planting guides",
      ],
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Insights",
      description: "Real-time market prices and demand forecasting for better profitability",
      details: ["Price trend analysis", "Demand forecasting", "Supply chain insights", "Profit optimization"],
    },
  ]

  const additionalFeatures = [
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Integration",
      description: "Secure cloud storage and real-time data synchronization",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile App",
      description: "Access your farm data anywhere with our mobile application",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Analytics",
      description: "Advanced analytics dashboard with customizable reports",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Alerts",
      description: "Instant notifications for critical farming decisions",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Powerful Features</h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Everything you need to make informed farming decisions and maximize your agricultural success with
              cutting-edge technology.
            </p>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-slate-700 border-slate-600 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                    <ul className="space-y-1">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-xs text-gray-400 flex items-center">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Additional Capabilities</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enhanced tools and integrations to streamline your farming operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-slate-800 border-slate-700 hover:border-emerald-500/30 transition-colors"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-md font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Why AgroGuide Stands Out</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">99.9%</div>
                <div className="text-white font-semibold mb-2">Uptime</div>
                <div className="text-gray-300 text-sm">Reliable service you can count on</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
                <div className="text-white font-semibold mb-2">Support</div>
                <div className="text-gray-300 text-sm">Expert help whenever you need it</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">50+</div>
                <div className="text-white font-semibold mb-2">Crop Types</div>
                <div className="text-gray-300 text-sm">Comprehensive crop database</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
