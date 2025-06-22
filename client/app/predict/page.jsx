"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  Star,
  Shield,
  CheckCircle,
  MapPin,
  Thermometer,
  Leaf,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Predict() {
  const [formData, setFormData] = useState({
    location: "",
    soilType: "",
    nitrogenRequired: "",
    phosphorousRequired: "",
    potassiumRequired: "",
    soilpH: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    farmSize: "",
    climate: "",
    previousCrop: "",
    budget: "",
    experience: "",
    notes: "",
  })

  const [predictions, setPredictions] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // const handlePredict = async () => {
  //   setIsLoading(true)
  //   // Simulate API call
  //   setTimeout(() => {
  //     setPredictions({
  //       recommendedCrops: [
  //         { name: "Corn", suitability: 95, expectedYield: "180 bushels/kattha", profit: "$850/kattha", risk: "Low" },
  //         { name: "Soybeans", suitability: 88, expectedYield: "55 bushels/kattha", profit: "$720/kattha", risk: "Medium" },
  //         { name: "Wheat", suitability: 82, expectedYield: "65 bushels/kattha", profit: "$650/kattha", risk: "Low" },
  //       ],
  //       insights: {
  //         bestPlantingTime: "Mid-April to Early May",
  //         weatherRisk: "Low - Favorable conditions expected",
  //         marketOutlook: "Strong demand projected for corn",
  //         soilRecommendation: "Consider nitrogen supplementation",
  //       },
  //     })
  //     setIsLoading(false)
  //   }, 2000)
  // }

  const handlePredict = async () => {
    setIsLoading(true)

    // ✅ Validate required fields (you can customize this further)
    const requiredFields = [
      "nitrogenRequired",
      "phosphorousRequired",
      "potassiumRequired",
      "temperature",
      "humidity",
      "soilpH",
      "rainfall"
    ]

    for (const field of requiredFields) {
      if (!formData[field] || isNaN(Number(formData[field]))) {
        alert(`Please enter a valid number for "${field}"`)
        setIsLoading(false)
        return
      }
    }

    // ✅ Prepare safe numeric payload for model
    const payload = {
      N: Number(formData.nitrogenRequired),
      P: Number(formData.phosphorousRequired),
      K: Number(formData.potassiumRequired),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.soilpH),
      rainfall: Number(formData.rainfall),
    }

    try {
      const response = await fetch("http://localhost:8000/api/crops/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      console.log("🌱 Recommended crop:", data.recommended_crop)

      setPredictions({
        recommendedCrops: [
          {
            name: data.recommended_crop,
            suitability: 95,
            expectedYield: "Auto-calculated",
            profit: "Est. based on local market",
            risk: "Low",
          },
        ],
        insights: {
          bestPlantingTime: "As per forecasted window",
          weatherRisk: "Low",
          marketOutlook: "Positive",
          soilRecommendation: "Monitor pH and nutrient levels",
        },
      })
    } catch (err) {
      console.error("❌ Prediction failed:", err)
      alert("Prediction failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }


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
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">AI-Powered Crop Prediction</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Get personalized crop recommendations based on your specific farming conditions. Our AI analyzes your data
              to provide accurate predictions and maximize your yield potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
                onClick={() => document.getElementById("prediction-form").scrollIntoView({ behavior: "smooth" })}
              >
                Start Prediction
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

        {/* Prediction Form */}
        <section id="prediction-form" className="py-20 bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Get Your Crop Predictions</h2>
              <p className="text-gray-300">Fill in your farming details to receive personalized recommendations</p>
            </div>

            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-xl">Farm Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      Farm Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="City, State or ZIP code"
                        className="pl-10 bg-slate-600 border-slate-500 text-white"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmSize" className="text-white">
                      Farm Size (katthas)
                    </Label>
                    <Input type="number"
                      id="farmSize"
                      placeholder="e.g., 100"
                      className="bg-slate-600 border-slate-500 text-white"
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange("farmSize", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soilType" className="text-white">
                      Soil Type
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("soilType", value)}>
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nitrogenRrquired" className="text-white">
                      Nitrogen Content (N)
                    </Label>
                    <Input type="number"
                      id="nitrogenRequired"
                      placeholder="e.g., 100" required
                      className="bg-slate-600 border-slate-500 text-white"
                      value={formData.nitrogenRequired}
                      onChange={(e) => handleInputChange("nitrogenRequired", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorousRequired" className="text-white">
                      Phosphorous Content (P)
                    </Label>
                    <Input type="number"
                      id="phosphorousRequired" required
                      placeholder="e.g., 100"
                      className="bg-slate-600 border-slate-500 text-white"
                      value={formData.phosphorousRequired}
                      onChange={(e) => handleInputChange("phosphorousRequired", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmSize" className="text-white">
                      Potassium Content (K)
                    </Label>
                    <Input type="number" required
                      id="potassiumRequired"
                      placeholder="e.g., 100"
                      className="bg-slate-600 border-slate-500 text-white"
                      value={formData.potassiumRequired}
                      onChange={(e) => handleInputChange("potassiumRequired", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall" className="text-white">
                      Rainfall
                    </Label>
                    <Input type="number"
                      id="rainfall" required
                      placeholder="e.g., 100"
                      className="bg-slate-600 border-slate-500 text-white"
                      value={formData.rainfall}
                      onChange={(e) => handleInputChange("rainfall", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity" className="text-white">
                      Humidity
                    </Label>
                    <Input type="number" required
                      id="humidity"
                      placeholder="e.g., 100"
                      className="bg-slate-600 border-slate-500 text-white"
                      value={formData.humidity}
                      onChange={(e) => handleInputChange("humidity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="text-white">
                      Temperature (degree C)
                    </Label>
                    <Input type="number" required
                      id="temperature"
                      placeholder="e.g., 100"
                      className="bg-slate-600 border-slate-500 text-white"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange("temperature", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilpH" className="text-white">
                      Soil pH
                    </Label>
                    <Input type="number"
                      id="soilpH"
                      placeholder="e.g., 100"
                      className="bg-slate-600 border-slate-500 text-white"
                      value={formData.soilpH}
                      onChange={(e) => handleInputChange("soilpH", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="climate" className="text-white">
                      Climate Zone
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("climate", value)}>
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select climate zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperate">Temperate</SelectItem>
                        <SelectItem value="subtropical">Subtropical</SelectItem>
                        <SelectItem value="arid">Arid</SelectItem>
                        <SelectItem value="tropical">Tropical</SelectItem>
                        <SelectItem value="continental">Continental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousCrop" className="text-white">
                      Previous Crop
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("previousCrop", value)}>
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="What did you grow last?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="soybeans">Soybeans</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="none">First time farming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-white">
                      Budget Range
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("budget", value)}>
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Under NPR 1000000</SelectItem>
                        <SelectItem value="medium">NPR 1000000 - NPR 5000000</SelectItem>
                        <SelectItem value="high">NPR 5000000 - NPR 10000000</SelectItem>
                        <SelectItem value="enterprise">Over NPR 10000000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements, concerns, or goals for your farm..."
                    className="bg-slate-600 border-slate-500 text-white"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isLoading || !formData.location || !formData.soilType}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-lg font-semibold"
                >
                  {isLoading ? "Analyzing Your Farm..." : "Get Crop Predictions"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Prediction Results */}
        {predictions && (
          <section className="py-20 bg-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Your Crop Recommendations</h2>
                <p className="text-gray-300">Based on your farm conditions, here are our AI-powered recommendations</p>
              </div>

              {/* Recommended Crops */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {predictions.recommendedCrops.map((crop, index) => (
                  <Card key={index} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{crop.name}</h3>
                        <div className="text-emerald-400 font-bold">{crop.suitability}%</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span className="text-gray-300 text-sm">Yield: {crop.expectedYield}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span className="text-gray-300 text-sm">Profit: {crop.profit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-emerald-400" />
                          <span className="text-gray-300 text-sm">Risk: {crop.risk}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${crop.suitability}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Insights */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Additional Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Best Planting Time</h4>
                        <p className="text-gray-300 text-sm">{predictions.insights.bestPlantingTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Thermometer className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Weather Risk</h4>
                        <p className="text-gray-300 text-sm">{predictions.insights.weatherRisk}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Market Outlook</h4>
                        <p className="text-gray-300 text-sm">{predictions.insights.marketOutlook}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Leaf className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h4 className="text-white font-semibold mb-1">Soil Recommendation</h4>
                        <p className="text-gray-300 text-sm">{predictions.insights.soilRecommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Farming?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who are already using AgroGuide to make smarter, data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
