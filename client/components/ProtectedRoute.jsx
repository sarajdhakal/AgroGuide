"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // This would typically check localStorage, cookies, or make an API call
      const userToken = localStorage.getItem("userToken")
      const adminToken = localStorage.getItem("adminToken")

      if (requireAdmin) {
        if (!adminToken) {
          router.push("/login")
          return
        }
      } else {
        if (!userToken) {
          router.push("/login")
          return
        }
      }

      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requireAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}
