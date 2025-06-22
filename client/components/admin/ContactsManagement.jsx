"use client"

import { useState, useEffect } from "react"
import { FaEnvelope, FaPhone, FaUser, FaSearch, FaEye, FaTrash, FaFilter } from "react-icons/fa"
import Link from "next/link"

// Mock contact data
const MOCK_CONTACTS = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        subject: "Question about crop prediction",
        message:
            "I would like to know more about how your crop prediction system works and if it can be used for organic farming.",
        status: "New",
        date: "2023-06-15T10:30:00Z",
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
    },
    {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "+1 (555) 456-7890",
        subject: "Partnership opportunity",
        message:
            "Our company is interested in partnering with you for an upcoming agricultural technology expo. Please contact me to discuss details.",
        status: "Pending",
        date: "2023-06-13T09:15:00Z",
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "+1 (555) 234-5678",
        subject: "Feature request",
        message: "I would love to see a mobile app version of your platform. Is this something you're planning to develop?",
        status: "New",
        date: "2023-06-12T16:20:00Z",
    },
    {
        id: 5,
        name: "Robert Wilson",
        email: "robert.w@example.com",
        phone: "+1 (555) 876-5432",
        subject: "Billing inquiry",
        message: "I noticed an unexpected charge on my account. Can you please review and explain this charge?",
        status: "Resolved",
        date: "2023-06-11T11:05:00Z",
    },
]

export default function ContactsManagement() {
    const [contacts, setContacts] = useState([])
    const [filteredContacts, setFilteredContacts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })

    useEffect(() => {
        // Simulate API call to fetch contacts
        const fetchContacts = async () => {
            setIsLoading(true)

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            setContacts(MOCK_CONTACTS)
            setFilteredContacts(MOCK_CONTACTS)
            setIsLoading(false)
        }

        fetchContacts()
    }, [])

    useEffect(() => {
        // Filter and sort contacts based on search term, status filter, and sort config
        let result = [...contacts]

        // Apply search filter
        if (searchTerm) {
            result = result.filter(
                (contact) =>
                    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.subject.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        // Apply status filter
        if (statusFilter !== "All") {
            result = result.filter((contact) => contact.status === statusFilter)
        }

        // Apply sorting
        result.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1
            }
            return 0
        })

        setFilteredContacts(result)
    }, [contacts, searchTerm, statusFilter, sortConfig])

    const handleSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            // In a real app, you would call an API to delete the contact
            setContacts(contacts.filter((contact) => contact.id !== id))
        }
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
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
                <p className="text-gray-600">Manage and respond to contact form submissions</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Filters and search */}
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-2">
                        <FaFilter className="text-gray-500" />
                        <select
                            className="border border-gray-300 rounded-md py-2 pl-2 pr-8 focus:ring-green-500 focus:border-green-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="New">New</option>
                            <option value="Replied">Replied</option>
                            <option value="Pending">Pending</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Contacts table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center">
                                        <span>Name</span>
                                        {sortConfig.key === "name" && (
                                            <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("subject")}
                                >
                                    <div className="flex items-center">
                                        <span>Subject</span>
                                        {sortConfig.key === "subject" && (
                                            <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("status")}
                                >
                                    <div className="flex items-center">
                                        <span>Status</span>
                                        {sortConfig.key === "status" && (
                                            <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("date")}
                                >
                                    <div className="flex items-center">
                                        <span>Date</span>
                                        {sortConfig.key === "date" && (
                                            <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredContacts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No contacts found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <FaUser className="text-gray-500" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <FaEnvelope className="mr-1 text-xs" /> {contact.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <FaPhone className="mr-1 text-xs" /> {contact.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{contact.subject}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {contact.message.substring(0, 60)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contact.status)}`}
                                            >
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(contact.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={`/admin/contacts/${contact.id}`} className="text-green-600 hover:text-green-900">
                                                    <FaEye className="text-lg" />
                                                </Link>
                                                <button onClick={() => handleDelete(contact.id)} className="text-red-600 hover:text-red-900">
                                                    <FaTrash className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
