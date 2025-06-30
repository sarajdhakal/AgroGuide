"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage
    const userToken = localStorage.getItem("userToken")
    const adminToken = localStorage.getItem("adminToken")
    const userData = localStorage.getItem("userData")
    const adminData = localStorage.getItem("adminData")

    if (userToken && userData) {
      setUser(JSON.parse(userData))
    } else if (adminToken && adminData) {
      setIsAdmin(true)
      setUser(JSON.parse(adminData))
    }

    setIsLoading(false)
  }, [])

  // 🔐 User login handler
  const userLogin = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", { email, password })
      const { token, user } = res.data

      const userData = {
        ...user,
        avatar: "/saraj.jpg",
        initials: (user.firstName[0] + user.lastName[0]).toUpperCase(),
      }

      localStorage.setItem("userToken", token)
      localStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)
      setIsAdmin(false)
      return { success: true, redirect: "/home" }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || "Login failed" }
    }
  }

  // 🔐 Admin login handler
  const adminLogin = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8000/api/admin/login", { email, password })
      const { token, admin } = res.data

      const adminData = {
        ...admin,
        avatar: "/saraj.jpg",
        initials: admin.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "AD",
      }

      localStorage.setItem("adminToken", token)
      localStorage.setItem("adminData", JSON.stringify(adminData))
      setUser(adminData)
      setIsAdmin(true)

      return { success: true, redirect: "/admin" }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || "Login failed" }
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

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isLoading,
      userLogin,
      adminLogin,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}
