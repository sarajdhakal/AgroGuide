"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, Leaf } from "lucide-react"
import axios from "axios"

export default function ViewTimeline() {
    const router = useRouter()
    const params = useParams()
    const timelineId = params.id

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [timeline, setTimeline] = useState(null)
    const [crop, setCrop] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const timelineRes = await axios.get(`http://localhost:8000/api/timeline/${timelineId}`)
                setTimeline(timelineRes.data)

                // Fetch crop details
                const cropsRes = await axios.get("http://localhost:8000/api/crops")
                const matchedCrop = cropsRes.data.find((c) => c.scientificName === timelineRes.data.scientificName)
                setCrop(matchedCrop)
            } catch (error) {
                console.error("Error fetching timeline:", error)
                setError("Failed to load timeline data")
            } finally {
                setLoading(false)
            }
        }

        if (timelineId) {
            fetchData()
        }
    }, [timelineId])

    const getCategoryBadge = (category) => {
        const colors = {
            Cereal: "bg-blue-100 text-blue-800",
            Legume: "bg-green-100 text-green-800",
            Vegetable: "bg-orange-100 text-orange-800",
            Fruit: "bg-red-100 text-red-800",
        }
        return <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <AdminSidebar
                    activeTab="crops-timelines"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="crops-timelines" />
                    <main className="p-6">
                        <div className="p-4">Loading...</div>
                    </main>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <AdminSidebar
                    activeTab="crops-timelines"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="crops-timelines" />
                    <main className="p-6">
                        <div className="p-4 text-red-600">{error}</div>
                    </main>
                </div>
            </div>
        )
    }

    if (!timeline) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <AdminSidebar
                    activeTab="crops-timelines"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="crops-timelines" />
                    <main className="p-6">
                        <div className="p-4">Timeline not found</div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar
                activeTab="crops-timelines"
                setActiveTab={() => { }}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="crops-timelines" />

                <main className="p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push("/admin/timelines")}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Timelines
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Timeline Details</h1>
                                    <p className="text-slate-600 dark:text-slate-400">View timeline information</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => router.push(`/admin/timelines/edit/${timelineId}`)}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Timeline
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Timeline Info Card */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Crop Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Crop Name</label>
                                            <p className="text-lg font-semibold">{crop?.cropName || "Unknown"}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Scientific Name</label>
                                            <p className="text-lg italic">{timeline.scientificName}</p>
                                        </div>
                                    </div>

                                    {crop && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Category</label>
                                                <div className="mt-1">{getCategoryBadge(crop.category)}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Season</label>
                                                <p className="text-gray-900 capitalize">{crop.season}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Growth Period</label>
                                                <p className="text-gray-900">{crop.growthPeriod}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-4 block">
                                            Tasks Timeline ({timeline.tasks?.length || 0} tasks)
                                        </label>
                                        <div className="space-y-4">
                                            {timeline.tasks?.map((task, index) => (
                                                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                                            <span className="text-emerald-600 font-semibold text-sm">Day {task.day}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                                                        {task.description && <p className="text-gray-600 text-sm">{task.description}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!timeline.tasks || timeline.tasks.length === 0) && (
                                                <div className="text-center py-8 text-gray-500">No tasks defined for this timeline.</div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Stats Card */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Timeline Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Total Tasks</span>
                                            <span className="font-semibold">{timeline.tasks?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Duration</span>
                                            <span className="font-semibold">
                                                {timeline.tasks?.length > 0 ? `${Math.max(...timeline.tasks.map((t) => t.day))} days` : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Created</span>
                                            <span className="text-sm">
                                                {timeline.createdAt ? new Date(timeline.createdAt).toLocaleDateString() : "N/A"}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {crop && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Leaf className="w-5 h-5" />
                                                Crop Info
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Yield</span>
                                                <span className="text-sm">{crop.yield || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Water Req.</span>
                                                <span className="text-sm">{crop.waterRequirement || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Soil Type</span>
                                                <span className="text-sm">{crop.soilType || "N/A"}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
