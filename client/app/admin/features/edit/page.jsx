"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Leaf, AlertCircle, CheckCircle } from 'lucide-react'
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function EditFeaturePage() {
    const router = useRouter()
    const params = useParams()
    const featureId = params.id
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "analysis",
        status: "active",
        isPublic: true,
        isPremium: false,
        icon: "leaf",
        sortOrder: 1,
    })

    useEffect(() => {
        const fetchFeature = async () => {
            try {
                setIsFetching(true)
                // In a real app, fetch feature data from API
                // const response = await axios.get(`/api/features/${featureId}`)
                // setFormData(response.data)

                // Mock data for demonstration
                setTimeout(() => {
                    setFormData({
                        name: "Soil Analysis",
                        description: "Advanced soil analysis with AI-powered recommendations for optimal crop growth.",
                        category: "analysis",
                        status: "active",
                        isPublic: true,
                        isPremium: true,
                        icon: "leaf",
                        sortOrder: 2,
                    })
                    setIsFetching(false)
                }, 800)
            } catch (err) {
                setError("Failed to fetch feature data")
                setIsFetching(false)
            }
        }

        fetchFeature()
    }, [featureId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSuccess("Feature updated successfully!")

            // Reset form after success
            setTimeout(() => {
                router.push("/admin")
            }, 2000)
        } catch (err) {
            setError("Failed to update feature. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        setError("")
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <AdminSidebar
                    activeTab="features"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="features" />
                    <main className="p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar
                activeTab="features"
                setActiveTab={() => { }}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="features" />

                <main className="p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Feature</h1>
                                <p className="text-slate-600 dark:text-slate-400">Update feature information</p>
                            </div>
                        </div>

                        {/* Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Leaf className="w-5 h-5" />
                                    Feature Information
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
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Feature Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                placeholder="Soil Analysis"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description *</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => handleInputChange("description", e.target.value)}
                                                placeholder="Describe the feature..."
                                                rows={4}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="analysis">Analysis</SelectItem>
                                                    <SelectItem value="prediction">Prediction</SelectItem>
                                                    <SelectItem value="monitoring">Monitoring</SelectItem>
                                                    <SelectItem value="management">Management</SelectItem>
                                                    <SelectItem value="education">Education</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                    <SelectItem value="development">In Development</SelectItem>
                                                    <SelectItem value="deprecated">Deprecated</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="icon">Icon</Label>
                                            <Select value={formData.icon} onValueChange={(value) => handleInputChange("icon", value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="leaf">Leaf</SelectItem>
                                                    <SelectItem value="droplet">Droplet</SelectItem>
                                                    <SelectItem value="sun">Sun</SelectItem>
                                                    <SelectItem value="cloud">Cloud</SelectItem>
                                                    <SelectItem value="thermometer">Thermometer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="sortOrder">Sort Order</Label>
                                            <Input
                                                id="sortOrder"
                                                type="number"
                                                value={formData.sortOrder}
                                                onChange={(e) => handleInputChange("sortOrder", parseInt(e.target.value))}
                                                min={1}
                                            />
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="isPublic" className="text-base">Public Feature</Label>
                                                <p className="text-sm text-slate-500">Make this feature visible to all users</p>
                                            </div>
                                            <Switch
                                                id="isPublic"
                                                checked={formData.isPublic}
                                                onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="isPremium" className="text-base">Premium Feature</Label>
                                                <p className="text-sm text-slate-500">Restrict to premium subscribers only</p>
                                            </div>
                                            <Switch
                                                id="isPremium"
                                                checked={formData.isPremium}
                                                onCheckedChange={(checked) => handleInputChange("isPremium", checked)}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-4 pt-6">
                                        <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                            <Save className="w-4 h-4 mr-2" />
                                            {isLoading ? "Saving Changes..." : "Save Changes"}
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