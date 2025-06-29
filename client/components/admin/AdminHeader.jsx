"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function AdminHeader({ activeTab }) {
  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard Overview",
      users: "User Management",
      subscriptions: "Subscription Management",
      crops: "Crop Management",
      cropsinsights: "Crops Insights Management",
      features: "Feature Management",
      blog: "Blog Management",
      contacts: "Contact Management",
      predictions: "Prediction Management",
      analytics: "Analytics & Reports",
      settings: "System Settings",
    }
    return titles[activeTab] || "Dashboard"
  }

  const getPageDescription = () => {
    const descriptions = {
      dashboard: "Monitor your AgroGuide platform performance",
      users: "Manage user accounts and permissions",
      subscriptions: "Handle user subscriptions and billing",
      crops: "Manage crop database and information",
      cropsinsights: "Manage crop timelines and insights",
      features: "Configure platform features",
      blog: "Create and manage blog content",
      contacts: "View and respond to user inquiries",
      predictions: "Monitor and manage AI predictions",
      analytics: "View detailed reports and analytics",
      settings: "Configure system settings",
    }
    return descriptions[activeTab] || "Manage your AgroGuide platform"
  }

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getPageTitle()}</h1>
          <p className="text-slate-600 dark:text-slate-400">{getPageDescription()}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block">Admin User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
