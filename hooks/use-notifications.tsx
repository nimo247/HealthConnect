"use client"

import { useEffect, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  title: string
  description: string
  type: "pill" | "appointment" | "aqi" | "medicine"
  priority: "low" | "medium" | "high" | "critical"
}

const useNotifications = () => {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined" && isAudioEnabled) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(context)
      } catch (error) {
        console.warn("Web Audio API not supported:", error)
      }
    }
  }, [isAudioEnabled])

  const generateBeep = useCallback(
    (frequency = 800, duration = 200, volume = 0.3) => {
      if (!audioContext || !isAudioEnabled) return Promise.resolve()

      return new Promise<void>((resolve) => {
        try {
          // Resume audio context if suspended
          if (audioContext.state === "suspended") {
            audioContext.resume()
          }

          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + duration / 1000)

          oscillator.onended = () => resolve()
        } catch (error) {
          console.error("Error generating beep:", error)
          resolve()
        }
      })
    },
    [audioContext, isAudioEnabled],
  )

  const playBeepSound = useCallback(
    async (soundType: string, priority: "low" | "medium" | "high" | "critical") => {
      if (!isAudioEnabled || !audioContext) return

      try {
        // Different beep patterns for different types and priorities
        const beepPatterns = {
          pill: { frequency: 800, duration: 300 },
          appointment: { frequency: 600, duration: 400 },
          aqi: { frequency: 1000, duration: 500 },
          medicine: { frequency: 900, duration: 350 },
        }

        const pattern = beepPatterns[soundType as keyof typeof beepPatterns] || beepPatterns.pill
        const volume = priority === "critical" ? 0.5 : priority === "high" ? 0.4 : 0.3

        // Play multiple beeps for higher priority
        const playCount = priority === "critical" ? 3 : priority === "high" ? 2 : 1

        for (let i = 0; i < playCount; i++) {
          await generateBeep(pattern.frequency, pattern.duration, volume)
          if (i < playCount - 1) {
            // Wait between beeps
            await new Promise((resolve) => setTimeout(resolve, 200))
          }
        }
      } catch (error) {
        console.error("Error playing beep sound:", error)
      }
    },
    [isAudioEnabled, audioContext, generateBeep],
  )

  const showNotification = useCallback(
    (notification: Notification) => {
      // Play beep sound first
      playBeepSound(notification.type, notification.priority)

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.description,
        variant: notification.priority === "critical" || notification.priority === "high" ? "destructive" : "default",
        duration: notification.priority === "critical" ? 10000 : notification.priority === "high" ? 7000 : 5000,
      })

      setNotifications((prev) => [...prev, notification])
    },
    [toast, playBeepSound],
  )

  const checkMedicineAlerts = useCallback(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Example medicine schedule - in real app this would come from user's medicine data
    const medicineSchedule = [
      { name: "Blood Pressure Medication", time: "08:00", priority: "high" as const },
      { name: "Vitamin D", time: "12:00", priority: "medium" as const },
      { name: "Evening Medication", time: "20:00", priority: "high" as const },
    ]

    medicineSchedule.forEach((medicine) => {
      const [scheduleHour, scheduleMinute] = medicine.time.split(":").map(Number)

      if (currentHour === scheduleHour && currentMinute === scheduleMinute) {
        showNotification({
          id: `medicine-${Date.now()}`,
          title: "💊 Medicine Reminder",
          description: `Time to take your ${medicine.name}`,
          type: "medicine",
          priority: medicine.priority,
        })
      }
    })
  }, [showNotification])

  const checkAQIAlerts = useCallback(
    (currentAQI: number) => {
      if (currentAQI > 200) {
        showNotification({
          id: `aqi-critical-${Date.now()}`,
          title: "🚨 Critical AQI Alert",
          description: `Air quality is hazardous (AQI: ${currentAQI}). Stay indoors and avoid all outdoor activities.`,
          type: "aqi",
          priority: "critical",
        })
      } else if (currentAQI > 150) {
        showNotification({
          id: `aqi-high-${Date.now()}`,
          title: "⚠️ High AQI Alert",
          description: `Air quality is unhealthy (AQI: ${currentAQI}). Limit outdoor exposure.`,
          type: "aqi",
          priority: "high",
        })
      }
    },
    [showNotification],
  )

  const checkAppointmentReminders = useCallback(() => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Example: Check for appointments tomorrow
    const upcomingAppointments = [{ doctor: "Dr. Sarah Johnson", time: "10:00 AM", date: tomorrow.toDateString() }]

    upcomingAppointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date)
      const timeDiff = appointmentDate.getTime() - now.getTime()
      const hoursDiff = timeDiff / (1000 * 3600)

      if (hoursDiff <= 24 && hoursDiff > 23) {
        // 24 hours before
        showNotification({
          id: `appointment-24h-${Date.now()}`,
          title: "📅 Appointment Reminder",
          description: `You have an appointment with ${appointment.doctor} tomorrow at ${appointment.time}`,
          type: "appointment",
          priority: "medium",
        })
      } else if (hoursDiff <= 1 && hoursDiff > 0) {
        // 1 hour before
        showNotification({
          id: `appointment-1h-${Date.now()}`,
          title: "🏥 Appointment Starting Soon",
          description: `Your appointment with ${appointment.doctor} starts in 1 hour`,
          type: "appointment",
          priority: "high",
        })
      }
    })
  }, [showNotification])

  // Initialize audio context on user interaction
  const initializeAudio = useCallback(() => {
    if (!audioContext && isAudioEnabled && typeof window !== "undefined") {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(context)
        if (context.state === "suspended") {
          context.resume()
        }
      } catch (error) {
        console.warn("Could not initialize audio context:", error)
      }
    }
  }, [audioContext, isAudioEnabled])

  useEffect(() => {
    // Add click listener to initialize audio context on first user interaction
    const handleUserInteraction = () => {
      initializeAudio()
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [initializeAudio])

  useEffect(() => {
    // Check medicine alerts every minute
    const medicineInterval = setInterval(checkMedicineAlerts, 60000)

    // Check appointment reminders every hour
    const appointmentInterval = setInterval(checkAppointmentReminders, 3600000)

    // Simulate initial notifications for demo (after a delay to allow audio context setup)
    const demoTimeout = setTimeout(() => {
      showNotification({
        id: "demo-pill",
        title: "💊 Medicine Reminder",
        description: "Time to take your morning blood pressure medication",
        type: "medicine",
        priority: "high",
      })
    }, 5000)

    const demoAQITimeout = setTimeout(() => {
      showNotification({
        id: "demo-aqi",
        title: "⚠️ AQI Alert",
        description: "Air quality has exceeded safe limits (AQI: 165). Consider staying indoors.",
        type: "aqi",
        priority: "high",
      })
    }, 10000)

    return () => {
      clearInterval(medicineInterval)
      clearInterval(appointmentInterval)
      clearTimeout(demoTimeout)
      clearTimeout(demoAQITimeout)
    }
  }, [checkMedicineAlerts, checkAppointmentReminders, showNotification])

  return {
    notifications,
    showNotification,
    checkAQIAlerts,
    isAudioEnabled,
    setIsAudioEnabled,
    initializeAudio,
  }
}

export default useNotifications
