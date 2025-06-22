"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Rocket,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Leaf,
  BarChart3,
  Target,
  CheckCircle,
  Play,
  Star,
  Upload,
  Brain,
  Download,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection"
import { CountUpAnimation } from "@/components/CountUpAnimation"
import { SlideshowBackground } from "@/components/SlideshowBackground"
import { ParallaxBackground } from "@/components/ParallaxBackground"

export default function Home() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("home")

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "how-it-works", "features", "predict"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const navigateToPage = (path) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header activeSection={activeSection} onScroll={scrollToSection} onNavigate={navigateToPage} />

      {/* Hero Section with Slideshow - ONLY HOME SECTION */}
      <SlideshowBackground className="relative min-h-screen flex items-center justify-center pt-16">
        <section id="home" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="fadeInUp" className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              AgroGuide:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Your Farming Future
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={200} className="mb-4">
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the perfect crops for your land with our innovative AI-powered platform.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={400} className="mb-8">
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Maximize yield, minimize risk, and grow smarter with data-driven insights.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
                onClick={() => scrollToSection("predict")}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
                onClick={() => scrollToSection("about")}
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </AnimatedSection>
        </section>
      </SlideshowBackground>

      {/* About Section - Static Background */}
      <ParallaxBackground className="relative py-20">
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <AnimatedSection animation="slideInUp">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">About Agroguide</h2>

            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={200}>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                AgroGuide is a revolutionary platform designed to empower farmers with intelligent crop selection tools.
                Our goal is to enhance agricultural productivity and sustainability through cutting-edge technology and
                data science.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Data-Driven Insights */}
            <AnimatedCard index={0} delay={150}>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Data-Driven Insights</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Leverage advanced analytics and machine learning to make informed decisions about crop selection and
                    farming strategies.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Global Impact */}
            <AnimatedCard index={1} delay={150}>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform duration-300">
                    <Globe className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Global Impact</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Contributing to sustainable agriculture worldwide by helping farmers optimize their crop yields and
                    reduce environmental impact.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Farmer-Centric */}
            <AnimatedCard index={2} delay={150}>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform duration-300">
                    <Users className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Farmer-Centric</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Built by farmers, for farmers. Our platform addresses real-world challenges with practical,
                    easy-to-use solutions.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>

          <AnimatedSection animation="fadeInUp" delay={600}>
            <div className="text-center mt-12">
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white transform hover:scale-105 transition-all duration-300"
                onClick={() => navigateToPage("/about")}
              >
                Learn More About Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </AnimatedSection>
        </section>
      </ParallaxBackground>

      {/* How It Works Section - Solid Background */}
      <section id="how-it-works" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <AnimatedSection animation="slideInUp">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">How It Works</h2>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={200}>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our AI-powered platform makes crop selection simple and effective through a streamlined process
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Input Your Data",
                description: "Provide information about your soil, climate, and farming conditions",
                icon: <Upload className="w-8 h-8" />,
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our machine learning algorithms analyze your data against our extensive database",
                icon: <Brain className="w-8 h-8" />,
              },
              {
                step: "03",
                title: "Get Recommendations",
                description: "Receive personalized crop recommendations with yield predictions and risk assessments",
                icon: <Download className="w-8 h-8" />,
              },
            ].map((item, index) => (
              <AnimatedCard key={index} index={index} delay={200}>
                <div className="relative">
                  <div className="bg-slate-700 rounded-lg p-8 h-full hover:bg-slate-600 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 transform hover:rotate-12 transition-transform duration-300">
                        {item.step}
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 transform hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-emerald-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedSection animation="fadeInUp" delay={800}>
            <div className="text-center mt-12">
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white transform hover:scale-105 transition-all duration-300"
                onClick={() => navigateToPage("/how-it-works")}
              >
                Learn More About Our Process
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section - Solid Background */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <AnimatedSection animation="slideInUp">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Powerful Features</h2>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={200}>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Everything you need to make informed farming decisions and maximize your agricultural success
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
            ].map((feature, index) => (
              <AnimatedCard key={index} index={index} delay={100}>
                <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-4 transform hover:rotate-12 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedSection animation="fadeInUp" delay={800}>
            <div className="text-center mt-12">
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white transform hover:scale-105 transition-all duration-300"
                onClick={() => navigateToPage("/features")}
              >
                Explore All Features
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Predict Section - Gradient Background */}
      <section id="predict" className="py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="slideInUp">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Farming?
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={200}>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who are already using AgroGuide to make smarter, data-driven decisions and
              increase their yields.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
                onClick={() => navigateToPage("/predict")}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {[
              { number: "10000+", label: "Active Farmers" },
              { number: "95%", label: "Accuracy Rate" },
              { number: "30%", label: "Average Yield Increase" },
            ].map((stat, index) => (
              <AnimatedCard key={index} index={index} delay={150}>
                <div className="text-center">
                  <CountUpAnimation end={stat.number} duration={2000} />
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedSection animation="fadeInUp" delay={800}>
            <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400">
              {[
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
              ].map((indicator, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 transform hover:scale-105 transition-transform duration-300"
                >
                  {indicator.icon}
                  <span>{indicator.text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
