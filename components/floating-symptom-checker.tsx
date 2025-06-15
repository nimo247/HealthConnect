"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mic, MicOff, Volume2, VolumeX, X, Minimize2, Maximize2, Bot, User } from "lucide-react"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: Date
  analysis?: SymptomAnalysis
}

interface SymptomAnalysis {
  possibleConditions: Array<{
    name: string
    probability: number
    severity: "low" | "medium" | "high"
    description: string
  }>
  recommendations: string[]
  urgency: "low" | "medium" | "high" | "emergency"
}

interface FloatingSymptomCheckerProps {
  isOpen: boolean
  onClose: () => void
}

export function FloatingSymptomChecker({ isOpen, onClose }: FloatingSymptomCheckerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI health assistant. Describe your symptoms and I'll help analyze them. You can type or use voice input!",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Speech Recognition
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

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }

      // Speech Synthesis
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
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
    if (synthRef.current) {
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

  // Medical AI Analysis (simulating Hugging Face Medical-bot)
  const analyzeSymptoms = async (symptoms: string): Promise<SymptomAnalysis> => {
    // Simulate API call to Hugging Face Medical-bot
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Enhanced medical analysis based on keywords
    const lowerSymptoms = symptoms.toLowerCase()
    let analysis: SymptomAnalysis

    if (lowerSymptoms.includes("chest pain") || lowerSymptoms.includes("heart")) {
      analysis = {
        possibleConditions: [
          {
            name: "Angina",
            probability: 65,
            severity: "high",
            description: "Chest pain due to reduced blood flow to the heart",
          },
          {
            name: "Muscle Strain",
            probability: 30,
            severity: "low",
            description: "Chest muscle strain from physical activity",
          },
          { name: "Anxiety", probability: 25, severity: "medium", description: "Anxiety-related chest discomfort" },
        ],
        recommendations: [
          "Seek immediate medical attention if pain is severe",
          "Avoid strenuous activities",
          "Monitor for additional symptoms like shortness of breath",
        ],
        urgency: "high",
      }
    } else if (lowerSymptoms.includes("fever") || lowerSymptoms.includes("temperature")) {
      analysis = {
        possibleConditions: [
          {
            name: "Viral Infection",
            probability: 70,
            severity: "medium",
            description: "Common viral illness causing fever",
          },
          {
            name: "Bacterial Infection",
            probability: 45,
            severity: "medium",
            description: "Bacterial infection requiring treatment",
          },
          { name: "Flu", probability: 60, severity: "medium", description: "Seasonal influenza" },
        ],
        recommendations: [
          "Rest and stay hydrated",
          "Monitor temperature regularly",
          "Consider over-the-counter fever reducers",
          "Consult doctor if fever persists over 3 days",
        ],
        urgency: "medium",
      }
    } else if (lowerSymptoms.includes("headache") || lowerSymptoms.includes("head")) {
      analysis = {
        possibleConditions: [
          { name: "Tension Headache", probability: 75, severity: "low", description: "Common stress-related headache" },
          {
            name: "Migraine",
            probability: 40,
            severity: "medium",
            description: "Severe headache with possible nausea",
          },
          { name: "Sinus Headache", probability: 35, severity: "low", description: "Headache due to sinus congestion" },
        ],
        recommendations: [
          "Rest in a quiet, dark room",
          "Stay hydrated",
          "Consider over-the-counter pain relievers",
          "Apply cold or warm compress",
        ],
        urgency: "low",
      }
    } else {
      // Default analysis for general symptoms
      analysis = {
        possibleConditions: [
          { name: "Common Cold", probability: 60, severity: "low", description: "Viral upper respiratory infection" },
          { name: "Allergic Reaction", probability: 40, severity: "low", description: "Environmental or food allergy" },
          { name: "Stress Response", probability: 30, severity: "low", description: "Physical symptoms due to stress" },
        ],
        recommendations: [
          "Get adequate rest",
          "Stay hydrated",
          "Monitor symptoms for changes",
          "Consult healthcare provider if symptoms worsen",
        ],
        urgency: "low",
      }
    }

    return analysis
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

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

      // Speak the response
      speakText(botResponse)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateBotResponse = (analysis: SymptomAnalysis): string => {
    const topCondition = analysis.possibleConditions[0]
    return `Based on your symptoms, the most likely condition appears to be ${topCondition.name} with ${topCondition.probability}% probability. This is typically a ${topCondition.severity} severity condition. ${topCondition.description}.`
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="bg-gray-800/95 backdrop-blur-sm border-green-500/30 shadow-2xl shadow-green-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Health Assistant
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
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-64 overflow-y-auto space-y-3 pr-2">
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
                      className={`p-2 rounded-lg text-sm ${
                        message.type === "user" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <p>{message.content}</p>
                      {message.analysis && (
                        <div className="mt-2 space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {message.analysis.possibleConditions.slice(0, 2).map((condition, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {condition.name} ({condition.probability}%)
                              </Badge>
                            ))}
                          </div>
                          <Badge
                            className={`text-xs ${
                              message.analysis.urgency === "high"
                                ? "bg-red-500"
                                : message.analysis.urgency === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          >
                            {message.analysis.urgency} priority
                          </Badge>
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
                  <div className="bg-gray-700 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
                      <p className="text-xs text-gray-300">Analyzing symptoms...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your symptoms or use voice input..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-[60px]"
                disabled={isAnalyzing}
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isAnalyzing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Send
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isAnalyzing}
                  className={`border-gray-600 ${isListening ? "bg-red-500/20 text-red-400" : "text-gray-400"}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  disabled={!isSpeaking}
                  className={`border-gray-600 ${isSpeaking ? "bg-blue-500/20 text-blue-400" : "text-gray-400"}`}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
