"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, Star, Phone, Clock, Search, ExternalLink } from "lucide-react"

interface GoogleClinic {
  id: string
  name: string
  address: string
  distance: number
  rating: number
  totalRatings: number
  isOpen: boolean
  openingHours?: string[]
  phone?: string
  website?: string
  placeId: string
  coordinates: { lat: number; lng: number }
  types: string[]
  priceLevel?: number
}

interface GoogleClinicFinderProps {
  userLocation?: { lat: number; lng: number }
}

export function GoogleClinicFinder({ userLocation }: GoogleClinicFinderProps) {
  const [clinics, setClinics] = useState<GoogleClinic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationError, setLocationError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Mock Google Places API response (in real app, this would use actual Google Places API)
  const mockGoogleClinics: GoogleClinic[] = [
    {
      id: "1",
      name: "Carbon Health Urgent & Primary Care Santa Clara",
      address: "2775 Park Ave, Santa Clara, CA 95050",
      distance: 0.8,
      rating: 3.9,
      totalRatings: 431,
      isOpen: true,
      openingHours: ["Monday: 8:00 AM – 8:00 PM", "Tuesday: 8:00 AM – 8:00 PM", "Wednesday: 8:00 AM – 8:00 PM"],
      phone: "(650) 543-4800",
      website: "https://carbonhealth.com",
      placeId: "ChIJ1234567890",
      coordinates: { lat: 37.3541, lng: -121.9552 },
      types: ["hospital", "health", "establishment"],
      priceLevel: 2,
    },
    {
      id: "2",
      name: "Stanford Primary Care in Santa Clara",
      address: "2589 Scott Blvd, Santa Clara, CA 95050",
      distance: 1.2,
      rating: 2.8,
      totalRatings: 39,
      isOpen: true,
      openingHours: ["Monday: 8:00 AM – 5:00 PM", "Tuesday: 8:00 AM – 5:00 PM", "Wednesday: 8:00 AM – 5:00 PM"],
      phone: "(650) 498-6000",
      website: "https://stanfordhealthcare.org",
      placeId: "ChIJ0987654321",
      coordinates: { lat: 37.3688, lng: -121.9644 },
      types: ["hospital", "health", "establishment"],
      priceLevel: 3,
    },
    {
      id: "3",
      name: "Stanford Express Care Clinic – San Jose",
      address: "52 Skytop St, San Jose, CA 95134",
      distance: 2.1,
      rating: 3.1,
      totalRatings: 62,
      isOpen: false,
      openingHours: ["Monday: 9:00 AM – 9:00 PM", "Tuesday: 9:00 AM – 9:00 PM", "Wednesday: 9:00 AM – 9:00 PM"],
      phone: "(650) 498-6000",
      website: "https://stanfordhealthcare.org",
      placeId: "ChIJ1122334455",
      coordinates: { lat: 37.4419, lng: -121.943 },
      types: ["hospital", "health", "establishment"],
      priceLevel: 3,
    },
    {
      id: "4",
      name: "Kaiser Permanente Santa Clara Medical Center",
      address: "700 Lawrence Expy, Santa Clara, CA 95051",
      distance: 1.8,
      rating: 4.2,
      totalRatings: 1250,
      isOpen: true,
      openingHours: ["Monday: 24 hours", "Tuesday: 24 hours", "Wednesday: 24 hours"],
      phone: "(408) 851-1000",
      website: "https://kp.org",
      placeId: "ChIJ5566778899",
      coordinates: { lat: 37.3496, lng: -121.939 },
      types: ["hospital", "health", "establishment"],
      priceLevel: 2,
    },
  ]

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentLocation(location)
          resolve(location)
        },
        (error) => {
          reject(new Error("Unable to retrieve your location"))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      )
    })
  }

  const searchNearbyClinicsMock = async (location: { lat: number; lng: number }, query = "") => {
    setIsLoading(true)
    setLocationError(null)

    try {
      // Simulate Google Places API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let filteredClinics = mockGoogleClinics

      // Filter by search query if provided
      if (query.trim()) {
        filteredClinics = filteredClinics.filter(
          (clinic) =>
            clinic.name.toLowerCase().includes(query.toLowerCase()) ||
            clinic.address.toLowerCase().includes(query.toLowerCase()) ||
            clinic.types.some((type) => type.toLowerCase().includes(query.toLowerCase())),
        )
      }

      // Calculate distances and sort by proximity
      const clinicsWithDistance = filteredClinics
        .map((clinic) => ({
          ...clinic,
          distance: calculateDistance(location.lat, location.lng, clinic.coordinates.lat, clinic.coordinates.lng),
        }))
        .sort((a, b) => a.distance - b.distance)

      setClinics(clinicsWithDistance)
    } catch (error) {
      console.error("Error searching clinics:", error)
      setLocationError("Failed to search for nearby clinics")
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleLocationSearch = async () => {
    try {
      const location = await getCurrentLocation()
      await searchNearbyClinicsMock(location, searchQuery)
    } catch (error) {
      setLocationError("Unable to access your location. Please enable location services.")
      // Use default location as fallback
      const defaultLocation = { lat: 37.3541, lng: -121.9552 } // Santa Clara, CA
      setCurrentLocation(defaultLocation)
      await searchNearbyClinicsMock(defaultLocation, searchQuery)
    }
  }

  const openInGoogleMaps = (clinic: GoogleClinic) => {
    const query = encodeURIComponent(`${clinic.name} ${clinic.address}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, "_blank")
  }

  const openDirections = (clinic: GoogleClinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.address)}`
    window.open(url, "_blank")
  }

  const callClinic = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  useEffect(() => {
    if (userLocation) {
      searchNearbyClinicsMock(userLocation)
    } else {
      handleLocationSearch()
    }
  }, [userLocation])

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-400" />
            Google Clinics Near You
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocationSearch}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Navigation className="h-4 w-4 mr-1" />
            {isLoading ? "Searching..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clinics, hospitals, urgent care..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <Button
            onClick={() => currentLocation && searchNearbyClinicsMock(currentLocation, searchQuery)}
            disabled={isLoading || !currentLocation}
            className="bg-green-600 hover:bg-green-700"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {locationError && (
          <Alert className="bg-amber-900/50 border-amber-700">
            <AlertDescription className="text-amber-300">{locationError}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        <div className="space-y-3">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
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
                  <span>
                    {clinic.rating} ({clinic.totalRatings})
                  </span>
                </div>
                {clinic.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{clinic.phone}</span>
                  </div>
                )}
              </div>

              {clinic.openingHours && (
                <div className="text-xs text-gray-500 mb-3">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {clinic.openingHours[0]}
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                {clinic.types.slice(0, 3).map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {type.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openInGoogleMaps(clinic)}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Google
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
                {clinic.phone && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => callClinic(clinic.phone!)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          ))}

          {clinics.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-400">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No clinics found. Try adjusting your search or location.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
