"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, User, FileText } from "lucide-react"
import axios from "axios"

export default function ViewUser() {
    const router = useRouter()
    const params = useParams()
    const userId = params.id

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/user/${userId}`)
                setUser(response.data)
            } catch (error) {
                console.error("Error fetching user:", error)
                setError("Failed to load user data")
            } finally {
                setLoading(false)
            }
        }

        if (userId) {
            fetchUser()
        }
    }, [userId])

    const getStatusBadge = (status) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>
            case "Inactive":
                return <Badge variant="secondary">Inactive</Badge>
            case "Suspended":
                return <Badge variant="destructive">Suspended</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (loading) {
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
                    activeTab="users"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="users" />
                    <main className="p-6">
                        <div className="p-4 text-red-600">{error}</div>
                    </main>
                </div>
            </div>
        )
    }

    if (!user) {
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
                        <div className="p-4">User not found</div>
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
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" onClick={() => router.push("/admin/users")} className="flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Users
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Profile</h1>
                                    <p className="text-slate-600 dark:text-slate-400">View user details</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => router.push(`/admin/users/edit/${userId}`)}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Edit className="w-4 h-4" />
                                Edit User
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* User Info Card */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                                            <p className="text-lg font-semibold">
                                                {user.firstName} {user.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Status</label>
                                            <div className="mt-1">{getStatusBadge(user.status)}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Email</label>
                                                <p className="text-gray-900">{user.email}</p>
                                            </div>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                                    <p className="text-gray-900">{user.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {user.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Address</label>
                                                <p className="text-gray-900">{user.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Member Since</label>
                                            <p className="text-gray-900">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {user.notes && (
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Notes</label>
                                                <p className="text-gray-900">{user.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Stats Card */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Role</span>
                                            <Badge variant="outline">{user.role || "User"}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Predictions</span>
                                            <span className="font-semibold">23</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Last Active</span>
                                            <span className="text-sm">Recently</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button variant="outline" className="w-full justify-start bg-transparent">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Send Email
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start bg-transparent">
                                            Reset Password
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start text-red-600 bg-transparent">
                                            Suspend Account
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
