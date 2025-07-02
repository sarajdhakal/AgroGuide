"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, UserPlus, Download, Mail, Ban, Edit, Eye, Trash2 } from "lucide-react"
import axios from "axios"
import Link from "next/link"

export default function UsersManagement() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:8000/api/users")
        setUsers(response.data)
        setError("")
      } catch (error) {
        console.log("Error while fetching data", error)
        setError("Failed to fetch users data")
        // Fallback to mock data if API fails
        setUsers([
          {
            id: 1,
            firstName: "John",
            lastName: "Farmer",
            email: "john@farm.com",
            address: "Iowa, USA",
            status: "Active",
            lastActive: "2 hours ago",
          },
          {
            id: 2,
            firstName: "Sarah",
            lastName: "Green",
            email: "sarah@greenfields.com",
            address: "California, USA",
            status: "Active",
            lastActive: "1 day ago",
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

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

  const handleAddUser = () => {
    router.push("/admin/users/add")
  }

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/api/delete/user/${userId}`)
        setUsers((prev) => prev.filter((user) => user._id !== userId))
        alert("User deleted successfully")
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Failed to delete user")
      }
    }
  }

  const handleSuspendUser = async (userId) => {
    if (confirm("Are you sure you want to suspend this user?")) {
      try {
        await axios.put(`http://localhost:8000/api/update/user/${userId}`, {
          status: "Suspended",
        })
        setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, status: "Suspended" } : user)))
        alert("User suspended successfully")
      } catch (error) {
        console.error("Error suspending user:", error)
        alert("Failed to suspend user")
      }
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
          <p className="text-slate-600 dark:text-slate-400">"View, edit, or remove user accounts. Monitor registrations, user roles, and account statuses."</p>
        </div>

      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

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
                Filter: {filterStatus === "all" ? "All" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Users</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Inactive")}>Inactive</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Suspended")}>Suspended</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleAddUser} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Predictions</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user._id || user.id || index}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.address || user.location || "N/A"}</TableCell>
                  <TableCell>{user.joinDate || "2025/06/12"}</TableCell>
                  <TableCell>{getStatusBadge(user.status || "Active")}</TableCell>
                  <TableCell>{user.predictions || 23}</TableCell>
                  <TableCell>{user.lastActive || "Recently"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(user._id || user.id) && (
                          <>
                            <Link href={`/admin/users/view/${user._id || user.id}`}>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                View Profile
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/admin/users/edit/${user._id || user.id}`}>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Edit User
                              </DropdownMenuItem>
                            </Link>
                          </>
                        )}
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSuspendUser(user._id || user.id)}
                          className="flex items-center gap-2 text-orange-600"
                        >
                          <Ban className="w-4 h-4" />
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user._id || user.id)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "Active").length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter((u) => u.status === "Inactive").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Inactive Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.status === "Suspended").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Suspended Users</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
