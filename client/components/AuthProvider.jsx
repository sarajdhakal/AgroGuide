"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication
    const userToken = localStorage.getItem("userToken")
    const adminToken = localStorage.getItem("adminToken")
    const userData = localStorage.getItem("userData")

    if (userToken && userData) {
      setUser(JSON.parse(userData))
    }

    if (adminToken) {
      setIsAdmin(true)
    }

    setIsLoading(false)
  }, [])

  const userLogin = async (email, password) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "user@agroguide.com" && password === "password") {
        const userData = {
          id: 1,
          email,
          name: "John Farmer",
          role: "user",
        }
        localStorage.setItem("userToken", "user-token-123")
        localStorage.setItem("userData", JSON.stringify(userData))
        setUser(userData)
        return { success: true, redirect: "/" }
      }

      return { success: false, error: "Invalid credentials" }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const adminLogin = async (email, password) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "admin@agroguide.com" && password === "admin123") {
        const adminData = {
          id: 1,
          email,
          name: "Admin User",
          role: "admin",
        }
        localStorage.setItem("adminToken", "admin-token-123")
        localStorage.setItem("adminData", JSON.stringify(adminData))
        setIsAdmin(true)
        return { success: true, redirect: "/admin" }
      }

      return { success: false, error: "Invalid admin credentials" }
    } catch (error) {
      return { success: false, error: "Admin login failed" }
    }
  }

  const logout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("adminToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("adminData")
    setUser(null)
    setIsAdmin(false)
  }

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful registration
      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  }

  const value = {
    user,
    isAdmin,
    isLoading,
    userLogin,
    adminLogin,
    logout,
    register,
    isAuthenticated: !!user || isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
