"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Search,
    Filter,
    MoreHorizontal,
    CreditCard,
    Download,
    Eye,
    Edit,
    Ban,
    CheckCircle,
    Crown,
    DollarSign,
    TrendingUp,
    Users,
    AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

export default function SubscriptionsManagement() {
    const router = useRouter()
    const { toast } = useToast()
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterPlan, setFilterPlan] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedUser, setSelectedUser] = useState(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true)
                const response = await axios.get("http://localhost:8000/api/users")
                setUsers(response.data)
                setError("")

                toast({
                    title: "Users Loaded Successfully",
                    description: `Loaded ${response.data.length} users with subscription data`,
                    variant: "success",
                })
            } catch (error) {
                console.error("Error loading users:", error)
                setError("Failed to fetch users data")

                toast({
                    title: "Error Loading Users",
                    description: "Failed to fetch users data from server",
                    variant: "destructive",
                })

                // Mock data with subscription info
                setUsers([
                    {
                        _id: "1",
                        firstName: "John",
                        lastName: "Farmer",
                        email: "john@farm.com",
                        subscription: {
                            plan: "pro",
                            status: "active",
                            startDate: "2024-01-15T00:00:00Z",
                            endDate: "2025-01-15T00:00:00Z",
                            billingCycle: "yearly",
                            amount: 39000,
                            paymentMethod: "esewa",
                        },
                        paymentHistory: [{ date: "2024-01-15", amount: 39000, status: "completed", method: "esewa" }],
                    },
                ])
            } finally {
                setLoading(false)
            }
        }
        loadUsers()
    }, [])

    const filteredUsers = users.filter((user) => {
        const userName = `${user.firstName} ${user.lastName}`.toLowerCase()
        const matchesSearch =
            userName.includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase())

        const userPlan = user.subscription?.plan || "free"
        const userStatus = user.subscription?.status || "inactive"

        const matchesPlan = filterPlan === "all" || userPlan === filterPlan
        const matchesStatus = filterStatus === "all" || userStatus === filterStatus

        return matchesSearch && matchesPlan && matchesStatus
    })

    const getSubscriptionBadge = (subscription) => {
        if (!subscription || subscription.plan === "free") {
            return <Badge variant="outline">Free</Badge>
        }

        const colors = {
            pro: "bg-emerald-100 text-emerald-800",
            enterprise: "bg-purple-100 text-purple-800",
        }

        return (
            <Badge className={colors[subscription.plan] || "bg-gray-100 text-gray-800"}>
                <Crown className="w-3 h-3 mr-1" />
                {subscription.plan.toUpperCase()}
            </Badge>
        )
    }

    const getStatusBadge = (status) => {
        const colors = {
            active: "bg-green-100 text-green-800",
            expired: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
            pending: "bg-yellow-100 text-yellow-800",
        }
        return <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
    }

    const handleViewSubscription = (user) => {
        setSelectedUser(user)
        setIsViewModalOpen(true)
    }

    const handleEditSubscription = (user) => {
        setSelectedUser(user)
        setIsEditModalOpen(true)
    }

    const handleUpdateSubscription = async (userId, updatedData) => {
        try {
            await axios.put(`http://localhost:8000/api/update/user/${userId}`, {
                subscription: updatedData,
            })

            // Update local state
            setUsers((prev) =>
                prev.map((user) =>
                    user._id === userId ? { ...user, subscription: { ...user.subscription, ...updatedData } } : user,
                ),
            )

            setIsEditModalOpen(false)
            setSelectedUser(null)

            toast({
                title: "Subscription Updated Successfully",
                description: "User subscription has been successfully updated with new information",
                variant: "success",
            })
        } catch (error) {
            console.error("Error updating subscription:", error)
            toast({
                title: "Update Failed",
                description: "Failed to update subscription. Please try again.",
                variant: "destructive",
            })
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatCurrency = (amount) => {
        return `NPR ${amount?.toLocaleString() || 0}`
    }

    const calculateRevenue = () => {
        return users.reduce((total, user) => {
            if (user.subscription?.status === "active" && user.subscription?.amount) {
                return total + user.subscription.amount
            }
            return total
        }, 0)
    }

    const getSubscriptionStats = () => {
        const stats = {
            total: users.length,
            free: users.filter((u) => !u.subscription || u.subscription.plan === "free").length,
            pro: users.filter((u) => u.subscription?.plan === "pro").length,
            enterprise: users.filter((u) => u.subscription?.plan === "enterprise").length,
            active: users.filter((u) => u.subscription?.status === "active").length,
            revenue: calculateRevenue(),
        }
        return stats
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    const stats = getSubscriptionStats()

    return (
        <div className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Total Users</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Active Subs</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-emerald-600" />
                            <div>
                                <div className="text-2xl font-bold text-emerald-600">{stats.pro}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Pro Users</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <div>
                                <div className="text-2xl font-bold text-purple-600">{stats.enterprise}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Enterprise</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-yellow-600" />
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.revenue)}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                <Filter className="w-4 h-4" />
                                Plan: {filterPlan === "all" ? "All" : filterPlan}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterPlan("all")}>All Plans</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterPlan("free")}>Free</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterPlan("pro")}>Pro</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterPlan("enterprise")}>Enterprise</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                <Filter className="w-4 h-4" />
                                Status: {filterStatus === "all" ? "All" : filterStatus}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("expired")}>Expired</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>Cancelled</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Download className="w-4 h-4" />
                        Export Revenue Report
                    </Button>
                </div>
            </div>

            {/* Subscriptions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>User Subscriptions ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Billing Cycle</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => {
                                const subscription = user.subscription || {}
                                return (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-white">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-sm text-slate-500">{user.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getSubscriptionBadge(subscription)}</TableCell>
                                        <TableCell>{getStatusBadge(subscription.status || "inactive")}</TableCell>
                                        <TableCell className="capitalize">{subscription.billingCycle || "N/A"}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(subscription.amount)}</TableCell>
                                        <TableCell>{subscription.startDate ? formatDate(subscription.startDate) : "N/A"}</TableCell>
                                        <TableCell>
                                            {subscription.endDate ? (
                                                <div className={`${new Date(subscription.endDate) < new Date() ? "text-red-600" : ""}`}>
                                                    {formatDate(subscription.endDate)}
                                                    {new Date(subscription.endDate) < new Date() && (
                                                        <AlertTriangle className="w-4 h-4 inline ml-1" />
                                                    )}
                                                </div>
                                            ) : (
                                                "N/A"
                                            )}
                                        </TableCell>
                                        <TableCell className="capitalize">{subscription.paymentMethod || "N/A"}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleViewSubscription(user)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditSubscription(user)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit Subscription
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4" />
                                                        Payment History
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                                        <Ban className="w-4 h-4" />
                                                        Cancel Subscription
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View Subscription Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Subscription Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && <SubscriptionDetailsView user={selectedUser} />}
                </DialogContent>
            </Dialog>

            {/* Edit Subscription Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Subscription</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <EditSubscriptionForm
                            user={selectedUser}
                            onSave={(updatedData) => handleUpdateSubscription(selectedUser._id, updatedData)}
                            onCancel={() => setIsEditModalOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Subscription Details View Component
function SubscriptionDetailsView({ user }) {
    const subscription = user.subscription || {}
    const paymentHistory = user.paymentHistory || []

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatCurrency = (amount) => {
        return `NPR ${amount?.toLocaleString() || 0}`
    }

    return (
        <div className="space-y-6">
            {/* User Info */}
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Name</Label>
                            <p className="font-medium">
                                {user.firstName} {user.lastName}
                            </p>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <Label>Join Date</Label>
                            <p>{user.createdAt ? formatDate(user.createdAt) : "N/A"}</p>
                        </div>
                        <div>
                            <Label>User Status</Label>
                            <Badge className="bg-green-100 text-green-800">{user.status || "Active"}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Plan</Label>
                            <div className="mt-1">
                                {subscription.plan ? (
                                    <Badge className="bg-emerald-100 text-emerald-800">
                                        <Crown className="w-3 h-3 mr-1" />
                                        {subscription.plan.toUpperCase()}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Free</Badge>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <div className="mt-1">
                                <Badge
                                    className={
                                        subscription.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : subscription.status === "expired"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                    }
                                >
                                    {subscription.status || "Inactive"}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <Label>Billing Cycle</Label>
                            <p className="capitalize">{subscription.billingCycle || "N/A"}</p>
                        </div>
                        <div>
                            <Label>Amount</Label>
                            <p className="font-medium text-emerald-600">{formatCurrency(subscription.amount)}</p>
                        </div>
                        <div>
                            <Label>Start Date</Label>
                            <p>{subscription.startDate ? formatDate(subscription.startDate) : "N/A"}</p>
                        </div>
                        <div>
                            <Label>End Date</Label>
                            <p className={new Date(subscription.endDate) < new Date() ? "text-red-600" : ""}>
                                {subscription.endDate ? formatDate(subscription.endDate) : "N/A"}
                            </p>
                        </div>
                        <div>
                            <Label>Payment Method</Label>
                            <p className="capitalize">{subscription.paymentMethod || "N/A"}</p>
                        </div>
                        <div>
                            <Label>Auto Renewal</Label>
                            <Badge variant={subscription.autoRenewal ? "default" : "outline"}>
                                {subscription.autoRenewal ? "Enabled" : "Disabled"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    {paymentHistory.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentHistory.map((payment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{formatDate(payment.date)}</TableCell>
                                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                        <TableCell className="capitalize">{payment.method}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    payment.status === "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : payment.status === "failed"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                }
                                            >
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{payment.transactionId || "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No payment history available</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Enhanced Edit Subscription Form Component with Validation and Auto Date Selection
function EditSubscriptionForm({ user, onSave, onCancel }) {
    const subscription = user.subscription || {}
    const [formData, setFormData] = useState({
        plan: subscription.plan || "free",
        status: subscription.status || "inactive",
        billingCycle: subscription.billingCycle || "monthly",
        amount: subscription.amount || 0,
        startDate: subscription.startDate ? subscription.startDate.split("T")[0] : "",
        endDate: subscription.endDate ? subscription.endDate.split("T")[0] : "",
        paymentMethod: subscription.paymentMethod || "free",
        autoRenewal: subscription.autoRenewal || false,
    })

    const [errors, setErrors] = useState({})

    // Auto-set dates when billing cycle changes to monthly
    useEffect(() => {
        if (formData.billingCycle === "monthly" && !formData.startDate) {
            const today = new Date()
            const oneMonthLater = new Date(today)
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

            setFormData((prev) => ({
                ...prev,
                startDate: today.toISOString().split("T")[0],
                endDate: oneMonthLater.toISOString().split("T")[0],
            }))
        }
        else if (formData.billingCycle === "yearly" && !formData.startDate) {
            const today = new Date()
            const oneYearLater = new Date(today)
            oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

            setFormData((prev) => ({
                ...prev,
                startDate: today.toISOString().split("T")[0],
                endDate: oneYearLater.toISOString().split("T")[0],
            }))
        }
    }, [formData.billingCycle])

    // Update payment method when plan changes
    useEffect(() => {
        if (formData.plan === "free") {
            setFormData((prev) => ({ ...prev, paymentMethod: "free", amount: 0 }))
        } else if (formData.paymentMethod === "free" && formData.plan !== "free") {
            setFormData((prev) => ({ ...prev, paymentMethod: "esewa" }))
        }
    }, [formData.plan])

    const validateForm = () => {
        const newErrors = {}

        // Required field validations
        if (!formData.plan.trim()) newErrors.plan = "Plan is required"
        if (!formData.status.trim()) newErrors.status = "Status is required"

        // Date validations
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate)
            const endDate = new Date(formData.endDate)

            if (endDate <= startDate) {
                newErrors.endDate = "End date must be after start date"
            }
        }

        if (formData.status === "active") {
            if (!formData.startDate) newErrors.startDate = "Start date is required for active subscriptions"
            if (!formData.endDate) newErrors.endDate = "End date is required for active subscriptions"
        }

        // Amount validation
        if (formData.plan !== "free" && (!formData.amount || formData.amount <= 0)) {
            newErrors.amount = "Amount must be greater than 0 for paid plans"
        }

        // Payment method validation
        if (formData.plan === "free" && formData.paymentMethod !== "free") {
            newErrors.paymentMethod = "Free plan must have 'free' payment method"
        }

        if (formData.plan !== "free" && formData.paymentMethod === "free") {
            newErrors.paymentMethod = "Paid plans cannot have 'free' payment method"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const updatedData = {
            ...formData,
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            amount: Number.parseInt(formData.amount),
        }

        onSave(updatedData)
    }

    const handleBillingCycleChange = (value) => {
        setFormData((prev) => ({ ...prev, billingCycle: value }))

        // Auto-set dates for monthly billing
        if (value === "monthly") {
            const today = new Date()
            const oneMonthLater = new Date(today)
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

            setFormData((prev) => ({
                ...prev,
                startDate: today.toISOString().split("T")[0],
                endDate: oneMonthLater.toISOString().split("T")[0],
            }))
        }
        else if (value === "yearly") {
            const today = new Date()
            const oneYearLater = new Date(today)
            oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

            setFormData((prev) => ({
                ...prev,
                startDate: today.toISOString().split("T")[0],
                endDate: oneYearLater.toISOString().split("T")[0],
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="plan">Plan *</Label>
                    <select
                        id="plan"
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className={`w-full p-2 border rounded-md ${errors.plan ? "border-red-500" : ""}`}
                    >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                    {errors.plan && <p className="text-red-500 text-sm mt-1">{errors.plan}</p>}
                </div>
                <div>
                    <Label htmlFor="status">Status *</Label>
                    <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={`w-full p-2 border rounded-md ${errors.status ? "border-red-500" : ""}`}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="billingCycle">Billing Cycle</Label>
                    <select
                        id="billingCycle"
                        value={formData.billingCycle}
                        onChange={(e) => handleBillingCycleChange(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        disabled={formData.plan === "free"}
                    >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    {formData.billingCycle === "monthly" && (
                        <p className="text-blue-600 text-sm mt-1">Dates automatically set to today and 1 month later</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="amount">Amount (NPR)</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        disabled={formData.plan === "free"}
                        className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="startDate">Start Date {formData.status === "active" && "*"}</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className={errors.startDate ? "border-red-500" : ""}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>
                <div>
                    <Label htmlFor="endDate">End Date {formData.status === "active" && "*"}</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className={errors.endDate ? "border-red-500" : ""}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
            </div>

            <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className={`w-full p-2 border rounded-md ${errors.paymentMethod ? "border-red-500" : ""}`}
                >
                    <option value="free">Free</option>
                    <option value="esewa">eSewa</option>
                    <option value="khalti">Khalti</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                </select>
                {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
                {formData.plan === "free" && (
                    <p className="text-blue-600 text-sm mt-1">Free plan automatically uses 'free' payment method</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="autoRenewal"
                    checked={formData.autoRenewal}
                    onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
                    disabled={formData.plan === "free"}
                />
                <Label htmlFor="autoRenewal">Enable Auto Renewal</Label>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
