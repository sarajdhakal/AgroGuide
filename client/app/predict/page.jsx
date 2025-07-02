"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Star,
  Shield,
  CheckCircle,
  Thermometer,
  Leaf,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Droplets,
  Wind,
  Sun,
  Beaker,
  Sprout,
  User,
  Wallet,
  FileText,
  AlertCircle,
  Crown,
  Lock,
  Zap,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FarmLocationPicker from "@/components/FarmLocationPicker"
import { useAuth } from "@/components/AuthProvider"

export default function Predict() {
  const router = useRouter()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    location: "",
    locationCoordinates: null,
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
  const [predictionId, setPredictionId] = useState(null)
  const [errors, setErrors] = useState({})

  // Subscription and limits state
  const [userSubscription, setUserSubscription] = useState(null)
  const [predictionCount, setPredictionCount] = useState(0)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)

  // Check user subscription and prediction count
  useEffect(() => {
    const checkSubscriptionAndLimits = async () => {
      if (!user) {
        setIsLoadingSubscription(false)
        return
      }

      try {
        setIsLoadingSubscription(true)

        // Fetch user details including subscription
        const userResponse = await axios.get(`http://localhost:8000/api/user/${user.id}`)
        const userData = userResponse.data

        // Set subscription data (default to free if not specified)
        const subscription = userData.subscription || { plan: "free", status: "active" }
        setUserSubscription(subscription)

        // Fetch user's predictions to count them
        const allPredictionsResponse = await axios.get(`http://localhost:8000/api/predictions`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })

        const allPredictions = allPredictionsResponse.data || []

        const userPredictions = allPredictions.filter((prediction) => {
          const predictionUserId =
            typeof prediction.userId === "object" && prediction.userId !== null
              ? prediction.userId._id || prediction.userId.toString()
              : prediction.userId

          return String(predictionUserId) === String(user.id)
        })

        setPredictionCount(userPredictions.length)
        console.log("✅ Matched predictions:", userPredictions.length)

        console.log("User subscription:", subscription)
      } catch (error) {
        console.error("Error fetching subscription details:", error)
        // Default to free plan if error
        setUserSubscription({ plan: "free", status: "active" })
        setPredictionCount(0)
      } finally {
        setIsLoadingSubscription(false)
      }
    }

    checkSubscriptionAndLimits()
  }, [user])

  // Check if user has exceeded free plan limits
  const hasExceededLimit = () => {
    if (!userSubscription) return false
    if (userSubscription.plan === "pro" || userSubscription.plan === "premium") return false
    return predictionCount >= 3
  }

  // Check if user can make predictions
  const canMakePrediction = () => {
    if (!user) return false
    if (isLoadingSubscription) return false
    return !hasExceededLimit()
  }

  // Get remaining predictions for free users
  const getRemainingPredictions = () => {
    if (!userSubscription || userSubscription.plan === "pro" || userSubscription.plan === "premium") {
      return "Unlimited"
    }
    return Math.max(0, 3 - predictionCount)
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    // Farm Information validation
    if (!formData.location.trim()) {
      newErrors.location = "Farm location is required"
    }
    if (!formData.farmSize || Number(formData.farmSize) <= 0) {
      newErrors.farmSize = "Please enter a valid farm size"
    }
    if (!formData.soilType) {
      newErrors.soilType = "Please select a soil type"
    }

    // Soil Analysis validation
    if (!formData.nitrogenRequired || Number(formData.nitrogenRequired) < 0) {
      newErrors.nitrogenRequired = "Please enter a valid nitrogen value (0-300)"
    }
    if (!formData.phosphorousRequired || Number(formData.phosphorousRequired) < 0) {
      newErrors.phosphorousRequired = "Please enter a valid phosphorous value (0-150)"
    }
    if (!formData.potassiumRequired || Number(formData.potassiumRequired) < 0) {
      newErrors.potassiumRequired = "Please enter a valid potassium value (0-300)"
    }
    if (!formData.soilpH || Number(formData.soilpH) < 0 || Number(formData.soilpH) > 14) {
      newErrors.soilpH = "Please enter a valid pH value (0-14)"
    }

    // Environmental Conditions validation
    if (!formData.temperature || Number(formData.temperature) < -50 || Number(formData.temperature) > 60) {
      newErrors.temperature = "Please enter a valid temperature (-50 to 60°C)"
    }
    if (!formData.humidity || Number(formData.humidity) < 0 || Number(formData.humidity) > 100) {
      newErrors.humidity = "Please enter a valid humidity (0-100%)"
    }
    if (!formData.rainfall || Number(formData.rainfall) < 0) {
      newErrors.rainfall = "Please enter a valid rainfall amount"
    }
    if (!formData.climate) {
      newErrors.climate = "Please select a climate zone"
    }

    // Farming Details validation
    if (!formData.previousCrop) {
      newErrors.previousCrop = "Please select previous crop information"
    }
    if (!formData.budget) {
      newErrors.budget = "Please select a budget range"
    }
    if (!formData.experience) {
      newErrors.experience = "Please select your farming experience"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleLocationChange = (location, coordinates) => {
    setFormData((prev) => ({
      ...prev,
      location,
      locationCoordinates: coordinates || null,
    }))

    if (errors.location) {
      setErrors((prev) => ({
        ...prev,
        location: "",
      }))
    }
  }

  const handlePredict = async () => {
    // Check subscription limits first
    if (!canMakePrediction()) {
      return
    }

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setIsLoading(true)

    // Prepare payload for AI model
    const aiPayload = {
      N: Number(formData.nitrogenRequired),
      P: Number(formData.phosphorousRequired),
      K: Number(formData.potassiumRequired),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.soilpH),
      rainfall: Number(formData.rainfall),
    }

    try {
      // Get AI predictions using axios
      const aiResponse = await axios.post("http://localhost:8000/api/crops/predict", aiPayload, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      })

      const aiData = aiResponse.data
      console.log("🌱 AI Response:", aiData)

      // Convert AI response to recommended crops format
      let recommendedCrops = []

      // AI response format: { "Low Risk": "cropName (confidence)", ... }
      const riskLevels = Object.keys(aiData)

      if (riskLevels.length > 0) {
        recommendedCrops = riskLevels
          .map((riskLabel) => {
            const value = aiData[riskLabel] || ""
            const [name, confidenceRaw] = value.split(" (")
            const confidence = confidenceRaw ? Number.parseFloat(confidenceRaw.replace(")", "")) : 0.8

            return {
              cropName: name.trim(),
              scientificName: getCropScientificName(name.trim()),
              suitability: Math.round(confidence * 100),
              expectedYield: "Auto-calculated",
              profit: "Est. based on local market",
              risk: riskLabel.replace(" Risk", ""),
            }
          })
          .slice(0, 3) // limit to top 3
      } else {
        recommendedCrops = [
          {
            cropName: "Unknown",
            scientificName: "Unknown",
            suitability: 90,
            expectedYield: "Auto-calculated",
            profit: "Est. based on local market",
            risk: "Low",
          },
        ]
      }

      // Prepare data for your backend API
      const predictionData = {
        userId: user?.id || "665d18a23f52fc2a8ef3bc9a", // Use actual user ID or fallback
        inputData: {
          location: formData.location,
          locationCoordinates: formData.locationCoordinates,
          soilType: formData.soilType,
          nitrogenRequired: formData.nitrogenRequired,
          phosphorousRequired: formData.phosphorousRequired,
          potassiumRequired: formData.potassiumRequired,
          soilpH: formData.soilpH,
          temperature: formData.temperature,
          humidity: formData.humidity,
          rainfall: formData.rainfall,
          farmSize: formData.farmSize,
          climate: formData.climate,
          previousCrop: formData.previousCrop,
          budget: formData.budget,
          experience: formData.experience || "intermediate",
          notes: formData.notes,
        },
        recommendedCrops: recommendedCrops.map((crop) => ({
          cropName: crop.cropName,
          scientificName: crop.scientificName,
          suitability: crop.suitability,
          risk: crop.risk,
        })),
      }

      // Save to your backend
      const saveResponse = await axios.post("http://localhost:8000/api/predictions", predictionData, {
        headers: { "Content-Type": "application/json" },
      })

      console.log("Saved Prediction:", saveResponse.data)
      setPredictionId(saveResponse.data.prediction._id)

      // Update prediction count immediately
      setPredictionCount((prev) => prev + 1)

      // Set predictions for UI display
      setPredictions({
        recommendedCrops,
        insights: {
          bestPlantingTime: "As per forecasted window",
          weatherRisk: "Low",
          marketOutlook: "Positive",
          soilRecommendation: "Monitor pH and nutrient levels",
        },
      })

      console.log("✅ Prediction saved successfully")

      // Scroll to results
      setTimeout(() => {
        document.getElementById("prediction-results").scrollIntoView({ behavior: "smooth" })
      }, 500)
    } catch (err) {
      console.error("❌ Prediction failed:", err)
      if (err.response) {
        setErrors({ submit: `Prediction failed: ${err.response.data?.message || err.response.statusText}` })
      } else if (err.request) {
        setErrors({ submit: "No response from server. Please check if the AI service is running." })
      } else {
        setErrors({ submit: `Prediction failed: ${err.message}` })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCropSelect = async (crop) => {
    if (!predictionId) {
      alert("Please save your prediction first")
      return
    }

    try {
      const kebabCaseScientificName = crop.scientificName.toLowerCase().replace(/\s+/g, "-")

      // Save the selected crop choice using your backend API
      const selectionData = {
        predictionId: predictionId,
        cropName: crop.cropName,
        scientificName: crop.scientificName,
      }

      console.log("✅ Sending crop selection:", selectionData)

      await axios.post("http://localhost:8000/api/predictions/select", selectionData, {
        headers: { "Content-Type": "application/json" },
      })

      // Redirect to crop details page using kebab-case scientific name
      router.push(`/crop-details/${kebabCaseScientificName}?predictionId=${predictionId}`)
    } catch (error) {
      console.error("Error selecting crop:", error)
      alert("Failed to select crop. Please try again.")
    }
  }

  const getCropScientificName = (cropName) => {
    // Map common names to scientific names (matching your backend data)
    const cropMapping = {
      // Cereals
      rice: "Oryza sativa",
      maize: "Zea mays",
      // Legumes
      chickpea: "Cicer arietinum",
      kidneybeans: "Phaseolus vulgaris",
      pigeonpeas: "Cajanus cajan",
      mothbeans: "Vigna aconitifolia",
      mungbean: "Vigna radiata",
      blackgram: "Vigna mungo",
      lentil: "Lens culinaris",
      // Fruits
      pomegranate: "Punica granatum",
      banana: "Musa spp.",
      mango: "Mangifera indica",
      grapes: "Vitis vinifera",
      watermelon: "Citrullus lanatus",
      muskmelon: "Cucumis melo",
      apple: "Malus domestica",
      orange: "Citrus sinensis",
      papaya: "Carica papaya",
      coconut: "Cocos nucifera",
      // Cash crops
      cotton: "Gossypium hirsutum",
      jute: "Corchorus olitorius",
      coffee: "Coffea arabica",
    }

    return cropMapping[cropName.toLowerCase()] || cropName
  }

  const handleUpgradeClick = () => {
    router.push("/pricing")
  }

  const handleStartFreeTrial = () => {
    if (!user) {
      router.push("/login")
    } else if (userSubscription?.plan === "pro" || userSubscription?.plan === "premium") {
      // Already pro user, scroll to form
      document.getElementById("prediction-form").scrollIntoView({ behavior: "smooth" })
    } else if (hasExceededLimit()) {
      // Free user who exceeded limit, redirect to pricing
      router.push("/pricing")
    } else {
      // Free user within limit, scroll to form
      document.getElementById("prediction-form").scrollIntoView({ behavior: "smooth" })
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

            {/* Subscription Status */}
            {user && !isLoadingSubscription && (
              <div className="mb-8">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${userSubscription?.plan === "pro" || userSubscription?.plan === "premium"
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-slate-800 text-gray-300 border border-slate-600"
                    }`}
                >
                  {userSubscription?.plan === "pro" || userSubscription?.plan === "premium" ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Pro Plan - Unlimited Predictions
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Free Plan - {getRemainingPredictions()} predictions remaining
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
                onClick={handleStartFreeTrial}
              >
                {!user
                  ? "Start Prediction"
                  : userSubscription?.plan === "pro" || userSubscription?.plan === "premium"
                    ? "Start Prediction"
                    : hasExceededLimit()
                      ? "Upgrade to Pro"
                      : "Start Prediction"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-full bg-transparent"
                onClick={() => window.open("https://youtu.be/G0JWNPa_SwY", "_blank")}
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
        {user ? (
          <section id="prediction-form" className="py-20 bg-slate-800 relative">
            {/* Blur overlay for exceeded limits */}
            {hasExceededLimit() && (
              <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                <Card className="bg-slate-800 border-slate-600 max-w-md mx-4">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h3>
                      <p className="text-gray-300">
                        You've reached your free plan limit of 3 predictions. Upgrade to Pro for unlimited predictions
                        and advanced features.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">Free Plan</span>
                          <span className="text-red-400">{predictionCount}/3 used</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(predictionCount / 3) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <Button
                        onClick={handleUpgradeClick}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade to Pro
                      </Button>

                      <div className="text-xs text-gray-400">
                        ✨ Unlimited predictions • Advanced analytics • Priority support
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${hasExceededLimit() ? "blur-sm" : ""}`}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Get Your Crop Predictions</h2>
                <p className="text-gray-300">Fill in your farming details to receive personalized recommendations</p>
              </div>

              {/* Error Alert */}
              {errors.submit && (
                <Alert className="mb-6 border-red-500 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-400">{errors.submit}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-8">
                {/* Farm Information Section */}
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                      Farm Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Farm Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-white flex items-center gap-1">
                          Farm Location *{errors.location && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <FarmLocationPicker
                          value={formData.location}
                          onChange={handleLocationChange}
                          className={errors.location ? "border-red-500" : ""}
                          disabled={!canMakePrediction()}
                        />
                        {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
                        {formData.locationCoordinates && (
                          <p className="text-xs text-gray-400">📍 Coordinates saved for weather data accuracy</p>
                        )}
                      </div>

                      {/* Farm Size */}
                      <div className="space-y-2">
                        <Label htmlFor="farmSize" className="text-white flex items-center gap-1">
                          Farm Size (katthas) *{errors.farmSize && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Input
                          type="number"
                          id="farmSize"
                          placeholder="e.g., 100"
                          min="0.1"
                          step="0.1"
                          className={`bg-slate-600 border-slate-500 text-white ${errors.farmSize ? "border-red-500" : ""}`}
                          value={formData.farmSize}
                          onChange={(e) => handleInputChange("farmSize", e.target.value)}
                          disabled={!canMakePrediction()}
                        />
                        {errors.farmSize && <p className="text-red-400 text-sm">{errors.farmSize}</p>}
                      </div>

                      {/* Soil Type */}
                      <div className="space-y-2">
                        <Label htmlFor="soilType" className="text-white flex items-center gap-1">
                          Soil Type *{errors.soilType && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange("soilType", value)}
                          disabled={!canMakePrediction()}
                        >
                          <SelectTrigger
                            className={`bg-slate-600 border-slate-500 text-white ${errors.soilType ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clay">Clay - Heavy, nutrient-rich</SelectItem>
                            <SelectItem value="sandy">Sandy - Light, well-draining</SelectItem>
                            <SelectItem value="loam">Loam - Balanced, fertile</SelectItem>
                            <SelectItem value="silt">Silt - Fine particles, moisture-retaining</SelectItem>
                            <SelectItem value="mixed">Mixed - Combination of types</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.soilType && <p className="text-red-400 text-sm">{errors.soilType}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Soil Analysis Section */}
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Beaker className="w-5 h-5 text-emerald-400" />
                      Soil Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Nitrogen */}
                      <div className="space-y-2">
                        <Label htmlFor="nitrogenRequired" className="text-white flex items-center gap-1">
                          Nitrogen (N) * <span className="text-xs text-gray-400">(0-300 kg/ha)</span>
                          {errors.nitrogenRequired && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Input
                          type="number"
                          id="nitrogenRequired"
                          placeholder="e.g., 100"
                          min="0"
                          max="300"
                          className={`bg-slate-600 border-slate-500 text-white ${errors.nitrogenRequired ? "border-red-500" : ""}`}
                          value={formData.nitrogenRequired}
                          onChange={(e) => handleInputChange("nitrogenRequired", e.target.value)}
                          disabled={!canMakePrediction()}
                        />
                        {errors.nitrogenRequired && <p className="text-red-400 text-sm">{errors.nitrogenRequired}</p>}
                      </div>

                      {/* Phosphorous */}
                      <div className="space-y-2">
                        <Label htmlFor="phosphorousRequired" className="text-white flex items-center gap-1">
                          Phosphorous (P) * <span className="text-xs text-gray-400">(0-150 kg/ha)</span>
                          {errors.phosphorousRequired && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Input
                          type="number"
                          id="phosphorousRequired"
                          placeholder="e.g., 50"
                          min="0"
                          max="150"
                          className={`bg-slate-600 border-slate-500 text-white ${errors.phosphorousRequired ? "border-red-500" : ""}`}
                          value={formData.phosphorousRequired}
                          onChange={(e) => handleInputChange("phosphorousRequired", e.target.value)}
                          disabled={!canMakePrediction()}
                        />
                        {errors.phosphorousRequired && (
                          <p className="text-red-400 text-sm">{errors.phosphorousRequired}</p>
                        )}
                      </div>

                      {/* Potassium */}
                      <div className="space-y-2">
                        <Label htmlFor="potassiumRequired" className="text-white flex items-center gap-1">
                          Potassium (K) * <span className="text-xs text-gray-400">(0-300 kg/ha)</span>
                          {errors.potassiumRequired && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Input
                          type="number"
                          id="potassiumRequired"
                          placeholder="e.g., 80"
                          min="0"
                          max="300"
                          className={`bg-slate-600 border-slate-500 text-white ${errors.potassiumRequired ? "border-red-500" : ""}`}
                          value={formData.potassiumRequired}
                          onChange={(e) => handleInputChange("potassiumRequired", e.target.value)}
                          disabled={!canMakePrediction()}
                        />
                        {errors.potassiumRequired && <p className="text-red-400 text-sm">{errors.potassiumRequired}</p>}
                      </div>

                      {/* Soil pH */}
                      <div className="space-y-2">
                        <Label htmlFor="soilpH" className="text-white flex items-center gap-1">
                          Soil pH * <span className="text-xs text-gray-400">(0-14)</span>
                          {errors.soilpH && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          id="soilpH"
                          placeholder="e.g., 6.5"
                          min="0"
                          max="14"
                          className={`bg-slate-600 border-slate-500 text-white ${errors.soilpH ? "border-red-500" : ""}`}
                          value={formData.soilpH}
                          onChange={(e) => handleInputChange("soilpH", e.target.value)}
                          disabled={!canMakePrediction()}
                        />
                        {errors.soilpH && <p className="text-red-400 text-sm">{errors.soilpH}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Conditions Section */}
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Sun className="w-5 h-5 text-emerald-400" />
                      Environmental Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Temperature */}
                      <div className="space-y-2">
                        <Label htmlFor="temperature" className="text-white flex items-center gap-1">
                          <Thermometer className="w-4 h-4" />
                          Temperature (°C) * <span className="text-xs text-gray-400">(-50 to 60)</span>
                          {errors.temperature && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Input
                          type="number"
                          id="temperature"
                          placeholder="e.g., 25"
                          min="-50"
                          max="60"
                          className={`bg-slate-600 border-slate-500 text-white ${errors.temperature ? "border-red-500" : ""}`}
                          value={formData.temperature}
                          onChange={(e) => handleInputChange("temperature", e.target.value)}
                          disabled={!canMakePrediction()}
                        />
                        {errors.temperature && <p className="text-red-400 text-sm">{errors.temperature}</p>}
                      </div>

                      {/* Humidity */}
                      <div className="space-y-2">
                        <Label htmlFor="humidity" className="text-white flex items-center gap-1">
                          <Droplets className="w-4 h-4" />
                          Humidity (%) * <span className="text-xs text-gray-400">(0-100)</span>
                          {errors.humidity && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Input
                          type="number"
                          id="humidity"
                          placeholder="e.g., 65"
                          min="0"
                          max="100"
                          className={`bg-slate-600 border-slate-500 text-white ${errors.humidity ? "border-red-500" : ""}`}
                          value={formData.humidity}
                          onChange={(e) => handleInputChange("humidity", e.target.value)}
                          disabled={!canMakePrediction()}
                        />
                        {errors.humidity && <p className="text-red-400 text-sm">{errors.humidity}</p>}
                      </div>

                      {/* Rainfall */}
                      <div className="space-y-2">
                        <Label htmlFor="rainfall" className="text-white flex items-center gap-1">
                          <Droplets className="w-4 h-4" />
                          Rainfall (mm) * <span className="text-xs text-gray-400">(Annual)</span>
                          {errors.rainfall && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Input
                          type="number"
                          id="rainfall"
                          placeholder="e.g., 1200"
                          min="0"
                          className={`bg-slate-600 border-slate-500 text-white ${errors.rainfall ? "border-red-500" : ""}`}
                          value={formData.rainfall}
                          onChange={(e) => handleInputChange("rainfall", e.target.value)}
                          disabled={!canMakePrediction()}
                        />
                        {errors.rainfall && <p className="text-red-400 text-sm">{errors.rainfall}</p>}
                      </div>

                      {/* Climate Zone */}
                      <div className="space-y-2">
                        <Label htmlFor="climate" className="text-white flex items-center gap-1">
                          <Wind className="w-4 h-4" />
                          Climate Zone *{errors.climate && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange("climate", value)}
                          disabled={!canMakePrediction()}
                        >
                          <SelectTrigger
                            className={`bg-slate-600 border-slate-500 text-white ${errors.climate ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select climate zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="temperate">Temperate - Moderate seasons</SelectItem>
                            <SelectItem value="subtropical">Subtropical - Warm, humid</SelectItem>
                            <SelectItem value="arid">Arid - Dry, low rainfall</SelectItem>
                            <SelectItem value="tropical">Tropical - Hot, humid</SelectItem>
                            <SelectItem value="continental">Continental - Extreme seasons</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.climate && <p className="text-red-400 text-sm">{errors.climate}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Farming Details Section */}
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-emerald-400" />
                      Farming Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Previous Crop */}
                      <div className="space-y-2">
                        <Label htmlFor="previousCrop" className="text-white flex items-center gap-1">
                          Previous Crop *{errors.previousCrop && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange("previousCrop", value)}
                          disabled={!canMakePrediction()}
                        >
                          <SelectTrigger
                            className={`bg-slate-600 border-slate-500 text-white ${errors.previousCrop ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="What did you grow last?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corn">Corn/Maize</SelectItem>
                            <SelectItem value="soybeans">Soybeans</SelectItem>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="vegetables">Vegetables</SelectItem>
                            <SelectItem value="none">First time farming</SelectItem>
                            <SelectItem value="fallow">Land was fallow</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.previousCrop && <p className="text-red-400 text-sm">{errors.previousCrop}</p>}
                      </div>

                      {/* Budget Range */}
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-white flex items-center gap-1">
                          <Wallet className="w-4 h-4" />
                          Budget Range *{errors.budget && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange("budget", value)}
                          disabled={!canMakePrediction()}
                        >
                          <SelectTrigger
                            className={`bg-slate-600 border-slate-500 text-white ${errors.budget ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Under NPR 100,000</SelectItem>
                            <SelectItem value="medium">NPR 100,000 - NPR 500,000</SelectItem>
                            <SelectItem value="high">NPR 500,000 - NPR 1,000,000</SelectItem>
                            <SelectItem value="enterprise">Over NPR 1,000,000</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.budget && <p className="text-red-400 text-sm">{errors.budget}</p>}
                      </div>

                      {/* Farming Experience */}
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-white flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Farming Experience *{errors.experience && <AlertCircle className="w-4 h-4 text-red-400" />}
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange("experience", value)}
                          disabled={!canMakePrediction()}
                        >
                          <SelectTrigger
                            className={`bg-slate-600 border-slate-500 text-white ${errors.experience ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                            <SelectItem value="intermediate">Intermediate (3-10 years)</SelectItem>
                            <SelectItem value="experienced">Experienced (10+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.experience && <p className="text-red-400 text-sm">{errors.experience}</p>}
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-white flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific requirements, concerns, or goals for your farm..."
                        className="bg-slate-600 border-slate-500 text-white min-h-[100px]"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        disabled={!canMakePrediction()}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    onClick={handlePredict}
                    disabled={isLoading || !canMakePrediction()}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-4 text-lg font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing Your Farm...
                      </>
                    ) : hasExceededLimit() ? (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Upgrade Required
                      </>
                    ) : (
                      "Get Crop Predictions"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-20 bg-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Sign In Required</h2>
              <p className="text-gray-300 mb-8">Please sign in to access crop prediction features</p>
              <Button
                onClick={() => router.push("/login")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
              >
                Sign In Now
              </Button>
            </div>
          </section>
        )}

        {/* Prediction Results */}
        {predictions && (
          <section id="prediction-results" className="py-20 bg-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Your Crop Recommendations</h2>
                <p className="text-gray-300">Based on your farm conditions, here are our AI-powered recommendations</p>
              </div>

              {/* Recommended Crops */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {predictions.recommendedCrops.map((crop, index) => (
                  <Card
                    key={index}
                    className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => handleCropSelect(crop)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{crop.cropName}</h3>
                        <div className="text-emerald-400 font-bold">{crop.suitability}%</div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-gray-400 text-sm italic">{crop.scientificName}</p>
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

                      <Button
                        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCropSelect(crop)
                        }}
                      >
                        Choose This Crop
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
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
        <section className={user ? "py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20" : "py-20 bg-slate-800"}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Farming?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who are already using AgroGuide to make smarter, data-driven decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold rounded-full"
                onClick={handleStartFreeTrial}
              >
                {!user
                  ? "Start Free Trial"
                  : userSubscription?.plan === "pro" || userSubscription?.plan === "premium"
                    ? "Start Free Trial"
                    : hasExceededLimit()
                      ? "Upgrade to Pro"
                      : "Start Free Trial"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-full bg-transparent"
                onClick={() => router.push("/contact")}
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
