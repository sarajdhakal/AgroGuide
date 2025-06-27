"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, LogOut, User, Settings, BarChart3, Bell, LogIn } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/AuthProvider" // or wherever your AuthProvider is located

export default function Header({ activeSection, onScroll, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { user, isLoading, logout } = useAuth()

  // Add debug logging
  console.log("Header - Auth state:", { user, isLoading })

  const navigationItems = [
    { id: "home", path: "/", label: "Home" },
    { id: "about", path: "/about", label: "About" },
    { id: "how-it-works", path: "/how-it-works", label: "How It Works" },
    { id: "features", path: "/features", label: "Features" },
    { id: "predict", path: "/predict", label: "Predict" },
    { id: "contact", path: "/contact", label: "Contact Us" },
  ]

  const handleNavigation = (item) => {
    setIsMenuOpen(false)

    if (pathname === "/" && onScroll && item.id !== "contact") {
      onScroll(item.id)
    } else {
      if (item.id === "home") {
        router.push("/")
      } else {
        router.push(item.path)
      }
    }
  }

  const handleProfileNavigation = (path) => {
    router.push(path)
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (item) => {
    if (pathname === "/") {
      return activeSection === item.id
    } else {
      return pathname === item.path
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    console.log("Header - Showing loading state")
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <img src="/logo.png" alt="AgroGuide Logo" className="h-[70px] w-auto" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`text-m font-medium transition-colors ${isActive(item) ? "text-emerald-400" : "text-gray-300 hover:text-white"
                    }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  console.log("Header - Rendering with user:", user ? "logged in" : "not logged in")

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/logo.png" alt="AgroGuide Logo" className="h-[70px] w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`text-m font-medium transition-colors ${isActive(item) ? "text-emerald-400" : "text-gray-300 hover:text-white"
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* Conditional Rendering: Profile Dropdown OR Login Button */}
            {user ? (
              // Show Profile Dropdown when logged in
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-slate-800 z-[55]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar className="h-10 w-10 border-2 border-emerald-500/50 hover:border-emerald-400 transition-colors">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-slate-800 border-slate-700 z-[60]" align="end" forceMount>
                  {user && (
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs leading-none text-gray-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  )}
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    onClick={() => handleProfileNavigation("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-gray-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    onClick={() => handleProfileNavigation("/predictions")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>My Predictions</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="text-red-400 hover:text-red-300 hover:bg-slate-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Show Login Button when not logged in
              <Button
                onClick={handleLogin}
                className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Profile Avatar OR Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full z-[55]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar className="h-8 w-8 border border-emerald-500/50">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-emerald-500 text-white text-xs">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 z-[60]" align="end">
                  {user && (
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs leading-none text-gray-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  )}
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="text-gray-300 hover:text-white hover:bg-slate-700"
                    onClick={() => handleProfileNavigation("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-gray-300 hover:text-white hover:bg-slate-700"
                    onClick={() => handleProfileNavigation("/predictions")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>My Predictions</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs rounded-full"
              >
                <LogIn className="w-3 h-3 mr-1" />
                Login
              </Button>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 rounded-lg mt-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item)
                    ? "text-emerald-400 bg-slate-700"
                    : "text-gray-300 hover:text-white hover:bg-slate-700"
                    }`}
                >
                  {item.label}
                </button>
              ))}

              {!user && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogin()
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md bg-emerald-500 hover:bg-emerald-600 text-white transition-colors mt-2"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
