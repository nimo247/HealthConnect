"use client"

import { Stethoscope, Heart, Activity } from "lucide-react"

export function HealthLogo() {
  return (
    <div className="fixed bottom-4 right-4 z-40 group cursor-pointer">
      <div className="relative">
        {/* Main logo container */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full shadow-2xl shadow-green-500/30 border-2 border-green-400/50 backdrop-blur-sm group-hover:scale-110 transition-all duration-300">
          <Stethoscope className="h-8 w-8 text-white" />
        </div>

        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border border-green-400/20 animate-pulse"></div>

        {/* Floating mini icons */}
        <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: "0.5s" }}>
          <Heart className="h-4 w-4 text-red-400" />
        </div>
        <div className="absolute -bottom-2 -left-2 animate-bounce" style={{ animationDelay: "1s" }}>
          <Activity className="h-4 w-4 text-blue-400" />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          HealthConnect AI
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    </div>
  )
}
