"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Wheat,
  Settings,
  BarChart3,
  Brain,
  Leaf,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  PenSquare,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin?tab=dashboard",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/admin?tab=users",
      subItems: [
        { id: "users-list", label: "All Users", path: "/admin?tab=users" },
        { id: "users-add", label: "Add User", path: "/admin/users/add" },
      ],
    },
    {
      id: "crops",
      label: "Crops",
      icon: Wheat,
      path: "/admin?tab=crops",
      subItems: [
        { id: "crops-list", label: "All Crops", path: "/admin?tab=crops" },
        { id: "crops-add", label: "Add Crop", path: "/admin/crops/add" },
      ],
    },
    {
      id: "cropsinsights",
      label: "Crops Insights",
      icon: Wheat,
      path: "/admin?tab=cropsinsights",
      subItems: [
        { id: "crops-list-insights", label: "All Crops Insights", path: "/admin?tab=cropsinsights" },
        { id: "crops-insights-add", label: "Add Crop Insights", path: "/admin/crops/add" },
      ],
    },
    {
      id: "features",
      label: "Features",
      icon: Leaf,
      path: "/admin?tab=features",
      subItems: [
        { id: "features-list", label: "All Features", path: "/admin?tab=features" },
        { id: "features-add", label: "Add Feature", path: "/admin/features/add" },
      ],
    },
    {
      id: "blog",
      label: "Blog",
      icon: PenSquare,
      path: "/admin?tab=blog",
      subItems: [
        { id: "blog-list", label: "All Posts", path: "/admin?tab=blog", tab: "blog" },
        { id: "blog-add", label: "New Post", path: "/admin/blog/add" },
      ],
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: MessageSquare,
      path: "/admin?tab=contacts",
    },
    {
      id: "predictions",
      label: "Predictions",
      icon: Brain,
      path: "/admin?tab=predictions",
      subItems: [
        { id: "predictions-list", label: "All Predictions", path: "/admin?tab=predictions" },
        { id: "predictions-create", label: "Create Prediction", path: "/admin/predictions/create" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/admin?tab=analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admin?tab=settings",
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
    <TooltipProvider>
      <div
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${sidebarOpen ? "w-64" : "w-16"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {sidebarOpen && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/admin")}>
              <img src="/logo.png" alt="AgroGuide Logo" className="h-[70px] w-32" />

            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon

              if (item.subItems && sidebarOpen) {
                return (
                  <div key={item.id} className="space-y-1">
                    <Button
                      variant={isActive(item.id) ? "secondary" : "ghost"}
                      className={`w-full justify-start gap-3 ${isActive(item.id)
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "text-gray-300 hover:text-white hover:bg-slate-800"
                        }`}
                      onClick={() => handleNavigation(item)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Button>
                    {isActive(item.id) && (
                      <div className="ml-6 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Button
                            key={subItem.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-800"
                            onClick={() => handleNavigation(item, subItem)}
                          >
                            {subItem.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              const menuButton = (
                <Button
                  key={item.id}
                  variant={isActive(item.id) ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${isActive(item.id)
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "text-gray-300 hover:text-white hover:bg-slate-800"
                    } ${!sidebarOpen ? "px-2" : ""}`}
                  onClick={() => handleNavigation(item)}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Button>
              )

              if (!sidebarOpen) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return menuButton
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-slate-800 ${!sidebarOpen ? "px-2" : ""
                  }`}
                onClick={handleGoHome}
              >
                <Home size={20} />
                {sidebarOpen && <span>Back to Site</span>}
              </Button>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent side="right">
                <p>Back to Site</p>
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 ${!sidebarOpen ? "px-2" : ""
                  }`}
                onClick={handleLogout}
              >
                <LogOut size={20} />
                {sidebarOpen && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
