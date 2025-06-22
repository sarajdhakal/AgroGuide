"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Lock, Bell, Shield, Save, AlertCircle, CheckCircle } from 'lucide-react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ProfilePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        farmLocation: "",
        farmSize: "",
        experience: "",
        bio: "",
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        marketUpdates: true,
        weatherAlerts: true,
        newFeatures: false,
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                // In a real app, fetch user profile from API
                // const response = await axios.get('/api/profile')
                // setProfileData(response.data.profile)
                // setNotificationSettings(response.data.notifications)

                // Mock data for demonstration
                setTimeout(() => {
                    setProfileData({
                        firstName: "Saraj",
                        lastName: "Dhakal",
                        email: "sarajdhakal@gmail.com",
                        phoneNumber: "+977 9866115177",
                        farmLocation: "Bharatpur-15,Fulbari",
                        farmSize: "medium",
                        experience: "experienced",
                        bio: "Experienced corn and soybean farmer with over 10 years in sustainable agriculture.",
                    })
                    setNotificationSettings({
                        emailNotifications: true,
                        marketUpdates: true,
                        weatherAlerts: true,
                        newFeatures: false,
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

    const handleNotificationUpdate = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setError("")
        setSuccess("")

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSuccess("Notification preferences updated successfully!")
        } catch (err) {
            setError("Failed to update notification preferences. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({ ...prev, [field]: value }))
        setError("")
    }

    const handleNotificationChange = (field, value) => {
        setNotificationSettings((prev) => ({ ...prev, [field]: value }))
        setError("")
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Profile</h1>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-6">
                            <TabsTrigger value="profile">Profile Information</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="myPredictions">My Predictions</TabsTrigger>
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
                                                    placeholder="Saraj"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={profileData.lastName}
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                    placeholder="Dhakal"
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
                                                        placeholder="sarajdhakal@gmail.com"
                                                        className="pl-10"
                                                        required
                                                        disabled
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-500">Contact support to change your email address</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    value={profileData.phoneNumber}
                                                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                    placeholder="+977 9866115177"
                                                />
                                            </div>
                                        </div>

                                        {/* Farm Information */}
                                        <div className="border-t pt-6">
                                            <h3 className="text-lg font-semibold mb-4">Farm Information</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="farmLocation">Farm Location</Label>
                                                    <Input
                                                        id="farmLocation"
                                                        value={profileData.farmLocation}
                                                        onChange={(e) => handleInputChange("farmLocation", e.target.value)}
                                                        placeholder="City, State"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="farmSize">Farm Size</Label>
                                                    <Select
                                                        value={profileData.farmSize}
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
                                                    value={profileData.experience}
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

                                        {/* Bio */}
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={profileData.bio}
                                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                                placeholder="Tell us about yourself and your farming experience..."
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
                                            <h3 className="text-lg font-semibold mb-4">Account Security</h3>
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
                                                        <p className="font-medium">Active Sessions</p>
                                                        <p className="text-sm text-slate-500">Manage your active login sessions</p>
                                                    </div>
                                                    <Button variant="outline">Manage</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="myPredictions">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        My Predictions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    History of My predictions
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    )
}