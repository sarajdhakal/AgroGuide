"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, User, Mail, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import axios from "axios"




export default function EditUserPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.id
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "user",
        status: "active",
        address: "",
        farmSize: "",
        experience: "",
        phoneNumber: "",
        description: "",
    })

    const { id } = useParams();



    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsFetching(true)
                // In a real app, fetch user data from API
                const response = await axios.get(`http://localhost:8000/api/user/${id}`)
                setFormData(response.data)

                // Mock data for demonstration
                setTimeout(() => {
                    setFormData({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email,
                        role: response.data.role,
                        status: response.data.status,
                        farmLocation: response.data.address,
                        farmSize: response.data.farmSize,
                        experience: response.data.experience,
                        phoneNumber: response.data.phoneNumber,
                        description: response.data.description,
                    })
                    setIsFetching(false)
                }, 800)
            } catch (err) {
                setError("Failed to fetch user data")
                setIsFetching(false)
            }
        }

        fetchUser()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            await axios.put(`http://localhost:8000/api/update/user/${id}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                address: formData.farmLocation,  // backend expects 'address'
                farmSize: formData.farmSize,
                experience: formData.experience,
                phoneNumber: formData.phoneNumber,
                description: formData.description, // or formData.notes depending on backend
            })

            setSuccess("User updated successfully!")
        } catch (err) {
            setError("Failed to update user. Please try again.")
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
                    activeTab="users"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="users" />
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
                activeTab="users"
                setActiveTab={() => { }}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="users" />

                <main className="p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit User</h1>
                                <p className="text-slate-600 dark:text-slate-400">Update user information</p>
                            </div>
                        </div>

                        {/* Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    User Information
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

                                    {/* Personal Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                placeholder="Farmer"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    placeholder="john@farm.com"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="User">User</SelectItem>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="Moderaor">Moderator</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Account Status</Label>
                                            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Farm Information */}
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Farm Information
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="farmLocation">Farm Location</Label>
                                                <Input
                                                    id="farmLocation"
                                                    value={formData.farmLocation}
                                                    onChange={(e) => handleInputChange("farmLocation", e.target.value)}
                                                    placeholder="City, State"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="farmSize">Farm Size</Label>
                                                <Select
                                                    value={formData.farmSize}
                                                    onValueChange={(value) => handleInputChange("farmSize", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select farm size" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="small">Under 10 acres</SelectItem>
                                                        <SelectItem value="medium">10-100 acres</SelectItem>
                                                        <SelectItem value="large">100-500 acres</SelectItem>
                                                        <SelectItem value="enterprise">500+ acres</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <Label htmlFor="experience">Farming Experience</Label>
                                            <Select
                                                value={formData.experience}
                                                onValueChange={(value) => handleInputChange("experience", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select experience" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">0-2 years</SelectItem>
                                                    <SelectItem value="intermediate">3-10 years</SelectItem>
                                                    <SelectItem value="experienced">10+ years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Additional Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Additional Notes</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            placeholder="Any additional information about the user..."
                                            rows={3}
                                        />
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