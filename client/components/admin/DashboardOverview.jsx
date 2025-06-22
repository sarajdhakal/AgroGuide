"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wheat, Brain, TrendingUp, Activity, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function DashboardOverview() {
  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Predictions",
      value: "8,921",
      change: "+8%",
      icon: Brain,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Crop Varieties",
      value: "156",
      change: "+3",
      icon: Wheat,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const recentActivity = [
    { user: "John Farmer", action: "Created new prediction", time: "2 minutes ago", status: "success" },
    { user: "Sarah Green", action: "Updated crop data", time: "15 minutes ago", status: "info" },
    { user: "Mike Johnson", action: "Reported issue", time: "1 hour ago", status: "warning" },
    { user: "Lisa Brown", action: "Completed harvest", time: "2 hours ago", status: "success" },
    { user: "Tom Wilson", action: "Failed prediction", time: "3 hours ago", status: "error" },
  ]

  const systemHealth = [
    { name: "API Response Time", value: 98, status: "good" },
    { name: "Database Performance", value: 95, status: "good" },
    { name: "ML Model Accuracy", value: 94, status: "good" },
    { name: "Server Uptime", value: 99, status: "excellent" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-emerald-600 font-medium">{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{activity.user}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        activity.status === "success"
                          ? "default"
                          : activity.status === "warning"
                            ? "secondary"
                            : activity.status === "error"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{metric.name}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{metric.value}%</span>
                  </div>
                  <Progress
                    value={metric.value}
                    className={`h-2 ${
                      metric.value >= 98 ? "bg-green-100" : metric.value >= 90 ? "bg-yellow-100" : "bg-red-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
              <Brain className="w-8 h-8 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Run ML Training</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Update prediction models</p>
            </button>
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Export User Data</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Generate user reports</p>
            </button>
            <button className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <Wheat className="w-8 h-8 text-amber-600 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Update Crop Database</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Sync latest crop data</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
