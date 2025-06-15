// Add this line at the top if you're using client-side features
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TreesIcon as Lungs, Heart, Brain, Shield, Info } from "lucide-react"

interface RespiratoryConditionsSetupProps {
  onComplete: (conditions: string[]) => void
  initialConditions?: string[]
}

const respiratoryConditions = [
  {
    id: "asthma",
    name: "Asthma",
    description: "Chronic respiratory condition causing airway inflammation",
    severity: "high",
    icon: Lungs,
  },
  {
    id: "copd",
    name: "COPD",
    description: "Chronic obstructive pulmonary disease",
    severity: "high",
    icon: Lungs,
  },
  {
    id: "sinus",
    name: "Chronic Sinusitis",
    description: "Long-term inflammation of sinus cavities",
    severity: "medium",
    icon: Brain,
  },
  {
    id: "allergies",
    name: "Respiratory Allergies",
    description: "Allergic reactions affecting breathing",
    severity: "medium",
    icon: Shield,
  },
  {
    id: "bronchitis",
    name: "Chronic Bronchitis",
    description: "Long-term inflammation of bronchial tubes",
    severity: "medium",
    icon: Lungs,
  },
  {
    id: "heart_disease",
    name: "Heart Disease",
    description: "Cardiovascular conditions affecting breathing",
    severity: "high",
    icon: Heart,
  },
  {
    id: "none",
    name: "No Respiratory Conditions",
    description: "I don't have any known respiratory conditions",
    severity: "low",
    icon: Shield,
  },
]

export function RespiratoryConditionsSetup({
  onComplete,
  initialConditions = [],
}: RespiratoryConditionsSetupProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(initialConditions)
  const [showInfo, setShowInfo] = useState(false)

  const handleConditionToggle = (conditionId: string) => {
    if (conditionId === "none") {
      setSelectedConditions(["none"])
    } else {
      setSelectedConditions((prev) => {
        const filtered = prev.filter((id) => id !== "none")
        if (filtered.includes(conditionId)) {
          return filtered.filter((id) => id !== conditionId)
        } else {
          return [...filtered, conditionId]
        }
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSelectedConditionNames = () => {
    return selectedConditions
      .filter((id) => id !== "none")
      .map((id) => respiratoryConditions.find((c) => c.id === id)?.name)
      .filter(Boolean)
  }

  const handleSubmitAndClose = () => {
    onComplete(selectedConditions.filter((id) => id !== "none"))
    window.close()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800/50 border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lungs className="h-5 w-5 text-blue-400" />
          Respiratory Health Profile
        </CardTitle>
        <CardDescription className="text-gray-400">
          Help us provide personalized air quality recommendations by selecting any respiratory conditions you have.
          This information will be used to give you tailored AQI alerts and health advice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 overflow-y-auto pr-2 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Select Your Conditions</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-400 hover:text-white"
          >
            <Info className="h-4 w-4 mr-1" />
            Why we ask
          </Button>
        </div>

        {showInfo && (
          <Alert className="bg-blue-900/50 border-blue-700">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              Your respiratory health information helps us provide personalized AQI recommendations, suggest optimal
              times for outdoor activities, and alert you when air quality may affect your specific conditions. This
              data is stored locally and used only for your health recommendations.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {respiratoryConditions.map((condition) => {
            const Icon = condition.icon
            const isSelected = selectedConditions.includes(condition.id)

            return (
              <div
                key={condition.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-green-500 bg-green-500/10"
                    : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                }`}
                onClick={() => handleConditionToggle(condition.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={isSelected} onChange={() => {}} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-blue-400" />
                      <h4 className="font-medium text-white">{condition.name}</h4>
                      <Badge className={`text-xs ${getSeverityColor(condition.severity)} text-white`}>
                        {condition.severity} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{condition.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {selectedConditions.length > 0 && !selectedConditions.includes("none") && (
          <Alert className="bg-green-900/50 border-green-700">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-green-200">
              <strong>Selected conditions:</strong> {getSelectedConditionNames().join(", ")}
              <br />
              You'll receive personalized AQI recommendations based on these conditions.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <div className="flex flex-col gap-3 p-4 border-t border-gray-700">
        <div className="flex gap-3">
          <Button
            onClick={() => onComplete(selectedConditions.filter((id) => id !== "none"))}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={selectedConditions.length === 0}
          >
            Save Health Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => onComplete([])}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Skip for Now
          </Button>
        </div>
        <Button
          onClick={handleSubmitAndClose}
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={selectedConditions.length === 0}
        >
          Submit & Close Tab
        </Button>
      </div>
    </Card>
  )
}
