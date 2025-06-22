"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Lock, Shield, Save, AlertCircle, CheckCircle } from 'lucide-react'
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function AdminProfilePage() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        role: "",
        department: "",
        bio: "",
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                // In a real app, fetch admin profile from API
                // const response = await axios.get('/api/admin/profile')
                // setProfileData(response.data)

                // Mock data for demonstration
                setTimeout(() => {
                    setProfileData({
                        firstName: "Admin",
                        lastName: "User",
                        email: "admin@agroguide.com",
                        phoneNumber: "+1 (555) 987-6543",
                        role: "Administrator",
                        department: "Management",
                        bio: "Platform administrator responsible for user management and system configuration.",
                    })
                    setIsLoading(false)
                }, 800)
            } catch (err) {
                setError("Failed to load profile data")
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setError("")
        setSuccess("")

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSuccess("Profile updated successfully!")
        } catch (err) {
            setError("Failed to update profile. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({ ...prev, [field]: value }))
        setError("")
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <AdminSidebar
                    activeTab="profile"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="profile" />
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
                activeTab="profile"
                setActiveTab={() => { }}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="profile" />

                <main className="p-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Profile</h1>

                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid grid-cols-2 mb-6">
                                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            Personal Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleProfileUpdate} className="space-y-6">
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
                                                    <Label htmlFor="firstName">First Name</Label>
                                                    <Input
                                                        id="firstName"
                                                        value={profileData.firstName}
                                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                        placeholder="Admin"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lastName">Last Name</Label>
                                                    <Input
                                                        id="lastName"
                                                        value={profileData.lastName}
                                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                        placeholder="User"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={profileData.email}
                                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                                            placeholder="admin@agroguide.com"
                                                            className="pl-10"
                                                            required
                                                            disabled
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-500">Contact system administrator to change your email address</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                                    <Input
                                                        id="phoneNumber"
                                                        value={profileData.phoneNumber}
                                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                        placeholder="+1 (555) 987-6543"
                                                    />
                                                </div>
                                            </div>

                                            {/* Role Information */}
                                            <div className="border-t pt-6">
                                                <h3 className="text-lg font-semibold mb-4">Role Information</h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="role">Role</Label>
                                                        <Input
                                                            id="role"
                                                            value={profileData.role}
                                                            onChange={(e) => handleInputChange("role", e.target.value)}
                                                            placeholder="Administrator"
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="department">Department</Label>
                                                        <Input
                                                            id="department"
                                                            value={profileData.department}
                                                            onChange={(e) => handleInputChange("department", e.target.value)}
                                                            placeholder="Management"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bio */}
                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    value={profileData.bio}
                                                    onChange={(e) => handleInputChange("bio", e.target.value)}
                                                    placeholder="Tell us about yourself and your role..."
                                                    rows={3}
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {isSaving ? "Saving..." : "Save Changes"}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="w-5 h-5" />
                                            Security Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold">Change Password</h3>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="currentPassword">Current Password</Label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                            <Input
                                                                id="currentPassword"
                                                                type="password"
                                                                placeholder="Enter current password"
                                                                className="pl-10"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="newPassword">New Password</Label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                            <Input
                                                                id="newPassword"
                                                                type="password"
                                                                placeholder="Enter new password"
                                                                className="pl-10"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                            <Input
                                                                id="confirmPassword"
                                                                type="password"
                                                                placeholder="Confirm new password"
                                                                className="pl-10"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                                                            Update Password
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t pt-6">
                                                <h3 className="text-lg font-semibold mb-4">Advanced Security</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">Two-Factor Authentication</p>
                                                            <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                                                        </div>
                                                        <Button variant="outline">Enable</Button>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">API Access</p>
                                                            <p className="text-sm text-slate-500">Manage your API keys and access tokens</p>
                                                        </div>
                                                        <Button variant="outline">Manage</Button>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">Login History</p>
                                                            <p className="text-sm text-slate-500">View your recent login activity</p>
                                                        </div>
                                                        <Button variant="outline">View</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    )
}