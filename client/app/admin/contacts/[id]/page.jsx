"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { FaArrowLeft, FaEnvelope, FaPhone, FaUser, FaCalendarAlt, FaReply, FaTrash, FaCheck } from "react-icons/fa"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ArrowLeft, Save, User, Mail, MapPin, AlertCircle, CheckCircle } from 'lucide-react'

// Mock contact data
const MOCK_CONTACTS = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        subject: "Question about crop prediction",
        message:
            "I would like to know more about how your crop prediction system works and if it can be used for organic farming. I have a small organic farm and I'm interested in using technology to improve my yields while maintaining organic certification. Can your system account for organic farming practices? Also, what kind of data would I need to provide to get accurate predictions? Thank you for your help.",
        status: "New",
        date: "2023-06-15T10:30:00Z",
        replies: [],
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1 (555) 987-6543",
        subject: "Technical support needed",
        message: "I'm having trouble accessing my account. Can you please help me reset my password?",
        status: "Replied",
        date: "2023-06-14T14:45:00Z",
        replies: [
            {
                id: 1,
                from: "support@agritech.com",
                message:
                    "Hi Sarah, I've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password. Let me know if you need further assistance.",
                date: "2023-06-14T15:30:00Z",
            },
        ],
    },
    // Other contacts...
]

export default function ContactDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { id } = params
    const [sidebarOpen, setSidebarOpen] = useState(true)


    const [contact, setContact] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [replyText, setReplyText] = useState("")
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        // Simulate API call to fetch contact details
        const fetchContact = async () => {
            setIsLoading(true)

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const foundContact = MOCK_CONTACTS.find((c) => c.id === Number.parseInt(id))

            if (foundContact) {
                setContact(foundContact)
            } else {
                // Contact not found, redirect to contacts listing
                router.push("/admin/contacts")
            }

            setIsLoading(false)
        }

        fetchContact()
    }, [id, router])

    const handleReply = async (e) => {
        e.preventDefault()

        if (!replyText.trim()) return

        setIsSending(true)

        // Simulate API call to send reply
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Update contact with new reply
        const newReply = {
            id: contact.replies.length + 1,
            from: "support@agritech.com",
            message: replyText,
            date: new Date().toISOString(),
        }

        const updatedContact = {
            ...contact,
            status: "Replied",
            replies: [...contact.replies, newReply],
        }

        setContact(updatedContact)
        setReplyText("")
        setIsSending(false)
    }

    const handleMarkAsResolved = async () => {
        // Simulate API call to update status
        await new Promise((resolve) => setTimeout(resolve, 500))

        setContact({
            ...contact,
            status: "Resolved",
        })
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            // Simulate API call to delete contact
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Redirect to contacts listing
            router.push("/admin/contacts")
        }
    }

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "New":
                return "bg-blue-100 text-blue-800"
            case "Replied":
                return "bg-green-100 text-green-800"
            case "Pending":
                return "bg-yellow-100 text-yellow-800"
            case "Resolved":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }


    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader title="Contact Details" />
                    <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!contact) {
        return null // This should not happen as we redirect in the useEffect
    }

    return (
        <>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <AdminSidebar
                    activeTab="contacts"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="contacts" />

                    <main className="p-6">
                        <div className="max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contacts Messaege</h1>
                                    <p className="text-slate-600 dark:text-slate-400">Farmers Message</p>
                                </div>
                            </div>

                            {/* Form */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Message Information
                                    </CardTitle>
                                </CardHeader>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{contact.subject}</h1>
                                                <div className="flex items-center mb-4">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contact.status)}`}
                                                    >
                                                        {contact.status}
                                                    </span>
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        <FaCalendarAlt className="inline mr-1" />
                                                        {formatDate(contact.date)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                {contact.status !== "Resolved" && (
                                                    <button
                                                        onClick={handleMarkAsResolved}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    >
                                                        <FaCheck className="mr-1" />
                                                        Mark Resolved
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleDelete}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <FaTrash className="mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <div className="flex items-start mb-4">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <FaUser className="text-gray-500" />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <FaEnvelope className="mr-1 text-xs" /> {contact.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <FaPhone className="mr-1 text-xs" /> {contact.phone}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-md">
                                                <p className="text-gray-800 whitespace-pre-line">{contact.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reply history */}
                                {contact.replies.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                        <div className="p-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">Reply History</h2>

                                            <div className="space-y-4">
                                                {contact.replies.map((reply) => (
                                                    <div key={reply.id} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                                                <FaReply className="text-green-500" />
                                                            </div>
                                                            <div className="ml-3 flex-1">
                                                                <div className="flex justify-between">
                                                                    <div className="text-sm font-medium text-gray-900">{reply.from}</div>
                                                                    <div className="text-sm text-gray-500">{formatDate(reply.date)}</div>
                                                                </div>
                                                                <div className="mt-2 text-sm text-gray-800 bg-gray-50 p-3 rounded-md">{reply.message}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Reply form */}
                                {contact.status !== "Resolved" && (
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="p-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4">Reply to Contact</h2>

                                            <form onSubmit={handleReply}>
                                                <div className="mb-4">
                                                    <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Your Message
                                                    </label>
                                                    <textarea
                                                        id="reply"
                                                        rows="5"
                                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                        placeholder="Type your reply here..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        required
                                                    ></textarea>
                                                </div>

                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        disabled={isSending}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                    >
                                                        {isSending ? (
                                                            <>
                                                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaReply className="mr-2" />
                                                                Send Reply
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </main>
                </div>
            </div>


        </>
    )
}
