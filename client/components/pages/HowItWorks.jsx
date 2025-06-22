import { BarChart3, Target, CheckCircle, ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Input Your Data",
      description: "Provide information about your soil, climate, and farming conditions",
      icon: <BarChart3 className="w-8 h-8" />,
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Our machine learning algorithms analyze your data against our extensive database",
      icon: <Target className="w-8 h-8" />,
    },
    {
      step: "03",
      title: "Get Recommendations",
      description: "Receive personalized crop recommendations with yield predictions and risk assessments",
      icon: <CheckCircle className="w-8 h-8" />,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform makes crop selection simple and effective through a streamlined process
          </p>
        </div>

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
                <p className="text-gray-300">{item.description}</p>
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
  )
}
