"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Plus, Trash2, Calendar } from "lucide-react"
import axios from "axios"

export default function EditTimeline() {
    const router = useRouter()
    const params = useParams()
    const timelineId = params.id

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [formData, setFormData] = useState({
        scientificName: "",
        tasks: [],
    })
    const [crops, setCrops] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [timelineRes, cropsRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/timeline/${timelineId}`),
                    axios.get("http://localhost:8000/api/crops"),
                ])

                setFormData({
                    scientificName: timelineRes.data.scientificName || "",
                    tasks: timelineRes.data.tasks || [],
                })
                setCrops(cropsRes.data)
            } catch (error) {
                console.error("Error fetching data:", error)
                setError("Failed to load timeline data")
            } finally {
                setLoading(false)
            }
        }

        if (timelineId) {
            fetchData()
        }
    }, [timelineId])

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleTaskChange = (index, field, value) => {
        const updatedTasks = [...formData.tasks]
        updatedTasks[index] = {
            ...updatedTasks[index],
            [field]: value,
        }
        setFormData((prev) => ({
            ...prev,
            tasks: updatedTasks,
        }))
    }

    const addTask = () => {
        setFormData((prev) => ({
            ...prev,
            tasks: [...prev.tasks, { day: "", title: "", description: "" }],
        }))
    }

    const removeTask = (index) => {
        setFormData((prev) => ({
            ...prev,
            tasks: prev.tasks.filter((_, i) => i !== index),
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await axios.put(`http://localhost:8000/api/update/timeline/${timelineId}`, formData)
            alert("Timeline updated successfully")
            router.push("/admin/timelines")
        } catch (error) {
            console.error("Error updating timeline:", error)
            alert("Failed to update timeline")
        } finally {
            setSaving(false)
        }
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
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                variant="ghost"
                                onClick={() => router.push("/admin/timelines")}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Timelines
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Timeline</h1>
                                <p className="text-slate-600 dark:text-slate-400">Update timeline information</p>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Timeline Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="scientificName">Crop</Label>
                                    <Select
                                        value={formData.scientificName}
                                        onValueChange={(value) => handleInputChange("scientificName", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a crop" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {crops.map((crop) => (
                                                <SelectItem key={crop._id} value={crop.scientificName}>
                                                    {crop.cropName} ({crop.scientificName})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Tasks</Label>
                                        <Button type="button" onClick={addTask} className="flex items-center gap-2" size="sm">
                                            <Plus className="w-4 h-4" />
                                            Add Task
                                        </Button>
                                    </div>

                                    {formData.tasks.map((task, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                                <div className="md:col-span-2">
                                                    <Label htmlFor={`day-${index}`}>Day</Label>
                                                    <Input
                                                        id={`day-${index}`}
                                                        type="number"
                                                        value={task.day}
                                                        onChange={(e) => handleTaskChange(index, "day", Number.parseInt(e.target.value))}
                                                        placeholder="Day"
                                                        min="1"
                                                    />
                                                </div>
                                                <div className="md:col-span-4">
                                                    <Label htmlFor={`title-${index}`}>Task Title</Label>
                                                    <Input
                                                        id={`title-${index}`}
                                                        value={task.title}
                                                        onChange={(e) => handleTaskChange(index, "title", e.target.value)}
                                                        placeholder="Task title"
                                                    />
                                                </div>
                                                <div className="md:col-span-5">
                                                    <Label htmlFor={`description-${index}`}>Description</Label>
                                                    <Textarea
                                                        id={`description-${index}`}
                                                        value={task.description || ""}
                                                        onChange={(e) => handleTaskChange(index, "description", e.target.value)}
                                                        placeholder="Task description (optional)"
                                                        rows={2}
                                                    />
                                                </div>
                                                <div className="md:col-span-1 flex items-end">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeTask(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}

                                    {formData.tasks.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No tasks added yet. Click "Add Task" to get started.
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button variant="outline" onClick={() => router.push("/admin/timelines")}>
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
