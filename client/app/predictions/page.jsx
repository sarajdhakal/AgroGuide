"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Calendar,
    MapPin,
    Leaf,
    TrendingUp,
    Eye,
    Search,
    Filter,
    ChevronDown,
    Clock,
    CheckCircle,
    AlertTriangle,
    BarChart3,
    Download,
    RefreshCw,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/components/AuthProvider"


export default function PredictionsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [predictions, setPredictions] = useState([])
    const [filteredPredictions, setFilteredPredictions] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [selectedCropsMap, setSelectedCropsMap] = useState({})



    useEffect(() => {
        if (user) {
            fetchPredictions()
        }
    }, [user])

    useEffect(() => {
        filterAndSortPredictions()
    }, [predictions, searchTerm, filterStatus, sortBy])

    const fetchPredictions = async () => {
        try {
            setLoading(true)
            const [predRes, selectedRes] = await Promise.all([
                axios.get(`http://localhost:8000/api/predictions/user/${user.id}`, {
                    headers: { "Content-Type": "application/json" },
                }),
                axios.get("http://localhost:8000/api/selected-crops/", {
                    headers: { "Content-Type": "application/json" },
                }),
            ])

            setPredictions(predRes.data)

            // Create a map of predictionId -> selectedCrop
            const cropMap = {}
            selectedRes.data.forEach((item) => {
                cropMap[item.predictionId.toString()] = item
            })
            setSelectedCropsMap(cropMap)
            const updatedPredictions = predRes.data.map((prediction) => {
                const hasThreeRecommendations = prediction.recommendedCrops?.length === 3
                const hasSelectedCrop = cropMap[prediction._id] !== undefined

                let status = "Pending"
                if (hasThreeRecommendations && hasSelectedCrop) {
                    status = "Completed"
                } else if (hasThreeRecommendations && !hasSelectedCrop) {
                    status = "In Progress"
                }

                return {
                    ...prediction,
                    status,
                }
            })

            setPredictions(updatedPredictions)
        } catch (error) {
            console.error("Error fetching predictions or selected crops:", error)
        } finally {
            setLoading(false)
        }
    }
    const filterAndSortPredictions = () => {
        let filtered = [...predictions]

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (prediction) =>
                    prediction.inputData.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    prediction.recommendedCrops.some((crop) => crop.cropName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    prediction.selectedCrop?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        // Status filter
        if (filterStatus !== "all") {
            filtered = filtered.filter((prediction) => prediction.status === filterStatus)
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                case "location":
                    return a.inputData.location.localeCompare(b.inputData.location)
                default:
                    return 0
            }
        })

        setFilteredPredictions(filtered)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-emerald-500"
            case "In Progress":
                return "bg-yellow-500"
            case "Pending":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CheckCircle className="w-4 h-4" />
            case "In Progress":
                return <Clock className="w-4 h-4" />
            case "Pending":
                return <AlertTriangle className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    const handleViewDetails = (predictionId) => {
        router.push(`/predictions/${predictionId}`)
    }

    const handleNewPrediction = () => {
        router.push("/predict")
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

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900">
                <Header />
                <div className="pt-20 flex items-center justify-center min-h-screen">
                    <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                        <CardContent>
                            <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
                            <p className="text-gray-300 mb-6">You need to be logged in to view your predictions.</p>
                            <Button onClick={() => router.push("/login")} className="bg-emerald-500 hover:bg-emerald-600">
                                Login
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">My Predictions</h1>
                                <p className="text-gray-300">Track and manage all your crop predictions</p>
                            </div>
                            <div className="flex gap-3 mt-6 md:mt-0">
                                <Button
                                    variant="outline"
                                    className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                                    onClick={fetchPredictions}
                                    disabled={loading}
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                                    Refresh
                                </Button>
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleNewPrediction}>
                                    New Prediction
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-8 h-8 text-emerald-400" />
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Predictions</p>
                                        <p className="text-2xl font-bold text-white">{predictions.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                    <div>
                                        <p className="text-gray-400 text-sm">Completed</p>
                                        <p className="text-2xl font-bold text-white">
                                            {predictions.filter((p) => p.status === "Completed").length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-8 h-8 text-yellow-400" />
                                    <div>
                                        <p className="text-gray-400 text-sm">In Progress</p>
                                        <p className="text-2xl font-bold text-white">
                                            {predictions.filter((p) => p.status === "In Progress").length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-8 h-8 text-red-400" />
                                    <div>
                                        <p className="text-gray-400 text-sm">Pending</p>
                                        <p className="text-2xl font-bold text-white">
                                            {predictions.filter((p) => p.status === "Pending").length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="bg-slate-800 border-slate-700 mb-8">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search predictions..."
                                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <Filter className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <ChevronDown className="w-4 h-4 mr-2" />
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="location">By Location</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Predictions List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                            <span className="text-white ml-3">Loading predictions...</span>
                        </div>
                    ) : filteredPredictions.length === 0 ? (
                        <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="p-12 text-center">
                                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No Predictions Found</h3>
                                <p className="text-gray-400 mb-6">
                                    {searchTerm || filterStatus !== "all"
                                        ? "Try adjusting your search or filters"
                                        : "Start by creating your first crop prediction"}
                                </p>
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleNewPrediction}>
                                    Create New Prediction
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredPredictions.map((prediction) => (
                                <Card
                                    key={prediction._id}
                                    className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all duration-300"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-white text-lg">
                                                Prediction #{prediction._id.slice(-6)}
                                            </CardTitle>
                                            <Badge className={`${getStatusColor(prediction.status)} text-white`}>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(prediction.status)}
                                                    {prediction.status?.replace("_", " ") || "Not set"}
                                                </div>
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Location and Date */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <MapPin className="w-4 h-4 text-emerald-400" />
                                                {prediction.inputData.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(prediction.predictedAt)}
                                            </div>
                                        </div>

                                        {/* Farm Details */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-400">Soil Type:</span>
                                                <span className="text-white ml-2 capitalize">
                                                    {prediction.inputData.soilType}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Farm Size:</span>
                                                <span className="text-white ml-2">
                                                    {prediction.inputData.farmSize} katthas
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Climate:</span>
                                                <span className="text-white ml-2 capitalize">
                                                    {prediction.inputData.climate}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Budget:</span>
                                                <span className="text-white ml-2 capitalize">
                                                    {prediction.inputData.budget}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Recommended Crops */}
                                        <div>
                                            <p className="text-gray-400 text-sm mb-2">Recommended Crops:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {prediction.recommendedCrops.map((crop, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="border-emerald-500 text-emerald-400"
                                                    >
                                                        <Leaf className="w-3 h-3 mr-1" />
                                                        {crop.cropName}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* SelectedCrop component here */}
                                        {selectedCropsMap[prediction._id] && (
                                            <div className="bg-slate-700 rounded-lg p-3 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-gray-400 text-sm">Selected Crop:</span>
                                                    <span className="text-emerald-400 font-semibold capitalize">
                                                        {selectedCropsMap[prediction._id]?.cropName}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {/* Action Button */}
                                        <Button
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                            onClick={() => handleViewDetails(prediction._id)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}

                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
