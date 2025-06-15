"use client"

import { Heart, Stethoscope, Pill, Activity, Shield, Thermometer, Syringe, Cross, Zap, Droplets } from "lucide-react"

const medicalIcons = [Heart, Stethoscope, Pill, Activity, Shield, Thermometer, Syringe, Cross, Zap, Droplets]

interface FloatingElement {
  id: number
  Icon: any
  size: number
  duration: number
  delay: number
  startX: number
  endX: number
  startY: number
  endY: number
  opacity: number
}

export function FloatingMedicalElements() {
  // Generate random floating elements
  const elements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    Icon: medicalIcons[Math.floor(Math.random() * medicalIcons.length)],
    size: Math.random() * 20 + 16, // 16-36px
    duration: Math.random() * 20 + 15, // 15-35s
    delay: Math.random() * 10, // 0-10s delay
    startX: Math.random() * 100, // 0-100%
    endX: Math.random() * 100, // 0-100%
    startY: Math.random() * 100, // 0-100%
    endY: Math.random() * 100, // 0-100%
    opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4 opacity
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => {
        const { id, Icon, size, duration, delay, startX, endX, startY, endY, opacity } = element

        return (
          <div
            key={id}
            className="absolute animate-float"
            style={
              {
                left: `${startX}%`,
                top: `${startY}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                "--end-x": `${endX}%`,
                "--end-y": `${endY}%`,
              } as any
            }
          >
            <Icon size={size} className="text-green-500/20 dark:text-green-400/20" style={{ opacity }} />
          </div>
        )
      })}

      {/* Additional pulsing elements */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`pulse-${i}`}
          className="absolute animate-pulse-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          <div
            className="w-2 h-2 bg-green-500/10 dark:bg-green-400/10 rounded-full"
            style={{
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
