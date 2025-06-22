"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Plus, Download, Edit, Trash2, Settings } from "lucide-react"

export default function FeaturesManagement() {
  const router = useRouter()
  const [features, setFeatures] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeatures = async () => {
      setLoading(true)
      // Mock data
      const mockFeatures = [
        {
          id: 1,
          name: "Risk Assessment",
          description: "Comprehensive risk analysis for weather, pests, and market conditions",
          category: "risk",
          enabled: true,
          version: "1.0.0",
          priority: "high",
        },
        {
          id: 2,
          name: "Yield Prediction",
          description: "Accurate yield forecasting based on historical data and current conditions",
          category: "prediction",
          enabled: true,
          version: "1.1.0",
          priority: "high",
        },
        {
          id: 3,
          name: "Climate Analysis",
          description: "Real-time climate data integration for optimal planting decisions",
          category: "climate",
          enabled: true,
          version: "1.2.0",
          priority: "medium",
        },
        {
          id: 4,
          name: "Soil Optimization",
          description: "Soil health monitoring and improvement recommendations",
          category: "soil",
          enabled: true,
          version: "1.0.0",
          priority: "medium",
        },
        {
          id: 5,
          name: "Precision Farming",
          description: "GPS-enabled field mapping and precision agriculture tools",
          category: "precision",
          enabled: false,
          version: "1.3.0",
          priority: "low",
        },
        {
          id: 6,
          name: "Market Insights",
          description: "Real-time market prices and demand forecasting for better profitability",
          category: "market",
          enabled: true,
          version: "1.0.5",
          priority: "medium",
        },
      ]

      setFeatures(mockFeatures)
      setLoading(false)
    }
    loadFeatures()
  }, [])

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "enabled" && feature.enabled) ||
      (filterStatus === "disabled" && !feature.enabled)
    return matchesSearch && matchesFilter
  })

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return <Badge className={colors[priority]}>{priority}</Badge>
  }

  const toggleFeature = (id) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)))
  }

  const handleAddFeature = () => {
    router.push("/admin/features/add")
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
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter: {filterStatus === "all" ? "All" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Features</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("enabled")}>Enabled</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("disabled")}>Disabled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleAddFeature} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4" />
            Add Feature
          </Button>
        </div>
      </div>

      {/* Features Table */}
      <Card>
        <CardHeader>
          <CardTitle>Features ({filteredFeatures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeatures.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900 dark:text-white">{feature.name}</div>
                  </TableCell>
                  <TableCell className="text-slate-500">{feature.description}</TableCell>
                  <TableCell className="capitalize">{feature.category}</TableCell>
                  <TableCell>{feature.version}</TableCell>
                  <TableCell>{getPriorityBadge(feature.priority)}</TableCell>
                  <TableCell>
                    <Switch checked={feature.enabled} onCheckedChange={() => toggleFeature(feature.id)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit Feature
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          Delete Feature
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

      {/* Feature Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{features.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Features</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{features.filter((f) => f.enabled).length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Enabled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{features.filter((f) => !f.enabled).length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Disabled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {features.filter((f) => f.priority === "high").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">High Priority</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
