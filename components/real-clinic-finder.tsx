"use client"


import dynamic from 'next/dynamic';
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Navigation,
  Star,
  Phone,
  Clock,
  Search,
  ExternalLink,
  Filter,
  Loader2,
  AlertTriangle,
  Radius,
} from "lucide-react"
import { log } from 'node:console';
import { handleClientScriptLoad } from 'next/script';
// import Map from "./Map"

interface RealClinic {
  id: number;
  type: "node" | "way" | "relation";
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags: {
    name?: string;
    amenity?: string;
    description?: string;
    "addr:district"?: string;
    "addr:state"?: string;
    "addr:postcode"?: string;
    "addr:full"?: string;
    "contact:phone"?: string;
    "healthcare"?: string;
    "health_facility:type"?: string;
    [key: string]: any;
  };
}


interface RealClinicFinderProps {
  userLocation?: { lat: number; lng: number }
}


export function RealClinicFinder({ userLocation }: RealClinicFinderProps) {
  const [clinics, setClinics] = useState<RealClinic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchRadius, setSearchRadius] = useState(5000) // 5km default
  const [locationError, setLocationError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("hospital") // Default to hospitals
  const [nearbyhospital, setnearbyhospital] = useState<RealClinic[]>([])

  const Map = dynamic(() => import('@/components/Map'), { ssr: false });


  const clinicTypes = [
    { id: "hospital", name: "Hospitals", query: "hospital" },
    { id: "clinic", name: "Clinics", query: "clinic" },
    // { id: "urgent_care", name: "Urgent Care", query: "urgent care" },
    // { id: "pharmacy", name: "Pharmacies", query: "pharmacy" },
    // { id: "specialist", name: "Specialists", query: "specialist doctor" },
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
          console.log("Current location retrieved:", location);

          setCurrentLocation(location)
          resolve(location)
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
          }
          reject(new Error(errorMessage))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      )
    })
  }

  const getnearestHospital = async(location,selectedType)=>{
    console.log("getnearestHospital",location,selectedType);
    
    // const loc = currentLocation
    const radius = 2000
      const query = `
    [out:json][timeout:25];
    (
      node["amenity"=${selectedType}](around:${radius},${location?.lat},${location?.lng});
      way["amenity"=${selectedType}](around:${radius},${location?.lat},${location?.lng});
      relation["amenity"=${selectedType}](around:${radius},${location?.lat},${location?.lng});
    );
    out center;
  `;
    
  const url = 'https://overpass-api.de/api/interpreter';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'text/plain'
      },
    });

    if (!response.ok) {
      return new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    setClinics(data.elements);
    
  } catch (error) {
    console.error("Error fetching nearest hospital:", error);
    throw new Error("Failed to fetch nearest hospital");
  
    }
  }


