"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Globe, Calendar, Download, Eye, MousePointer } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AnalyticsManagement() {
  const overviewStats = [
    {
      title: "Total Page Views",
      value: "2.4M",
      change: "+12.5%",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Unique Visitors",
      value: "186K",
      change: "+8.2%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.8%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Session Duration",
      value: "4m 32s",
      change: "+15.3%",
      icon: MousePointer,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const topPages = [
    { page: "/", views: 45234, bounce: 32 },
    { page: "/predict", views: 38921, bounce: 28 },
    { page: "/about", views: 29876, bounce: 45 },
    { page: "/features", views: 23456, bounce: 38 },
    { page: "/how-it-works", views: 18765, bounce: 42 },
  ]

  const userDemographics = [
    { country: "United States", users: 45234, percentage: 38 },
    { country: "India", users: 32156, percentage: 27 },
    { country: "Brazil", users: 18976, percentage: 16 },
    { country: "Canada", users: 12345, percentage: 10 },
    { country: "Australia", users: 8765, percentage: 7 },
    { country: "Others", users: 2524, percentage: 2 },
  ]

  const cropPredictionStats = [
    { crop: "Corn", predictions: 12456, accuracy: 94 },
    { crop: "Soybeans", predictions: 9876, accuracy: 91 },
    { crop: "Wheat", predictions: 8765, accuracy: 89 },
    { crop: "Rice", predictions: 6543, accuracy: 87 },
    { crop: "Cotton", predictions: 4321, accuracy: 85 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-slate-600 dark:text-slate-400">Monitor platform performance and user behavior</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index}>
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

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">{page.page}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {page.views.toLocaleString()} views
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={page.bounce < 35 ? "default" : page.bounce < 45 ? "secondary" : "destructive"}>
                        {page.bounce}% bounce
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  User Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userDemographics.map((demo, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{demo.country}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {demo.users.toLocaleString()} ({demo.percentage}%)
                        </span>
                      </div>
                      <Progress value={demo.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">12,543</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Daily Active Users</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">45,678</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Active Users</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">2.3</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Avg Sessions/User</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">78%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Returning Users</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crop Prediction Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cropPredictionStats.map((crop, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">{crop.crop}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {crop.predictions.toLocaleString()} predictions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">{crop.accuracy}%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response Time</span>
                      <span className="text-sm font-bold">245ms</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Query Time</span>
                      <span className="text-sm font-bold">89ms</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ML Model Processing</span>
                      <span className="text-sm font-bold">1.2s</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Server Uptime</span>
                      <span className="text-sm font-bold">99.9%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0.02%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Overall Error Rate</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">0.01%</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">API Errors</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">0.03%</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">ML Errors</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
