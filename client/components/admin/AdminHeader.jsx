"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, User, Settings, LogOut, Mail, Shield, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function AdminHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@agriprediction.com",
    role: "Super Administrator",
    avatar: null,
    lastLogin: new Date().toLocaleString(),
    initials: "AU",
  })

  useEffect(() => {
    // Load admin profile from localStorage or API
    const savedProfile = localStorage.getItem("adminData")
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile)
        setAdminProfile((prev) => ({
          ...prev,
          name: profile.name || prev.name,
          email: profile.email || prev.email,
          role: profile.role || prev.role,
          avatar: profile.avatar || prev.avatar,
          initials: getInitials(profile.name || prev.name),
        }))
      } catch (error) {
        console.error("Error parsing admin profile:", error)
      }
    }
  }, [])

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    router.push("/adminlogin")
  }

  const notifications = [
    {
      id: 1,
      title: "New subscription",
      message: "John Doe upgraded to Pro plan",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment received",
      message: "NPR 1,000 from Jane Smith",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: 3,
      title: "New prediction request",
      message: "Ram Sharma requested crop prediction",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 4,
      title: "System update",
      message: "Database backup completed successfully",
      time: "1 hour ago",
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users, predictions, analytics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">{notification.title}</p>
                          {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-800">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 h-auto">
                {adminProfile.avatar ? (
                  <img
                    src={adminProfile.avatar || "/placeholder.svg"}
                    alt={adminProfile.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{adminProfile.initials}</span>
                  </div>
                )}
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{adminProfile.name}</div>
                  <div className="text-xs text-gray-500">{adminProfile.role}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {/* Profile Header */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  {adminProfile.avatar ? (
                    <img
                      src={adminProfile.avatar || "/placeholder.svg"}
                      alt={adminProfile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-lg">{adminProfile.initials}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{adminProfile.name}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {adminProfile.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Shield className="w-3 h-3 mr-1" />
                      {adminProfile.role}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Last login: {adminProfile.lastLogin}
                </div>
              </div>

              {/* Menu Items */}
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
