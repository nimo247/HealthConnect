"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Stethoscope,
  Menu,
  Home,
  Activity,
  Calendar,
  MapPin,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Wind,
  Brain,
} from "lucide-react"
import { GlobalAIAssistant } from "@/components/global-ai-assistant"
import { RespiratoryConditionsSetup } from "@/components/respiratory-conditions-setup"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [showRespiratorySetup, setShowRespiratorySetup] = useState(false)
  const [userRespiratoryConditions, setUserRespiratoryConditions] = useState<string[]>([])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Health Metrics", href: "/dashboard/health-metrics", icon: Activity },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
    { name: "Find Clinics", href: "/dashboard/find-clinics", icon: MapPin },
    { name: "Health Records", href: "/dashboard/health-records", icon: FileText },
    { name: "Air Quality", href: "/dashboard/air-quality", icon: Wind },
    { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  ]

  const isActive = (path: string) => pathname === path

  // Check for existing respiratory conditions on mount
  useEffect(() => {
    const savedConditions = localStorage.getItem("respiratoryConditions")
    if (savedConditions) {
      try {
        const conditions = JSON.parse(savedConditions)
        setUserRespiratoryConditions(conditions)
      } catch (error) {
        console.error("Error parsing saved respiratory conditions:", error)
      }
    } else {
      // Show setup if no conditions are saved
      setShowRespiratorySetup(true)
    }
  }, [])

  const handleRespiratoryConditionsComplete = (conditions: string[]) => {
    setUserRespiratoryConditions(conditions)
    localStorage.setItem("respiratoryConditions", JSON.stringify(conditions))
    setShowRespiratorySetup(false)
  }

  const openAIAssistant = () => {
    setIsAIAssistantOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Respiratory Conditions Setup Modal */}
      {showRespiratorySetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <RespiratoryConditionsSetup
            onComplete={handleRespiratoryConditionsComplete}
            initialConditions={userRespiratoryConditions}
          />
        </div>
      )}

      {/* Mobile Header */}
      <header className="lg:hidden bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-green-400" />
          <h1 className="text-xl font-bold text-white">HealthConnect</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={openAIAssistant} className="text-white hover:bg-gray-700">
            <Brain className="h-5 w-5" />
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-gray-800 border-gray-700">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 py-4">
                  <Stethoscope className="h-6 w-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">HealthConnect</h2>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? "bg-green-600/20 text-green-400 border border-green-600/30"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto border-t border-gray-700 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      openAIAssistant()
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full justify-start"
                  >
                    <Brain className="h-5 w-5" />
                    AI Assistant
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setShowRespiratorySetup(true)
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full justify-start"
                  >
                    <Settings className="h-5 w-5" />
                    Health Profile
                  </Button>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex h-screen overflow-hidden bg-gray-900 lg:pt-0 pt-16">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-700">
            <Stethoscope className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">HealthConnect</h2>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-green-600/20 text-green-400 border border-green-600/30"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}

              <Button
                variant="ghost"
                onClick={openAIAssistant}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full justify-start"
              >
                <Brain className="h-5 w-5" />
                AI Assistant
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowRespiratorySetup(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full justify-start"
              >
                <MessageSquare className="h-5 w-5" />
                Health Profile
              </Button>
            </nav>
            <div className="border-t border-gray-700 p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback className="bg-gray-700 text-white">JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">john.doe@example.com</p>
                </div>
              </div>
              {userRespiratoryConditions.length > 0 && (
                <div className="mb-4 p-2 bg-blue-900/30 rounded-lg">
                  <p className="text-xs text-blue-300 mb-1">Health Conditions:</p>
                  <div className="flex flex-wrap gap-1">
                    {userRespiratoryConditions.slice(0, 2).map((condition, index) => (
                      <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {condition}
                      </span>
                    ))}
                    {userRespiratoryConditions.length > 2 && (
                      <span className="text-xs text-blue-400">+{userRespiratoryConditions.length - 2} more</span>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                  Log Out
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6 relative z-10">{children}</main>
      </div>

      {/* Global AI Assistant */}
      <GlobalAIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        userRespiratoryConditions={userRespiratoryConditions}
      />
    </div>
  )
}
