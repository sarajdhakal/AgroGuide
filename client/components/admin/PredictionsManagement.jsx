"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Eye,
  Trash2,
  Edit,
  MapPin,
  Plus,
  CheckCircle,
  BarChart3,
  User,
  Calendar,
  Thermometer,
  Leaf,
  Brain,
  Star,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

export default function PredictionsManagement() {
  const router = useRouter()
  const { toast } = useToast()

  // State management
  const [predictions, setPredictions] = useState([])
  const [users, setUsers] = useState([])
  const [selectedCrops, setSelectedCrops] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Modal states
  const [selectedPrediction, setSelectedPrediction] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Crop selection modal states
  const [isSelectCropModalOpen, setIsSelectCropModalOpen] = useState(false)
  const [selectedPredictionForCrop, setSelectedPredictionForCrop] = useState(null)
  const [selectedCropForSelection, setSelectedCropForSelection] = useState(null)
  const [isSelectingCrop, setIsSelectingCrop] = useState(false)
  const [selectionNotes, setSelectionNotes] = useState("")

  // Create prediction form data
  const [createFormData, setCreateFormData] = useState({
    userId: "",
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

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [predictionsRes, usersRes, selectedCropsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/predictions"),
          axios.get("http://localhost:8000/api/users"),
          axios.get("http://localhost:8000/api/selected-crops"),
        ])

        setPredictions(predictionsRes.data)
        setUsers(usersRes.data)

        setSelectedCrops(selectedCropsRes.data)
        setError("")

        toast({
          title: "Data Loaded Successfully",
          description: `Loaded ${predictionsRes.data.length} predictions, ${usersRes.data.length} users, and ${selectedCropsRes.data.length} selected crops`,
        })
      } catch (error) {
        console.error("Error loading predictions:", error)
        setError("Failed to fetch predictions data")

        toast({
          title: "Error Loading Data",
          description: "Failed to fetch predictions data from server",
          variant: "destructive",
        })

        // Fallback mock data
        setPredictions([
          {
            _id: "68600017c4d51a2327538f7",
            userId: "685aba74ad3275a4a39980ab",
            inputData: {
              location: "Kathmandu Valley",
              locationCoordinates: { lat: 27.7172, lng: 85.324 },
              soilType: "sandy",
              nitrogenRequired: "90",
              phosphorousRequired: "42",
              potassiumRequired: "38",
              soilpH: "7",
              temperature: "26",
              humidity: "89",
              rainfall: "202",
              farmSize: "34",
              climate: "subtropical",
              previousCrop: "soybeans",
              budget: "medium",
              experience: "intermediate",
              notes: "Looking for high yield crops",
            },
            recommendedCrops: [
              {
                cropName: "rice",
                scientificName: "Oryza sativa",
                suitability: 85,
                risk: "Low",
                _id: "68600017c4d51a2327538f9",
              },
              {
                cropName: "wheat",
                scientificName: "Triticum aestivum",
                suitability: 75,
                risk: "Medium",
                _id: "68600017c4d51a2327538fa",
              },
              {
                cropName: "maize",
                scientificName: "Zea mays",
                suitability: 65,
                risk: "Low",
                _id: "68600017c4d51a2327538fb",
              },
            ],
            predictedAt: "2025-06-28T14:45:21.209+00:00",
            __v: 0,
          },
          {
            _id: "68600017c4d51a2327538f8",
            userId: "685aba74ad3275a4a39980ac",
            inputData: {
              location: "Pokhara",
              locationCoordinates: { lat: 28.2096, lng: 83.9856 },
              soilType: "loamy",
              nitrogenRequired: "80",
              phosphorousRequired: "35",
              potassiumRequired: "45",
              soilpH: "6.5",
              temperature: "24",
              humidity: "75",
              rainfall: "180",
              farmSize: "50",
              climate: "temperate",
              previousCrop: "potato",
              budget: "high",
              experience: "expert",
              notes: "Organic farming preferred",
            },
            recommendedCrops: [
              {
                cropName: "potato",
                scientificName: "Solanum tuberosum",
                suitability: 92,
                risk: "Low",
                _id: "68600017c4d51a2327538fc",
              },
              {
                cropName: "tomato",
                scientificName: "Solanum lycopersicum",
                suitability: 88,
                risk: "Medium",
                _id: "68600017c4d51a2327538fd",
              },
            ],
            predictedAt: "2025-06-27T10:30:15.123+00:00",
            __v: 0,
          },
        ])

        setUsers([
          {
            _id: "685aba74ad3275a4a39980ab",
            firstName: "Ram",
            lastName: "Sharma",
            email: "ram.sharma@example.com",
          },
          {
            _id: "685aba74ad3275a4a39980ac",
            firstName: "Sita",
            lastName: "Poudel",
            email: "sita.poudel@example.com",
          },
        ])

        setSelectedCrops([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Helper functions
  const getUserById = (userId) => {
    const id = typeof userId === "object" && userId !== null ? userId._id : userId
    const user = users.find((u) => u._id.toString() === id?.toString())
    return user || { firstName: "Unknown", lastName: "User", email: "N/A" }
  }

  const getSelectedCropByPredictionId = (predictionId) => {
    return selectedCrops.find((crop) => crop.predictionId === predictionId)
  }

  const filteredPredictions = predictions.filter((prediction) => {
    const user = getUserById(prediction.userId)
    const userName = `${user.firstName} ${user.lastName}`.toLowerCase()
    const matchesSearch =
      userName.includes(searchTerm.toLowerCase()) ||
      prediction.inputData?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.recommendedCrops?.[0]?.cropName?.toLowerCase().includes(searchTerm.toLowerCase())

    const hasRecommendations = prediction.recommendedCrops && prediction.recommendedCrops.length > 0
    const hasSelection = getSelectedCropByPredictionId(prediction._id)

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "completed" && hasRecommendations && hasSelection) ||
      (filterStatus === "pending" && hasRecommendations && !hasSelection) ||
      (filterStatus === "processing" && !hasRecommendations)

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (prediction) => {
    const hasRecommendations = prediction.recommendedCrops && prediction.recommendedCrops.length > 0
    const hasSelection = getSelectedCropByPredictionId(prediction._id)

    if (hasRecommendations && hasSelection) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>
    } else if (hasRecommendations && !hasSelection) {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending Selection</Badge>
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
    }
  }

  const getRiskBadge = (risk) => {
    const colors = {
      Low: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[risk] || "bg-gray-100 text-gray-800"}>{risk} Risk</Badge>
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-100"
      case "Medium":
        return "text-yellow-600 bg-yellow-100"
      case "High":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSuitabilityColor = (suitability) => {
    if (suitability >= 80) return "text-green-600"
    if (suitability >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // CRUD Operations
  const handleViewPrediction = (prediction) => {
    setSelectedPrediction(prediction)
    setIsViewModalOpen(true)
  }

  const handleEditPrediction = (prediction) => {
    setSelectedPrediction(prediction)
    setIsEditModalOpen(true)
  }

  const handleUpdatePrediction = async (updatedData) => {
    try {
      await axios.put(`http://localhost:8000/api/predictions/${selectedPrediction._id}`, updatedData)
      setPredictions((prev) => prev.map((p) => (p._id === selectedPrediction._id ? { ...p, ...updatedData } : p)))
      setIsEditModalOpen(false)
      setSelectedPrediction(null)

      toast({
        title: "Prediction Updated Successfully",
        description: "The prediction has been successfully updated",
      })
    } catch (error) {
      console.error("Error updating prediction:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update prediction. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePrediction = async (predictionId) => {
    if (!confirm("Are you sure you want to delete this prediction?")) return

    try {
      await axios.delete(`http://localhost:8000/api/predictions/${predictionId}`)
      setPredictions((prev) => prev.filter((p) => p._id !== predictionId))

      toast({
        title: "Prediction Deleted",
        description: "Prediction has been successfully deleted",
      })
    } catch (error) {
      console.error("Error deleting prediction:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete prediction. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Crop Selection Functions
  const handleSelectCrop = (prediction) => {
    setSelectedPredictionForCrop(prediction)
    setSelectedCropForSelection(null)
    setSelectionNotes("")
    setIsSelectCropModalOpen(true)
  }

  const handleCropSelection = async (crop) => {
    setIsSelectingCrop(true)

    try {
      const selectedCropData = {
        predictionId: selectedPredictionForCrop._id,
        cropName: crop.cropName,
        scientificName: crop.scientificName,
        suitability: crop.suitability,
        risk: crop.risk,
        selectedAt: new Date().toISOString(),
        notes: selectionNotes,
      }

      // Save selected crop to backend
      const response = await axios.post("http://localhost:8000/api/predictions/select", selectedCropData, {
        headers: { "Content-Type": "application/json" },
      })

      // Update local state
      setSelectedCrops((prev) => [...prev, response.data])
      setIsSelectCropModalOpen(false)
      setSelectedPredictionForCrop(null)
      setSelectedCropForSelection(null)
      setSelectionNotes("")

      toast({
        title: "Crop Selected Successfully! 🌱",
        description: `${crop.cropName} has been selected for this prediction. The prediction is now complete.`,
      })
      setTimeout(() => {
        window.location.reload()
      }, 3000)

    } catch (error) {
      console.error("Error selecting crop:", error)
      toast({
        title: "Selection Failed",
        description: "Failed to select crop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSelectingCrop(false)
    }
  }

  // Create prediction functionality
  const handleCreateInputChange = (field, value) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLocationChange = (location, coordinates) => {
    setCreateFormData((prev) => ({
      ...prev,
      location,
      locationCoordinates: coordinates || null,
    }))
  }

  const getCropScientificName = (cropName) => {
    const cropMapping = {
      rice: "Oryza sativa",
      maize: "Zea mays",
      wheat: "Triticum aestivum",
      potato: "Solanum tuberosum",
      tomato: "Solanum lycopersicum",
      chickpea: "Cicer arietinum",
      kidneybeans: "Phaseolus vulgaris",
      pigeonpeas: "Cajanus cajan",
      mothbeans: "Vigna aconitifolia",
      mungbean: "Vigna radiata",
      blackgram: "Vigna mungo",
      lentil: "Lens culinaris",
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
      cotton: "Gossypium hirsutum",
      jute: "Corchorus olitorius",
      coffee: "Coffea arabica",
    }
    return cropMapping[cropName.toLowerCase()] || cropName
  }

  const handleCreatePrediction = async () => {
    setIsCreating(true)

    const requiredNumericFields = [
      "nitrogenRequired",
      "phosphorousRequired",
      "potassiumRequired",
      "temperature",
      "humidity",
      "soilpH",
      "rainfall",
    ]

    const requiredTextFields = [
      "userId",
      "location",
      "soilType",
      "climate",
      "previousCrop",
      "budget",
      "experience",
      "farmSize",
    ]

    // Validate numeric fields
    for (const field of requiredNumericFields) {
      if (!createFormData[field] || isNaN(Number(createFormData[field]))) {
        toast({
          title: "Validation Error",
          description: `Please enter a valid number for "${field}"`,
          variant: "destructive",
        })
        setIsCreating(false)
        return
      }
    }

    // Validate text fields
    for (const field of requiredTextFields) {
      if (!createFormData[field] || createFormData[field].trim() === "") {
        toast({
          title: "Validation Error",
          description: `Please select or enter a value for "${field}"`,
          variant: "destructive",
        })
        setIsCreating(false)
        return
      }
    }

    // Prepare payload for AI model
    const aiPayload = {
      N: Number(createFormData.nitrogenRequired),
      P: Number(createFormData.phosphorousRequired),
      K: Number(createFormData.potassiumRequired),
      temperature: Number(createFormData.temperature),
      humidity: Number(createFormData.humidity),
      ph: Number(createFormData.soilpH),
      rainfall: Number(createFormData.rainfall),
    }

    try {
      // Get AI predictions
      const aiResponse = await axios.post("http://localhost:8000/api/crops/predict", aiPayload, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      })

      const aiData = aiResponse.data
      console.log("🌱 AI Response:", aiData)

      // Convert AI response to recommended crops format
      let recommendedCrops = []
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
              risk: riskLabel.replace(" Risk", ""),
            }
          })
          .slice(0, 3)
      } else {
        recommendedCrops = [
          {
            cropName: "Unknown",
            scientificName: "Unknown",
            suitability: 90,
            risk: "Low",
          },
        ]
      }

      // Prepare data for backend API
      const predictionData = {
        userId: createFormData.userId,
        inputData: {
          location: createFormData.location,
          locationCoordinates: createFormData.locationCoordinates,
          soilType: createFormData.soilType,
          nitrogenRequired: createFormData.nitrogenRequired,
          phosphorousRequired: createFormData.phosphorousRequired,
          potassiumRequired: createFormData.potassiumRequired,
          soilpH: createFormData.soilpH,
          temperature: createFormData.temperature,
          humidity: createFormData.humidity,
          rainfall: createFormData.rainfall,
          farmSize: createFormData.farmSize,
          climate: createFormData.climate,
          previousCrop: createFormData.previousCrop,
          budget: createFormData.budget,
          experience: createFormData.experience,
          notes: createFormData.notes,
        },
        recommendedCrops: recommendedCrops.map((crop) => ({
          cropName: crop.cropName,
          scientificName: crop.scientificName,
          suitability: crop.suitability,
          risk: crop.risk,
        })),
      }

      // Save to backend
      const saveResponse = await axios.post("http://localhost:8000/api/predictions", predictionData, {
        headers: { "Content-Type": "application/json" },
      })

      console.log("Saved Prediction:", saveResponse.data)

      // Update local state
      setPredictions((prev) => [saveResponse.data.prediction, ...prev])

      // Reset form and close dialog
      setCreateFormData({
        userId: "",
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
      setIsCreateDialogOpen(false)

      toast({
        title: "Prediction Created Successfully",
        description: "New prediction has been created and saved",
      })
    } catch (err) {
      console.error("❌ Prediction creation failed:", err)
      toast({
        title: "Creation Failed",
        description: err.response?.data?.message || "Failed to create prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Navigate to Analytics
  const handleNavigateToAnalytics = () => {
    // You can navigate to analytics in multiple ways:

    // Option 2: If using separate route
    router.push("/admin/predictions/analytics")

    // Option 3: If using state management
    // setActiveView('analytics')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (


    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Predictions (AI Predictions)</h2>
          <p className="text-slate-600 dark:text-slate-400">Access and analyze all AI-generated crop recommendations. Review prediction history and suitability scores</p>
        </div>

      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="w-4 h-4" />
                Filter: {filterStatus === "all" ? "All" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Predictions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pending Selection</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("processing")}>Processing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleNavigateToAnalytics}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Prediction
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Predictions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Predictions ({filteredPredictions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Soil Type</TableHead>
                <TableHead>Recommendations</TableHead>
                <TableHead>Selected Crop</TableHead>
                <TableHead>Top Suitability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPredictions.map((prediction) => {
                const user = getUserById(prediction.userId)
                const selectedCrop = getSelectedCropByPredictionId(prediction._id)
                const bestSuitability =
                  prediction.recommendedCrops?.reduce(
                    (max, crop) => (crop.suitability > max ? crop.suitability : max),
                    0,
                  ) || 0

                return (
                  <TableRow key={prediction._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {prediction.inputData?.location || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{prediction.inputData?.soilType || "N/A"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {prediction.recommendedCrops?.map((crop, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <span className="font-medium text-gray-900">
                              {index + 1}. {crop.cropName}
                            </span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {crop.suitability}%
                            </Badge>
                          </div>
                        )) || <span className="text-gray-500">No recommendations</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {selectedCrop ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium text-green-700">{selectedCrop.cropName}</div>
                            <div className="text-xs text-slate-500 italic">{selectedCrop.scientificName}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Not selected</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-emerald-600 font-medium">{bestSuitability}%</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(prediction)}</TableCell>
                    <TableCell>{formatDate(prediction.predictedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewPrediction(prediction)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditPrediction(prediction)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Prediction
                          </DropdownMenuItem>
                          {!getSelectedCropByPredictionId(prediction._id) &&
                            prediction.recommendedCrops &&
                            prediction.recommendedCrops.length > 0 && (
                              <DropdownMenuItem
                                onClick={() => handleSelectCrop(prediction)}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Select Crop
                              </DropdownMenuItem>
                            )}
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download Report
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePrediction(prediction._id)}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Prediction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Prediction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{predictions.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Predictions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {
                predictions.filter((p) => {
                  const hasRecommendations = p.recommendedCrops && p.recommendedCrops.length > 0
                  const hasSelection = getSelectedCropByPredictionId(p._id)
                  return hasRecommendations && hasSelection
                }).length
              }
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {
                predictions.filter((p) => {
                  const hasRecommendations = p.recommendedCrops && p.recommendedCrops.length > 0
                  const hasSelection = getSelectedCropByPredictionId(p._id)
                  return hasRecommendations && !hasSelection
                }).length
              }
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Pending Selection</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {predictions.length > 0
                ? Math.round(
                  predictions
                    .filter((p) => p.recommendedCrops?.length > 0)
                    .reduce((acc, p) => {
                      const maxSuitability = p.recommendedCrops.reduce(
                        (max, crop) => (crop.suitability > max ? crop.suitability : max),
                        0,
                      )
                      return acc + maxSuitability
                    }, 0) / predictions.filter((p) => p.recommendedCrops?.length > 0).length || 0,
                )
                : 0}
              %
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Best Suitability</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Prediction Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Prediction</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* User Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="userId">User *</Label>
                  <Select onValueChange={(value) => handleCreateInputChange("userId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user for this prediction" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Farm Information */}
            <Card>
              <CardHeader>
                <CardTitle>Farm Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Farm Location *</Label>
                    <Input
                      placeholder="e.g., Kathmandu Valley"
                      value={createFormData.location}
                      onChange={(e) => handleLocationChange(e.target.value, null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (katthas) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={createFormData.farmSize}
                      onChange={(e) => handleCreateInputChange("farmSize", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type *</Label>
                    <Select onValueChange={(value) => handleCreateInputChange("soilType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="climate">Climate Zone *</Label>
                    <Select onValueChange={(value) => handleCreateInputChange("climate", value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="previousCrop">Previous Crop *</Label>
                    <Select onValueChange={(value) => handleCreateInputChange("previousCrop", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="What was grown last?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="soybeans">Soybeans</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                        <SelectItem value="none">First time farming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range *</Label>
                    <Select onValueChange={(value) => handleCreateInputChange("budget", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Under NPR 1,000,000</SelectItem>
                        <SelectItem value="medium">NPR 1,000,000 - NPR 5,000,000</SelectItem>
                        <SelectItem value="high">NPR 5,000,000 - NPR 10,000,000</SelectItem>
                        <SelectItem value="enterprise">Over NPR 10,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Farming Experience *</Label>
                  <Select onValueChange={(value) => handleCreateInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">0-2 years</SelectItem>
                      <SelectItem value="intermediate">3-10 years</SelectItem>
                      <SelectItem value="expert">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Soil & Environmental Data */}
            <Card>
              <CardHeader>
                <CardTitle>Soil & Environmental Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogenRequired">Nitrogen Content (N) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={createFormData.nitrogenRequired}
                      onChange={(e) => handleCreateInputChange("nitrogenRequired", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorousRequired">Phosphorous Content (P) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={createFormData.phosphorousRequired}
                      onChange={(e) => handleCreateInputChange("phosphorousRequired", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassiumRequired">Potassium Content (K) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={createFormData.potassiumRequired}
                      onChange={(e) => handleCreateInputChange("potassiumRequired", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilpH">Soil pH *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 6.5"
                      value={createFormData.soilpH}
                      onChange={(e) => handleCreateInputChange("soilpH", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 25"
                      value={createFormData.temperature}
                      onChange={(e) => handleCreateInputChange("temperature", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 70"
                      value={createFormData.humidity}
                      onChange={(e) => handleCreateInputChange("humidity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall">Rainfall (mm) *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 200"
                      value={createFormData.rainfall}
                      onChange={(e) => handleCreateInputChange("rainfall", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                placeholder="Any specific requirements, concerns, or goals..."
                value={createFormData.notes}
                onChange={(e) => handleCreateInputChange("notes", e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePrediction}
                disabled={isCreating || !createFormData.userId || !createFormData.location}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isCreating ? "Creating Prediction..." : "Create Prediction"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crop Selection Modal */}
      <Dialog open={isSelectCropModalOpen} onOpenChange={setIsSelectCropModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-emerald-600" />
              Complete Prediction - Select Final Crop
            </DialogTitle>
          </DialogHeader>

          {selectedPredictionForCrop && (
            <div className="space-y-6">
              {/* Prediction Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Prediction Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm text-slate-600">Farmer</Label>
                      <p className="font-medium">
                        {getUserById(selectedPredictionForCrop.userId).firstName}{" "}
                        {getUserById(selectedPredictionForCrop.userId).lastName}
                      </p>
                      <p className="text-sm text-slate-500">{getUserById(selectedPredictionForCrop.userId).email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Location</Label>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedPredictionForCrop.inputData?.location}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Soil Type</Label>
                      <p className="font-medium capitalize">{selectedPredictionForCrop.inputData?.soilType}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Farm Size</Label>
                      <p className="font-medium">{selectedPredictionForCrop.inputData?.farmSize} katthas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crop Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    Select the Final Recommended Crop ({selectedPredictionForCrop.recommendedCrops?.length || 0}{" "}
                    options)
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    Choose the best crop recommendation to complete this prediction
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {selectedPredictionForCrop.recommendedCrops
                      ?.sort((a, b) => b.suitability - a.suitability)
                      .map((crop, index) => (
                        <div
                          key={crop._id}
                          className={`border-2 rounded-lg p-6 transition-all cursor-pointer hover:shadow-lg ${selectedCropForSelection?._id === crop._id
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-emerald-300"
                            }`}
                          onClick={() => setSelectedCropForSelection(crop)}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold capitalize text-slate-900">{crop.cropName}</h3>
                                {index === 0 && (
                                  <Badge className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Best Match
                                  </Badge>
                                )}
                                <Badge className={`${getRiskColor(crop.risk)}`}>{crop.risk} Risk</Badge>
                              </div>
                              <p className="text-slate-600 italic mb-3">{crop.scientificName}</p>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm text-slate-600">Rank #{index + 1}</span>
                                </div>
                                {crop.risk === "High" && (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm">Higher risk crop</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className={`text-4xl font-bold ${getSuitabilityColor(crop.suitability)}`}>
                                {crop.suitability}%
                              </div>
                              <div className="text-sm text-slate-500">Suitability Score</div>
                              <div className="mt-2">
                                {crop.suitability >= 80 && (
                                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                                )}
                                {crop.suitability >= 60 && crop.suitability < 80 && (
                                  <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                                )}
                                {crop.suitability < 60 && <Badge className="bg-red-100 text-red-800">Fair</Badge>}
                              </div>
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          {selectedCropForSelection?._id === crop._id && (
                            <div className="flex items-center justify-center mt-4 p-3 bg-emerald-100 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                              <span className="text-emerald-800 font-medium">Selected for final recommendation</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selection Notes */}
              {selectedCropForSelection && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selection Notes (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add any notes about why this crop was selected or additional recommendations for the farmer..."
                      value={selectionNotes}
                      onChange={(e) => setSelectionNotes(e.target.value)}
                      rows={3}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsSelectCropModalOpen(false)
                    setSelectedPredictionForCrop(null)
                    setSelectedCropForSelection(null)
                    setSelectionNotes("")
                  }}
                  disabled={isSelectingCrop}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCropSelection(selectedCropForSelection)}
                  disabled={!selectedCropForSelection || isSelectingCrop}
                  className="bg-emerald-600 hover:bg-emerald-700 min-w-[140px]"
                >
                  {isSelectingCrop ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Prediction
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Prediction Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prediction Details</DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="font-medium">
                        {getUserById(selectedPrediction.userId).firstName}{" "}
                        {getUserById(selectedPrediction.userId).lastName}
                      </p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{getUserById(selectedPrediction.userId).email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Crop Info */}
              {getSelectedCropByPredictionId(selectedPrediction._id) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Selected Crop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Crop Name</Label>
                        <p className="font-medium capitalize">
                          {getSelectedCropByPredictionId(selectedPrediction._id).cropName}
                        </p>
                      </div>
                      <div>
                        <Label>Scientific Name</Label>
                        <p className="italic">{getSelectedCropByPredictionId(selectedPrediction._id).scientificName}</p>
                      </div>
                      <div>
                        <Label>Selected At</Label>
                        <p>{formatDate(getSelectedCropByPredictionId(selectedPrediction._id).selectedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Input Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Farm Input Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Location</Label>
                      <p className="font-medium">{selectedPrediction.inputData?.location}</p>
                    </div>
                    <div>
                      <Label>Soil Type</Label>
                      <p className="capitalize">{selectedPrediction.inputData?.soilType}</p>
                    </div>
                    <div>
                      <Label>Farm Size</Label>
                      <p>{selectedPrediction.inputData?.farmSize} katthas</p>
                    </div>
                    <div>
                      <Label>Climate</Label>
                      <p className="capitalize">{selectedPrediction.inputData?.climate}</p>
                    </div>
                    <div>
                      <Label>Previous Crop</Label>
                      <p className="capitalize">{selectedPrediction.inputData?.previousCrop}</p>
                    </div>
                    <div>
                      <Label>Budget</Label>
                      <p className="capitalize">{selectedPrediction.inputData?.budget}</p>
                    </div>
                    <div>
                      <Label>Experience Level</Label>
                      <p className="capitalize">{selectedPrediction.inputData?.experience}</p>
                    </div>
                  </div>
                  {selectedPrediction.inputData?.notes && (
                    <div className="mt-4">
                      <Label>Notes</Label>
                      <p className="text-sm text-slate-600">{selectedPrediction.inputData.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Environmental Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      Soil Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>pH Level:</span>
                        <span className="font-medium">{selectedPrediction.inputData?.soilpH || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nitrogen Required:</span>
                        <span className="font-medium">
                          {selectedPrediction.inputData?.nitrogenRequired || "N/A"} kg/ha
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phosphorous Required:</span>
                        <span className="font-medium">
                          {selectedPrediction.inputData?.phosphorousRequired || "N/A"} kg/ha
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Potassium Required:</span>
                        <span className="font-medium">
                          {selectedPrediction.inputData?.potassiumRequired || "N/A"} kg/ha
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5" />
                      Climate Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span className="font-medium">{selectedPrediction.inputData?.temperature || "N/A"}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Humidity:</span>
                        <span className="font-medium">{selectedPrediction.inputData?.humidity || "N/A"}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rainfall:</span>
                        <span className="font-medium">{selectedPrediction.inputData?.rainfall || "N/A"}mm</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* All Recommended Crops */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    All Recommended Crops ({selectedPrediction.recommendedCrops?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPrediction.recommendedCrops && selectedPrediction.recommendedCrops.length > 0 ? (
                    <div className="grid gap-4">
                      {selectedPrediction.recommendedCrops
                        .sort((a, b) => b.suitability - a.suitability)
                        .map((crop, index) => {
                          const isSelected =
                            getSelectedCropByPredictionId(selectedPrediction._id)?.cropName === crop.cropName
                          return (
                            <div
                              key={crop._id}
                              className={`border rounded-lg p-4 ${isSelected ? "border-green-500 bg-green-50" : ""}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold text-lg capitalize flex items-center gap-2">
                                    {crop.cropName}
                                    {isSelected && <CheckCircle className="w-5 h-5 text-green-600" />}
                                  </h4>
                                  <p className="text-sm text-slate-600 italic">{crop.scientificName}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-emerald-600">{crop.suitability}%</div>
                                  <div className="text-sm text-slate-500">Suitability</div>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                  <Badge
                                    className={`${index === 0 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}
                                  >
                                    Rank #{index + 1}
                                  </Badge>
                                  {isSelected && <Badge className="bg-green-100 text-green-800">Selected</Badge>}
                                </div>
                                {getRiskBadge(crop.risk)}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-8">No crop recommendations available</p>
                  )}
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Predicted At</Label>
                      <p>{formatDate(selectedPrediction.predictedAt)}</p>
                    </div>
                    {getSelectedCropByPredictionId(selectedPrediction._id) && (
                      <div>
                        <Label>Crop Selected At</Label>
                        <p>{formatDate(getSelectedCropByPredictionId(selectedPrediction._id).selectedAt)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Prediction Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Prediction</DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <EditPredictionForm
              prediction={selectedPrediction}
              onSave={handleUpdatePrediction}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Enhanced Edit Prediction Form Component
function EditPredictionForm({ prediction, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    // Input Data
    location: prediction.inputData?.location || "",
    soilType: prediction.inputData?.soilType || "",
    nitrogenRequired: prediction.inputData?.nitrogenRequired || "",
    phosphorousRequired: prediction.inputData?.phosphorousRequired || "",
    potassiumRequired: prediction.inputData?.potassiumRequired || "",
    soilpH: prediction.inputData?.soilpH || "",
    temperature: prediction.inputData?.temperature || "",
    humidity: prediction.inputData?.humidity || "",
    rainfall: prediction.inputData?.rainfall || "",
    farmSize: prediction.inputData?.farmSize || "",
    climate: prediction.inputData?.climate || "",
    previousCrop: prediction.inputData?.previousCrop || "",
    budget: prediction.inputData?.budget || "",
    experience: prediction.inputData?.experience || "",
    notes: prediction.inputData?.notes || "",

    // All 3 Recommended Crops
    crops: prediction.recommendedCrops?.map((crop) => ({
      cropName: crop.cropName || "",
      scientificName: crop.scientificName || "",
      suitability: crop.suitability || 0,
      risk: crop.risk || "Low",
      _id: crop._id,
    })) || [
        { cropName: "", scientificName: "", suitability: 0, risk: "Low", _id: "" },
        { cropName: "", scientificName: "", suitability: 0, risk: "Low", _id: "" },
        { cropName: "", scientificName: "", suitability: 0, risk: "Low", _id: "" },
      ],
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    // Required field validations
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.soilType.trim()) newErrors.soilType = "Soil type is required"
    if (!formData.temperature.trim()) newErrors.temperature = "Temperature is required"
    if (!formData.humidity.trim()) newErrors.humidity = "Humidity is required"
    if (!formData.rainfall.trim()) newErrors.rainfall = "Rainfall is required"
    if (!formData.farmSize.trim()) newErrors.farmSize = "Farm size is required"

    // Validate crops
    formData.crops.forEach((crop, index) => {
      if (crop.cropName && (crop.suitability < 0 || crop.suitability > 100)) {
        newErrors[`crop${index}Suitability`] = "Suitability must be between 0 and 100"
      }
    })

    // Numeric validations
    if (formData.soilpH && (Number.parseFloat(formData.soilpH) < 0 || Number.parseFloat(formData.soilpH) > 14)) {
      newErrors.soilpH = "pH must be between 0 and 14"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const updatedData = {
      inputData: {
        location: formData.location,
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
        experience: formData.experience,
        notes: formData.notes,
      },
      recommendedCrops: formData.crops
        .filter((crop) => crop.cropName.trim())
        .map((crop) => ({
          cropName: crop.cropName,
          scientificName: crop.scientificName,
          suitability: Number.parseInt(crop.suitability),
          risk: crop.risk,
          _id: crop._id || new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
        })),
    }

    onSave(updatedData)
  }

  const updateCrop = (index, field, value) => {
    const newCrops = [...formData.crops]
    newCrops[index] = { ...newCrops[index], [field]: value }
    setFormData({ ...formData, crops: newCrops })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Farm Information */}
      <Card>
        <CardHeader>
          <CardTitle>Farm Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
            <div>
              <Label htmlFor="soilType">Soil Type *</Label>
              <select
                id="soilType"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className={`w-full p-2 border rounded-md ${errors.soilType ? "border-red-500" : ""}`}
              >
                <option value="">Select soil type</option>
                <option value="sandy">Sandy</option>
                <option value="clay">Clay</option>
                <option value="loamy">Loamy</option>
                <option value="silt">Silt</option>
              </select>
              {errors.soilType && <p className="text-red-500 text-sm mt-1">{errors.soilType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="farmSize">Farm Size (katthas) *</Label>
              <Input
                id="farmSize"
                type="number"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                className={errors.farmSize ? "border-red-500" : ""}
              />
              {errors.farmSize && <p className="text-red-500 text-sm mt-1">{errors.farmSize}</p>}
            </div>
            <div>
              <Label htmlFor="climate">Climate</Label>
              <select
                id="climate"
                value={formData.climate}
                onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select climate</option>
                <option value="tropical">Tropical</option>
                <option value="subtropical">Subtropical</option>
                <option value="temperate">Temperate</option>
                <option value="arid">Arid</option>
              </select>
            </div>
            <div>
              <Label htmlFor="budget">Budget</Label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select budget</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="previousCrop">Previous Crop</Label>
              <Input
                id="previousCrop"
                value={formData.previousCrop}
                onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <select
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soil Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="soilpH">pH Level</Label>
              <Input
                id="soilpH"
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={formData.soilpH}
                onChange={(e) => setFormData({ ...formData, soilpH: e.target.value })}
                className={errors.soilpH ? "border-red-500" : ""}
              />
              {errors.soilpH && <p className="text-red-500 text-sm mt-1">{errors.soilpH}</p>}
            </div>
            <div>
              <Label htmlFor="nitrogenRequired">Nitrogen (kg/ha)</Label>
              <Input
                id="nitrogenRequired"
                type="number"
                value={formData.nitrogenRequired}
                onChange={(e) => setFormData({ ...formData, nitrogenRequired: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phosphorousRequired">Phosphorous (kg/ha)</Label>
              <Input
                id="phosphorousRequired"
                type="number"
                value={formData.phosphorousRequired}
                onChange={(e) => setFormData({ ...formData, phosphorousRequired: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="potassiumRequired">Potassium (kg/ha)</Label>
              <Input
                id="potassiumRequired"
                type="number"
                value={formData.potassiumRequired}
                onChange={(e) => setFormData({ ...formData, potassiumRequired: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Climate Data */}
      <Card>
        <CardHeader>
          <CardTitle>Climate Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="temperature">Temperature (°C) *</Label>
              <Input
                id="temperature"
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className={errors.temperature ? "border-red-500" : ""}
              />
              {errors.temperature && <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>}
            </div>
            <div>
              <Label htmlFor="humidity">Humidity (%) *</Label>
              <Input
                id="humidity"
                type="number"
                min="0"
                max="100"
                value={formData.humidity}
                onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                className={errors.humidity ? "border-red-500" : ""}
              />
              {errors.humidity && <p className="text-red-500 text-sm mt-1">{errors.humidity}</p>}
            </div>
            <div>
              <Label htmlFor="rainfall">Rainfall (mm) *</Label>
              <Input
                id="rainfall"
                type="number"
                value={formData.rainfall}
                onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                className={errors.rainfall ? "border-red-500" : ""}
              />
              {errors.rainfall && <p className="text-red-500 text-sm mt-1">{errors.rainfall}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All 3 Crop Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Crop Recommendations (Up to 3)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.crops.map((crop, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-lg">Crop #{index + 1}</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`cropName${index}`}>Crop Name</Label>
                  <Input
                    id={`cropName${index}`}
                    value={crop.cropName}
                    onChange={(e) => updateCrop(index, "cropName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`scientificName${index}`}>Scientific Name</Label>
                  <Input
                    id={`scientificName${index}`}
                    value={crop.scientificName}
                    onChange={(e) => updateCrop(index, "scientificName", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`suitability${index}`}>Suitability (%)</Label>
                  <Input
                    id={`suitability${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={crop.suitability}
                    onChange={(e) => updateCrop(index, "suitability", e.target.value)}
                    className={errors[`crop${index}Suitability`] ? "border-red-500" : ""}
                  />
                  {errors[`crop${index}Suitability`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`crop${index}Suitability`]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`risk${index}`}>Risk Level</Label>
                  <select
                    id={`risk${index}`}
                    value={crop.risk}
                    onChange={(e) => updateCrop(index, "risk", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Any additional notes or observations..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Save Changes
        </Button>
      </div>
    </form>
  )
}
