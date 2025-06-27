"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Calendar,
    Thermometer,
    Droplets,
    Leaf,
    TrendingUp,
    DollarSign,
    AlertTriangle,
    Clock,
    CheckCircle,
    ArrowLeft,
    Download,
    Share2,
} from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function CropDetailsPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const predictionId = searchParams.get("predictionId")

    const scientificName = params.scientificName?.replace(/-/g, " ")

    console.log("Scientific Name:", scientificName)
    console.log("Prediction ID:", predictionId)
    const router = useRouter()

    const [cropData, setCropData] = useState(null)
    const [timeline, setTimeline] = useState([])
    const [predictionData, setPredictionData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cropsRes, timelineRes, predictionRes] = await Promise.all([
                    fetch("http://localhost:8000/api/crops"),
                    fetch("http://localhost:8000/api/timelines"),
                    fetch(`http://localhost:8000/api/predictions/${predictionId}`)
                ])
                const cropsJson = await cropsRes.json()
                const timelineJson = await timelineRes.json()
                const predictionJson = await predictionRes.json()

                const selectedCrop = cropsJson.find(
                    crop => crop.scientificName.toLowerCase() === scientificName?.toLowerCase()
                )
                const selectedTimeline = timelineJson.find(
                    t => t.scientificName.toLowerCase() === scientificName?.toLowerCase()
                )
                console.log("Selected Timeline Data :", selectedTimeline)

                const recommendedCrop = predictionJson.recommendedCrops?.find(
                    rc => rc.scientificName.toLowerCase() === scientificName?.toLowerCase()
                )

                setCropData(selectedCrop)
                console.log("Crop Data :", selectedCrop)

                setTimeline(selectedTimeline?.tasks || [])
                setPredictionData({
                    suitability: recommendedCrop?.suitability ?? 0,
                    risk: selectedCrop?.risk || "Unknown",
                })
                console.log("Timeline Data :", selectedTimeline)

            } catch (err) {
                console.error("Failed to fetch data", err)
            }
        }

        if (scientificName && predictionId) {
            fetchData()
        }
    }, [scientificName, predictionId])

    // Static maize data
    const cropData1 = {
        name: "Maize",
        commonName: "Maize",
        growingSeason: "Spring - Summer (90-120 days)",
        optimalTemp: "20-30°C",
        waterReq: "Moderate to High",
        expectedYield: "3-5 tons/hectare",
        marketPrice: "NPR 30-60/kg",
        soilType: "Well-drained loamy soil with good organic matter",
    }

    const timeline1 = [
        { title: "Land Preparation", day: 1, details: "Plough the field thoroughly and apply organic compost." },
        { title: "Sowing", day: 10, details: "Sow seeds 2.5-5 cm deep at proper spacing after the final ploughing." },
        { title: "Irrigation", day: 20, details: "First irrigation 10-15 days after sowing, then as required." },
        { title: "Fertilization", day: 25, details: "Apply nitrogen, phosphorus, and potassium fertilizers at recommended doses." },
        { title: "Pest Control", day: 40, details: "Monitor for stem borers and use biological or chemical control methods." },
        { title: "Harvesting", day: 110, details: "Harvest when husks turn brown and kernels are hard and shiny." },
    ]

    const predictionData1 = {
        suitability: 88,
        risk: "Low",
    }

    const getTimelineIcon = (title) => {
        const iconMap = {
            "Land Preparation": <Leaf className="w-5 h-5" />,
            Sowing: <Calendar className="w-5 h-5" />,
            Irrigation: <Droplets className="w-5 h-5" />,
            Fertilization: <TrendingUp className="w-5 h-5" />,
            "Pest Control": <AlertTriangle className="w-5 h-5" />,
            Harvesting: <CheckCircle className="w-5 h-5" />,
        }
        return iconMap[title] || <Clock className="w-5 h-5" />
    }

    const getStatusColor = (day) => {
        const currentDay = new Date().getDate()
        if (day < currentDay) return "bg-emerald-500"
        if (day === currentDay) return "bg-yellow-500"
        return "bg-gray-400"
    }
    if (!cropData || !predictionData) return <div className="text-white p-10">Loading...</div>


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
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Predictions
                        </Button>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{cropData.cropName}</h1>
                                <p className="text-xl text-gray-300 italic">{scientificName}  {predictionId}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <Badge className="bg-emerald-500 text-white">Selected Crop</Badge>
                                    <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                                        Suitability: {predictionData.suitability}%
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 md:mt-0">
                                <Button variant="outline" className="border-emerald-500 text-emerald-400">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button className="bg-emerald-500 hover:bg-emerald-600">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Guide
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Crop Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Growing Season</p>
                                                    <p className="text-white font-semibold">{cropData.season}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Thermometer className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Optimal Temperature</p>
                                                    <p className="text-white font-semibold">{cropData.temperature}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Droplets className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Water Requirements</p>
                                                    <p className="text-white font-semibold">{cropData.rainfall}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Expected Yield</p>
                                                    <p className="text-white font-semibold">{cropData.expectedYield}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Market Price</p>
                                                    <p className="text-white font-semibold">NPR {cropData.marketValue}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Leaf className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Soil Type</p>
                                                    <p className="text-white font-semibold">{cropData.soilType}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Timeline */}
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Farming Timeline & Activities</CardTitle>
                                    <p className="text-gray-400">Step-by-step guide for optimal crop management</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {timeline.map((task, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getStatusColor(task.day)}`}
                                                    >
                                                        {getTimelineIcon(task.title)}
                                                    </div>
                                                    {index < timeline.length - 1 && <div className="w-0.5 h-16 bg-slate-600 mt-2"></div>}
                                                </div>
                                                <div className="flex-1 pb-8">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-white font-semibold">{task.title}</h3>
                                                        <Badge variant="outline" className="text-xs text-white">
                                                            Day {task.day}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed">{task.details}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Your Prediction Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-400">Suitability Score</span>
                                            <span className="text-emerald-400 font-bold">{predictionData.suitability}%</span>
                                        </div>
                                        <Progress value={predictionData.suitability} className="h-2" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Risk Level</span>
                                            <span className="text-white">{predictionData.risk}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Expected ROI</span>
                                            <span className="text-emerald-400">+25-35%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Prediction Date</span>
                                            <span className="text-white">{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Quick Tips</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                                            <p className="text-gray-300 text-sm">Use certified seeds for better yield.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                                            <p className="text-gray-300 text-sm">Avoid waterlogging by ensuring proper drainage.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                                            <p className="text-gray-300 text-sm">Monitor for pest attacks weekly.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                        Weather Alert
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300 text-sm">
                                        Rain expected in next 3 days. Avoid field work during heavy showers.
                                    </p>
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
