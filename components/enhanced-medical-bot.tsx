"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Heart,
  TreesIcon as Lungs,
  Brain,
  Activity,
  Wind,
  Stethoscope,
} from "lucide-react"
import useNotifications from "@/hooks/use-notifications"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  organImpact?: string[]
  aqiImpact?: {
    level: string
    recommendation: string
    affectedOrgans: string[]
  }
}

// Declare SpeechRecognition interface
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export function EnhancedMedicalBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI medical assistant. I can help analyze symptoms, provide health recommendations, and monitor air quality impacts on your health. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { initializeAudio, isAudioEnabled } = useNotifications()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognitionInstance.onerror = () => {
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const analyzeSymptoms = (text: string) => {
    const symptoms = text.toLowerCase()
    const organImpact: string[] = []
    let aqiImpact = null

    // Organ impact analysis
    if (symptoms.includes("chest pain") || symptoms.includes("heart")) {
      organImpact.push("Cardiovascular System")
    }
    if (symptoms.includes("breathing") || symptoms.includes("cough") || symptoms.includes("lungs")) {
      organImpact.push("Respiratory System")
    }
    if (symptoms.includes("headache") || symptoms.includes("dizzy") || symptoms.includes("brain")) {
      organImpact.push("Nervous System")
    }
    if (symptoms.includes("stomach") || symptoms.includes("nausea") || symptoms.includes("digestive")) {
      organImpact.push("Digestive System")
    }

    // AQI impact analysis
    if (symptoms.includes("breathing") || symptoms.includes("cough") || symptoms.includes("air quality")) {
      aqiImpact = {
        level: "Moderate",
        recommendation: "Consider limiting outdoor activities during high pollution hours",
        affectedOrgans: ["Respiratory System", "Cardiovascular System"],
      }
    }

    return { organImpact, aqiImpact }
  }

  const generateResponse = (userMessage: string) => {
    const analysis = analyzeSymptoms(userMessage)
    let response = ""

    if (userMessage.toLowerCase().includes("chest pain")) {
      response =
        "I understand you're experiencing chest pain. This could be related to various factors including cardiovascular issues, muscle strain, or respiratory problems. I recommend consulting with a healthcare professional immediately if the pain is severe or persistent."
    } else if (userMessage.toLowerCase().includes("breathing") || userMessage.toLowerCase().includes("cough")) {
      response =
        "Breathing difficulties and cough can be related to respiratory conditions, allergies, or air quality issues. Monitor your symptoms and consider checking the current air quality index in your area."
    } else if (userMessage.toLowerCase().includes("headache")) {
      response =
        "Headaches can have various causes including stress, dehydration, air quality, or underlying health conditions. Ensure you're staying hydrated and getting adequate rest."
    } else {
      response =
        "Thank you for sharing your symptoms. Based on your description, I recommend monitoring your condition and consulting with a healthcare professional for a proper evaluation."
    }

    return { response, analysis }
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    // Initialize audio on first interaction
    initializeAudio()

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Generate bot response
    setTimeout(() => {
      const { response, analysis } = generateResponse(inputText)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
        organImpact: analysis.organImpact,
        aqiImpact: analysis.aqiImpact,
      }

      setMessages((prev) => [...prev, botMessage])

      // Text-to-speech for bot response
      if (isAudioEnabled && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(response)
        utterance.rate = 0.8
        utterance.pitch = 1
        utterance.volume = 0.7
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        speechSynthesis.speak(utterance)
      }
    }, 1000)

    setInputText("")
  }

  const handleVoiceInput = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      // Initialize audio on first interaction
      initializeAudio()
      recognition.start()
      setIsListening(true)
    }
  }

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const getOrganIcon = (organ: string) => {
    switch (organ) {
      case "Cardiovascular System":
        return <Heart className="h-4 w-4 text-red-500" />
      case "Respiratory System":
        return <Lungs className="h-4 w-4 text-blue-500" />
      case "Nervous System":
        return <Brain className="h-4 w-4 text-purple-500" />
      case "Digestive System":
        return <Activity className="h-4 w-4 text-green-500" />
      default:
        return <Stethoscope className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-500" />
          Enhanced AI Medical Assistant
          {isSpeaking && <Volume2 className="h-4 w-4 text-green-500 animate-pulse" />}
        </CardTitle>
        <CardDescription>AI-powered symptom analysis with organ impact assessment and AQI monitoring</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot ? "bg-blue-50 border border-blue-200" : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString()}</p>

                  {/* Organ Impact Analysis */}
                  {message.organImpact && message.organImpact.length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Organ Impact Analysis
                      </h4>
                      <ScrollArea className="max-h-24">
                        <div className="space-y-1">
                          {message.organImpact.map((organ, index) => (
                            <div key={index} className="flex items-center gap-2">
                              {getOrganIcon(organ)}
                              <span className="text-xs">{organ}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* AQI Impact Analysis */}
                  {message.aqiImpact && (
                    <div className="mt-3 p-3 bg-orange-50 rounded border border-orange-200">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Wind className="h-4 w-4 text-orange-500" />
                        AQI Impact Assessment
                      </h4>
                      <ScrollArea className="max-h-32">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Level: {message.aqiImpact.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{message.aqiImpact.recommendation}</p>
                          <div className="space-y-1">
                            <p className="text-xs font-medium">Affected Organs:</p>
                            {message.aqiImpact.affectedOrgans.map((organ, index) => (
                              <div key={index} className="flex items-center gap-2">
                                {getOrganIcon(organ)}
                                <span className="text-xs">{organ}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <Separator />

        {/* Input Area */}
        <div className="flex-shrink-0 flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your symptoms or ask a health question..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleVoiceInput} variant="outline" size="icon" disabled={!recognition}>
            {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button onClick={toggleSpeech} variant="outline" size="icon" disabled={!isSpeaking}>
            {isSpeaking ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button onClick={handleSendMessage} disabled={!inputText.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
