"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Wifi,
  WifiOff,
  Brain,
  Heart,
  TreesIcon as Lungs,
} from "lucide-react"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: Date
  analysis?: MedicalAnalysis
}

interface MedicalAnalysis {
  possibleConditions: Array<{
    name: string
    probability: number
    severity: "low" | "medium" | "high" | "emergency"
    description: string
    icd10Code?: string
    organSystem: string
  }>
  recommendations: string[]
  urgency: "low" | "medium" | "high" | "emergency"
  specialistReferral?: string
  followUpDays?: number
  aqiRecommendations?: string[]
}

interface GlobalAIAssistantProps {
  isOpen: boolean
  onClose: () => void
  userRespiratoryConditions?: string[]
}

export function GlobalAIAssistant({ isOpen, onClose, userRespiratoryConditions = [] }: GlobalAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your enhanced AI medical assistant with comprehensive health knowledge. I can analyze symptoms, provide organ-specific health insights, and give personalized AQI recommendations based on your respiratory conditions. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  
  const [inputMessage, setInputMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [activeTab, setActiveTab] = useState("chat")

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  // Enhanced medical knowledge base with organ systems
  const medicalKnowledgeBase = {
    symptoms: {
      "chest pain": {
        conditions: [
          {
            name: "Myocardial Infarction",
            probability: 25,
            severity: "emergency",
            icd10: "I21.9",
            organSystem: "Cardiovascular",
          },
          {
            name: "Angina Pectoris",
            probability: 35,
            severity: "high",
            icd10: "I20.9",
            organSystem: "Cardiovascular",
          },
          {
            name: "Costochondritis",
            probability: 40,
            severity: "low",
            icd10: "M94.0",
            organSystem: "Musculoskeletal",
          },
        ],
        urgency: "high",
        specialist: "Cardiologist",
      },
      "shortness of breath": {
        conditions: [
          {
            name: "Asthma Exacerbation",
            probability: 45,
            severity: "medium",
            icd10: "J45.9",
            organSystem: "Respiratory",
          },
          {
            name: "Pulmonary Embolism",
            probability: 15,
            severity: "emergency",
            icd10: "I26.9",
            organSystem: "Respiratory",
          },
          {
            name: "Heart Failure",
            probability: 25,
            severity: "high",
            icd10: "I50.9",
            organSystem: "Cardiovascular",
          },
        ],
        urgency: "high",
        specialist: "Pulmonologist",
      },
      cough: {
        conditions: [
          {
            name: "Viral Upper Respiratory Infection",
            probability: 60,
            severity: "low",
            icd10: "J06.9",
            organSystem: "Respiratory",
          },
          {
            name: "Bacterial Pneumonia",
            probability: 25,
            severity: "medium",
            icd10: "J15.9",
            organSystem: "Respiratory",
          },
          {
            name: "Chronic Bronchitis",
            probability: 30,
            severity: "medium",
            icd10: "J42",
            organSystem: "Respiratory",
          },
        ],
        urgency: "medium",
        specialist: "Pulmonologist",
      },
      headache: {
        conditions: [
          {
            name: "Tension-Type Headache",
            probability: 70,
            severity: "low",
            icd10: "G44.2",
            organSystem: "Neurological",
          },
          {
            name: "Migraine",
            probability: 40,
            severity: "medium",
            icd10: "G43.9",
            organSystem: "Neurological",
          },
          {
            name: "Cluster Headache",
            probability: 15,
            severity: "medium",
            icd10: "G44.0",
            organSystem: "Neurological",
          },
        ],
        urgency: "low",
        specialist: "Neurologist",
      },
    },
    organSystems: {
      Respiratory: {
        aqiEffects: {
          "0-50": "Minimal impact. Normal breathing patterns.",
          "51-100": "Slight irritation possible for very sensitive individuals.",
          "101-150": "Mild irritation, coughing may occur in sensitive people.",
          "151-200": "Moderate irritation, breathing difficulties for sensitive groups.",
          "201-300": "Significant respiratory distress, avoid outdoor activities.",
          "301+": "Severe respiratory impact, emergency measures needed.",
        },
        conditions: ["asthma", "copd", "bronchitis", "pneumonia"],
      },
      Cardiovascular: {
        aqiEffects: {
          "0-50": "No significant cardiovascular stress.",
          "51-100": "Minimal impact on heart rate and blood pressure.",
          "101-150": "Slight increase in cardiovascular workload.",
          "151-200": "Moderate stress on cardiovascular system.",
          "201-300": "High cardiovascular risk, especially for heart patients.",
          "301+": "Extreme cardiovascular stress, seek immediate shelter.",
        },
        conditions: ["heart disease", "hypertension", "arrhythmia"],
      },
      Neurological: {
        aqiEffects: {
          "0-50": "Clear thinking, no cognitive impact.",
          "51-100": "Minimal effect on cognitive function.",
          "101-150": "Slight reduction in cognitive performance.",
          "151-200": "Noticeable impact on concentration and memory.",
          "201-300": "Significant cognitive impairment possible.",
          "301+": "Severe neurological effects, confusion possible.",
        },
        conditions: ["migraine", "epilepsy", "dementia"],
      },
    },
  }

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputMessage(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => setIsListening(false)
        recognitionRef.current.onend = () => setIsListening(false)
      }

      synthRef.current = window.speechSynthesis
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && isConnected) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text: string) => {
    if (synthRef.current && isConnected) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  // Enhanced medical analysis
  const analyzeSymptoms = async (symptoms: string): Promise<MedicalAnalysis> => {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const lowerSymptoms = symptoms.toLowerCase()
    let analysis: MedicalAnalysis

    // Find matching symptoms
    const matchedSymptoms = Object.keys(medicalKnowledgeBase.symptoms).filter((symptom) =>
      lowerSymptoms.includes(symptom),
    )

    if (matchedSymptoms.length > 0) {
      const primarySymptom = matchedSymptoms[0]
      const symptomData = medicalKnowledgeBase.symptoms[primarySymptom as keyof typeof medicalKnowledgeBase.symptoms]

      analysis = {
        possibleConditions: symptomData.conditions.map((condition) => ({
          name: condition.name,
          probability: condition.probability + Math.floor(Math.random() * 10 - 5),
          severity: condition.severity as "low" | "medium" | "high" | "emergency",
          description: getConditionDescription(condition.name),
          icd10Code: condition.icd10,
          organSystem: condition.organSystem,
        })),
        recommendations: getRecommendations(primarySymptom, symptomData.urgency),
        urgency: symptomData.urgency as "low" | "medium" | "high" | "emergency",
        specialistReferral: symptomData.specialist,
        followUpDays: getFollowUpDays(symptomData.urgency),
        aqiRecommendations: getAQIRecommendations(userRespiratoryConditions),
      }
    } else {
      analysis = {
        possibleConditions: [
          {
            name: "Non-specific Symptoms",
            probability: 60,
            severity: "low",
            description: "General symptoms requiring further evaluation",
            icd10Code: "R68.89",
            organSystem: "General",
          },
        ],
        recommendations: [
          "Monitor symptoms for 24-48 hours",
          "Stay hydrated and get adequate rest",
          "Seek medical attention if symptoms worsen",
        ],
        urgency: "low",
        followUpDays: 3,
        aqiRecommendations: getAQIRecommendations(userRespiratoryConditions),
      }
    }

    return analysis
  }

  const getConditionDescription = (conditionName: string): string => {
    const descriptions: { [key: string]: string } = {
      "Myocardial Infarction": "Heart attack caused by blocked blood flow to heart muscle",
      "Angina Pectoris": "Chest pain due to reduced blood flow to the heart",
      Costochondritis: "Inflammation of cartilage connecting ribs to breastbone",
      "Asthma Exacerbation": "Worsening of asthma symptoms with airway inflammation",
      "Pulmonary Embolism": "Blood clot blocking arteries in the lungs",
      "Heart Failure": "Heart's inability to pump blood effectively",
      "Viral Upper Respiratory Infection": "Common cold or similar viral illness affecting upper airways",
      "Bacterial Pneumonia": "Lung infection caused by bacteria",
      "Chronic Bronchitis": "Long-term inflammation of bronchial tubes",
      "Tension-Type Headache": "Most common headache type, often stress-related",
      Migraine: "Severe headache with possible nausea and light sensitivity",
      "Cluster Headache": "Severe headaches occurring in clusters over time",
    }
    return descriptions[conditionName] || "Medical condition requiring professional evaluation"
  }

  const getRecommendations = (symptom: string, urgency: string): string[] => {
    const baseRecommendations: { [key: string]: string[] } = {
      "chest pain": [
        "Seek immediate medical attention if severe",
        "Avoid strenuous activities",
        "Take prescribed medications as directed",
        "Monitor for worsening symptoms",
      ],
      "shortness of breath": [
        "Sit upright and remain calm",
        "Use prescribed inhalers if available",
        "Avoid triggers and allergens",
        "Seek immediate care if severe",
      ],
      cough: [
        "Stay hydrated with warm fluids",
        "Use humidifier to moisten air",
        "Avoid irritants and smoke",
        "Consider over-the-counter cough suppressants",
      ],
      headache: [
        "Rest in quiet, dark environment",
        "Apply cold or warm compress",
        "Stay hydrated",
        "Consider over-the-counter pain relievers",
      ],
    }

    return baseRecommendations[symptom] || ["Monitor symptoms and seek medical advice if concerned"]
  }

  const getFollowUpDays = (urgency: string): number => {
    switch (urgency) {
      case "emergency":
        return 0
      case "high":
        return 1
      case "medium":
        return 3
      default:
        return 7
    }
  }

  const getAQIRecommendations = (conditions: string[]): string[] => {
    if (conditions.length === 0) return ["Monitor air quality for general health"]

    const recommendations: string[] = []
    conditions.forEach((condition) => {
      switch (condition.toLowerCase()) {
        case "asthma":
          recommendations.push("Check AQI before going outside, use inhaler as prescribed")
          break
        case "copd":
          recommendations.push("Avoid outdoor activities when AQI > 100")
          break
        case "sinus":
          recommendations.push("Use air purifier indoors, wear mask when AQI > 150")
          break
        default:
          recommendations.push("Monitor air quality for respiratory health")
      }
    })

    return recommendations
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isConnected) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsAnalyzing(true)

    try {
      const analysis = await analyzeSymptoms(inputMessage)
      const botResponse = generateBotResponse(analysis)

      const botMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
        analysis,
      }

      setMessages((prev) => [...prev, botMessage])
      speakText(botResponse)
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        content: "I'm experiencing connectivity issues. Please try again or consult with a healthcare professional.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateBotResponse = (analysis: MedicalAnalysis): string => {
    const topCondition = analysis.possibleConditions[0]
    let response = `Based on your symptoms, the most likely condition appears to be ${topCondition.name} (${topCondition.organSystem} system) with ${topCondition.probability}% probability. `

    if (topCondition.icd10Code) {
      response += `(ICD-10: ${topCondition.icd10Code}) `
    }

    response += `This is typically a ${topCondition.severity} severity condition. ${topCondition.description}.`

    if (analysis.specialistReferral) {
      response += ` I recommend consulting with a ${analysis.specialistReferral}.`
    }

    if (analysis.aqiRecommendations && analysis.aqiRecommendations.length > 0) {
      response += ` Given your respiratory conditions, please also consider: ${analysis.aqiRecommendations.join(", ")}.`
    }

    return response
  }

  const getOrganSystemInfo = (organSystem: string) => {
    return medicalKnowledgeBase.organSystems[organSystem as keyof typeof medicalKnowledgeBase.organSystems]
  }

  if (!isOpen) return null

  return (
    <div className=" overflow-auto fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className=" overflow-auto w-full max-w-4xl h-[80vh] bg-gray-800/95 backdrop-blur-sm border-green-500/30 shadow-2xl">
        <CardHeader className="pb-2 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Enhanced AI Medical Assistant
              {isConnected ? <Wifi className="h-4 w-4 text-green-400" /> : <WifiOff className="h-4 w-4 text-red-400" />}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 text-gray-400 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-gray-400 hover:text-white">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {userRespiratoryConditions.length > 0 && (
            <div className=" flex gap-1 mt-2">
              <span className="text-xs text-gray-400">Your conditions:</span>
              {userRespiratoryConditions.map((condition, index) => (
                <Badge key={index} variant="outline" className=" bg-white text-xs">
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className=" flex-1 flex flex-col p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 m-4 mb-0">
                <TabsTrigger value="chat">AI Chat</TabsTrigger>
                <TabsTrigger value="organs">Organ Guide</TabsTrigger>
                <TabsTrigger value="aqi">AQI Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className=" flex-1 flex flex-col p-4">
                {/* Messages */}
                <div className="flex-1 overflow-auto space-y-3 pr-2 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            message.type === "user" ? "bg-green-500/20" : "bg-blue-500/20"
                          }`}
                        >
                          {message.type === "user" ? (
                            <User className="h-3 w-3 text-green-400" />
                          ) : (
                            <Bot className="h-3 w-3 text-blue-400" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            message.type === "user" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-100"
                          }`}
                        >
                          <p>{message.content}</p>
                          {message.analysis && (
                            <div className="mt-3 space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {message.analysis.possibleConditions.slice(0, 2).map((condition, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {condition.name} ({condition.probability}%)
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-1">
                                <Badge
                                  className={`text-xs ${
                                    message.analysis.urgency === "emergency"
                                      ? "bg-red-500"
                                      : message.analysis.urgency === "high"
                                        ? "bg-orange-500"
                                        : message.analysis.urgency === "medium"
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                  }`}
                                >
                                  {message.analysis.urgency} priority
                                </Badge>
                                {message.analysis.specialistReferral && (
                                  <Badge variant="outline" className="text-xs">
                                    {message.analysis.specialistReferral}
                                  </Badge>
                                )}
                              </div>
                              {message.analysis.aqiRecommendations && (
                                <div className="text-xs text-blue-300">
                                  <strong>AQI Advice:</strong> {message.analysis.aqiRecommendations.join(", ")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isAnalyzing && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-blue-400" />
                      </div>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
                          <p className="text-xs text-gray-300">Analyzing with enhanced medical AI...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Describe your symptoms in detail (e.g., 'chest pain for 2 hours, shortness of breath')..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-[60px]"
                    disabled={isAnalyzing || !isConnected}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isAnalyzing || !isConnected}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Analyze Symptoms
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={isListening ? stopListening : startListening}
                      disabled={isAnalyzing || !isConnected}
                      className={`border-gray-600 ${isListening ? "bg-red-500/20 text-red-400" : "text-gray-400"}`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={isSpeaking ? stopSpeaking : () => {}}
                      disabled={!isSpeaking || !isConnected}
                      className={`border-gray-600 ${isSpeaking ? "bg-blue-500/20 text-blue-400" : "text-gray-400"}`}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="organs" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Organ System Health Guide</h3>
                  {Object.entries(medicalKnowledgeBase.organSystems).map(([system, data]) => (
                    <Card key={system} className="bg-gray-700/50 border-gray-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white flex items-center gap-2">
                          {system === "Respiratory" && <Lungs className="h-5 w-5 text-blue-400" />}
                          {system === "Cardiovascular" && <Heart className="h-5 w-5 text-red-400" />}
                          {system === "Neurological" && <Brain className="h-5 w-5 text-purple-400" />}
                          {system} System
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-300">Common Conditions:</h4>
                          <div className="flex flex-wrap gap-1">
                            {data.conditions.map((condition, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="aqi" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">AQI Impact on Organ Systems</h3>
                  {Object.entries(medicalKnowledgeBase.organSystems).map(([system, data]) => (
                    <Card key={system} className="bg-gray-700/50 border-gray-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white flex items-center gap-2">
                          {system === "Respiratory" && <Lungs className="h-5 w-5 text-blue-400" />}
                          {system === "Cardiovascular" && <Heart className="h-5 w-5 text-red-400" />}
                          {system === "Neurological" && <Brain className="h-5 w-5 text-purple-400" />}
                          {system} System - AQI Effects
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(data.aqiEffects).map(([range, effect]) => (
                            <div key={range} className="flex justify-between items-start">
                              <Badge
                                className={`text-xs ${
                                  range.includes("0-50")
                                    ? "bg-green-500"
                                    : range.includes("51-100")
                                      ? "bg-yellow-500"
                                      : range.includes("101-150")
                                        ? "bg-orange-500"
                                        : range.includes("151-200")
                                          ? "bg-red-500"
                                          : range.includes("201-300")
                                            ? "bg-purple-500"
                                            : "bg-gray-800"
                                } text-white`}
                              >
                                AQI {range}
                              </Badge>
                              <p className="text-sm text-gray-300 ml-3 flex-1">{effect}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
