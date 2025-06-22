"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"

// Mock blog data
const BLOG_POSTS = [
    {
        id: 1,
        slug: "sustainable-farming-practices",
        title: "Sustainable Farming Practices for Modern Agriculture",
        excerpt:
            "Learn about the latest sustainable farming practices that can help improve crop yield while protecting the environment.",
        content: `
      <p>Sustainable farming practices are becoming increasingly important in modern agriculture as we face challenges like climate change, soil degradation, and water scarcity. This article explores various sustainable farming methods that can help farmers maintain productivity while protecting natural resources.</p>
      
      <h2>What is Sustainable Farming?</h2>
      <p>Sustainable farming, also known as sustainable agriculture, is a farming approach that aims to meet society's present food and textile needs without compromising the ability of future generations to meet their own needs. It integrates three main objectives: environmental health, economic profitability, and social equity.</p>
      
      <h2>Key Sustainable Farming Practices</h2>
      
      <h3>1. Crop Rotation</h3>
      <p>Crop rotation involves changing the type of crops grown in a particular area according to a specific plan. This practice helps to improve soil health, optimize nutrients in the soil, and combat pest and weed pressure.</p>
      
      <h3>2. Cover Crops</h3>
      <p>Cover crops are planted to cover the soil rather than for harvest. They help prevent soil erosion, improve soil health, enhance water availability, smother weeds, control pests and diseases, and increase biodiversity.</p>
      
      <h3>3. Reduced Tillage</h3>
      <p>Reducing or eliminating tillage minimizes soil disturbance, which helps maintain soil structure, prevents erosion, and preserves beneficial soil organisms.</p>
      
      <h3>4. Integrated Pest Management (IPM)</h3>
      <p>IPM is an ecosystem-based strategy that focuses on long-term prevention of pests through a combination of techniques such as biological control, habitat manipulation, modification of cultural practices, and use of resistant varieties.</p>
      
      <h2>Benefits of Sustainable Farming</h2>
      <ul>
        <li>Conserves and improves soil health</li>
        <li>Reduces water usage and pollution</li>
        <li>Minimizes air pollution and greenhouse gas emissions</li>
        <li>Promotes biodiversity</li>
        <li>Reduces dependency on non-renewable energy sources</li>
        <li>Creates more resilient farming systems</li>
      </ul>
      
      <h2>Challenges and Solutions</h2>
      <p>While sustainable farming offers numerous benefits, it also comes with challenges such as initial costs, knowledge gaps, and market access. However, these challenges can be addressed through education, government support, and consumer awareness.</p>
      
      <h2>Conclusion</h2>
      <p>Adopting sustainable farming practices is not just beneficial for the environment but also for the long-term viability of farming operations. By implementing these practices, farmers can ensure that their land remains productive for generations to come while contributing to a healthier planet.</p>
    `,
        author: "John Doe",
        authorBio:
            "John Doe is an agricultural scientist with over 15 years of experience in sustainable farming practices. He has worked with farmers across the country to implement eco-friendly farming methods.",
        authorImage: "/placeholder.svg?height=100&width=100",
        date: "June 15, 2023",
        category: "Sustainable Farming",
        image: "/placeholder.svg?height=400&width=800",
        tags: ["sustainable", "farming", "environment"],
    },
    {
        id: 2,
        slug: "crop-rotation-benefits",
        title: "The Benefits of Crop Rotation in Modern Agriculture",
        excerpt: "Discover how crop rotation can improve soil health, reduce pests, and increase your farm's productivity.",
        content: "Full content here...",
        author: "Jane Smith",
        authorBio: "Jane Smith is an agricultural consultant specializing in crop management strategies.",
        authorImage: "/placeholder.svg?height=100&width=100",
        date: "June 10, 2023",
        category: "Crop Management",
        image: "/placeholder.svg?height=400&width=800",
        tags: ["crop rotation", "soil health", "productivity"],
    },
    // Other blog posts...
]

// Related posts function
const getRelatedPosts = (currentSlug, category, limit = 3) => {
    return BLOG_POSTS.filter((post) => post.slug !== currentSlug && post.category === category).slice(0, limit)
}

export default function BlogPostPage() {
    const params = useParams()
    const router = useRouter()
    const { slug } = params

    const [post, setPost] = useState(null)
    const [relatedPosts, setRelatedPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call to fetch blog post
        const fetchPost = () => {
            setIsLoading(true)

            setTimeout(() => {
                const foundPost = BLOG_POSTS.find((p) => p.slug === slug)

                if (foundPost) {
                    setPost(foundPost)
                    setRelatedPosts(getRelatedPosts(slug, foundPost.category))
                } else {
                    // Post not found, redirect to blog listing
                    router.push("/blog")
                }

                setIsLoading(false)
            }, 1000)
        }

        fetchPost()
    }, [slug, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Loading article...</h1>
                        <div className="mt-8 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!post) {
        return null // This should not happen as we redirect in the useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link href="/blog" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6">
                    <FaArrowLeft className="mr-2" />
                    Back to all articles
                </Link>

                {/* Article header */}
                <article>
                    <header className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">{post.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
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

                        <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-md"
                        />
                    </header>

                    {/* Article content */}
                    <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                    {/* Tags */}
                    <div className="mt-8 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Social sharing */}
                    <div className="mt-8 border-t border-b border-gray-200 py-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Share this article</h3>
                        <div className="flex space-x-4">
                            <button className="text-blue-600 hover:text-blue-800">
                                <FaFacebook size={24} />
                            </button>
                            <button className="text-blue-400 hover:text-blue-600">
                                <FaTwitter size={24} />
                            </button>
                            <button className="text-blue-700 hover:text-blue-900">
                                <FaLinkedin size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Author bio */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <img
                                src={post.authorImage || "/placeholder.svg"}
                                alt={post.author}
                                className="h-16 w-16 rounded-full mr-4"
                            />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{post.author}</h3>
                                <p className="text-gray-600">{post.authorBio}</p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related articles */}
                {relatedPosts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <div
                                    key={relatedPost.id}
                                    className="bg-white overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                                >
                                    <img
                                        className="h-48 w-full object-cover"
                                        src={relatedPost.image || "/placeholder.svg"}
                                        alt={relatedPost.title}
                                    />
                                    <div className="p-4">
                                        <Link href={`/blog/${relatedPost.slug}`} className="block mt-1">
                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600">{relatedPost.title}</h3>
                                        </Link>
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                                        <div className="mt-3">
                                            <Link
                                                href={`/blog/${relatedPost.slug}`}
                                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                                            >
                                                Read more →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
