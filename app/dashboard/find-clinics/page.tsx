"use client"
import { RealClinicFinder } from "@/components/real-clinic-finder"

export default function FindClinics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">Find Nearby Clinics</h1>
        <p className="text-gray-400">Discover healthcare facilities in your area using real-time location data</p>
      </div>

      <RealClinicFinder />
    </div>
  )
}
