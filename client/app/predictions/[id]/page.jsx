"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Thermometer,
    Droplets,
    Leaf,
    TrendingUp,
    DollarSign,
    BarChart3,
    Download,
    Share2,
    Edit,
    CheckCircle,
    Clock,
    AlertTriangle,
    Eye,
    User,
    Save,
    X,
    Loader2,
    Zap,
    ArrowRight,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FarmLocationPicker from "@/components/FarmLocationPicker"
import { useAuth } from "@/components/AuthProvider"

export default function PredictionDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedCrop, setSelectedCrop] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editFormData, setEditFormData] = useState({})
    const [isSaving, setIsSaving] = useState(false)
    const [isRepredicting, setIsRepredicting] = useState(false)
    const [errors, setErrors] = useState({})
    const [saveMessage, setSaveMessage] = useState("")
    const [newPredictions, setNewPredictions] = useState(null)
    const [showNewPredictions, setShowNewPredictions] = useState(false)
    const [hasParameterChanges, setHasParameterChanges] = useState(false)

    // Parameters that trigger re-prediction
    const predictionParameters = [
        "nitrogenRequired",
        "phosphorousRequired",
        "potassiumRequired",
        "temperature",
        "humidity",
        "soilpH",
        "rainfall",
    ]

    useEffect(() => {
        if (params.id) {
            fetchPredictionDetails()
        }
    }, [params.id])

    // Check if prediction parameters have changed
    useEffect(() => {
        if (prediction && editFormData) {
            const hasChanges = predictionParameters.some((param) => editFormData[param] !== prediction.inputData[param])
            setHasParameterChanges(hasChanges)
        }
    }, [editFormData, prediction])

    const fetchPredictionDetails = async () => {
        try {
            setLoading(true)
            // Fetch prediction details from your backend
            const response = await axios.get(`http://localhost:8000/api/predictions/${params.id}`, {
                headers: { "Content-Type": "application/json" },
            })

            const selectedCropRes = await axios.get("http://localhost:8000/api/selected-crops/")
            const cropMap = {}
            selectedCropRes.data.forEach((item) => {
                cropMap[item.predictionId.toString()] = item
            })

            const matchedSelectedCrop = cropMap[response.data._id]
            setSelectedCrop(matchedSelectedCrop)
            setPrediction(response.data)

            const recommended = response.data.recommendedCrops || []
            let computedStatus = "Pending"
            if (recommended.length === 3 && matchedSelectedCrop) {
                computedStatus = "Completed"
            } else if (recommended.length === 3) {
                computedStatus = "In Progress"
            }

            const predictionData = {
                ...response.data,
                status: computedStatus,
            }
            setPrediction(predictionData)
            setEditFormData(predictionData.inputData)
        } catch (error) {
            console.error("Error fetching prediction details:", error)
            // Mock data for development
            const mockPrediction = {
                _id: params.id,
                userId: user?.id,
                inputData: {
                    location: "Chitwan",
                    locationCoordinates: null,
                    soilType: "clay",
                    nitrogenRequired: "90",
                    phosphorousRequired: "55",
                    potassiumRequired: "45",
                    soilpH: "6.8",
                    temperature: "27",
                    humidity: "68",
                    rainfall: "110",
                    farmSize: "60",
                    climate: "subtropical",
                    previousCrop: "rice",
                    budget: "medium",
                    experience: "intermediate",
                    notes: "Looking for high-yield vegetables suitable for subtropical climate",
                },
                recommendedCrops: [
                    { cropName: "Tomato", scientificName: "Solanum lycopersicum" },
                    { cropName: "Chili", scientificName: "Capsicum annuum" },
                    { cropName: "Okra", scientificName: "Abelmoschus esculentus" },
                ],
                selectedCrop: "Tomato",
                status: "completed",
                confidence: 92,
                insights: {
                    bestPlantingTime: "March to May",
                    weatherRisk: "Low - Favorable conditions expected",
                    marketOutlook: "Strong demand for tomatoes in local markets",
                    soilRecommendation: "Consider adding organic compost to improve clay soil drainage",
                    expectedYield: "15-20 tons per hectare",
                    profitEstimate: "NPR 200,000 - 300,000 per season",
                },
                createdAt: "2024-06-15T10:30:00Z",
                updatedAt: "2024-06-15T11:00:00Z",
            }
            setPrediction(mockPrediction)
            setEditFormData(mockPrediction.inputData)
        } finally {
            setLoading(false)
        }
    }

    const handleEditInputChange = (field, value) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    const handleLocationChange = (location, coordinates) => {
        setEditFormData((prev) => ({
            ...prev,
            location,
            locationCoordinates: coordinates || null,
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        // Required numeric fields
        const requiredNumericFields = [
            "nitrogenRequired",
            "phosphorousRequired",
            "potassiumRequired",
            "temperature",
            "humidity",
            "soilpH",
            "rainfall",
            "farmSize",
        ]

        // Required text fields
        const requiredTextFields = ["location", "soilType", "climate", "previousCrop", "budget", "experience"]

        // Validate numeric fields
        requiredNumericFields.forEach((field) => {
            if (!editFormData[field] || isNaN(Number(editFormData[field]))) {
                newErrors[field] = `Please enter a valid number for ${field}`
            }
        })

        // Validate text fields
        requiredTextFields.forEach((field) => {
            if (!editFormData[field] || editFormData[field].trim() === "") {
                newErrors[field] = `Please select or enter a value for ${field}`
            }
        })

        // Specific validations
        if (editFormData.soilpH && (Number(editFormData.soilpH) < 0 || Number(editFormData.soilpH) > 14)) {
            newErrors.soilpH = "pH must be between 0 and 14"
        }

        if (editFormData.humidity && (Number(editFormData.humidity) < 0 || Number(editFormData.humidity) > 100)) {
            newErrors.humidity = "Humidity must be between 0 and 100%"
        }

        if (editFormData.temperature && (Number(editFormData.temperature) < -50 || Number(editFormData.temperature) > 60)) {
            newErrors.temperature = "Temperature must be between -50°C and 60°C"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
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

    const handleRepredict = async () => {
        if (!validateForm()) {
            setSaveMessage("Please fix the errors below")
            return
        }

        setIsRepredicting(true)
        setSaveMessage("")

        try {
            // Prepare payload for AI model (same logic as predict.jsx)
            const aiPayload = {
                N: Number(editFormData.nitrogenRequired),
                P: Number(editFormData.phosphorousRequired),
                K: Number(editFormData.potassiumRequired),
                temperature: Number(editFormData.temperature),
                humidity: Number(editFormData.humidity),
                ph: Number(editFormData.soilpH),
                rainfall: Number(editFormData.rainfall),
            }

            console.log("🔄 Re-predicting with new parameters:", aiPayload)

            // Get AI predictions using axios
            const aiResponse = await axios.post("http://localhost:8000/api/crops/predict", aiPayload, {
                headers: { "Content-Type": "application/json" },
                timeout: 30000,
            })

            const aiData = aiResponse.data
            console.log("🌱 New AI Response:", aiData)

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

            // Set new predictions for display
            setNewPredictions({
                recommendedCrops,
                insights: {
                    bestPlantingTime: "As per forecasted window",
                    weatherRisk: "Low",
                    marketOutlook: "Positive",
                    soilRecommendation: "Monitor pH and nutrient levels",
                },
            })

            setShowNewPredictions(true)
            setSaveMessage("New crop predictions generated! Review and save to apply changes.")
        } catch (err) {
            console.error("❌ Re-prediction failed:", err)
            if (err.response) {
                setSaveMessage(`Re-prediction failed: ${err.response.data?.message || err.response.statusText}`)
            } else if (err.request) {
                setSaveMessage("No response from server. Please check if the AI service is running.")
            } else {
                setSaveMessage(`Re-prediction failed: ${err.message}`)
            }
        } finally {
            setIsRepredicting(false)
        }
    }

    const handleSave = async () => {
        if (!validateForm()) {
            setSaveMessage("Please fix the errors below")
            return
        }

        setIsSaving(true)
        setSaveMessage("")

        try {
            // Prepare update data
            const updateData = {
                inputData: editFormData,
            }

            // If we have new predictions, include them
            if (newPredictions) {
                updateData.recommendedCrops = newPredictions.recommendedCrops.map((crop) => ({
                    cropName: crop.cropName,
                    scientificName: crop.scientificName,
                    suitability: crop.suitability,
                    risk: crop.risk,
                }))
            }

            // Update prediction via API
            await axios.put(`http://localhost:8000/api/predictions/${params.id}`, updateData, {
                headers: { "Content-Type": "application/json" },
            })

            // If we have new predictions, save them to the prediction
            if (newPredictions) {
                // Save new prediction data to backend
                const saveResponse = await axios.put(
                    `http://localhost:8000/api/predictions/${params.id}`,
                    {
                        inputData: editFormData,
                        recommendedCrops: newPredictions.recommendedCrops.map((crop) => ({
                            cropName: crop.cropName,
                            scientificName: crop.scientificName,
                            suitability: crop.suitability,
                            risk: crop.risk,
                        })),
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    },
                )

                console.log("Updated Prediction with new crops:", saveResponse.data)

                // Clear any existing selected crop since we have new recommendations
                setSelectedCrop(null)

                // Update local state with new predictions
                setPrediction((prev) => ({
                    ...prev,
                    inputData: editFormData,
                    recommendedCrops: newPredictions.recommendedCrops,
                    insights: newPredictions.insights,
                    updatedAt: new Date().toISOString(),
                    status: "In Progress", // Reset status since new crops need to be selected
                }))
            } else {
                // Update local state with just the input data
                setPrediction((prev) => ({
                    ...prev,
                    inputData: editFormData,
                    updatedAt: new Date().toISOString(),
                }))
            }

            setIsEditing(false)
            setShowNewPredictions(false)
            setNewPredictions(null)
            setHasParameterChanges(false)
            setSaveMessage("Prediction updated successfully!")

            // Clear success message after 3 seconds
            setTimeout(() => setSaveMessage(""), 3000)
        } catch (error) {
            console.error("Error updating prediction:", error)
            setSaveMessage("Failed to update prediction. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleNewCropSelect = async (crop) => {
        try {
            const kebabCaseScientificName = crop.scientificName.toLowerCase().replace(/\s+/g, "-")

            // Save the selected crop choice using your backend API
            const selectionData = {
                predictionId: params.id,
                cropName: crop.cropName,
                scientificName: crop.scientificName,
            }

            console.log("✅ Sending new crop selection:", selectionData)

            await axios.post("http://localhost:8000/api/predictions/select", selectionData, {
                headers: { "Content-Type": "application/json" },
            })

            // Update selected crop state
            setSelectedCrop(selectionData)

            // Update prediction status to completed
            setPrediction((prev) => ({
                ...prev,
                status: "Completed",
            }))

            // Redirect to crop details page
            router.push(`/crop-details/${kebabCaseScientificName}?predictionId=${params.id}`)
        } catch (error) {
            console.error("Error selecting new crop:", error)
            setSaveMessage("Failed to select crop. Please try again.")
        }
    }

    const handleCancel = () => {
        setEditFormData(prediction.inputData)
        setErrors({})
        setSaveMessage("")
        setIsEditing(false)
        setShowNewPredictions(false)
        setNewPredictions(null)
        setHasParameterChanges(false)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-emerald-500"
            case "In Progress":
                return "bg-yellow-500"
            case "Pending":
                return "bg-gray-500"
            default:
                return "bg-gray-500"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CheckCircle className="w-5 h-5" />
            case "In Progress":
                return <Clock className="w-5 h-5" />
            case "Pending":
                return <AlertTriangle className="w-5 h-5" />
            default:
                return <Clock className="w-5 h-5" />
        }
    }

    const handleCropSelect = (crop) => {
        const kebabCaseScientificName = crop.scientificName.toLowerCase().replace(/\s+/g, "-")
        router.push(`/crop-details/${kebabCaseScientificName}?predictionId=${params.id}`)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                router.push("/login")
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [user, router])

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                        <CardContent>
                            <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
                            <p className="text-gray-300 mb-6">
                                You need to be logged in to view your predictions. Redirecting in 5 seconds...
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <div className="text-white text-xl">Loading prediction details...</div>
                </div>
            </div>
        )
    }

    if (!prediction) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                        <CardContent>
                            <h2 className="text-2xl font-bold text-white mb-4">Prediction Not Found</h2>
                            <p className="text-gray-300 mb-6">The prediction you're looking for doesn't exist.</p>
                            <Button onClick={() => router.push("/predictions")} className="bg-emerald-500 hover:bg-emerald-600">
                                Back to Predictions
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />
            <main className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            className="text-emerald-400 hover:text-emerald-300 mb-4"
                            onClick={() => router.push("/predictions")}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Predictions
                        </Button>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Prediction #{prediction._id.slice(-6)}</h1>
                                <div className="flex items-center gap-4">
                                    <Badge className={`${getStatusColor(prediction.status)} text-white`}>
                                        <div className="flex items-center gap-1">
                                            {getStatusIcon(prediction.status)}
                                            {prediction.status?.replace("_", " ") || "Not set"}
                                        </div>
                                    </Badge>
                                    <span className="text-gray-400">Created {formatDate(prediction.createdAt)}</span>
                                    {prediction.updatedAt !== prediction.createdAt && (
                                        <span className="text-gray-400">• Updated {formatDate(prediction.updatedAt)}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 md:mt-0">
                                {!isEditing ? (
                                    <>
                                        <Button variant="outline" className="border-emerald-500 text-emerald-400 bg-transparent">
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Share
                                        </Button>
                                        <Button variant="outline" className="border-emerald-500 text-emerald-400 bg-transparent" onClick={() => window.print()}>
                                            <Download className="w-4 h-4 mr-2" />
                                            Export
                                        </Button>
                                        <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => setIsEditing(true)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {hasParameterChanges && !showNewPredictions && (
                                            <Button
                                                className="bg-blue-500 hover:bg-blue-600"
                                                onClick={handleRepredict}
                                                disabled={isRepredicting || isSaving}
                                            >
                                                {isRepredicting ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Zap className="w-4 h-4 mr-2" />
                                                )}
                                                {isRepredicting ? "Predicting..." : "Re-predict Crops"}
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            className="border-gray-500 text-gray-400 bg-transparent"
                                            onClick={handleCancel}
                                            disabled={isSaving || isRepredicting}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-emerald-500 hover:bg-emerald-600"
                                            onClick={handleSave}
                                            disabled={isSaving || isRepredicting}
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Save Message */}
                        {saveMessage && (
                            <Alert
                                className={`mt-4 ${saveMessage.includes("successfully") || saveMessage.includes("generated")
                                    ? "border-emerald-500 bg-emerald-900/20"
                                    : "border-red-500 bg-red-900/20"
                                    }`}
                            >
                                <AlertDescription
                                    className={
                                        saveMessage.includes("successfully") || saveMessage.includes("generated")
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                    }
                                >
                                    {saveMessage}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Parameter Change Warning */}
                        {isEditing && hasParameterChanges && !showNewPredictions && (
                            <Alert className="mt-4 border-yellow-500 bg-yellow-900/20">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <AlertDescription className="text-yellow-400">
                                    You've changed prediction parameters (NPK, temperature, humidity, rainfall, or pH). Click "Re-predict
                                    Crops" to get new crop recommendations based on these changes.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Farm Information */}
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        Farm Information
                                        {isEditing && (
                                            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                                                Editing
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <div className="space-y-6">
                                            {/* Edit Form */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Location */}
                                                <div className="space-y-2">
                                                    <Label className="text-white">Farm Location *</Label>
                                                    <FarmLocationPicker value={editFormData.location} onChange={handleLocationChange} />
                                                    {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
                                                </div>

                                                {/* Farm Size */}
                                                <div className="space-y-2">
                                                    <Label className="text-white">Farm Size (katthas) *</Label>
                                                    <Input
                                                        type="number"
                                                        className={`bg-slate-600 border-slate-500 text-white ${errors.farmSize ? "border-red-500" : ""}`}
                                                        value={editFormData.farmSize}
                                                        onChange={(e) => handleEditInputChange("farmSize", e.target.value)}
                                                        placeholder="e.g., 100"
                                                    />
                                                    {errors.farmSize && <p className="text-red-400 text-sm">{errors.farmSize}</p>}
                                                </div>

                                                {/* Soil Type */}
                                                <div className="space-y-2">
                                                    <Label className="text-white">Soil Type *</Label>
                                                    <Select
                                                        onValueChange={(value) => handleEditInputChange("soilType", value)}
                                                        value={editFormData.soilType}
                                                    >
                                                        <SelectTrigger
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.soilType ? "border-red-500" : ""}`}
                                                        >
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
                                                    {errors.soilType && <p className="text-red-400 text-sm">{errors.soilType}</p>}
                                                </div>

                                                {/* Temperature - Prediction Parameter */}
                                                <div className="space-y-2">
                                                    <Label className="text-white flex items-center gap-2">
                                                        Temperature (°C) *
                                                        <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                                                            Prediction Parameter
                                                        </Badge>
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        className={`bg-slate-600 border-slate-500 text-white ${errors.temperature ? "border-red-500" : ""}`}
                                                        value={editFormData.temperature}
                                                        onChange={(e) => handleEditInputChange("temperature", e.target.value)}
                                                        placeholder="e.g., 25"
                                                    />
                                                    {errors.temperature && <p className="text-red-400 text-sm">{errors.temperature}</p>}
                                                </div>

                                                {/* Humidity - Prediction Parameter */}
                                                <div className="space-y-2">
                                                    <Label className="text-white flex items-center gap-2">
                                                        Humidity (%) *
                                                        <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                                                            Prediction Parameter
                                                        </Badge>
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        className={`bg-slate-600 border-slate-500 text-white ${errors.humidity ? "border-red-500" : ""}`}
                                                        value={editFormData.humidity}
                                                        onChange={(e) => handleEditInputChange("humidity", e.target.value)}
                                                        placeholder="e.g., 65"
                                                    />
                                                    {errors.humidity && <p className="text-red-400 text-sm">{errors.humidity}</p>}
                                                </div>

                                                {/* Rainfall - Prediction Parameter */}
                                                <div className="space-y-2">
                                                    <Label className="text-white flex items-center gap-2">
                                                        Rainfall (mm) *
                                                        <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                                                            Prediction Parameter
                                                        </Badge>
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        className={`bg-slate-600 border-slate-500 text-white ${errors.rainfall ? "border-red-500" : ""}`}
                                                        value={editFormData.rainfall}
                                                        onChange={(e) => handleEditInputChange("rainfall", e.target.value)}
                                                        placeholder="e.g., 110"
                                                    />
                                                    {errors.rainfall && <p className="text-red-400 text-sm">{errors.rainfall}</p>}
                                                </div>

                                                {/* Climate Zone */}
                                                <div className="space-y-2">
                                                    <Label className="text-white">Climate Zone *</Label>
                                                    <Select
                                                        onValueChange={(value) => handleEditInputChange("climate", value)}
                                                        value={editFormData.climate}
                                                    >
                                                        <SelectTrigger
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.climate ? "border-red-500" : ""}`}
                                                        >
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
                                                    {errors.climate && <p className="text-red-400 text-sm">{errors.climate}</p>}
                                                </div>

                                                {/* Previous Crop */}
                                                <div className="space-y-2">
                                                    <Label className="text-white">Previous Crop *</Label>
                                                    <Select
                                                        onValueChange={(value) => handleEditInputChange("previousCrop", value)}
                                                        value={editFormData.previousCrop}
                                                    >
                                                        <SelectTrigger
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.previousCrop ? "border-red-500" : ""}`}
                                                        >
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
                                                    {errors.previousCrop && <p className="text-red-400 text-sm">{errors.previousCrop}</p>}
                                                </div>

                                                {/* Budget Range */}
                                                <div className="space-y-2">
                                                    <Label className="text-white">Budget Range *</Label>
                                                    <Select
                                                        onValueChange={(value) => handleEditInputChange("budget", value)}
                                                        value={editFormData.budget}
                                                    >
                                                        <SelectTrigger
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.budget ? "border-red-500" : ""}`}
                                                        >
                                                            <SelectValue placeholder="Select budget range" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="low">Under NPR 1,000,000</SelectItem>
                                                            <SelectItem value="medium">NPR 1,000,000 - NPR 5,000,000</SelectItem>
                                                            <SelectItem value="high">NPR 5,000,000 - NPR 10,000,000</SelectItem>
                                                            <SelectItem value="enterprise">Over NPR 10,000,000</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.budget && <p className="text-red-400 text-sm">{errors.budget}</p>}
                                                </div>

                                                {/* Experience */}
                                                <div className="space-y-2">
                                                    <Label className="text-white">Farming Experience *</Label>
                                                    <Select
                                                        onValueChange={(value) => handleEditInputChange("experience", value)}
                                                        value={editFormData.experience}
                                                    >
                                                        <SelectTrigger
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.experience ? "border-red-500" : ""}`}
                                                        >
                                                            <SelectValue placeholder="Select experience" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="beginner">0-2 years</SelectItem>
                                                            <SelectItem value="intermediate">3-10 years</SelectItem>
                                                            <SelectItem value="experienced">10+ years</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.experience && <p className="text-red-400 text-sm">{errors.experience}</p>}
                                                </div>
                                            </div>

                                            {/* Soil Nutrients - All Prediction Parameters */}
                                            <div className="pt-6 border-t border-slate-700">
                                                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                                    Soil Nutrients
                                                    <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                                                        Prediction Parameters
                                                    </Badge>
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-white">Nitrogen (N) *</Label>
                                                        <Input
                                                            type="number"
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.nitrogenRequired ? "border-red-500" : ""}`}
                                                            value={editFormData.nitrogenRequired}
                                                            onChange={(e) => handleEditInputChange("nitrogenRequired", e.target.value)}
                                                            placeholder="e.g., 90"
                                                        />
                                                        {errors.nitrogenRequired && (
                                                            <p className="text-red-400 text-sm">{errors.nitrogenRequired}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-white">Phosphorous (P) *</Label>
                                                        <Input
                                                            type="number"
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.phosphorousRequired ? "border-red-500" : ""}`}
                                                            value={editFormData.phosphorousRequired}
                                                            onChange={(e) => handleEditInputChange("phosphorousRequired", e.target.value)}
                                                            placeholder="e.g., 55"
                                                        />
                                                        {errors.phosphorousRequired && (
                                                            <p className="text-red-400 text-sm">{errors.phosphorousRequired}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-white">Potassium (K) *</Label>
                                                        <Input
                                                            type="number"
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.potassiumRequired ? "border-red-500" : ""}`}
                                                            value={editFormData.potassiumRequired}
                                                            onChange={(e) => handleEditInputChange("potassiumRequired", e.target.value)}
                                                            placeholder="e.g., 45"
                                                        />
                                                        {errors.potassiumRequired && (
                                                            <p className="text-red-400 text-sm">{errors.potassiumRequired}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-white">pH Level *</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            className={`bg-slate-600 border-slate-500 text-white ${errors.soilpH ? "border-red-500" : ""}`}
                                                            value={editFormData.soilpH}
                                                            onChange={(e) => handleEditInputChange("soilpH", e.target.value)}
                                                            placeholder="e.g., 6.8"
                                                        />
                                                        {errors.soilpH && <p className="text-red-400 text-sm">{errors.soilpH}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Notes */}
                                            <div className="pt-6 border-t border-slate-700">
                                                <div className="space-y-2">
                                                    <Label className="text-white">Additional Notes (Optional)</Label>
                                                    <Textarea
                                                        className="bg-slate-600 border-slate-500 text-white"
                                                        value={editFormData.notes || ""}
                                                        onChange={(e) => handleEditInputChange("notes", e.target.value)}
                                                        placeholder="Any specific requirements, concerns, or goals for your farm..."
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* View Mode */
                                        <div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Location</p>
                                                            <p className="text-white font-semibold">{prediction.inputData.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Farm Size</p>
                                                            <p className="text-white font-semibold">{prediction.inputData.farmSize} katthas</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Leaf className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Soil Type</p>
                                                            <p className="text-white font-semibold capitalize">{prediction.inputData.soilType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Previous Crop</p>
                                                            <p className="text-white font-semibold capitalize">{prediction.inputData.previousCrop}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <User className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Experience</p>
                                                            <p className="text-white font-semibold capitalize">{prediction.inputData.experience}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <Thermometer className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Temperature</p>
                                                            <p className="text-white font-semibold">{prediction.inputData.temperature}°C</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Droplets className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Humidity</p>
                                                            <p className="text-white font-semibold">{prediction.inputData.humidity}%</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Climate Zone</p>
                                                            <p className="text-white font-semibold capitalize">{prediction.inputData.climate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <DollarSign className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Budget Range</p>
                                                            <p className="text-white font-semibold capitalize">{prediction.inputData.budget}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Droplets className="w-5 h-5 text-emerald-400" />
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Rainfall</p>
                                                            <p className="text-white font-semibold">{prediction.inputData.rainfall} mm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Soil Nutrients */}
                                            <div className="mt-6 pt-6 border-t border-slate-700">
                                                <h4 className="text-white font-semibold mb-4">Soil Nutrients</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="bg-slate-700 rounded-lg p-4">
                                                        <p className="text-gray-400 text-sm">Nitrogen (N)</p>
                                                        <p className="text-2xl font-bold text-white">{prediction.inputData.nitrogenRequired}</p>
                                                    </div>
                                                    <div className="bg-slate-700 rounded-lg p-4">
                                                        <p className="text-gray-400 text-sm">Phosphorous (P)</p>
                                                        <p className="text-2xl font-bold text-white">{prediction.inputData.phosphorousRequired}</p>
                                                    </div>
                                                    <div className="bg-slate-700 rounded-lg p-4">
                                                        <p className="text-gray-400 text-sm">Potassium (K)</p>
                                                        <p className="text-2xl font-bold text-white">{prediction.inputData.potassiumRequired}</p>
                                                    </div>
                                                    <div className="bg-slate-700 rounded-lg p-4">
                                                        <p className="text-gray-400 text-sm">pH Level</p>
                                                        <p className="text-2xl font-bold text-white">{prediction.inputData.soilpH}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Notes */}
                                            {prediction.inputData.notes && (
                                                <div className="mt-6 pt-6 border-t border-slate-700">
                                                    <h4 className="text-white font-semibold mb-2">Additional Notes</h4>
                                                    <p className="text-gray-300">{prediction.inputData.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* New Predictions Section */}
                            {showNewPredictions && newPredictions && (
                                <Card className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 border-blue-500">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-blue-400" />
                                            New Crop Recommendations
                                            <Badge className="bg-blue-500 text-white">Updated</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {newPredictions.recommendedCrops.map((crop, index) => (
                                                <Card
                                                    key={index}
                                                    className="bg-slate-700 border-blue-500 hover:border-emerald-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
                                                    onClick={() => handleNewCropSelect(crop)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-md font-bold text-white">{crop.cropName}</h3>
                                                            <div className="text-emerald-400 font-bold">{crop.suitability}%</div>
                                                        </div>
                                                        <p className="text-gray-400 text-xs italic mb-3">{crop.scientificName}</p>

                                                        <div className="space-y-2 mb-3">

                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="w-3 h-3 text-emerald-400" />
                                                                <span className="text-gray-300 text-xs">Profit: {crop.profit}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <AlertTriangle className="w-3 h-3 text-emerald-400" />
                                                                <span className="text-gray-300 text-xs">Risk: {crop.risk}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <div className="w-full bg-slate-600 rounded-full h-2">
                                                                <div
                                                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${crop.suitability}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleNewCropSelect(crop)
                                                            }}
                                                        >
                                                            Select This Crop
                                                            <ArrowRight className="w-3 h-3 ml-2" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Current Recommended Crops */}
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        {showNewPredictions ? "Previous Crop Recommendations" : "Recommended Crops"}
                                        {showNewPredictions && (
                                            <Badge variant="outline" className="text-gray-400 border-gray-400">
                                                Previous
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {prediction.recommendedCrops.map((crop, index) => {
                                            const isSelected = selectedCrop?.cropName === crop.cropName
                                            return (
                                                <Card
                                                    key={index}
                                                    className={`bg-slate-700 border-slate-600 transition-all duration-300 ${isSelected ? "border-emerald-500 bg-emerald-900/20" : ""
                                                        } ${showNewPredictions ? "opacity-60" : ""}`}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-md font-bold text-white">{crop.cropName}</h3>
                                                            {isSelected && <Badge className="bg-emerald-500 text-white">Selected</Badge>}
                                                        </div>
                                                        <p className="text-gray-400 text-xs italic mb-2">{crop.scientificName}</p>
                                                        {isSelected ? (
                                                            <Button
                                                                size="sm"
                                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                                                onClick={() => handleCropSelect(crop)}
                                                                disabled={showNewPredictions}
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                disabled
                                                                className="w-full bg-slate-600 text-gray-400 cursor-not-allowed"
                                                            >
                                                                Not Selected
                                                            </Button>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Prediction Confidence */}
                            {prediction.confidence && (
                                <Card className="bg-slate-800 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Prediction Confidence</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center mb-4">
                                            <div className="text-4xl font-bold text-emerald-400 mb-2">{prediction.confidence}%</div>
                                            <p className="text-gray-400">Accuracy Score</p>
                                        </div>
                                        <Progress value={prediction.confidence} className="h-3" />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Insights */}
                            {(prediction.insights || newPredictions?.insights) && (
                                <Card className="bg-slate-800 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Key Insights</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {(newPredictions?.insights || prediction.insights) && (
                                            <>
                                                <div>
                                                    <h4 className="text-white font-semibold mb-1">Best Planting Time</h4>
                                                    <p className="text-gray-300 text-sm">
                                                        {newPredictions?.insights?.bestPlantingTime || prediction.insights.bestPlantingTime}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-semibold mb-1">Weather Risk</h4>
                                                    <p className="text-gray-300 text-sm">
                                                        {newPredictions?.insights?.weatherRisk || prediction.insights.weatherRisk}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-semibold mb-1">Market Outlook</h4>
                                                    <p className="text-gray-300 text-sm">
                                                        {newPredictions?.insights?.marketOutlook || prediction.insights.marketOutlook}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-semibold mb-1">Soil Recommendation</h4>
                                                    <p className="text-gray-300 text-sm">
                                                        {newPredictions?.insights?.soilRecommendation || prediction.insights.soilRecommendation}
                                                    </p>
                                                </div>


                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                        onClick={() => router.push("/predict")}
                                    >
                                        Create New Prediction
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white bg-transparent"
                                        onClick={() => router.push("/predictions")}
                                    >
                                        View All Predictions
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
