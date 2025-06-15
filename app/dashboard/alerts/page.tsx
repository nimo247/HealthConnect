"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Bell, AlertTriangle, Calendar, Pill, Shield, TrendingUp, MapPin, Clock } from 'lucide-react';

// Mock data for alerts
const medicationAlerts = [
  {
    id: 1,
    medication: "Lisinopril 10mg",
    nextDose: "Today, 8:00 PM",
    frequency: "Twice daily",
    status: "upcoming",
    timeUntil: "2 hours"
  },
  {
    id: 2,
    medication: "Metformin 500mg",
    nextDose: "Tomorrow, 8:00 AM",
    frequency: "Twice daily",
    status: "scheduled",
    timeUntil: "14 hours"
  },
  {
    id: 3,
    medication: "Vitamin D3",
    nextDose: "Tomorrow, 9:00 AM",
    frequency: "Once daily",
    status: "scheduled",
    timeUntil: "15 hours"
  }
];

const vaccineAlerts = [
  {
    id: 1,
    vaccine: "COVID-19 Booster",
    dueDate: "June 15, 2024",
    status: "due",
    location: "City Health Center",
    importance: "high"
  },
  {
    id: 2,
    vaccine: "Annual Flu Shot",
    dueDate: "October 1, 2024",
    status: "upcoming",
    location: "Any participating clinic",
    importance: "medium"
  }
];

const outbreakAlerts = [
  {
    id: 1,
    disease: "Seasonal Flu",
    severity: "moderate",
    region: "Downtown Area",
    cases: 45,
    trend: "increasing",
    lastUpdated: "2 hours ago",
    recommendations: [
      "Get vaccinated if not already done",
      "Wash hands frequently",
      "Avoid crowded places if possible",
      "Wear masks in public spaces"
    ]
  },
  {
    id: 2,
    disease: "Norovirus",
    severity: "low",
    region: "University District",
    cases: 12,
    trend: "stable",
    lastUpdated: "6 hours ago",
    recommendations: [
      "Practice good hand hygiene",
      "Avoid sharing food and drinks",
      "Stay home if experiencing symptoms"
    ]
  }
];

const healthAlerts = [
  {
    id: 1,
    type: "Blood Pressure",
    message: "Your last reading (135/90) was elevated. Consider scheduling a check-up.",
    severity: "medium",
    timestamp: "Today, 10:30 AM",
    action: "Schedule appointment"
  },
  {
    id: 2,
    type: "Medication Refill",
    message: "Lisinopril prescription expires in 5 days. Request refill soon.",
    severity: "low",
    timestamp: "Yesterday, 2:15 PM",
    action: "Request refill"
  },
  {
    id: 3,
    type: "Lab Results",
    message: "New lab results are available for review.",
    severity: "low",
    timestamp: "May 25, 3:45 PM",
    action: "View results"
  }
];

export default function Alerts() {
  const [notificationSettings, setNotificationSettings] = useState({
    medications: true,
    vaccines: true,
    outbreaks: true,
    appointments: true,
    healthMetrics: true
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Alerts & Notifications</h1>
          <p className="text-gray-500">Stay informed about your health and regional health updates</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
          <TabsTrigger value="outbreaks">Outbreaks</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medication Reminders
                </CardTitle>
                <CardDescription>
                  Your upcoming medication schedule and reminders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicationAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          alert.status === 'upcoming' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                          <Pill className={`h-4 w-4 ${
                            alert.status === 'upcoming' ? 'text-orange-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">{alert.medication}</h4>
                          <p className="text-sm text-gray-500">{alert.frequency}</p>
                          <p className="text-sm text-gray-500">Next dose: {alert.nextDose}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={alert.status === 'upcoming' ? 'default' : 'secondary'}>
                          {alert.timeUntil}
                        </Badge>
                        <div className="mt-2">
                          <Button size="sm" variant="outline">Mark Taken</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vaccines" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Vaccination Alerts
                </CardTitle>
                <CardDescription>
                  Stay up to date with your vaccination schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaccineAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            alert.importance === 'high' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            <Shield className={`h-4 w-4 ${
                              alert.importance === 'high' ? 'text-red-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium">{alert.vaccine}</h4>
                            <p className="text-sm text-gray-500">Due: {alert.dueDate}</p>
                          </div>
                        </div>
                        <Badge variant={alert.status === 'due' ? 'destructive' : 'secondary'}>
                          {alert.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Schedule Vaccination
                        </Button>
                        <Button size="sm" variant="outline">
                          Find Locations
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outbreaks" className="mt-6">
          <div className="space-y-4">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Regional Health Alert</AlertTitle>
              <AlertDescription className="text-amber-700">
                Increased disease activity detected in your area. Follow recommended precautions.
              </AlertDescription>
            </Alert>

            {outbreakAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {alert.disease} Outbreak
                    </CardTitle>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity} severity
                    </Badge>
                  </div>
                  <CardDescription>
                    {alert.region} • {alert.cases} reported cases • {alert.trend}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last updated: {alert.lastUpdated}</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 ${
                          alert.trend === 'increasing' ? 'text-red-500' : 'text-green-500'
                        }`} />
                        <span className={alert.trend === 'increasing' ? 'text-red-600' : 'text-green-600'}>
                          {alert.trend}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommended Precautions:</h4>
                      <ul className="space-y-1">
                        {alert.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Find Testing Centers</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Personal Health Alerts
                </CardTitle>
                <CardDescription>
                  Notifications about your health metrics and medical care
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full border ${getSeverityColor(alert.severity)}`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div>
                          <h4 className="font-medium">{alert.type}</h4>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        {alert.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Customize which alerts and notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Medication Reminders</h4>
                    <p className="text-sm text-gray-500">Get notified about upcoming doses</p>
                  </div>
                  <Switch
                    checked={notificationSettings.medications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, medications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Vaccine Alerts</h4>
                    <p className="text-sm text-gray-500">Reminders for upcoming vaccinations</p>
                  </div>
                  <Switch
                    checked={notificationSettings.vaccines}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, vaccines: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Outbreak Notifications</h4>
                    <p className="text-sm text-gray-500">Regional health alerts and outbreak updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.outbreaks}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, outbreaks: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Appointment Reminders</h4>
                    <p className="text-sm text-gray-500">Notifications about upcoming appointments</p>
                  </div>
                  <Switch
                    checked={notificationSettings.appointments}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, appointments: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Health Metrics Alerts</h4>
                    <p className="text-sm text-gray-500">Notifications about abnormal readings</p>
                  </div>
                  <Switch
                    checked={notificationSettings.healthMetrics}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, healthMetrics: checked }))
                    }
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
