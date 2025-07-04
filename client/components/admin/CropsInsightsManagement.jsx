"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Plus, Download, Edit, Trash2, Eye } from "lucide-react"
import axios from "axios"
import Link from "next/link"

export default function CropsInsightsManagement() {
    const router = useRouter()
    const [timelines, setTimelines] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [crops, setCrops] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [cropRes, timelineRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/crops"),
                    axios.get("http://localhost:8000/api/timelines"),
                ])
                setCrops(cropRes.data)
                setTimelines(timelineRes.data)
            } catch (err) {
                console.error("Error loading timelines or crops:", err)
                // Fallback data
                setCrops([
                    {
                        _id: "1",
                        cropName: "Rice",
                        scientificName: "Oryza sativa",
                        category: "Cereal",
                        season: "Kharif",
                        growthPeriod: "120-150 days",
                    },
                ])
                setTimelines([
                    {
                        _id: "1",
                        scientificName: "Oryza sativa",
                        tasks: [
                            { day: 1, title: "Land preparation" },
                            { day: 15, title: "Sowing" },
                            { day: 30, title: "First weeding" },
                        ],
                    },
                ])
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    const getCategoryBadge = (category) => {
        const colors = {
            Cereal: "bg-blue-100 text-blue-800",
            Legume: "bg-green-100 text-green-800",
            Vegetable: "bg-orange-100 text-orange-800",
            Fruit: "bg-red-100 text-red-800",
        }
        return <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>
    }

    const filteredTimelines = timelines.filter((timeline) => {
        const crop = crops.find((c) => c.scientificName === timeline.scientificName)
        const cropName = crop?.cropName || ""
        const matchesSearch =
            cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            timeline.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterCategory === "all" || crop?.category === filterCategory
        return matchesSearch && matchesFilter
    })

    const handleAddTimeline = () => {
        router.push("/admin/timelines/add")
    }

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this timeline?")) {
            try {
                await axios.delete(`http://localhost:8000/api/delete/timeline/${id}`)
                setTimelines((prev) => prev.filter((t) => t._id !== id))
                alert("Timeline deleted successfully")
            } catch (error) {
                console.error("Error deleting timeline:", error)
                alert("Failed to delete timeline")
            }
        }
    }

    if (loading) return <div className="p-4">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crops Timelines</h2>
                    <p className="text-slate-600 dark:text-slate-400">Define and manage crop-specific farming timelines. Set up task intervals and track lifecycle events by scientific name.</p>
                </div>

            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search crops..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                <Filter className="w-4 h-4" />
                                Filter: {filterCategory === "all" ? "All" : filterCategory}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterCategory("all")}>All Categories</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("Cereal")}>Cereal</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("Legume")}>Legume</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("Vegetable")}>Vegetable</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("Fruit")}>Fruit</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Button onClick={handleAddTimeline} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4" />
                        Add Timeline
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Crop Timelines ({filteredTimelines.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Crop Name</TableHead>
                                <TableHead>Scientific Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Season</TableHead>
                                <TableHead>Growth Period</TableHead>
                                <TableHead>Total Tasks</TableHead>
                                <TableHead>Task Title (In Days Interval)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTimelines.map((timeline) => {
                                const crop = crops.find((c) => c.scientificName === timeline.scientificName)
                                const cropName = crop?.cropName || "-"
                                const category = crop?.category || "-"
                                const totalTasks = timeline.tasks?.length || 0

                                return (
                                    <TableRow key={timeline._id}>
                                        <TableCell>
                                            <div className="font-medium text-slate-900 dark:text-white">{cropName}</div>
                                        </TableCell>
                                        <TableCell className="italic text-slate-600">{timeline.scientificName}</TableCell>
                                        <TableCell>{getCategoryBadge(category)}</TableCell>
                                        <TableCell className="capitalize">{crop?.season || "-"}</TableCell>
                                        <TableCell>{crop?.growthPeriod || "-"}</TableCell>
                                        <TableCell>{totalTasks}</TableCell>
                                        <TableCell>
                                            <ul className="space-y-1 max-h-36 overflow-y-auto pr-2">
                                                {timeline.tasks?.map((task, i) => (
                                                    <li key={i} className="text-sm leading-snug">
                                                        <span className="font-medium text-slate-700 dark:text-white">Day {task.day}</span>:{" "}
                                                        {task.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link href={`/admin/timelines/view/${timeline._id}`}>
                                                        <DropdownMenuItem className="flex items-center gap-2">
                                                            <Eye className="w-4 h-4" /> View
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <Link href={`/admin/timelines/edit/${timeline._id}`}>
                                                        <DropdownMenuItem className="flex items-center gap-2">
                                                            <Edit className="w-4 h-4" /> Edit
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(timeline._id)}
                                                        className="flex items-center gap-2 text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Timeline Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{timelines.length}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Timelines</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {
                                timelines.filter((t) => {
                                    const crop = crops.find((c) => c.scientificName === t.scientificName)
                                    return crop?.category === "Cereal"
                                }).length
                            }
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Cereal Crops</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {
                                timelines.filter((t) => {
                                    const crop = crops.find((c) => c.scientificName === t.scientificName)
                                    return crop?.category === "Legume"
                                }).length
                            }
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Legume Crops</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">
                            {
                                timelines.filter((t) => {
                                    const crop = crops.find((c) => c.scientificName === t.scientificName)
                                    return crop?.category === "Vegetable"
                                }).length
                            }
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Vegetable Crops</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
