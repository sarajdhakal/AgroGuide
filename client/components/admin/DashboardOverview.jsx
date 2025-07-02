import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Users, Brain, CheckCircle, Clock, Download, Calendar, MapPin, Leaf } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"


export default function DashboardOverview() {
  const { toast } = useToast()
  const [predictions, setPredictions] = useState([])
  const [users, setUsers] = useState([])
  const [selectedCrops, setSelectedCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [error, setError] = useState("")

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
        console.log("✅ Users data:", usersRes.data)

        setSelectedCrops(selectedCropsRes.data)
        setError("")
      } catch (error) {
        console.error("Error loading analytics data:", error)
        setError("Failed to fetch analytics data")

        // Fallback mock data for analytics
        setPredictions([
          {
            _id: "1",
            userId: "user1",
            inputData: {
              location: "Kathmandu",
              soilType: "loamy",
              climate: "subtropical",
              farmSize: "50",
            },
            recommendedCrops: [
              { cropName: "rice", suitability: 85, risk: "Low" },
              { cropName: "wheat", suitability: 75, risk: "Medium" },
              { cropName: "maize", suitability: 65, risk: "Low" },
            ],
            predictedAt: "2025-06-25T10:00:00Z",
          },
          {
            _id: "2",
            userId: "user2",
            inputData: {
              location: "Pokhara",
              soilType: "sandy",
              climate: "temperate",
              farmSize: "75",
            },
            recommendedCrops: [
              { cropName: "potato", suitability: 90, risk: "Low" },
              { cropName: "tomato", suitability: 80, risk: "Medium" },
              { cropName: "cabbage", suitability: 70, risk: "Low" },
            ],
            predictedAt: "2025-06-24T14:30:00Z",
          },
          {
            _id: "3",
            userId: "user3",
            inputData: {
              location: "Chitwan",
              soilType: "clay",
              climate: "tropical",
              farmSize: "100",
            },
            recommendedCrops: [
              { cropName: "sugarcane", suitability: 95, risk: "Low" },
              { cropName: "banana", suitability: 85, risk: "Medium" },
              { cropName: "papaya", suitability: 75, risk: "High" },
            ],
            predictedAt: "2025-06-23T09:15:00Z",
          },
        ])

        setSelectedCrops([
          { predictionId: "1", cropName: "rice", selectedAt: "2025-06-25T11:00:00Z" },
          { predictionId: "3", cropName: "sugarcane", selectedAt: "2025-06-23T10:00:00Z" },
        ])

        setUsers([
          { _id: "user1", firstName: "Ram", lastName: "Sharma" },
          { _id: "user2", firstName: "Sita", lastName: "Poudel" },
          { _id: "user3", firstName: "Hari", lastName: "Thapa" },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Analytics calculations
  const getAnalyticsData = () => {
    const totalPredictions = predictions.length
    const completedPredictions = predictions.filter((p) => selectedCrops.some((sc) => sc.predictionId === p._id)).length
    const pendingPredictions = totalPredictions - completedPredictions

    const avgSuitability =
      predictions.length > 0
        ? Math.round(
          predictions
            .filter((p) => p.recommendedCrops?.length > 0)
            .reduce((acc, p) => {
              const maxSuitability = p.recommendedCrops.reduce(
                (max, crop) => (crop.suitability > max ? crop.suitability : max),
                0,
              )
              return acc + maxSuitability
            }, 0) / predictions.filter((p) => p.recommendedCrops?.length > 0).length,
        )
        : 0

    const completionRate = totalPredictions > 0 ? Math.round((completedPredictions / totalPredictions) * 100) : 0

    return {
      totalPredictions,
      completedPredictions,
      pendingPredictions,
      avgSuitability,
      completionRate,
    }
  }

  // Crop popularity data
  const getCropPopularityData = () => {
    const cropCounts = {}
    predictions.forEach((prediction) => {
      prediction.recommendedCrops?.forEach((crop) => {
        cropCounts[crop.cropName] = (cropCounts[crop.cropName] || 0) + 1
      })
    })

    return Object.entries(cropCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // Location distribution data
  const getLocationData = () => {
    const locationCounts = {}
    predictions.forEach((prediction) => {
      const location = prediction.inputData?.location || "Unknown"
      locationCounts[location] = (locationCounts[location] || 0) + 1
    })

    return Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }

  // Soil type distribution
  const getSoilTypeData = () => {
    const soilCounts = {}
    predictions.forEach((prediction) => {
      const soilType = prediction.inputData?.soilType || "Unknown"
      soilCounts[soilType] = (soilCounts[soilType] || 0) + 1
    })

    return Object.entries(soilCounts).map(([name, value]) => ({ name, value }))
  }

  // Risk level distribution
  const getRiskLevelData = () => {
    const riskCounts = { Low: 0, Medium: 0, High: 0 }
    predictions.forEach((prediction) => {
      prediction.recommendedCrops?.forEach((crop) => {
        riskCounts[crop.risk] = (riskCounts[crop.risk] || 0) + 1
      })
    })

    return Object.entries(riskCounts).map(([name, value]) => ({ name, value }))
  }

  // Time series data for predictions
  const getTimeSeriesData = () => {
    const dailyCounts = {}
    predictions.forEach((prediction) => {
      const date = new Date(prediction.predictedAt).toISOString().split("T")[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const analyticsData = getAnalyticsData()
  const cropPopularityData = getCropPopularityData()
  const locationData = getLocationData()
  const soilTypeData = getSoilTypeData()
  const riskLevelData = getRiskLevelData()
  const timeSeriesData = getTimeSeriesData()

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"]

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white"> Dashboard (Overview & Statistics)</h2>
          <p className="text-slate-600 dark:text-slate-400">Get a quick overview of total predictions, user activity, crop suitability, and recent trends. Track system usage and performance in real-time</p>
        </div>

      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Header */}


      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Predictions</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.totalPredictions}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-slate-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {analyticsData.completedPredictions}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-600">{analyticsData.completionRate}%</span>
              <span className="text-slate-500 ml-1">completion rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Suitability</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.avgSuitability}%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600">+5%</span>
              <span className="text-slate-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{users.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-purple-600">+8%</span>
              <span className="text-slate-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Predictions Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crop Popularity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Most Recommended Crops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropPopularityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Soil Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Soil Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={soilTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {soilTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationData.slice(0, 5).map((location, index) => (
                <div key={location.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium">{location.name}</span>
                  </div>
                  <Badge variant="outline">{location.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Prediction Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.slice(0, 5).map((prediction) => {
              const userId = typeof prediction.userId === "object" ? prediction.userId._id : prediction.userId
              const user = users.find((u) => u._id === userId) || { firstName: "Unknown", lastName: "User" }
              const isCompleted = selectedCrops.some((sc) => sc.predictionId === prediction._id)
              const topCrop = prediction.recommendedCrops?.[0]

              return (
                <div key={prediction._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${isCompleted ? "bg-green-500" : "bg-yellow-500"}`}></div>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-slate-500">{prediction.inputData?.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{topCrop?.cropName || "N/A"}</p>
                      <p className="text-sm text-slate-500">{topCrop?.suitability || 0}% suitability</p>
                    </div>
                    <Badge className={isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {isCompleted ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium">High Accuracy Rate</span>
                </div>
                <span className="text-green-600 font-bold">{analyticsData.avgSuitability}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Completion Rate</span>
                </div>
                <span className="text-blue-600 font-bold">{analyticsData.completionRate}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">Pending Selections</span>
                </div>
                <span className="text-yellow-600 font-bold">{analyticsData.pendingPredictions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border-l-4 border-emerald-500 bg-emerald-50">
                <h4 className="font-medium text-emerald-800">Excellent Performance</h4>
                <p className="text-sm text-emerald-600">Your prediction accuracy is above industry standards.</p>
              </div>

              <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-medium text-blue-800">User Engagement</h4>
                <p className="text-sm text-blue-600">Consider follow-up campaigns for pending selections.</p>
              </div>

              <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                <h4 className="font-medium text-yellow-800">Growth Opportunity</h4>
                <p className="text-sm text-yellow-600">Focus on expanding to underserved locations.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
