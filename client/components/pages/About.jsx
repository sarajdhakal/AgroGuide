import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Globe, Users } from "lucide-react"

export default function About() {
  return (
    <section
      id="about"
      className="relative py-20"
      style={{
        backgroundImage: "url('/about-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-slate-900/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-8">
            About AgroGuide
          </h2>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            AgroGuide is a revolutionary platform designed to empower farmers with intelligent crop selection tools. Our
            goal is to enhance agricultural productivity and sustainability through cutting-edge technology and data
            science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Data-Driven Insights */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Data-Driven Insights</h3>
              <p className="text-gray-300 leading-relaxed">
                Leverage advanced analytics and machine learning to make informed decisions about crop selection and
                farming strategies.
              </p>
            </CardContent>
          </Card>

          {/* Global Impact */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Global Impact</h3>
              <p className="text-gray-300 leading-relaxed">
                Contributing to sustainable agriculture worldwide by helping farmers optimize their crop yields and
                reduce environmental impact.
              </p>
            </CardContent>
          </Card>

          {/* Farmer-Centric */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Farmer-Centric</h3>
              <p className="text-gray-300 leading-relaxed">
                Built by farmers, for farmers. Our platform addresses real-world challenges with practical, easy-to-use
                solutions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
