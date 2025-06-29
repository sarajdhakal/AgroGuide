"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, Sparkles, User, BarChart3, LogOut, CreditCard, ChevronDown, Menu, X } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import axios from "axios"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [fullUserData, setFullUserData] = useState(null)
  const [isProUser, setIsProUser] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const navigationItems = [
    { id: "home", path: "/", label: "Home", isSection: true },
    { id: "about", path: "/about", label: "About", isSection: true },
    { id: "how-it-works", path: "/how-it-works", label: "How It Works", isSection: true },
    { id: "features", path: "/features", label: "Features", isSection: true },
    { id: "predict", path: "/predict", label: "Predict", isSection: true },
    { id: "contact", path: "/contact", label: "Contact Us", isSection: true },
  ]

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("")
      return
    }

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = ["home", "about", "how-it-works", "features", "predict", "contact"]
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    const heroSection = document.querySelector(".hero-section") || document.querySelector("main")
    if (heroSection && !heroSection.id) {
      heroSection.id = "home"
      observer.observe(heroSection)
    }

    return () => {
      observer.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (user?.id) {
        try {
          const res = await axios.get(`http://localhost:8000/api/user/${user.id}`)
          setFullUserData(res.data)

          // Check if user has active Pro subscription
          const hasActivePro = res.data?.subscription?.plan === "pro" && res.data?.subscription?.status === "active"
          setIsProUser(hasActivePro)

          console.log("✅ User subscription status:", hasActivePro ? "Pro" : "Free")
        } catch (error) {
          console.error("❌ Failed to fetch user subscription:", error)
        }
      }
    }

    fetchUserSubscription()
  }, [user])

  const handleGetPro = () => {
    router.push("/pricing")
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleProfileClick = () => {
    router.push("/profile")
    setIsDropdownOpen(false)
  }

  const handlePredictionsClick = () => {
    router.push("/predictions")
    setIsDropdownOpen(false)
  }

  const handleBillingClick = () => {
    router.push("/billing")
    setIsDropdownOpen(false)
  }

  // Enhanced navigation handler with smooth scrolling and scroll spy
  const handleNavClick = (path, itemId, isSection) => {
    setIsMobileMenuOpen(false)

    // If we're on the homepage and clicking a section link
    if (pathname === "/" && isSection) {
      const element = document.getElementById(itemId)
      if (element) {
        // Update active section immediately for better UX
        setActiveSection(itemId)

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        return
      }
    }

    // For other navigation items or if section not found, use router
    router.push(path)
  }

  const isActiveRoute = (path, itemId, isSection) => {
    // Special handling for homepage sections with scroll spy
    if (pathname === "/" && isSection) {
      return activeSection === itemId
    }

    // Regular route matching for non-section items
    if (path === "/") {
      return pathname === "/" && !isSection
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Made bigger */}
          <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
            <img src="/logo.png" alt="AgroGuide" className="h-16 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path, item.id, item.isSection)}
                className={`text-m font-medium transition-colors duration-200 relative ${isActiveRoute(item.path, item.id, item.isSection)
                  ? "text-emerald-400"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                {item.label}
                {/* Active indicator */}
                {isActiveRoute(item.path, item.id, item.isSection) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Right side - Auth & Pro Status */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Get Pro Button for Non-Pro Users */}
                {!isProUser && (
                  <Button
                    onClick={handleGetPro}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Pro
                  </Button>
                )}

                {/* User Profile Dropdown */}
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-3 hover:bg-slate-800 rounded-lg px-3 py-2 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={user.avatar || "/placeholder.svg?height=32&width=32"}
                          alt={user.firstName || user.email}
                          className="h-8 w-8 rounded-full border-2 border-gray-600 hover:border-emerald-400 transition-colors"
                        />

                        {/* Pro Badge on Avatar */}
                        {isProUser && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1 shadow-lg">
                            <Crown className="h-3 w-3 text-yellow-900" />
                          </div>
                        )}
                      </div>

                      {/* User Info with Pro Status */}
                      <div className="hidden lg:block text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">
                            {user.firstName || user.email?.split("@")[0]}
                          </span>
                          {isProUser && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1">
                              <Crown className="h-3 w-3 mr-1" />
                              PRO
                            </Badge>
                          )}
                        </div>
                        {isProUser && fullUserData?.subscription?.endDate && (
                          <p className="text-xs text-gray-400">
                            Pro until {new Date(fullUserData.subscription.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 bg-slate-800 border-slate-700" align="end">
                    {/* User Info Header */}
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">{user.firstName} {user.lastName}</span>
                          {isProUser && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold">
                              <Crown className="h-3 w-3 mr-1" />
                              PRO
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        {isProUser && fullUserData?.subscription?.endDate && (
                          <p className="text-xs text-emerald-400">
                            Pro until {new Date(fullUserData.subscription.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-slate-700" />

                    {/* Profile Menu Items */}
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handlePredictionsClick}
                      className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>My Predictions</span>
                    </DropdownMenuItem>

                    {/* Pro-specific menu items */}
                    {isProUser && (
                      <DropdownMenuItem
                        onClick={handleBillingClick}
                        className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing & Subscription</span>
                      </DropdownMenuItem>
                    )}

                    {/* Get Pro for non-Pro users */}
                    {!isProUser && (
                      <>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                          onClick={handleGetPro}
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 cursor-pointer"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          <span className="font-medium">Upgrade to Pro</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="bg-slate-700" />

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Login/Register buttons for non-authenticated users */
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => router.push("/login")}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-slate-800"
                >
                  Login
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/95 backdrop-blur-sm rounded-lg mt-2 border border-slate-700">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path, item.id, item.isSection)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActiveRoute(item.path, item.id, item.isSection)
                    ? "text-emerald-400 bg-emerald-900/20"
                    : "text-gray-300 hover:text-white hover:bg-slate-700"
                    }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-slate-700">
                {user ? (
                  <div className="space-y-2">
                    {/* User info */}
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={user.avatar || "/placeholder.svg?height=32&width=32"}
                            alt={user.name || user.email}
                            className="h-8 w-8 rounded-full border-2 border-gray-600"
                          />
                          {isProUser && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1">
                              <Crown className="h-3 w-3 text-yellow-900" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">
                              {user.name || user.email?.split("@")[0]}
                            </span>
                            {isProUser && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold">
                                PRO
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Get Pro button for mobile */}
                    {!isProUser && (
                      <button
                        onClick={handleGetPro}
                        className="w-full text-left px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 rounded-md text-sm font-medium"
                      >
                        <Sparkles className="inline mr-2 h-4 w-4" />
                        Upgrade to Pro
                      </button>
                    )}

                    {/* Mobile menu items */}
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md text-sm"
                    >
                      <User className="inline mr-2 h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={handlePredictionsClick}
                      className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md text-sm"
                    >
                      <BarChart3 className="inline mr-2 h-4 w-4" />
                      My Predictions
                    </button>
                    {isProUser && (
                      <button
                        onClick={handleBillingClick}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md text-sm"
                      >
                        <CreditCard className="inline mr-2 h-4 w-4" />
                        Billing & Subscription
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md text-sm"
                    >
                      <LogOut className="inline mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push("/login")
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        router.push("/register")
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
