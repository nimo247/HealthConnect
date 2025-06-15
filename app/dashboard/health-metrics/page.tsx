"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { HealthMetricsChart } from "@/components/health-metrics-chart"
import { NotificationSettings } from "@/components/notification-settings"
import { EnhancedMedicalBot } from "@/components/enhanced-medical-bot"
import { Heart, Activity, Thermometer, Droplets, Weight, Clock, TrendingUp, Bell, Bot, Settings } from "lucide-react"
import useNotifications from "@/hooks/use-notifications"

export default function HealthMetricsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { showNotification, initializeAudio } = useNotifications()

  const healthMetrics = [
    {
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      icon: Heart,
      color: "text-red-500",
      progress: 72,
      status: "Normal",
      trend: "+2%",
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      icon: Activity,
      color: "text-blue-500",
      progress: 85,
      status: "Good",
      trend: "-1%",
    },
    {
      title: "Body Temperature",
      value: "98.6",
      unit: "°F",
      icon: Thermometer,
      color: "text-orange-500",
      progress: 98,
      status: "Normal",
      trend: "0%",
    },
    {
      title: "Hydration",
      value: "2.1",
      unit: "L",
      icon: Droplets,
      color: "text-cyan-500",
      progress: 70,
      status: "Good",
      trend: "+5%",
    },
    {
      title: "Weight",
      value: "165",
      unit: "lbs",
      icon: Weight,
      color: "text-green-500",
      progress: 82,
      status: "Healthy",
      trend: "-0.5%",
    },
    {
      title: "Sleep",
      value: "7.5",
      unit: "hrs",
      icon: Clock,
      color: "text-purple-500",
      progress: 94,
      status: "Excellent",
      trend: "+8%",
    },
  ]

  const testHealthAlert = () => {
    initializeAudio()
    showNotification({
      id: `health-alert-${Date.now()}`,
      title: "🏥 Health Metrics Alert",
      description: "Your blood pressure reading is slightly elevated. Consider monitoring it more closely.",
      type: "medicine",
      priority: "medium",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Metrics</h1>
          <p className="text-gray-600">Monitor your vital signs and health indicators</p>
        </div>
        <Button onClick={testHealthAlert} variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Test Health Alert
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Health Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthMetrics.map((metric, index) => {
              const IconComponent = metric.icon
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <IconComponent className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metric.value} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={metric.status === "Excellent" ? "default" : "secondary"}>{metric.status}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">{metric.trend}</span>
                      </div>
                    </div>
                    <Progress value={metric.progress} className="mt-3" />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Health Metrics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Health Trends</CardTitle>
              <CardDescription>Your health metrics over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <HealthMetricsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-assistant">
          <EnhancedMedicalBot />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics Settings</CardTitle>
              <CardDescription>Configure your health monitoring preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Settings panel coming soon...</p>
                <Button variant="outline">Configure Sync Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
