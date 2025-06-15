"use client"

import { useEffect, useState } from "react"
import { Heart, Star, Sparkles, Zap, Sun, Moon, Coffee, Smile } from "lucide-react"

const cheerfulIcons = [Heart, Star, Sparkles, Zap, Sun, Moon, Coffee, Smile]
const colors = [
  "text-pink-400",
  "text-yellow-400",
  "text-blue-400",
  "text-green-400",
  "text-purple-400",
  "text-orange-400",
]

interface PopElement {
  id: number
  Icon: any
  color: string
  x: number
  y: number
  delay: number
  size: number
}

export function PoppingAnimations() {
  const [popElements, setPopElements] = useState<PopElement[]>([])

  useEffect(() => {
    // Generate random popping elements
    const elements: PopElement[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      Icon: cheerfulIcons[Math.floor(Math.random() * cheerfulIcons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 16 + 16, // 16-32px
    }))

    setPopElements(elements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {popElements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-pop-bounce"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: "3s",
          }}
        >
          <element.Icon size={element.size} className={`${element.color} opacity-60 drop-shadow-lg`} />
        </div>
      ))}

      {/* Floating bubbles */}
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={`bubble-${i}`}
          className="absolute animate-float-up"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 8 + 6}s`,
          }}
        >
          <div
            className="w-4 h-4 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full backdrop-blur-sm border border-white/10"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
            }}
          />
        </div>
      ))}

      {/* Sparkle effects */}
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        >
          <Sparkles className="h-6 w-6 text-yellow-400/60" />
        </div>
      ))}
    </div>
  )
}
