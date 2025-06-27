"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
    Eye, User,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/components/AuthProvider"

export default function PredictionDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedCrop, setSelectedCrop] = useState(null)


    useEffect(() => {
        if (params.id) {
            fetchPredictionDetails()
        }
    }, [params.id])

    const fetchPredictionDetails = async () => {
        try {
            setLoading(true)
            // Fetch prediction details from your backend
            const response = await axios.get(`http://localhost:8000/api/predictions/${params.id}`, {
                headers: { "Content-Type": "application/json" },
            })
            const selectedCropRes = await axios.get("http://localhost:8000/api/selected-crops/")
            const cropMap = {}
            selectedCropRes.data.forEach(item => {
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

            setPrediction({
                ...response.data,
                status: computedStatus,
            })
        } catch (error) {
            console.error("Error fetching prediction details:", error)
            // Mock data for development
            const mockPrediction = {
                _id: params.id,
                userId: user?.id,
                inputData: {
                    location: "Chitwan",
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
                    experience: "2",
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
        } finally {
            setLoading(false)
        }
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
                                    <span className="text-gray-400">Created {formatDate(prediction.predictedAt)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 md:mt-0">
                                <Button variant="outline" className="border-emerald-500 text-emerald-400">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="outline" className="border-emerald-500 text-emerald-400">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                                <Button className="bg-emerald-500 hover:bg-emerald-600">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Farm Information */}
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Farm Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            {/* Existing Items */}
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
                                            {/* ✅ New Item: Experience */}
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Experience</p>
                                                    <p className="text-white font-semibold capitalize">{prediction.inputData.experience} years</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {/* Existing Items */}
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
                                            {/* ✅ New Item: Rainfall */}
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
                                </CardContent>
                            </Card>

                            {/* Recommended Crops */}
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Recommended Crops</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {prediction.recommendedCrops.map((crop, index) => {
                                            const isSelected = selectedCrop?.cropName === crop.cropName

                                            return (
                                                <Card
                                                    key={index}
                                                    className={`bg-slate-700 border-slate-600 transition-all duration-300 ${isSelected ? "border-emerald-500 bg-emerald-900/20" : ""
                                                        }`}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-md font-bold text-white">{crop.cropName}</h3>
                                                            {isSelected && (
                                                                <Badge className="bg-emerald-500 text-white">Selected</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-400 text-xs italic mb-2">{crop.scientificName}</p>

                                                        {isSelected ? (
                                                            <Button
                                                                size="sm"
                                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                                                onClick={() => handleCropSelect(crop)}
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
                            {prediction.insights && (
                                <Card className="bg-slate-800 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Key Insights</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">Best Planting Time</h4>
                                            <p className="text-gray-300 text-sm">{prediction.insights.bestPlantingTime}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">Weather Risk</h4>
                                            <p className="text-gray-300 text-sm">{prediction.insights.weatherRisk}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">Market Outlook</h4>
                                            <p className="text-gray-300 text-sm">{prediction.insights.marketOutlook}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">Soil Recommendation</h4>
                                            <p className="text-gray-300 text-sm">{prediction.insights.soilRecommendation}</p>
                                        </div>
                                        {prediction.insights.expectedYield && (
                                            <div>
                                                <h4 className="text-white font-semibold mb-1">Expected Yield</h4>
                                                <p className="text-gray-300 text-sm">{prediction.insights.expectedYield}</p>
                                            </div>
                                        )}
                                        {prediction.insights.profitEstimate && (
                                            <div>
                                                <h4 className="text-white font-semibold mb-1">Profit Estimate</h4>
                                                <p className="text-emerald-400 text-sm font-semibold">{prediction.insights.profitEstimate}</p>
                                            </div>
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
                                        className="w-full border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
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
