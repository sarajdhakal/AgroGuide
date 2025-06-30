"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, Wheat, Brain, Settings, LogOut, ChevronLeft, ChevronRight, ChevronDown, Home, UserPlus, Plus, Clock, Eye } from 'lucide-react'

export default function AdminSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState({})
  const [hoveredItem, setHoveredItem] = useState(null)

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & Statistics",
      subItems: [],
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      description: "Manage User Accounts",
      subItems: [
        { id: "all-users", label: "All Users", icon: Users, path: "/admin?tab=users&view=all" },
        { id: "add-user", label: "Add New User", icon: UserPlus, path: "/admin/users/add" },
      ],
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      icon: CreditCard,
      description: "Payment & Billing",
      subItems: [],
    },
    {
      id: "crops",
      label: "Crops",
      icon: Wheat,
      description: "Crop Management",
      subItems: [
        { id: "all-crops", label: "All Crops", icon: Wheat, path: "/admin?tab=crops" },
        { id: "add-crop", label: "Add New Crops", icon: Plus, path: "/admin/crops/add" },
      ],
    },
    {
      id: "cropsinsights",
      label: "Crops Timelines",
      icon: Clock,
      description: "Timeline Management",
      subItems: [
        { id: "crops-list-insights", label: "All", icon: Eye, path: "/admin?tab=cropsinsights" },
        { id: "crops-insights-add", label: "Add", icon: Plus, path: "/admin/crops/add" },
      ],
    },
    {
      id: "predictions",
      label: "Predictions",
      icon: Brain,
      description: "AI Predictions",
      subItems: [],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "System Configuration",
      subItems: [],
    },
  ]

  const handleMenuClick = (itemId, hasSubItems = false, path = null) => {
    if (hasSubItems && sidebarOpen) {
      // Toggle expansion for items with sub-items
      setExpandedItems((prev) => ({
        ...prev,
        [itemId]: !prev[itemId],
      }))
    } else {
      // Navigate for items without sub-items or when sidebar is collapsed
      setActiveTab(itemId)
      if (path) {
        router.push(path)
      } else {
        router.push(`/admin?tab=${itemId}`)
      }
    }
  }

  const handleSubItemClick = (subItem, parentId) => {
    setActiveTab(parentId)
    router.push(subItem.path)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    router.push("/adminlogin")
  }

  const handleBackToSite = () => {
    router.push("/")
  }

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-slate-800 text-white transition-all duration-500 z-50 flex flex-col ${sidebarOpen ? "w-72" : "w-16"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {sidebarOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AG</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const isExpanded = expandedItems[item.id]
            const hasSubItems = item.subItems.length > 0

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => handleMenuClick(item.id, hasSubItems)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    } ${hoveredItem === item.id && sidebarOpen ? "transform scale-105" : ""}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                    {sidebarOpen && (
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                    )}
                  </div>
                  {sidebarOpen && hasSubItems && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "transform rotate-180" : ""
                        }`}
                    />
                  )}
                </button>

                {/* Sub Items */}
                {sidebarOpen && hasSubItems && isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem, item.id)}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 hover:transform hover:translate-x-2"
                        >
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <SubIcon className="w-4 h-4" />
                          <span className="text-sm">{subItem.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="space-y-2">
          <button
            onClick={handleBackToSite}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>Back to Site</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Sign out of admin</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
