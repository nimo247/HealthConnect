"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  Wind,
  AlertTriangle,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Utensils,
  Shield,
  TreesIcon as Lungs,
  Heart,
  Brain,
} from "lucide-react"

interface AQIData {
  timestamp: string
  aqi: number
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
  category: string
  color: string
}

interface TimeSlot {
  time: string
  aqi: number
  recommendation: "excellent" | "good" | "moderate" | "poor" | "avoid"
  activities: string[]
}

interface HealthRecommendation {
  condition: string
  severity: "mild" | "moderate" | "severe"
  recommendations: string[]
  dietSuggestions: string[]
  precautions: string[]
  organSystem: string
}

export default function AirQuality() {
  const [currentAQI, setCurrentAQI] = useState<AQIData | null>(null)
  const [historicalData, setHistoricalData] = useState<AQIData[]>([])
  const [predictions, setPredictions] = useState<AQIData[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [userConditions, setUserConditions] = useState<string[]>([])
  const [location, setLocation] = useState("Delhi, India")
  const [isLoading, setIsLoading] = useState(true)

  // Load user respiratory conditions from localStorage
  useEffect(() => {
    const savedConditions = localStorage.getItem("respiratoryConditions")
    if (savedConditions) {
      try {
        const conditions = JSON.parse(savedConditions)
        setUserConditions(conditions)
      } catch (error) {
        console.error("Error parsing saved respiratory conditions:", error)
      }
    }
  }, [])

  // Mock AQI data (in real app, this would come from aqi.in API)
  const mockAQIData: AQIData[] = [
    {
      timestamp: "2024-05-20",
      aqi: 156,
      pm25: 89,
      pm10: 145,
      o3: 45,
      no2: 67,
      so2: 23,
      co: 1.2,
      category: "Unhealthy",
      color: "#ff6b6b",
    },
    {
      timestamp: "2024-05-21",
      aqi: 178,
      pm25: 102,
      pm10: 167,
      o3: 52,
      no2: 78,
      so2: 28,
      co: 1.4,
      category: "Unhealthy",
      color: "#ff6b6b",
    },
    {
      timestamp: "2024-05-22",
      aqi: 145,
      pm25: 82,
      pm10: 134,
      o3: 41,
      no2: 62,
      so2: 21,
      co: 1.1,
      category: "Unhealthy for Sensitive Groups",
      color: "#ffa726",
    },
    {
      timestamp: "2024-05-23",
      aqi: 167,
      pm25: 95,
      pm10: 156,
      o3: 48,
      no2: 71,
      so2: 26,
      co: 1.3,
      category: "Unhealthy",
      color: "#ff6b6b",
    },
    {
      timestamp: "2024-05-24",
      aqi: 189,
      pm25: 112,
      pm10: 178,
      o3: 56,
      no2: 84,
      so2: 31,
      co: 1.5,
      category: "Unhealthy",
      color: "#ff6b6b",
    },
    {
      timestamp: "2024-05-25",
      aqi: 134,
      pm25: 76,
      pm10: 123,
      o3: 38,
      no2: 58,
      so2: 19,
      co: 1.0,
      category: "Unhealthy for Sensitive Groups",
      color: "#ffa726",
    },
    {
      timestamp: "2024-05-26",
      aqi: 142,
      pm25: 81,
      pm10: 131,
      o3: 42,
      no2: 63,
      so2: 22,
      co: 1.1,
      category: "Unhealthy for Sensitive Groups",
      color: "#ffa726",
    },
    {
      timestamp: "2024-05-27",
      aqi: 158,
      pm25: 91,
      pm10: 147,
      o3: 46,
      no2: 69,
      so2: 24,
      co: 1.2,
      category: "Unhealthy",
      color: "#ff6b6b",
    },
    {
      timestamp: "2024-05-28",
      aqi: 171,
      pm25: 98,
      pm10: 159,
      o3: 50,
      no2: 74,
      so2: 27,
      co: 1.3,
      category: "Unhealthy",
      color: "#ff6b6b",
    },
    {
      timestamp: "2024-05-29",
      aqi: 163,
      pm25: 93,
      pm10: 152,
      o3: 47,
      no2: 70,
      so2: 25,
      co: 1.2,
      category: "Unhealthy",
      color: "#ff6b6b",
    },
  ]

  // Simple linear regression for AQI prediction
  const predictAQI = (historicalData: AQIData[]): AQIData[] => {
    const n = historicalData.length
    const x = historicalData.map((_, i) => i)
    const y = historicalData.map((d) => d.aqi)

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    const predictions: AQIData[] = []
    for (let i = 0; i < 7; i++) {
      const futureX = n + i
      const predictedAQI = Math.max(0, Math.round(slope * futureX + intercept + (Math.random() - 0.5) * 20))
      const date = new Date()
      date.setDate(date.getDate() + i + 1)

      predictions.push({
        timestamp: date.toISOString().split("T")[0],
        aqi: predictedAQI,
        pm25: Math.round(predictedAQI * 0.6),
        pm10: Math.round(predictedAQI * 0.9),
        o3: Math.round(predictedAQI * 0.3),
        no2: Math.round(predictedAQI * 0.4),
        so2: Math.round(predictedAQI * 0.15),
        co: Math.round(predictedAQI * 0.008 * 100) / 100,
        category: getAQICategory(predictedAQI),
        color: getAQIColor(predictedAQI),
      })
    }

    return predictions
  }

  const getAQICategory = (aqi: number): string => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#4caf50"
    if (aqi <= 100) return "#ffeb3b"
    if (aqi <= 150) return "#ffa726"
    if (aqi <= 200) return "#ff6b6b"
    if (aqi <= 300) return "#9c27b0"
    return "#8d4e85"
  }

  const generateTimeSlots = (baseAQI: number): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const hours = ["6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"]

    hours.forEach((time, index) => {
      // Simulate AQI variation throughout the day
      let aqiVariation = 0
      if (index === 0 || index === 1) aqiVariation = -20 // Early morning better
      if (index === 2 || index === 3) aqiVariation = +15 // Afternoon worse
      if (index === 4) aqiVariation = +25 // Evening rush hour
      if (index === 5) aqiVariation = -10 // Night slightly better

      const slotAQI = Math.max(0, baseAQI + aqiVariation + (Math.random() - 0.5) * 10)

      let recommendation: "excellent" | "good" | "moderate" | "poor" | "avoid"
      let activities: string[] = []

      if (slotAQI <= 50) {
        recommendation = "excellent"
        activities = ["Outdoor exercise", "Jogging", "Cycling", "Sports"]
      } else if (slotAQI <= 100) {
        recommendation = "good"
        activities = ["Light outdoor activities", "Walking", "Gardening"]
      } else if (slotAQI <= 150) {
        recommendation = "moderate"
        activities = ["Indoor activities", "Short outdoor errands"]
      } else if (slotAQI <= 200) {
        recommendation = "poor"
        activities = ["Stay indoors", "Use air purifier", "Wear mask if going out"]
      } else {
        recommendation = "avoid"
        activities = ["Avoid outdoor activities", "Keep windows closed", "Use N95 mask"]
      }

      slots.push({
        time,
        aqi: Math.round(slotAQI),
        recommendation,
        activities,
      })
    })

    return slots
  }

  const getHealthRecommendations = (aqi: number, conditions: string[]): HealthRecommendation[] => {
    const recommendations: HealthRecommendation[] = []

    conditions.forEach((condition) => {
      let severity: "mild" | "moderate" | "severe"
      let recs: string[] = []
      let diet: string[] = []
      let precautions: string[] = []
      let organSystem = "Respiratory"

      if (condition === "asthma") {
        organSystem = "Respiratory"
        if (aqi <= 100) {
          severity = "mild"
          recs = ["Continue regular activities", "Keep rescue inhaler handy", "Monitor symptoms"]
          diet = ["Anti-inflammatory foods", "Omega-3 rich fish", "Fresh fruits and vegetables"]
          precautions = ["Avoid known triggers", "Stay hydrated"]
        } else if (aqi <= 150) {
          severity = "moderate"
          recs = ["Limit outdoor activities", "Use controller medication as prescribed", "Consider indoor exercise"]
          diet = ["Vitamin C rich foods", "Ginger tea", "Avoid dairy if it triggers symptoms"]
          precautions = ["Wear mask outdoors", "Use air purifier indoors", "Keep windows closed"]
        } else {
          severity = "severe"
          recs = ["Stay indoors", "Use rescue inhaler as needed", "Contact doctor if symptoms worsen"]
          diet = ["Light, easily digestible meals", "Warm liquids", "Avoid processed foods"]
          precautions = ["Avoid all outdoor activities", "Use HEPA air purifier", "Consider emergency action plan"]
        }
      } else if (condition === "copd") {
        organSystem = "Respiratory"
        if (aqi <= 100) {
          severity = "mild"
          recs = ["Light activities as tolerated", "Use prescribed medications", "Monitor oxygen levels"]
          diet = ["High-protein foods", "Complex carbohydrates", "Plenty of fluids"]
          precautions = ["Avoid respiratory irritants", "Practice breathing exercises"]
        } else if (aqi <= 150) {
          severity = "moderate"
          recs = ["Stay indoors", "Use supplemental oxygen if prescribed", "Avoid exertion"]
          diet = ["Soft, easy-to-digest foods", "Small frequent meals", "Avoid gas-producing foods"]
          precautions = ["Use bronchodilators as prescribed", "Monitor for worsening symptoms"]
        } else {
          severity = "severe"
          recs = ["Complete indoor isolation", "Contact healthcare provider", "Use all prescribed medications"]
          diet = ["Liquid nutrition if needed", "High-calorie supplements", "Avoid cold foods"]
          precautions = ["Emergency action plan ready", "Continuous oxygen monitoring", "Immediate medical access"]
        }
      } else if (condition === "sinus") {
        organSystem = "Respiratory"
        if (aqi <= 100) {
          severity = "mild"
          recs = ["Normal activities", "Nasal irrigation if needed", "Stay hydrated"]
          diet = ["Spicy foods to clear sinuses", "Warm soups", "Plenty of fluids"]
          precautions = ["Use humidifier", "Avoid allergens"]
        } else if (aqi <= 150) {
          severity = "moderate"
          recs = ["Limit outdoor exposure", "Use saline nasal spray", "Consider decongestants"]
          diet = ["Anti-inflammatory foods", "Turmeric", "Avoid dairy products"]
          precautions = ["Wear mask outdoors", "Use air purifier", "Nasal irrigation twice daily"]
        } else {
          severity = "severe"
          recs = ["Stay indoors", "Use prescribed medications", "Consult ENT specialist"]
          diet = ["Warm liquids only", "Ginger and honey", "Avoid cold foods"]
          precautions = ["Complete indoor isolation", "HEPA filtration", "Steam inhalation"]
        }
      } else if (condition === "heart_disease") {
        organSystem = "Cardiovascular"
        if (aqi <= 100) {
          severity = "mild"
          recs = ["Light exercise as tolerated", "Take medications as prescribed", "Monitor blood pressure"]
          diet = ["Heart-healthy diet", "Low sodium foods", "Omega-3 fatty acids"]
          precautions = ["Avoid sudden exertion", "Monitor for chest pain"]
        } else if (aqi <= 150) {
          severity = "moderate"
          recs = ["Avoid outdoor activities", "Monitor heart rate", "Rest frequently"]
          diet = ["Low-sodium diet", "Antioxidant-rich foods", "Limit caffeine"]
          precautions = ["Use air purifier", "Avoid stress", "Monitor symptoms closely"]
        } else {
          severity = "severe"
          recs = ["Complete rest indoors", "Contact cardiologist", "Monitor for emergency symptoms"]
          diet = ["Very low sodium", "Small frequent meals", "Avoid stimulants"]
          precautions = ["Emergency medications ready", "Avoid all physical stress", "Immediate medical access"]
        }
      }

      recommendations.push({
        condition: condition.charAt(0).toUpperCase() + condition.slice(1),
        severity,
        recommendations: recs,
        dietSuggestions: diet,
        precautions,
        organSystem,
      })
    })

    return recommendations
  }

  useEffect(() => {
    setIsLoading(true)

    // Simulate API calls
    setTimeout(() => {
      setHistoricalData(mockAQIData)
      setCurrentAQI(mockAQIData[mockAQIData.length - 1])
      setPredictions(predictAQI(mockAQIData))
      setTimeSlots(generateTimeSlots(mockAQIData[mockAQIData.length - 1].aqi))
      setIsLoading(false)
    }, 1000)
  }, [])

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "moderate":
        return "bg-yellow-500"
      case "poor":
        return "bg-orange-500"
      case "avoid":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-red-400" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-green-400" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getOrganIcon = (organSystem: string) => {
    switch (organSystem) {
      case "Respiratory":
        return <Lungs className="h-5 w-5 text-blue-400" />
      case "Cardiovascular":
        return <Heart className="h-5 w-5 text-red-400" />
      case "Neurological":
        return <Brain className="h-5 w-5 text-purple-400" />
      default:
        return <Activity className="h-5 w-5 text-gray-400" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Air Quality Monitor</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {location} • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Change Location
        </Button>
      </div>

      {/* Current AQI Alert */}
      {currentAQI && (
        <Alert
          className={`border-2 ${currentAQI.aqi > 150 ? "bg-red-900/50 border-red-700" : currentAQI.aqi > 100 ? "bg-orange-900/50 border-orange-700" : "bg-yellow-900/50 border-yellow-700"}`}
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-white">Current Air Quality: {currentAQI.category}</AlertTitle>
          <AlertDescription className="text-gray-200">
            AQI: {currentAQI.aqi} •{" "}
            {currentAQI.aqi > 150
              ? "Unhealthy air quality. Limit outdoor activities."
              : currentAQI.aqi > 100
                ? "Moderate air quality. Sensitive individuals should be cautious."
                : "Acceptable air quality for most people."}
            {userConditions.length > 0 && (
              <span className="block mt-1 text-blue-300">
                Personalized recommendations available based on your {userConditions.join(", ")} condition(s).
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Current AQI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wind className="h-5 w-5 text-blue-400" />
              Current Air Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentAQI && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">{currentAQI.aqi}</div>
                  <Badge className="text-lg px-4 py-1" style={{ backgroundColor: currentAQI.color }}>
                    {currentAQI.category}
                  </Badge>
                </div>
                <Progress value={(currentAQI.aqi / 300) * 100} className="h-3" />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-gray-400">PM2.5</div>
                    <div className="text-white font-semibold">{currentAQI.pm25}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">PM10</div>
                    <div className="text-white font-semibold">{currentAQI.pm10}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">O₃</div>
                    <div className="text-white font-semibold">{currentAQI.o3}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">24h Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {historicalData.length > 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">vs Yesterday</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(currentAQI?.aqi || 0, historicalData[historicalData.length - 2].aqi)}
                    <span className="text-white font-semibold">
                      {Math.abs((currentAQI?.aqi || 0) - historicalData[historicalData.length - 2].aqi)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Peak: {Math.max(...historicalData.slice(-7).map((d) => d.aqi))} AQI
                </div>
                <div className="text-xs text-gray-500">
                  Low: {Math.min(...historicalData.slice(-7).map((d) => d.aqi))} AQI
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Health Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-400" />
                <span className="text-sm text-gray-300">Respiratory Risk</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {currentAQI && currentAQI.aqi > 150 ? "High" : currentAQI && currentAQI.aqi > 100 ? "Medium" : "Low"}
              </div>
              <div className="text-xs text-gray-500">
                {userConditions.length > 0
                  ? `Based on your ${userConditions.join(", ")} condition(s)`
                  : "Based on current conditions"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
          <TabsTrigger value="health">Health Recommendations</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-400" />
                Best Times to Go Outside Today
              </CardTitle>
              <CardDescription className="text-gray-400">
                Personalized recommendations based on predicted AQI levels
                {userConditions.length > 0 && ` and your ${userConditions.join(", ")} condition(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">{slot.time}</h4>
                      <Badge className={`${getRecommendationColor(slot.recommendation)} text-white`}>
                        AQI {slot.aqi}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300 capitalize font-medium">{slot.recommendation} time</div>
                      <div className="space-y-1">
                        {slot.activities.map((activity, i) => (
                          <div key={i} className="text-xs text-gray-400 flex items-center gap-1">
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="mt-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                7-Day AQI Forecast
              </CardTitle>
              <CardDescription className="text-gray-400">
                ML-predicted air quality based on historical patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#9CA3AF"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                      labelStyle={{ color: "#F3F4F6" }}
                    />
                    <Line
                      dataKey="aqi"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {predictions.map((day, index) => (
                  <div key={index} className="p-3 bg-gray-700/50 rounded-lg text-center">
                    <div className="text-xs text-gray-400 mb-1">
                      {new Date(day.timestamp).toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold text-white mb-1">{day.aqi}</div>
                    <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: day.color, color: "white" }}>
                      {day.category.split(" ")[0]}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <div className="space-y-6">
            {userConditions.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    Set Up Your Health Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Add your respiratory conditions to get personalized AQI recommendations and health advice.
                  </p>
                  <Button
                    onClick={() => {
                      // Trigger the respiratory conditions setup
                      const event = new CustomEvent("openRespiratorySetup")
                      window.dispatchEvent(event)
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Set Up Health Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              currentAQI &&
              getHealthRecommendations(currentAQI.aqi, userConditions).map((rec, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        {getOrganIcon(rec.organSystem)}
                        {rec.condition} Management
                      </CardTitle>
                      <Badge
                        className={`${
                          rec.severity === "severe"
                            ? "bg-red-500"
                            : rec.severity === "moderate"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        } text-white`}
                      >
                        {rec.severity} risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="recommendations" className="w-full">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                        <TabsTrigger value="diet">Diet</TabsTrigger>
                        <TabsTrigger value="precautions">Precautions</TabsTrigger>
                      </TabsList>

                      <TabsContent value="recommendations" className="mt-4">
                        <div className="space-y-2">
                          {rec.recommendations.map((recommendation, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <Activity className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{recommendation}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="diet" className="mt-4">
                        <div className="space-y-2">
                          {rec.dietSuggestions.map((diet, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <Utensils className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                              <span>{diet}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="precautions" className="mt-4">
                        <div className="space-y-2">
                          {rec.precautions.map((precaution, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                              <span>{precaution}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Historical AQI Trends</CardTitle>
              <CardDescription className="text-gray-400">
                Last 10 days air quality data used for ML predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#9CA3AF"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                      labelStyle={{ color: "#F3F4F6" }}
                    />
                    <Bar dataKey="aqi" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-gray-400">Average AQI</div>
                  <div className="text-xl font-bold text-white">
                    {Math.round(historicalData.reduce((sum, d) => sum + d.aqi, 0) / historicalData.length)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-gray-400">Peak AQI</div>
                  <div className="text-xl font-bold text-white">{Math.max(...historicalData.map((d) => d.aqi))}</div>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-gray-400">Best Day</div>
                  <div className="text-xl font-bold text-white">{Math.min(...historicalData.map((d) => d.aqi))}</div>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-gray-400">Trend</div>
                  <div className="text-xl font-bold text-white flex items-center justify-center">
                    {historicalData[historicalData.length - 1].aqi > historicalData[0].aqi ? (
                      <TrendingUp className="h-5 w-5 text-red-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
