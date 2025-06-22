import { CheckCircle, ArrowRight, Upload, Brain, Download } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Input Your Data",
      description:
        "Provide information about your soil, climate, and farming conditions through our intuitive interface.",
      icon: <Upload className="w-8 h-8" />,
      details: [
        "Soil composition and pH levels",
        "Climate and weather patterns",
        "Farm size and location",
        "Previous crop history",
      ],
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Our machine learning algorithms analyze your data against our extensive agricultural database.",
      icon: <Brain className="w-8 h-8" />,
      details: [
        "Advanced pattern recognition",
        "Historical yield analysis",
        "Market trend evaluation",
        "Risk factor assessment",
      ],
    },
    {
      step: "03",
      title: "Get Recommendations",
      description: "Receive personalized crop recommendations with detailed yield predictions and risk assessments.",
      icon: <Download className="w-8 h-8" />,
      details: ["Crop suitability scores", "Expected yield estimates", "Profit projections", "Planting schedules"],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">How It Works</h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
              Our AI-powered platform makes crop selection simple and effective through a streamlined, three-step
              process that transforms your farming decisions.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-slate-700 rounded-lg p-8 h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {item.step}
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-300 mb-6">{item.description}</p>

                    <ul className="space-y-2">
                      {item.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-emerald-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our Process?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our scientifically-backed approach ensures you make the best decisions for your farm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Time Saving", description: "Get results in minutes, not weeks", percentage: "90%" },
                { title: "Accuracy", description: "AI-powered precision farming", percentage: "95%" },
                { title: "Cost Effective", description: "Reduce input costs significantly", percentage: "30%" },
                { title: "Yield Increase", description: "Maximize your harvest potential", percentage: "25%" },
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{benefit.percentage}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
