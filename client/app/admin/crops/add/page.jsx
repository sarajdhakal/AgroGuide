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
import { ArrowLeft, Save, Wheat, AlertCircle, CheckCircle } from "lucide-react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import axios from "axios"

export default function AddCropPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const crops = {
    cropName: "",
    scientificName: "",
    category: "",
    season: "",
    growthPeriod: "",
    soilType: "",
    climate: "",
    soilpH: "",
    temperature: "",
    humidity: "",
    sunlight: "",
    spacing: "",
    nitrogenRequired: "",
    phosphorusRequired: "",
    potassiumRequired: "",
    fertilizer: "",
    pestControl: "",
    harvesting: "",
    storage: "",
    marketValue: "",
    weather: "",
    rainfall: "",
    description: "",
    tips: "",
  }

  const [crop, setCrop] = useState(crops);



  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    await axios
      .post("http://localhost:8000/api/crop", {
        ...crop
      })
      .then((response) => {
        setSuccess(response.data.message || "Crop added successfully!")
        console.log("Crop added successfully.")
        setTimeout(() => {
          router.push("/admin/crops/")
        }, 2000)
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to add crop. Please try again.");
      });

    // try {
    //   // Simulate API call
    //   await new Promise((resolve) => setTimeout(resolve, 1500))
    //   setSuccess("Crop added successfully!")

    //   setTimeout(() => {
    //     router.push("/admin")
    //   }, 2000)
    // } catch (err) {
    //   setError("Failed to add crop. Please try again.")
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const handleInputChange = (field, value) => {
    setCrop((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar
        activeTab="crops"
        setActiveTab={() => { }}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-16"}`}>
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="crops" />

        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Crop</h1>
                <p className="text-slate-600 dark:text-slate-400">Add a new crop to the database</p>
              </div>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="w-5 h-5" />
                  Crop Information
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

                  {success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Crop Name *</Label>
                      <Input
                        id="name"
                        value={crop.cropName}
                        onChange={(e) => handleInputChange("cropName", e.target.value)}
                        placeholder="e.g., Corn"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scientificName">Scientific Name</Label>
                      <Input
                        id="scientificName"
                        value={crop.scientificName}
                        onChange={(e) => handleInputChange("scientificName", e.target.value)}
                        placeholder="e.g., Zea mays"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={crop.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cereal">Cereal</SelectItem>
                          <SelectItem value="Legume">Legume</SelectItem>
                          <SelectItem value="Vegetable">Vegetable</SelectItem>
                          <SelectItem value="Fruit">Fruit</SelectItem>
                          <SelectItem value="Fiber">Fiber</SelectItem>
                          <SelectItem value="Oilseed">Oilseed</SelectItem>
                          <SelectItem value="Spice">Spice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="season">Growing Season</Label>
                      <Select value={crop.season} onValueChange={(value) => handleInputChange("season", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                          <SelectItem value="Fall">Fall</SelectItem>
                          <SelectItem value="Winter">Winter</SelectItem>
                          <SelectItem value="Year-Round">Year Round</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="growthPeriod">Growth Period</Label>
                      <Input
                        id="growthPeriod"
                        value={crop.growthPeriod}
                        onChange={(e) => handleInputChange("growthPeriod", e.target.value)}
                        placeholder="e.g., 90-120 days"
                      />
                    </div>
                  </div>

                  {/* Growing Conditions */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Growing Conditions</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="soilType">Soil Type</Label>
                        <Input
                          id="soilType"
                          value={crop.soilType}
                          onChange={(e) => handleInputChange("soilType", e.target.value)}
                          placeholder="e.g., Loamy, Well-drained"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="soilpH">Soil pH Value</Label>
                        <Input
                          id="soilpH"
                          value={crop.soilpH}
                          onChange={(e) => handleInputChange("soilpH", e.target.value)}
                          placeholder="e.g., 6.0 to 6.8"
                        />
                      </div>  <div className="space-y-2">
                        <Label htmlFor="climate">Climate</Label>
                        <Input
                          id="climate"
                          value={crop.climate}
                          onChange={(e) => handleInputChange("climate", e.target.value)}
                          placeholder="e.g., Temperate, Tropical"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="nitrogenRequired">Nitrogen Content Required(N)</Label>
                        <Input
                          id="nitrogenRequired"
                          value={crop.nitrogenRequired}
                          onChange={(e) => handleInputChange("nitrogenRequired", e.target.value)}
                          placeholder="e.g. 10-14"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phosphorusRequired">Phosphorous Content Required (P)</Label>
                        <Input
                          id="phosphorusRequired"
                          value={crop.phosphorusRequired}
                          onChange={(e) => handleInputChange("phosphorusRequired", e.target.value)}
                          placeholder="e.g., 10-14 "
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="potassiumRequired">Potassium Content Required (K) </Label>
                        <Input
                          id="potassiumRequired"
                          value={crop.sunlight}
                          onChange={(e) => handleInputChange("potassiumRequired", e.target.value)}
                          placeholder="e.g.,10-14 "
                        />
                      </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature Range</Label>
                        <Input
                          id="temperature"
                          value={crop.temperature}
                          onChange={(e) => handleInputChange("temperature", e.target.value)}
                          placeholder="e.g., 20-30°C"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="humidity">Humidity</Label>
                        <Input
                          id="humidity"
                          value={crop.humidity}
                          onChange={(e) => handleInputChange("humidity", e.target.value)}
                          placeholder="e.g., 60-80%"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sunlight">Sunlight</Label>
                        <Input
                          id="sunlight"
                          value={crop.sunlight}
                          onChange={(e) => handleInputChange("sunlight", e.target.value)}
                          placeholder="e.g., Full sun, 6-8 hours"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="rainfall">Rainfall</Label>
                        <Input
                          id="rainfall"
                          value={crop.rainfall}
                          onChange={(e) => handleInputChange("rainfall", e.target.value)}
                          placeholder="e.g., 500-700mm annually"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spacing">Plant Spacing</Label>
                        <Input
                          id="spacing"
                          value={crop.spacing}
                          onChange={(e) => handleInputChange("spacing", e.target.value)}
                          placeholder="e.g., 30cm x 75cm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Farming Practices */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Farming Practices</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fertilizer">Fertilizer Requirements</Label>
                        <Textarea
                          id="fertilizer"
                          value={crop.fertilizer}
                          onChange={(e) => handleInputChange("fertilizer", e.target.value)}
                          placeholder="Describe fertilizer needs and application schedule..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pestControl">Pest Control</Label>
                        <Textarea
                          id="pestControl"
                          value={crop.pestControl}
                          onChange={(e) => handleInputChange("pestControl", e.target.value)}
                          placeholder="Common pests and control methods..."
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="harvesting">Harvesting</Label>
                          <Textarea
                            id="harvesting"
                            value={crop.harvesting}
                            onChange={(e) => handleInputChange("harvesting", e.target.value)}
                            placeholder="Harvesting methods and timing..."
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storage">Storage</Label>
                          <Textarea
                            id="storage"
                            value={crop.storage}
                            onChange={(e) => handleInputChange("storage", e.target.value)}
                            placeholder="Post-harvest storage requirements..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="marketPrice">Market Price Range</Label>
                        <Input
                          id="marketPrice"
                          value={crop.marketValue}
                          onChange={(e) => handleInputChange("marketValue", e.target.value)}
                          placeholder="e.g., $3-5 per bushel"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={crop.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="General description of the crop..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tips">Growing Tips</Label>
                        <Textarea
                          id="tips"
                          value={crop.tips}
                          onChange={(e) => handleInputChange("tips", e.target.value)}
                          placeholder="Helpful tips for successful cultivation..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Adding Crop..." : "Add Crop"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