// getnearestHospital()

  // Simulate real clinic search using browser APIs and external services
  // const searchNearbyClinics = async (
  //   location: { lat: number; lng: number },
  //   query = "",
  //   radius = 5000,
  // ): Promise<RealClinic[]> => {
  //   setIsLoading(true)
  //   setLocationError(null)

  //   try {
  //     // In a real implementation, you would use:
  //     // 1. Google Places API
  //     // 2. Foursquare API
  //     // 3. Yelp API
  //     // 4. Healthcare.gov API
  //     // 5. Local healthcare directories

  //     // Simulate API call delay
  //     await new Promise((resolve) => setTimeout(resolve, 1500))

  //     // Generate realistic clinic data based on location
  //     const mockClinics: RealClinic[] = generateRealisticClinics(location, query, radius)

  //     return mockClinics
  //   } catch (error) {
  //     console.error("Error searching clinics:", error)
  //     throw new Error("Failed to search for nearby clinics")
  //   }
  // }

  // const generateRealisticClinics = (
  //   location: { lat: number; lng: number },
  //   query: string,
  //   radius: number,
  // ): RealClinic[] => {
  //   // Generate clinics based on real-world patterns
  //   const clinicTemplates = [
  //     {
  //       namePattern: ["City Medical Center", "Community Hospital", "Regional Health Center"],
  //       types: ["hospital", "health", "establishment"],
  //       avgRating: 4.2,
  //       priceLevel: 3,
  //     },
  //     {
  //       namePattern: ["Family Practice", "Primary Care Clinic", "Medical Associates"],
  //       types: ["doctor", "health", "establishment"],
  //       avgRating: 4.0,
  //       priceLevel: 2,
  //     },
  //     {
  //       namePattern: ["Urgent Care", "Walk-in Clinic", "Express Care"],
  //       types: ["hospital", "health", "establishment"],
  //       avgRating: 3.8,
  //       priceLevel: 2,
  //     },
  //     {
  //       namePattern: ["Pharmacy", "Drug Store", "Medical Pharmacy"],
  //       types: ["pharmacy", "health", "store"],
  //       avgRating: 4.1,
  //       priceLevel: 1,
  //     },
  //     {
  //       namePattern: ["Specialist Center", "Medical Specialists", "Healthcare Specialists"],
  //       types: ["doctor", "health", "establishment"],
  //       avgRating: 4.3,
  //       priceLevel: 3,
  //     },
  //   ]

  //   const clinics: RealClinic[] = []
  //   const numClinics = Math.floor(Math.random() * 15) + 10 // 10-25 clinics

  //   for (let i = 0; i < numClinics; i++) {
  //     const template = clinicTemplates[Math.floor(Math.random() * clinicTemplates.length)]
  //     const nameBase = template.namePattern[Math.floor(Math.random() * template.namePattern.length)]

  //     // Generate random location within radius
  //     const angle = Math.random() * 2 * Math.PI
  //     const distance = Math.random() * (radius / 1000) // Convert to km
  //     const lat = location.lat + (distance / 111) * Math.cos(angle)
  //     const lng = location.lng + (distance / (111 * Math.cos((location.lat * Math.PI) / 180))) * Math.sin(angle)

  //     // Generate realistic address
  //     const streetNumber = Math.floor(Math.random() * 9999) + 1
  //     const streetNames = ["Main St", "Oak Ave", "Pine Rd", "Elm St", "Park Blvd", "Health Way", "Medical Dr"]
  //     const streetName = streetNames[Math.floor(Math.random() * streetNames.length)]

  //     const clinic: RealClinic = {
  //       id: `clinic_${i}`,
  //       name: `${nameBase} ${i > 5 ? Math.floor(Math.random() * 10) + 1 : ""}`.trim(),
  //       address: `${streetNumber} ${streetName}, City, State`,
  //       distance: calculateDistance(location.lat, location.lng, lat, lng),
  //       rating: Math.round((template.avgRating + (Math.random() - 0.5) * 1.0) * 10) / 10,
  //       totalRatings: Math.floor(Math.random() * 500) + 50,
  //       isOpen: Math.random() > 0.2, // 80% chance of being open
  //       phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  //       coordinates: { lat, lng },
  //       types: template.types,
  //       priceLevel: template.priceLevel,
  //       vicinity: `${streetNumber} ${streetName}`,
  //       openingHours: generateOpeningHours(),
  //     }

  //     clinics.push(clinic)
  //   }

  //   // Filter by query if provided
  //   let filteredClinics = clinics
  //   if (query && query !== "all") {
  //     const queryLower = query.toLowerCase()
  //     filteredClinics = clinics.filter(
  //       (clinic) =>
  //         clinic.name.toLowerCase().includes(queryLower) ||
  //         clinic.types.some((type) => type.toLowerCase().includes(queryLower)) ||
  //         clinic.address.toLowerCase().includes(queryLower),
  //     )
  //   }

  //   // Sort by distance
  //   return filteredClinics.sort((a, b) => a.distance - b.distance).slice(0, 20)
  // }

  // const generateOpeningHours = (): string[] => {
  //   const hours = [
  //     "Monday: 8:00 AM – 6:00 PM",
  //     "Tuesday: 8:00 AM – 6:00 PM",
  //     "Wednesday: 8:00 AM – 6:00 PM",
  //     "Thursday: 8:00 AM – 6:00 PM",
  //     "Friday: 8:00 AM – 6:00 PM",
  //     "Saturday: 9:00 AM – 3:00 PM",
  //     "Sunday: Closed",
  //   ]

  //   // Some variation for different clinic types
  //   if (Math.random() > 0.7) {
  //     hours[5] = "Saturday: Closed"
  //     hours[6] = "Sunday: Closed"
  //   }

  //   if (Math.random() > 0.9) {
  //     // 24/7 hospitals
  //     return ["Open 24 hours"]
  //   }

  //   return hours
  // }

  // const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  //   const R = 3959 // Earth's radius in miles
  //   const dLat = ((lat2 - lat1) * Math.PI) / 180
  //   const dLng = ((lng2 - lng1) * Math.PI) / 180
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  //   return R * c
  // }

  const handleLocationSearch = async () => {
    try {
      const location = await getCurrentLocation()
      const selectedType = clinicTypes.find((type) => type.id === selectedFilter)
      console.log("Selected clinic type:", selectedType?.id);
      console.log("Current location for search:", location);
      
      
      // const searchTerm = searchQuery || selectedType?.query || ""
      getnearestHospital(location,selectedType?.id)
      
    } catch (error) {
      // setLocationError((error as Error).message)
      // // Use default location as fallback (New York City)
      // const defaultLocation = { lat: 40.7128, lng: -74.006 }
      // setCurrentLocation(defaultLocation)
      // try {
      //   const selectedType = clinicTypes.find((type) => type.id === selectedFilter)
      //   const searchTerm = searchQuery || selectedType?.query || ""
      //   const results = await searchNearbyClinics(defaultLocation, searchTerm, searchRadius)
      //   setClinics(results)
      // } catch (fallbackError) {
      //   console.error("Fallback search failed:", fallbackError)
      // }
      console.error("Error retrieving location:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const openInGoogleMaps = (clinic: RealClinic) => {
    const query = encodeURIComponent(`${clinic.tags.name} ${clinic.tags['addr:full']}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, "_blank")
  }

  const openDirections = (clinic: RealClinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.tags['addr:full'])}`
    window.open(url, "_blank")
  }

  const callClinic = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^\d]/g, "")}`
  }

  useEffect(() => {
    // if (userLocation) {
    //   const selectedType = clinicTypes.find((type) => type.id === selectedFilter)
    //   const searchTerm = searchQuery || selectedType?.query || ""
    //   searchNearbyClinics(userLocation, searchTerm, searchRadius).then(setClinics).catch(console.error)
    // } else {
      handleLocationSearch()
    // }
  }, [userLocation, selectedFilter,setSelectedFilter])

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-400" />
            Real-Time Clinic Finder
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocationSearch}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Navigation className="h-4 w-4 mr-1" />}
            {isLoading ? "Searching..." : "Refresh Location"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Controls */}
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6">
            {clinicTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="text-xs">
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          {/* <div className="relative flex-1"> */}
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
            {/* <Input
              placeholder="Search specific clinic, doctor, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            /> */}
          {/* </div> */}
          {/* <Button onClick={handleLocationSearch} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button> */}
        </div>

        {/* Radius Filter */}
        {/* <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">Search radius:</span>
          <select
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            className="bg-gray-700 border-gray-600 text-white text-sm rounded px-2 py-1"
          >
            <option value={1000}>1 km</option>
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={25000}>25 km</option>
          </select>
        </div> */}

        {locationError && (
          <Alert className="bg-amber-900/50 border-amber-700">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-amber-300">
              {locationError} Using default location for search.
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        <div className="space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
              <span className="ml-2 text-gray-400">Finding nearby clinics...</span>
            </div>
          )}

          {!isLoading && clinics.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No clinics found in your area. Try expanding your search radius or changing filters.</p>
            </div>
          )}
          <div className="w-auto h-auto  flex flex-row-reverse items-center justify-center text-gray-400 mb-4">
            <Map location = {currentLocation} clinics={clinics}/>
            
            <div className="overflow-y-auto max-h-[70vh] w-[50%]">
          {!isLoading &&
            clinics.map((clinic) => (
              <div key={clinic.id} className=" p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{clinic.tags.name}</h4>
                    <p className="text-sm text-gray-400">{clinic.tags['addr:full']}</p>
                  </div>
                  {/* <div className="flex flex-col items-end gap-1">
                    <Badge
                      className={
                        clinic.isOpen
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }
                    >
                      {clinic.isOpen ? "Open" : "Closed"}
                    </Badge>
                    {clinic.priceLevel && (
                      <div className="text-xs text-gray-400">
                        {"$".repeat(clinic.priceLevel)}
                        {"$".repeat(4 - clinic.priceLevel).replace(/\$/g, "·")}
                      </div>
                    )}
                  </div> */}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  {/* <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{clinic.distance.toFixed(1)} miles</span>
                  </div> */}
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span>
                        49 500
                      </span>
                    </div>
                  
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>+91 10.....</span>
                    </div>
                  
                </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Open
                  </div>
        

                <div className="flex flex-wrap gap-1 mb-3">
                  {/* {clinic.tags['health_facility:type'].slice(0, 3).map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {type.replace(/_/g, " ")}
                    </Badge>
                  ))} */}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => openInGoogleMaps(clinic)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Maps
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
            </div>
        </div>

        {!isLoading && clinics.length > 0 && (
          <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-700">
            Showing {clinics.length} clinics within {searchRadius / 1000} km of your location
          </div>
        )}
      </CardContent>
    </Card>
  )
}
