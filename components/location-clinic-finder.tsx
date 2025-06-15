"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Star, Phone } from "lucide-react"

interface Clinic {
  id: number
  name: string
  address: string
  distance: number
  rating: number
  isOpen: boolean
  phone: string
  specialties: string[]
  coordinates: { lat: number; lng: number }
}

interface LocationClinicFinderProps {
  userLocation?: { lat: number; lng: number }
}

export function LocationClinicFinder({ userLocation }: LocationClinicFinderProps) {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Mock clinics data - in real app, this would come from an API
  const mockClinics: Clinic[] = [
    {
      id: 1,
      name: "City Health Center",
      address: "123 Main St, Downtown",
      distance: 0.8,
      rating: 4.8,
      isOpen: true,
      phone: "(555) 123-4567",
      specialties: ["General Medicine", "Pediatrics"],
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: 2,
      name: "Westside Medical Clinic",
      address: "456 Oak Ave, Westside",
      distance: 1.2,
      rating: 4.5,
      isOpen: true,
      phone: "(555) 234-5678",
      specialties: ["Family Medicine", "Cardiology"],
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    {
      id: 3,
      name: "Emergency Care Center",
      address: "789 Pine Rd, Midtown",
      distance: 2.1,
      rating: 4.7,
      isOpen: true,
      phone: "(555) 345-6789",
      specialties: ["Emergency Care", "Urgent Care"],
      coordinates: { lat: 40.7505, lng: -73.9934 },
    },
    {
      id: 4,
      name: "Eastside Family Practice",
      address: "321 Elm St, Eastside",
      distance: 2.8,
      rating: 4.6,
      isOpen: false,
      phone: "(555) 456-7890",
      specialties: ["Family Medicine", "Dermatology"],
      coordinates: { lat: 40.7282, lng: -73.7949 },
    },
  ]

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const findNearbyClinics = async (location: { lat: number; lng: number }) => {
    setIsLoading(true)
    try {
      // Calculate distances and sort by proximity
      const clinicsWithDistance = mockClinics
        .map((clinic) => ({
          ...clinic,
          distance: calculateDistance(location.lat, location.lng, clinic.coordinates.lat, clinic.coordinates.lng),
        }))
        .sort((a, b) => a.distance - b.distance)

      setClinics(clinicsWithDistance.slice(0, 5)) // Show top 5 nearest
    } catch (error) {
      console.error("Error finding clinics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        findNearbyClinics(location)
      },
      (error) => {
        setLocationError("Unable to retrieve your location")
        setIsLoading(false)
        // Use default location (NYC) as fallback
        findNearbyClinics({ lat: 40.7128, lng: -74.006 })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

  useEffect(() => {
    if (userLocation) {
      findNearbyClinics(userLocation)
    } else {
      getCurrentLocation()
    }
  }, [userLocation])

  const openDirections = (clinic: Clinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.address)}`
    window.open(url, "_blank")
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-400" />
            Nearby Clinics
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Navigation className="h-4 w-4 mr-1" />
            {isLoading ? "Finding..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {locationError && (
          <div className="text-amber-400 text-sm mb-4 p-2 bg-amber-900/20 rounded border border-amber-700/50">
            {locationError}
          </div>
        )}

        <div className="space-y-3">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-white">{clinic.name}</h4>
                  <p className="text-sm text-gray-400">{clinic.address}</p>
                </div>
                <Badge
                  className={
                    clinic.isOpen
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-red-500/20 text-red-300 border-red-500/30"
                  }
                >
                  {clinic.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{clinic.distance.toFixed(1)} miles</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span>{clinic.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{clinic.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {clinic.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={!clinic.isOpen}>
                  Book Appointment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openDirections(clinic)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
