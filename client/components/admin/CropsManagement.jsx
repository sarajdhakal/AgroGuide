"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Plus, Download, Edit, Trash2 } from "lucide-react"
import axios from "axios"
import Link from "next/link"


export default function CropsManagement() {
    const router = useRouter()
    const [crops, setCrops] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {
        const loadCrops = async () => {
            try {
                setLoading(true)
                const response = await axios.get("http://localhost:8000/api/crops")
                setCrops(response.data)
                setError("")
            } catch (error) {
                console.log("Error while fetching data", error)
                setError("Failes to fetch crop data")
                // Mock data
                setCrops([
                    {
                        id: 1,
                        name: "Corn",
                        scientificName: "Zea mays",
                        category: "cereal",
                        season: "summer",
                        growthPeriod: "90-120 days",
                        status: "active",
                    },
                    {
                        id: 2,
                        name: "Soybeans",
                        scientificName: "Glycine max",
                        category: "legume",
                        season: "summer",
                        growthPeriod: "100-130 days",
                        status: "active",
                    },
                    {
                        id: 3,
                        name: "Wheat",
                        scientificName: "Triticum aestivum",
                        category: "cereal",
                        season: "winter",
                        growthPeriod: "200-250 days",
                        status: "active",
                    },
                ])
            } finally {
                setLoading(false)
            }
        }
        loadCrops()
    }, [])

    const filteredCrops = crops.filter((crop) => {
        const matchesSearch = crop.cropName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterCategory === "all" || crop.category === filterCategory
        return matchesSearch && matchesFilter
    })

    const getCategoryBadge = (category) => {
        const colors = {
            Cereal: "bg-blue-100 text-blue-800",
            Oilseed: "bg-green-100 text-green-800",
            Vegetable: "bg-orange-100 text-orange-800",
            Fruit: "bg-red-100 text-red-800",
        }
        return <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>
    }

    const handleAddCrop = () => {
        router.push("/admin/crops/add")
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crops Management</h2>
                    <p className="text-slate-600 dark:text-slate-400">.......</p>
                </div>

            </div>
            {/* Header Actions */}
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
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filter: {filterCategory === "all" ? "All" : filterCategory}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterCategory("all")}>All Categories</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("Cereal")}>Cereal</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("Oilseed")}>Legume</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("Vegetable")}>Vegetable</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("Fruit")}>Fruit</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Button onClick={handleAddCrop} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4" />
                        Add Crop
                    </Button>
                </div>
            </div>

            {/* Crops Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Crops ({filteredCrops.length})</CardTitle>
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
                                <TableHead>Weather</TableHead>
                                <TableHead>Temp (°C)</TableHead>
                                <TableHead>Rainfall (Annually) </TableHead>
                                <TableHead>Humidity</TableHead>
                                <TableHead>Soil pH</TableHead>
                                <TableHead>Nitrogen</TableHead>
                                <TableHead>Phosporous</TableHead>
                                <TableHead>Potassium</TableHead>
                                <TableHead>Market Value</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCrops.map((crop) => (
                                <TableRow key={crop._id}>
                                    <TableCell>
                                        <div className="font-medium text-slate-900 dark:text-white">
                                            {crop.cropName}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 italic">{crop.scientificName}</TableCell>
                                    <TableCell>{getCategoryBadge(crop.category)}</TableCell>
                                    <TableCell className="capitalize">{crop.season}</TableCell>
                                    <TableCell>{crop.growthPeriod}</TableCell>
                                    <TableCell>{crop.weather}</TableCell>
                                    <TableCell>{crop.temperature}</TableCell>
                                    <TableCell>{crop.rainfall}</TableCell>
                                    <TableCell>{crop.humidity}</TableCell>
                                    <TableCell>{crop.soilpH}</TableCell>
                                    <TableCell>{crop.nitrogenRequired}</TableCell>
                                    <TableCell>{crop.phosphorusRequired}</TableCell>
                                    <TableCell>{crop.potassiumRequired}</TableCell>

                                    <TableCell>Rs. {crop.marketValue}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Link href={`/admin/crops/edit/${crop._id}`}>
                                                    <DropdownMenuItem className="flex items-center gap-2">
                                                        <Edit className="w-4 h-4" />
                                                        Edit Crop
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/admin/crops/view-details/${crop._id}`}>
                                                    <DropdownMenuItem className="flex items-center gap-2">View Details</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete Crop
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

            {/* Crop Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{crops.length}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Crops</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {crops.filter((c) => c.category === "Cereal").length}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Cereals</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {crops.filter((c) => c.category === "Oilseed").length}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Oilseed</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">
                            {crops.filter((c) => c.category === "Vegetable").length}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Vegetables</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">
                            {crops.filter((c) => c.category === "Fruit").length}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Fruit</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
