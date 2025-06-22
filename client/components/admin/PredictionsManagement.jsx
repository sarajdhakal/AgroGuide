"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Brain, Download, Eye, Trash2 } from "lucide-react"

export default function PredictionsManagement() {
  const router = useRouter()
  const [predictions, setPredictions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true)
      // Mock data
      const mockPredictions = [
        {
          id: 1,
          user: "John Farmer",
          crop: "Corn",
          location: "Iowa, USA",
          confidence: 92,
          expectedYield: "120 bushels/acre",
          status: "completed",
          createdAt: "2024-12-06",
          riskLevel: "low",
        },
        {
          id: 2,
          user: "Sarah Green",
          crop: "Soybeans",
          location: "California, USA",
          confidence: 87,
          expectedYield: "45 bushels/acre",
          status: "completed",
          createdAt: "2024-12-05",
          riskLevel: "medium",
        },
        {
          id: 3,
          user: "Anonymous",
          crop: "Wheat",
          location: "Kansas, USA",
          confidence: 95,
          expectedYield: "65 bushels/acre",
          status: "processing",
          createdAt: "2024-12-06",
          riskLevel: "low",
        },
      ]
      setPredictions(mockPredictions)
      setLoading(false)
    }
    loadPredictions()
  }, [])

  const filteredPredictions = predictions.filter((prediction) => {
    const matchesSearch =
      prediction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prediction.crop.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || prediction.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[status]}>{status}</Badge>
  }

  const getRiskBadge = (risk) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[risk]}>{risk} risk</Badge>
  }

  const handleCreatePrediction = () => {
    router.push("/admin/predictions/create")
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
              placeholder="Search predictions..."
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
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Predictions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("processing")}>Processing</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("failed")}>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={handleCreatePrediction}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Brain className="w-4 h-4" />
            Create Prediction
          </Button>
        </div>
      </div>

      {/* Predictions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Predictions ({filteredPredictions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Expected Yield</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPredictions.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900 dark:text-white">{prediction.user}</div>
                  </TableCell>
                  <TableCell>{prediction.crop}</TableCell>
                  <TableCell>{prediction.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-emerald-600 font-medium">{prediction.confidence}%</div>
                    </div>
                  </TableCell>
                  <TableCell>{prediction.expectedYield}</TableCell>
                  <TableCell>{getRiskBadge(prediction.riskLevel)}</TableCell>
                  <TableCell>{getStatusBadge(prediction.status)}</TableCell>
                  <TableCell>{prediction.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">Download Report</DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          Delete Prediction
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

      {/* Prediction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{predictions.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Predictions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {predictions.filter((p) => p.status === "completed").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {predictions.filter((p) => p.status === "processing").length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Confidence</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
