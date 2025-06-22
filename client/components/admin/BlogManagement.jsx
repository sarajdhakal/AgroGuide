"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, PenSquare, Download, Eye, Trash2 } from 'lucide-react'

export default function BlogManagement() {
    const router = useRouter()
    const [blogs, setBlogs] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBlogs = async () => {
            setLoading(true)
            // Mock data
            const mockBlogs = [
                {
                    id: 1,
                    title: "10 Tips for Sustainable Farming",
                    excerpt: "Learn how to implement sustainable practices in your farm...",
                    author: "John Farmer",
                    category: "sustainability",
                    status: "published",
                    publishDate: "2024-06-10",
                    readTime: "5 min",
                },
                {
                    id: 2,
                    title: "Understanding Soil Health",
                    excerpt: "The complete guide to maintaining optimal soil conditions...",
                    author: "Sarah Green",
                    category: "education",
                    status: "published",
                    publishDate: "2024-06-08",
                    readTime: "8 min",
                },
                {
                    id: 3,
                    title: "Future of AI in Agriculture",
                    excerpt: "How artificial intelligence is transforming farming...",
                    author: "Mike Johnson",
                    category: "technology",
                    status: "draft",
                    publishDate: null,
                    readTime: "12 min",
                },
            ]
            setBlogs(mockBlogs)
            setLoading(false)
        }
        loadBlogs()
    }, [])

    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterCategory === "all" || blog.category === filterCategory
        return matchesSearch && matchesFilter
    })

    const getCategoryBadge = (category) => {
        const colors = {
            sustainability: "bg-green-100 text-green-800",
            education: "bg-blue-100 text-blue-800",
            technology: "bg-purple-100 text-purple-800",
            news: "bg-yellow-100 text-yellow-800",
        }
        return <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>
    }

    const getStatusBadge = (status) => {
        const colors = {
            published: "bg-green-100 text-green-800",
            draft: "bg-yellow-100 text-yellow-800",
            archived: "bg-gray-100 text-gray-800",
        }
        return <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
    }

    const handleAddBlog = () => {
        router.push("/admin/blog/add")
    }

    const handleEditBlog = (id) => {
        router.push(`/admin/blog/edit/${id}`)
    }

    const handleViewBlog = (id) => {
        router.push(`/blog/${id}`)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filter: {filterCategory === "all" ? "All" : filterCategory}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterCategory("all")}>All Categories</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("sustainability")}>Sustainability</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("education")}>Education</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("technology")}>Technology</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("news")}>News</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Button onClick={handleAddBlog} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                        <PenSquare className="w-4 h-4" />
                        New Blog Post
                    </Button>
                </div>
            </div>

            {/* Blogs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Blog Posts ({filteredBlogs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Publish Date</TableHead>
                                <TableHead>Read Time</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBlogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-white">{blog.title}</div>
                                            <div className="text-sm text-slate-500 truncate max-w-xs">{blog.excerpt}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{blog.author}</TableCell>
                                    <TableCell>{getCategoryBadge(blog.category)}</TableCell>
                                    <TableCell>{getStatusBadge(blog.status)}</TableCell>
                                    <TableCell>{blog.publishDate || "—"}</TableCell>
                                    <TableCell>{blog.readTime}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditBlog(blog.id)} className="flex items-center gap-2">
                                                    <PenSquare className="w-4 h-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleViewBlog(blog.id)} className="flex items-center gap-2">
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Blog Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{blogs.length}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Posts</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {blogs.filter((b) => b.status === "published").length}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Published</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">{blogs.filter((b) => b.status === "draft").length}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Drafts</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {blogs.reduce((total, blog) => {
                                const readTime = parseInt(blog.readTime) || 0
                                return total + readTime
                            }, 0)}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Read Time (min)</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}