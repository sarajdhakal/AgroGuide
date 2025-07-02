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
import { useAuth } from "../AuthProvider"

export default function AdminHeader() {
  const { logoutAdmin } = useAuth()
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
    logoutAdmin()
  }



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
