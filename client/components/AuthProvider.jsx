"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)      // for regular users
  const [admin, setAdmin] = useState(null)    // for admins
  const [isAdmin, setIsAdmin] = useState(false)  // controls current view
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userToken = localStorage.getItem("userToken")
    const userData = localStorage.getItem("userData")
    const adminToken = localStorage.getItem("adminToken")
    const adminData = localStorage.getItem("adminData")

    if (userToken && userData) {
      setUser(JSON.parse(userData))
    } else {
      setUser(null)
    }

    if (adminToken && adminData) {
      setAdmin(JSON.parse(adminData))
    } else {
      setAdmin(null)
    }

    setIsLoading(false)
  }, [])

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

      return { success: true, redirect: "/" }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || "Login failed" }
    }
  }

  const adminLogin = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8000/api/admin/login", { email, password })
      const { token, admin } = res.data

      const adminData = {
        ...admin,
        avatar: "/saraj.jpg",
        initials: admin.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "AD",
      }

      localStorage.setItem("adminToken", token)
      localStorage.setItem("adminData", JSON.stringify(adminData))

      setAdmin(adminData)
      setIsAdmin(true)

      return { success: true, redirect: "/admin" }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || "Login failed" }
    }
  }

  const logoutUser = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userData")
    setUser(null)
    // only redirect if you're in the user app
    if (!isAdmin) router.push("/login")
  }

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    setAdmin(null)
    // only redirect if you're in the admin app
    if (isAdmin) router.push("/adminlogin")
  }

  const logout = () => {
    if (isAdmin) {
      logoutAdmin()
    } else {
      logoutUser()
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      isAdmin,
      isLoading,
      isAuthenticated: !!user || !!admin,
      userLogin,
      adminLogin,
      logoutUser,
      logoutAdmin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
