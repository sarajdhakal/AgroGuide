"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({ children }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("adminToken")
        if (!token) {
            router.push("/adminlogin")
        } else {
            setLoading(false)
        }
    }, [])

    if (loading) return null // Optional: replace with a loader

    return <>{children}</>
}
