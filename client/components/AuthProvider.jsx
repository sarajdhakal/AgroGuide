"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

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
    const adminData = localStorage.getItem("adminData")

    if (userToken && userData) {
      const parsedUserData = JSON.parse(userData)
      // Add avatar and initials for better Header integration
      setUser({
        ...parsedUserData,
        avatar: "/saraj.jpg",
        initials:
          parsedUserData.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "SD",
      })
    }

    if (adminToken && adminData) {
      const parsedAdminData = JSON.parse(adminData)
      setIsAdmin(true)
      // Set admin as user too for Header display
      setUser({
        ...parsedAdminData,
        avatar: "saraj.jpg",
        initials:
          parsedAdminData.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "A",
      })
    }

    setIsLoading(false)
  }, [])


  const userLogin = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      })

      const { token, user } = response.data

      const userData = {
        ...user,
        avatar: "/placeholder.svg?height=32&width=32", // Add default avatar
        initials:
          user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U",
      }

      localStorage.setItem("userToken", token)
      localStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)

      return { success: true, redirect: "/" }
    } catch (error) {
      if (error.response?.status === 401) {
        return { success: false, error: "Invalid email or password" }
      }
      return { success: false, error: "Login failed. Please try again." }
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
          avatar: "/placeholder.svg?height=32&width=32", // Add avatar
          initials: "AU", // Add initials
        }
        localStorage.setItem("adminToken", "admin-token-123")
        localStorage.setItem("adminData", JSON.stringify(adminData))
        setIsAdmin(true)
        setUser(adminData) // Set admin as user for Header display
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
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: "user",
        avatar: "/placeholder.svg?height=32&width=32",
        initials:
          userData.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U",
      }

      localStorage.setItem("userToken", `user-token-${Date.now()}`)
      localStorage.setItem("userData", JSON.stringify(newUser))
      setUser(newUser)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  }

  // Helper function to update user profile
  const updateProfile = (updatedData) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)

      if (isAdmin) {
        localStorage.setItem("adminData", JSON.stringify(updatedUser))
      } else {
        localStorage.setItem("userData", JSON.stringify(updatedUser))
      }
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
    updateProfile, // New function for updating profile
    isAuthenticated: !!user || isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
