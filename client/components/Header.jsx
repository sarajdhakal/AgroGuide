"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Leaf, LogIn } from "lucide-react"

export default function Header({ activeSection, onScroll, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    { id: "home", path: "/", label: "Home" },
    { id: "about", path: "/about", label: "About" },
    { id: "how-it-works", path: "/how-it-works", label: "How It Works" },
    { id: "features", path: "/features", label: "Features" },
    { id: "predict", path: "/predict", label: "Predict" },
    { id: "contact", path: "/contact", label: "Contact Us" },
    { id: "profile", path: "/profile", label: "My Profile" }
  ]

  const handleNavigation = (item) => {
    setIsMenuOpen(false)

    // If we're on the home page, scroll to the section
    if (pathname === "/" && onScroll && item.id !== "contact" && item.id !== "profile") {
      onScroll(item.id)
    }
    // Otherwise navigate to the page
    else {
      if (item.id === "home") {
        router.push("/")
      } else {
        router.push(item.path)
      }
    }
  }

  // Determine if an item is active
  const isActive = (item) => {
    if (pathname === "/") {
      return activeSection === item.id
    } else {
      return pathname === item.path
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")} >
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


            <button
              onClick={() => router.push("/login")}
              className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 text-lg font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-emerald-400"

            >
              <LogIn className="w-5 h-5 mr-2" />Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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



              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  router.push("/login")
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md bg-emerald-500 hover:bg-emerald-600 text-white transition-colors mt-2"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
