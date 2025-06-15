"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Bell, Volume2, Clock, Pill, Calendar, Wind, TestTube } from "lucide-react"
import useNotifications from "@/hooks/use-notifications"

export function NotificationSettings() {
  const { isAudioEnabled, setIsAudioEnabled, showNotification, initializeAudio } = useNotifications()
  const [pillReminders, setPillReminders] = useState(true)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [aqiAlerts, setAQIAlerts] = useState(true)
  const [medicalAlerts, setMedicalAlerts] = useState(true)
  const [volume, setVolume] = useState([80])
  const [reminderFrequency, setReminderFrequency] = useState([15]) // minutes

  const testNotification = (type: "pill" | "appointment" | "aqi" | "medicine") => {
    // Initialize audio context on user interaction
    initializeAudio()

    const notifications = {
      pill: {
        id: `test-pill-${Date.now()}`,
        title: "💊 Test Pill Reminder",
        description: "This is a test pill reminder notification with beep sound",
        type: "pill" as const,
        priority: "medium" as const,
      },
      appointment: {
        id: `test-appointment-${Date.now()}`,
        title: "📅 Test Appointment Reminder",
        description: "This is a test appointment reminder notification with beep sound",
        type: "appointment" as const,
        priority: "medium" as const,
      },
      aqi: {
        id: `test-aqi-${Date.now()}`,
        title: "🌬️ Test AQI Alert",
        description: "This is a test AQI alert notification with beep sound",
        type: "aqi" as const,
        priority: "high" as const,
      },
      medicine: {
        id: `test-medicine-${Date.now()}`,
        title: "💊 Test Medicine Alert",
        description: "This is a test medicine alert notification with beep sound",
        type: "medicine" as const,
        priority: "high" as const,
      },
    }

    showNotification(notifications[type])
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>Configure your health notifications and sound alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Sound Notifications</Label>
              <p className="text-sm text-gray-500">Enable beep sounds for all notifications</p>
            </div>
            <Switch checked={isAudioEnabled} onCheckedChange={setIsAudioEnabled} />
          </div>

          {isAudioEnabled && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Volume Level: {volume[0]}%
              </Label>
              <Slider value={volume} onValueChange={setVolume} max={100} min={0} step={10} className="w-full" />
            </div>
          )}
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Types</h3>

          {/* Pill Reminders */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Pill className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-base font-medium">Pill Reminders</Label>
                <p className="text-sm text-gray-500">Daily medication reminders</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={pillReminders} onCheckedChange={setPillReminders} />
              <Button variant="outline" size="sm" onClick={() => testNotification("pill")} disabled={!pillReminders}>
                Test
              </Button>
            </div>
          </div>

          {/* Appointment Reminders */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <Label className="text-base font-medium">Appointment Reminders</Label>
                <p className="text-sm text-gray-500">Upcoming appointment notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={appointmentReminders} onCheckedChange={setAppointmentReminders} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testNotification("appointment")}
                disabled={!appointmentReminders}
              >
                Test
              </Button>
            </div>
          </div>

          {/* AQI Alerts */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Wind className="h-5 w-5 text-orange-500" />
              <div>
                <Label className="text-base font-medium">AQI Alerts</Label>
                <p className="text-sm text-gray-500">Air quality warnings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={aqiAlerts} onCheckedChange={setAQIAlerts} />
              <Button variant="outline" size="sm" onClick={() => testNotification("aqi")} disabled={!aqiAlerts}>
                Test
              </Button>
            </div>
          </div>

          {/* Medical Alerts */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <TestTube className="h-5 w-5 text-red-500" />
              <div>
                <Label className="text-base font-medium">Medical Alerts</Label>
                <p className="text-sm text-gray-500">Critical health notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={medicalAlerts} onCheckedChange={setMedicalAlerts} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testNotification("medicine")}
                disabled={!medicalAlerts}
              >
                Test
              </Button>
            </div>
          </div>
        </div>

        {/* Reminder Frequency */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Reminder Frequency: Every {reminderFrequency[0]} minutes
          </Label>
          <Slider
            value={reminderFrequency}
            onValueChange={setReminderFrequency}
            max={60}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={isAudioEnabled ? "default" : "secondary"}>
            Audio: {isAudioEnabled ? "Enabled" : "Disabled"}
          </Badge>
          <Badge variant={pillReminders ? "default" : "secondary"}>Pills: {pillReminders ? "On" : "Off"}</Badge>
          <Badge variant={appointmentReminders ? "default" : "secondary"}>
            Appointments: {appointmentReminders ? "On" : "Off"}
          </Badge>
          <Badge variant={aqiAlerts ? "default" : "secondary"}>AQI: {aqiAlerts ? "On" : "Off"}</Badge>
          <Badge variant={medicalAlerts ? "default" : "secondary"}>Medical: {medicalAlerts ? "On" : "Off"}</Badge>
        </div>

        {/* Audio Context Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Audio notifications require user interaction to work properly. Click any test button
            or interact with the page to enable sound notifications.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
