"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaSearch, FaCalendarAlt, FaUser, FaTag } from "react-icons/fa"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// Mock blog data
const BLOG_POSTS = [
    {
        id: 1,
        slug: "sustainable-farming-practices",
        title: "Sustainable Farming Practices for Modern Agriculture",
        excerpt:
            "Learn about the latest sustainable farming practices that can help improve crop yield while protecting the environment.",
        content: "Full content here...",
        author: "John Doe",
        date: "2023-06-15",
        category: "Sustainable Farming",
        image: "/placeholder.svg?height=200&width=400",
        tags: ["sustainable", "farming", "environment"],
    },
    {
        id: 2,
        slug: "crop-rotation-benefits",
        title: "The Benefits of Crop Rotation in Modern Agriculture",
        excerpt: "Discover how crop rotation can improve soil health, reduce pests, and increase your farm's productivity.",
        content: "Full content here...",
        author: "Jane Smith",
        date: "2023-06-10",
        category: "Crop Management",
        image: "/placeholder.svg?height=200&width=400",
        tags: ["crop rotation", "soil health", "productivity"],
    },
    {
        id: 3,
        slug: "precision-agriculture-technology",
        title: "How Precision Agriculture Technology is Changing Farming",
        excerpt:
            "Explore the latest precision agriculture technologies and how they can help optimize your farming operations.",
        content: "Full content here...",
        author: "Michael Johnson",
        date: "2023-06-05",
        category: "Technology",
        image: "/placeholder.svg?height=200&width=400",
        tags: ["technology", "precision agriculture", "innovation"],
    },
    {
        id: 4,
        slug: "water-conservation-techniques",
        title: "Water Conservation Techniques for Sustainable Farming",
        excerpt:
            "Learn about effective water conservation techniques that can help you save water while maintaining crop yield.",
        content: "Full content here...",
        author: "Sarah Williams",
        date: "2023-05-28",
        category: "Water Management",
        image: "/placeholder.svg?height=200&width=400",
        tags: ["water conservation", "sustainability", "irrigation"],
    },
    {
        id: 5,
        slug: "organic-pest-control",
        title: "Organic Pest Control Methods for Healthier Crops",
        excerpt: "Discover organic pest control methods that can help you reduce chemical use while protecting your crops.",
        content: "Full content here...",
        author: "David Brown",
        date: "2023-05-20",
        category: "Pest Management",
        image: "/placeholder.svg?height=200&width=400",
        tags: ["organic", "pest control", "natural methods"],
    },
]

// Categories for filtering
const CATEGORIES = [
    "All Categories",
    "Sustainable Farming",
    "Crop Management",
    "Technology",
    "Water Management",
    "Pest Management",
]

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All Categories")
    const [filteredPosts, setFilteredPosts] = useState(BLOG_POSTS)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        // Filter posts based on search term and category
        const filtered = BLOG_POSTS.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

            const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory

            return matchesSearch && matchesCategory
        })

        setFilteredPosts(filtered)
    }, [searchTerm, selectedCategory])

    const handleSearch = (e) => {
        e.preventDefault()
        // Search is already handled by the useEffect
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Loading blog posts...</h1>
                        <div className="mt-8 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (

        <>
            <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
                <Header />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Agricultural Insights Blog</h1>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                            Stay updated with the latest farming techniques, crop management strategies, and agricultural innovations.
                        </p>
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row justify-between items-start gap-6">
                        {/* Sidebar with search and categories */}
                        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md">
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-green-500">
                                        <FaSearch />
                                    </button>
                                </div>
                            </form>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
                                <ul className="space-y-2">
                                    {CATEGORIES.map((category) => (
                                        <li key={category}>
                                            <button
                                                className={`block w-full text-left px-2 py-1 rounded-md ${selectedCategory === category
                                                    ? "bg-green-100 text-green-800 font-medium"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                {category}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Main content with blog posts */}
                        <div className="w-full md:w-3/4 space-y-8">
                            {filteredPosts.length === 0 ? (
                                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                    <p className="text-gray-500">No blog posts found matching your criteria.</p>
                                </div>
                            ) : (
                                filteredPosts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="bg-white overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                                    >
                                        <div className="md:flex">
                                            <div className="md:flex-shrink-0">
                                                <img
                                                    className="h-48 w-full object-cover md:h-full md:w-48"
                                                    src={post.image || "/placeholder.svg"}
                                                    alt={post.title}
                                                />
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                                    <span className="flex items-center">
                                                        <FaCalendarAlt className="mr-1" />
                                                        {post.date}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <FaUser className="mr-1" />
                                                        {post.author}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <FaTag className="mr-1" />
                                                        {post.category}
                                                    </span>
                                                </div>
                                                <Link href={`/blog/${post.slug}`} className="block mt-1">
                                                    <h2 className="text-xl font-semibold text-gray-900 hover:text-green-600">{post.title}</h2>
                                                </Link>
                                                <p className="mt-3 text-gray-600">{post.excerpt}</p>
                                                <div className="mt-4">
                                                    <Link href={`/blog/${post.slug}`} className="text-green-600 hover:text-green-800 font-medium">
                                                        Read more →
                                                    </Link>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {post.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
