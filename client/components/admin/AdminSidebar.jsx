"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Wheat,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  CreditCard,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AdminSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin?tab=dashboard",
      gradient: "from-blue-500 to-blue-600",
      description: "Overview & Statistics",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/admin?tab=users",
      gradient: "from-purple-500 to-purple-600",
      description: "Manage User Accounts",
      subItems: [
        { id: "users-list", label: "All Users", path: "/admin?tab=users", icon: Users },
        { id: "users-add", label: "Add User", path: "/admin/users/add", icon: Sparkles },
      ],
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      icon: CreditCard,
      path: "/admin?tab=subscriptions",
      gradient: "from-green-500 to-emerald-600",
      description: "Payment & Billing",
      subItems: [
        { id: "subscriptions-list", label: "All Subscriptions", path: "/admin?tab=subscriptions", icon: CreditCard },
        {
          id: "subscriptions-analytics",
          label: "Revenue Analytics",
          path: "/admin?tab=subscriptions&view=analytics",
          icon: TrendingUp,
        },
      ],
    },
    {
      id: "crops",
      label: "Crops",
      icon: Wheat,
      path: "/admin?tab=crops",
      gradient: "from-amber-500 to-orange-600",
      description: "Crop Management",
      subItems: [
        { id: "crops-list", label: "All Crops", path: "/admin?tab=crops", icon: Wheat },
        { id: "crops-add", label: "Add Crop", path: "/admin/crops/add", icon: Sparkles },
      ],
    },
    {
      id: "cropsinsights",
      label: "Crops Insights",
      icon: TrendingUp,
      path: "/admin?tab=cropsinsights",
      gradient: "from-teal-500 to-cyan-600",
      description: "Agricultural Analytics",
      subItems: [
        { id: "crops-list-insights", label: "All Insights", path: "/admin?tab=cropsinsights", icon: TrendingUp },
        { id: "crops-insights-add", label: "Add Insights", path: "/admin/crops/add", icon: Sparkles },
      ],
    },
    {
      id: "predictions",
      label: "Predictions",
      icon: Brain,
      path: "/admin?tab=predictions",
      gradient: "from-pink-500 to-rose-600",
      description: "AI Predictions",
      subItems: [
        { id: "predictions-list", label: "All Predictions", path: "/admin?tab=predictions", icon: Brain },
        {
          id: "predictions-analytics",
          label: "Prediction Analytics",
          path: "/admin?tab=predictions&view=analytics",
          icon: TrendingUp,
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admin?tab=settings",
      gradient: "from-gray-500 to-slate-600",
      description: "System Configuration",
    },
  ]

  const handleNavigation = (item, subItem = null) => {
    if (subItem) {
      router.push(subItem.path)
      const tab = new URLSearchParams(subItem.path.split("?")[1]).get("tab")
      if (tab) setActiveTab(tab)
    } else {
      router.push(item.path)
      const tab = new URLSearchParams(item.path.split("?")[1]).get("tab")
      if (tab) setActiveTab(tab)
    }
  }

  const handleLogout = () => {
    router.push("/")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  const isActive = (itemId) => activeTab === itemId

  return (
    <>
      <TooltipProvider>
        <div
          className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-500 ease-in-out z-50 shadow-2xl ${sidebarOpen ? "w-72" : "w-16"
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            {sidebarOpen && (
              <div
                className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
                onClick={() => router.push("/admin")}
              >
                <div className="relative">
                  <img
                    src="/logo.png"
                    alt="AgroGuide Logo"
                    className="h-12 w-24 transition-all duration-300 group-hover:brightness-110"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    Admin Panel
                  </span>
                  <span className="text-xs text-slate-400">Management System</span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 hover:scale-110 rounded-full p-2"
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>

          {/* Navigation - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <nav className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 p-3">
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon

                  if (item.subItems && sidebarOpen) {
                    return (
                      <div key={item.id} className="space-y-1">
                        <Button
                          variant={isActive(item.id) ? "secondary" : "ghost"}
                          className={`w-full justify-start gap-3 h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${isActive(item.id)
                              ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl`
                              : "text-gray-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
                            }`}
                          onClick={() => handleNavigation(item)}
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          <div
                            className={`p-2 rounded-lg ${isActive(item.id) ? "bg-white/20" : "bg-slate-700/30"} transition-all duration-300`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-xs opacity-70">{item.description}</span>
                          </div>
                        </Button>
                        {isActive(item.id) && (
                          <div className="ml-4 space-y-1 animate-in slide-in-from-left-2 duration-300">
                            {item.subItems.map((subItem, subIndex) => {
                              const SubIcon = subItem.icon
                              return (
                                <Button
                                  key={subItem.id}
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-3 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/30 transition-all duration-200 hover:translate-x-1"
                                  onClick={() => handleNavigation(item, subItem)}
                                  style={{
                                    animationDelay: `${subIndex * 50}ms`,
                                  }}
                                >
                                  <SubIcon size={16} className="opacity-70" />
                                  <span className="text-sm">{subItem.label}</span>
                                </Button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  }

                  const menuButton = (
                    <Button
                      key={item.id}
                      variant={isActive(item.id) ? "secondary" : "ghost"}
                      className={`w-full justify-start gap-3 h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${isActive(item.id)
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl`
                          : "text-gray-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md"
                        } ${!sidebarOpen ? "px-3" : ""}`}
                      onClick={() => handleNavigation(item)}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div
                        className={`p-2 rounded-lg ${isActive(item.id) ? "bg-white/20" : "bg-slate-700/30"} transition-all duration-300`}
                      >
                        <Icon size={18} />
                      </div>
                      {sidebarOpen && (
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs opacity-70">{item.description}</span>
                        </div>
                      )}
                    </Button>
                  )

                  if (!sidebarOpen) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-800 border-slate-600">
                          <div className="flex flex-col">
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-slate-400">{item.description}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return menuButton
                })}
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-11 rounded-xl text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] ${!sidebarOpen ? "px-3" : ""
                    }`}
                  onClick={handleGoHome}
                >
                  <div className="p-2 rounded-lg bg-slate-700/30 transition-all duration-300">
                    <Home size={18} />
                  </div>
                  {sidebarOpen && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Back to Site</span>
                      <span className="text-xs opacity-70">Return to main site</span>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent side="right" className="bg-slate-800 border-slate-600">
                  <p>Back to Site</p>
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-11 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300 hover:scale-[1.02] ${!sidebarOpen ? "px-3" : ""
                    }`}
                  onClick={handleLogout}
                >
                  <div className="p-2 rounded-lg bg-red-900/20 transition-all duration-300">
                    <LogOut size={18} />
                  </div>
                  {sidebarOpen && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Logout</span>
                      <span className="text-xs opacity-70">Sign out of admin</span>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent side="right" className="bg-slate-800 border-slate-600">
                  <p>Logout</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          .scrollbar-thin {
            scrollbar-width: thin;
          }
          .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
            background-color: rgb(71 85 105);
            border-radius: 6px;
          }
          .scrollbar-track-slate-800::-webkit-scrollbar-track {
            background-color: rgb(30 41 59);
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
        `}</style>
      </TooltipProvider>

      {/* Main Content Spacer - This pushes content to the right of the sidebar */}
      <div className={`transition-all duration-500 ${sidebarOpen ? "ml-72" : "ml-16"}`}>
        {/* This div creates the proper spacing for the main content */}
      </div>
    </>
  )
}
