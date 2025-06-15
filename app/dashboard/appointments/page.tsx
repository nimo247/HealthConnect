"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Phone, FileText, Video, Plus } from "lucide-react"
import useNotifications from "@/hooks/use-notifications"

// Mock data for appointments
const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "Tomorrow",
    time: "10:00 AM",
    type: "Follow-up",
    location: "City Health Center",
    address: "123 Main St, Cityville",
    phone: "(555) 123-4567",
    notes: "Blood pressure check and medication review",
    appointmentType: "in-person",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "General Practitioner",
    date: "May 30, 2024",
    time: "2:30 PM",
    type: "Annual Physical",
    location: "Westside Medical Clinic",
    address: "456 Oak Ave, Westside",
    phone: "(555) 234-5678",
    notes: "Comprehensive health examination",
    appointmentType: "in-person",
  },
  {
    id: 3,
    doctor: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    date: "June 5, 2024",
    time: "11:15 AM",
    type: "Consultation",
    location: "Telehealth",
    address: "Video Call",
    phone: "(555) 345-6789",
    notes: "Skin condition follow-up",
    appointmentType: "telehealth",
  },
]

const pastAppointments = [
  {
    id: 4,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "May 15, 2024",
    time: "10:00 AM",
    type: "Consultation",
    location: "City Health Center",
    status: "completed",
    notes: "Prescribed new blood pressure medication",
  },
  {
    id: 5,
    doctor: "Dr. Lisa Wong",
    specialty: "Nurse Practitioner",
    date: "May 10, 2024",
    time: "9:30 AM",
    type: "Vaccination",
    location: "City Health Center",
    status: "completed",
    notes: "COVID-19 booster administered",
  },
]

export default function Appointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null)
  const { showNotification } = useNotifications()

  const generateAppointmentLetter = (appointmentId: number) => {
    // In a real app, this would generate and download a PDF
    console.log("Generating appointment letter for appointment:", appointmentId)
    alert("Appointment letter will be downloaded as PDF")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-gray-500">Manage your healthcare appointments and consultations</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 gap-2">
          <Plus className="h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className={`cursor-pointer transition-all ${
                    selectedAppointment === appointment.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => setSelectedAppointment(appointment.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{appointment.doctor}</h3>
                        <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      </div>
                      <Badge variant={appointment.appointmentType === "telehealth" ? "secondary" : "default"}>
                        {appointment.type}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.appointmentType === "telehealth" ? (
                          <Video className="h-4 w-4 text-gray-500" />
                        ) : (
                          <MapPin className="h-4 w-4 text-gray-500" />
                        )}
                        <span>{appointment.location}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3">{appointment.notes}</p>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                      {appointment.appointmentType === "telehealth" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Join Call
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="hidden lg:block sticky top-6">
              {selectedAppointment ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{upcomingAppointments.find((a) => a.id === selectedAppointment)?.doctor}</CardTitle>
                    <CardDescription>
                      {upcomingAppointments.find((a) => a.id === selectedAppointment)?.specialty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Appointment Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span>{upcomingAppointments.find((a) => a.id === selectedAppointment)?.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span>{upcomingAppointments.find((a) => a.id === selectedAppointment)?.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span>{upcomingAppointments.find((a) => a.id === selectedAppointment)?.type}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Location</h4>
                        <div className="text-sm space-y-1">
                          <p>{upcomingAppointments.find((a) => a.id === selectedAppointment)?.location}</p>
                          <p className="text-gray-500">
                            {upcomingAppointments.find((a) => a.id === selectedAppointment)?.address}
                          </p>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{upcomingAppointments.find((a) => a.id === selectedAppointment)?.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Notes</h4>
                        <p className="text-sm text-gray-600">
                          {upcomingAppointments.find((a) => a.id === selectedAppointment)?.notes}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => generateAppointmentLetter(selectedAppointment)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Download Appointment Letter
                        </Button>
                        <Button variant="outline" className="w-full">
                          Add to Calendar
                        </Button>
                        <Button variant="outline" className="w-full">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center p-8 h-full">
                  <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">Select an appointment to view details</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{appointment.doctor}</h3>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{appointment.status}</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mt-3">{appointment.notes}</p>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      View Summary
                    </Button>
                    <Button size="sm" variant="outline">
                      Book Follow-up
                    </Button>
                    <Button size="sm" variant="outline">
                      Download Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Requests</CardTitle>
              <CardDescription>Pending appointment requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pending appointment requests</p>
                <Button className="mt-4 bg-green-600 hover:bg-green-700">Request New Appointment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
