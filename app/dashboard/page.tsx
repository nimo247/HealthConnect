"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Activity, Calendar, FileText, Bell, AlertTriangle, ArrowRight, Wind, Brain } from "lucide-react"
import { HealthMetricsChart } from "@/components/health-metrics-chart"
import { RealClinicFinder } from "@/components/real-clinic-finder"

export default function Dashboard() {
  const openAIAssistant = () => {
    const event = new CustomEvent("openAIAssistant")
    window.dispatchEvent(event)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Alerts Section */}
      <Alert className="bg-amber-900/50 border-amber-700 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <AlertTitle className="text-amber-300">Health Alert</AlertTitle>
        <AlertDescription className="text-amber-200">
          High AQI levels detected in your area (AQI: 163). Consider limiting outdoor activities today.
        </AlertDescription>
      </Alert>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Next Appointment</p>
                <h3 className="text-lg font-bold text-green-100">Dr. Sarah Johnson</h3>
                <p className="text-sm text-green-200">Tomorrow, 10:00 AM</p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
            <Link href="/dashboard/appointments">
              <Button variant="link" className="p-0 h-auto text-green-300 mt-2 hover:text-green-200">
                View details <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Medication Reminder</p>
                <h3 className="text-lg font-bold text-blue-100">Blood Pressure Medication</h3>
                <p className="text-sm text-blue-200">Daily, 8:00 AM & 8:00 PM</p>
              </div>
              <Bell className="h-8 w-8 text-blue-400" />
            </div>
            <Link href="/dashboard/alerts">
              <Button variant="link" className="p-0 h-auto text-blue-300 mt-2 hover:text-blue-200">
                View all reminders <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300">AI Health Assistant</p>
                <h3 className="text-lg font-bold text-purple-100">Enhanced Medical Bot</h3>
                <p className="text-sm text-purple-200">Voice-enabled AI analysis</p>
              </div>
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-purple-300 mt-2 hover:text-purple-200"
              onClick={openAIAssistant}
            >
              Open AI Assistant <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-300">Air Quality</p>
                <h3 className="text-lg font-bold text-orange-100">AQI: 163</h3>
                <p className="text-sm text-orange-200">Unhealthy - Stay indoors</p>
              </div>
              <Wind className="h-8 w-8 text-orange-400" />
            </div>
            <Link href="/dashboard/air-quality">
              <Button variant="link" className="p-0 h-auto text-orange-300 mt-2 hover:text-orange-200">
                View forecast <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Health Metrics</CardTitle>
            <Link href="/dashboard/health-metrics">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                View All
              </Button>
            </Link>
          </div>
          <CardDescription className="text-gray-400">Your recent health measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthMetricsChart />
        </CardContent>
      </Card>

      {/* Recent Activities & Real Clinics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Activities</CardTitle>
            <CardDescription className="text-gray-400">Your health-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-2 rounded-full border border-blue-500/30">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">Blood Pressure Updated</h4>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      120/80
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">Today, 8:30 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 p-2 rounded-full border border-green-500/30">
                  <FileText className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Lab Results Uploaded</h4>
                  <p className="text-sm text-gray-400">Yesterday, 2:15 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-2 rounded-full border border-purple-500/30">
                  <Calendar className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Appointment Scheduled</h4>
                  <p className="text-sm text-gray-400">May 25, 10:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 p-2 rounded-full border border-orange-500/30">
                  <Wind className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">AQI Alert Received</h4>
                  <p className="text-sm text-gray-400">Today, 6:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-2 rounded-full border border-purple-500/30">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">AI Health Analysis</h4>
                  <p className="text-sm text-gray-400">Yesterday, 3:20 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <RealClinicFinder /> */}
      </div>
    </div>
  )
}
