"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, FileText, AlertCircle, CheckCircle, Upload } from 'lucide-react'
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function EditBlogPostPage() {
    const router = useRouter()
    const params = useParams()
    const postId = params.id
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        categories: "",
        featuredImage: "",
        isFeatured: false,
        status: "draft",
    })

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsFetching(true)
                // In a real app, fetch post data from API
                // const response = await axios.get(`/api/blog/${postId}`)
                // setFormData(response.data)

                // Mock data for demonstration
                setTimeout(() => {
                    setFormData({
                        title: "Maximizing Crop Yield with AI-Powered Predictions",
                        slug: "maximizing-crop-yield-with-ai",
                        excerpt: "Learn how artificial intelligence is revolutionizing farming by providing accurate crop yield predictions.",
                        content: `
              <p>Modern agriculture is undergoing a significant transformation with the integration of artificial intelligence (AI) technologies. These advanced systems are helping farmers make more informed decisions, optimize resource allocation, and ultimately increase their crop yields.</p>
              
              <h2>The Power of Predictive Analytics in Farming</h2>
              
              <p>Predictive analytics, powered by machine learning algorithms, can process vast amounts of data from various sources such as weather patterns, soil conditions, historical yield data, and satellite imagery. By analyzing these diverse datasets, AI systems can provide farmers with valuable insights and recommendations.</p>
              
              <p>Here are some key ways AI-powered predictions are helping farmers:</p>
              
              <ul>
                <li><strong>Optimized Planting Schedules:</strong> AI can determine the ideal planting times based on weather forecasts and soil conditions.</li>
                <li><strong>Resource Management:</strong> Precise recommendations for water, fertilizer, and pesticide usage, reducing waste and environmental impact.</li>
                <li><strong>Early Disease Detection:</strong> Identifying potential crop diseases before they spread, allowing for targeted interventions.</li>
                <li><strong>Yield Forecasting:</strong> Accurate predictions of harvest quantities, helping with logistics and market planning.</li>
              </ul>
              
              <h2>Real-World Success Stories</h2>
              
              <p>Farmers across the globe are already seeing the benefits of AI-powered agricultural solutions. For instance, corn farmers in the Midwest have reported yield increases of up to 15% after implementing AI-based prediction systems. Similarly, vineyard owners in California have reduced water usage by 20% while maintaining or improving grape quality.</p>
            `,
                        categories: "Technology, Farming, AI",
                        featuredImage: "/placeholder.svg?height=400&width=800",
                        isFeatured: true,
                        status: "published",
                    })
                    setIsFetching(false)
                }, 800)
            } catch (err) {
                setError("Failed to fetch post data")
                setIsFetching(false)
            }
        }

        fetchPost()
    }, [postId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            // Validate form
            if (!formData.title || !formData.content) {
                throw new Error("Title and content are required")
            }

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSuccess("Blog post updated successfully!")

            // Reset form after success
            setTimeout(() => {
                router.push("/admin/blog")
            }, 2000)
        } catch (err) {
            setError(err.message || "Failed to update blog post. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        setError("")
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <AdminSidebar
                    activeTab="blog"
                    setActiveTab={() => { }}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="blog" />
                    <main className="p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar
                activeTab="blog"
                setActiveTab={() => { }}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab="blog" />

                <main className="p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Blog Post</h1>
                                <p className="text-slate-600 dark:text-slate-400">Update blog post information</p>
                            </div>
                        </div>

                        {/* Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Blog Post Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <Alert className="bg-red-50 border-red-200 text-red-800">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    {success && (
                                        <Alert className="bg-green-50 border-green-200 text-green-800">
                                            <CheckCircle className="h-4 w-4" />
                                            <AlertDescription>{success}</AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Post Title *</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => handleInputChange("title", e.target.value)}
                                                placeholder="Enter blog post title"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="slug">URL Slug</Label>
                                            <Input
                                                id="slug"
                                                value={formData.slug}
                                                onChange={(e) => handleInputChange("slug", e.target.value)}
                                                placeholder="your-post-url-slug"
                                            />
                                            <p className="text-xs text-slate-500">
                                                The slug is the URL-friendly version of the title.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="excerpt">Excerpt *</Label>
                                            <Textarea
                                                id="excerpt"
                                                value={formData.excerpt}
                                                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                                                placeholder="Brief summary of the post (displayed in listings)"
                                                rows={2}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Content *</Label>
                                        <Textarea
                                            id="content"
                                            value={formData.content}
                                            onChange={(e) => handleInputChange("content", e.target.value)}
                                            placeholder="Write your blog post content here..."
                                            rows={12}
                                            required
                                        />
                                        <p className="text-xs text-slate-500">
                                            You can use HTML tags for formatting. In a real editor, this would be a rich text editor.
                                        </p>
                                    </div>

                                    {/* Categories */}
                                    <div className="space-y-2">
                                        <Label htmlFor="categories">Categories</Label>
                                        <Input
                                            id="categories"
                                            value={formData.categories}
                                            onChange={(e) => handleInputChange("categories", e.target.value)}
                                            placeholder="Technology, Farming, AI (comma separated)"
                                        />
                                    </div>

                                    {/* Featured Image */}
                                    <div className="space-y-4">
                                        <Label>Featured Image</Label>
                                        <div className="flex items-center gap-4">
                                            {formData.featuredImage ? (
                                                <div className="w-32 h-32 rounded-md border overflow-hidden">
                                                    <img
                                                        src={formData.featuredImage || "/placeholder.svg"}
                                                        alt="Featured"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 rounded-md border border-dashed flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                                    <span className="text-slate-400 text-sm">No image</span>
                                                </div>
                                            )}
                                            <Button type="button" variant="outline" className="flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                Change Image
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Publishing Options */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-semibold">Publishing Options</h3>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="isFeatured" className="text-base">Featured Post</Label>
                                                <p className="text-sm text-slate-500">Display this post prominently on the blog homepage</p>
                                            </div>
                                            <Switch
                                                id="isFeatured"
                                                checked={formData.isFeatured}
                                                onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <select
                                                id="status"
                                                value={formData.status}
                                                onChange={(e) => handleInputChange("status", e.target.value)}
                                                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-4 pt-6">
                                        <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                                            <Save className="w-4 h-4 mr-2" />
                                            {isLoading ? "Saving Changes..." : "Save Changes"}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => router.back()}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}