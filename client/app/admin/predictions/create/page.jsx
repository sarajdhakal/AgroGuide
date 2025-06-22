"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Brain, AlertCircle, CheckCircle, MapPin, Thermometer } from "lucide-react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function CreatePredictionPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [predictionResult, setPredictionResult] = useState(null)

  const [formData, setFormData] = useState({
    userId: "",
    cropType: "",
    location: "",
    farmSize: "",
    soilType: "",
    soilPh: "",
    climate: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    season: "",
    previousCrop: "",
    fertilizer: "",
    irrigation: "",
    budget: "",
    notes: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call for prediction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock prediction result
      const mockResult = {
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
        expectedYield: `${Math.floor(Math.random() * 50) + 100} bushels/acre`,
        profitability: `$${Math.floor(Math.random() * 500) + 500}/acre`,
        riskLevel: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
        recommendations: [
          "Consider nitrogen supplementation",
          "Monitor soil moisture levels",
          "Plant during optimal weather window",
        ],
      }

      setPredictionResult(mockResult)
      setSuccess("Prediction generated successfully!")
    } catch (err) {
      setError("Failed to generate prediction. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar
        activeTab="predictions"
        setActiveTab={() => {}}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="predictions" />

        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Prediction</h1>
                <p className="text-slate-600 dark:text-slate-400">Generate AI-powered crop predictions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Prediction Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert className="bg-red-50 border-red-200 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* User Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="userId">Select User (Optional)</Label>
                      <Select value={formData.userId} onValueChange={(value) => handleInputChange("userId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user or create anonymous prediction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user1">John Farmer (john@farm.com)</SelectItem>
                          <SelectItem value="user2">Sarah Green (sarah@greenfields.com)</SelectItem>
                          <SelectItem value="user3">Mike Johnson (mike@johnson-farm.com)</SelectItem>
                          <SelectItem value="anonymous">Anonymous Prediction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cropType">Crop Type *</Label>
                        <Select
                          value={formData.cropType}
                          onValueChange={(value) => handleInputChange("cropType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corn">Corn</SelectItem>
                            <SelectItem value="soybeans">Soybeans</SelectItem>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmSize">Farm Size (acres)</Label>
                        <Input
                          id="farmSize"
                          value={formData.farmSize}
                          onChange={(e) => handleInputChange("farmSize", e.target.value)}
                          placeholder="e.g., 100"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="City, State or ZIP code"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Soil Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="soilType">Soil Type</Label>
                        <Select
                          value={formData.soilType}
                          onValueChange={(value) => handleInputChange("soilType", value)}
                        >
                          <SelectTrigger>
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
                        <Label htmlFor="soilPh">Soil pH</Label>
                        <Input
                          id="soilPh"
                          value={formData.soilPh}
                          onChange={(e) => handleInputChange("soilPh", e.target.value)}
                          placeholder="e.g., 6.5"
                        />
                      </div>
                    </div>

                    {/* Climate Data */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature (°C)</Label>
                        <div className="relative">
                          <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <Input
                            id="temperature"
                            value={formData.temperature}
                            onChange={(e) => handleInputChange("temperature", e.target.value)}
                            placeholder="e.g., 25"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="humidity">Humidity (%)</Label>
                        <Input
                          id="humidity"
                          value={formData.humidity}
                          onChange={(e) => handleInputChange("humidity", e.target.value)}
                          placeholder="e.g., 70"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rainfall">Rainfall (mm)</Label>
                        <Input
                          id="rainfall"
                          value={formData.rainfall}
                          onChange={(e) => handleInputChange("rainfall", e.target.value)}
                          placeholder="e.g., 500"
                        />
                      </div>
                    </div>

                    {/* Additional Parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="season">Season</Label>
                        <Select value={formData.season} onValueChange={(value) => handleInputChange("season", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spring">Spring</SelectItem>
                            <SelectItem value="summer">Summer</SelectItem>
                            <SelectItem value="fall">Fall</SelectItem>
                            <SelectItem value="winter">Winter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="previousCrop">Previous Crop</Label>
                        <Select
                          value={formData.previousCrop}
                          onValueChange={(value) => handleInputChange("previousCrop", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select previous crop" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corn">Corn</SelectItem>
                            <SelectItem value="soybeans">Soybeans</SelectItem>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="fallow">Fallow</SelectItem>
                            <SelectItem value="none">First time farming</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Any additional information or specific requirements..."
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.cropType || !formData.location}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      {isLoading ? "Generating Prediction..." : "Generate Prediction"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {!predictionResult && !isLoading && (
                    <div className="text-center py-12 text-slate-500">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Fill in the parameters and click "Generate Prediction" to see results</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-slate-600">Analyzing data and generating prediction...</p>
                    </div>
                  )}

                  {success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  {predictionResult && (
                    <div className="space-y-6">
                      {/* Confidence Score */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">{predictionResult.confidence}%</div>
                        <p className="text-slate-600">Prediction Confidence</p>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-slate-900 mb-1">Expected Yield</h4>
                          <p className="text-emerald-600 font-medium">{predictionResult.expectedYield}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-slate-900 mb-1">Profitability</h4>
                          <p className="text-emerald-600 font-medium">{predictionResult.profitability}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-slate-900 mb-1">Risk Level</h4>
                          <p
                            className={`font-medium ${
                              predictionResult.riskLevel === "Low"
                                ? "text-green-600"
                                : predictionResult.riskLevel === "Medium"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {predictionResult.riskLevel}
                          </p>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Recommendations</h4>
                        <ul className="space-y-2">
                          {predictionResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-600">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => {
                            setPredictionResult(null)
                            setSuccess("")
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          New Prediction
                        </Button>
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Save Results</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
