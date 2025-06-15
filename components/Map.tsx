
'use client';

import React, { HtmlHTMLAttributes, useEffect, useRef } from 'react'

import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({location,clinics}) => {
  const mapRef = useRef<HTMLDivElement>(null);

 const leafletMapRef = useRef<L.Map | null>(null);  // store map instance

  useEffect(() => {
    if (!mapRef.current) return;
    console.log(location);
    
    // Prevent re-initializing if map instance exists
    if (leafletMapRef.current) {
      console.warn('Map is already initialized on this element');
      return;
    }

    // Initialize map and store instance
    // leafletMapRef.current = leaflet.map(mapRef.current).setView([location.lat, location.lng], 13);

    leafletMapRef.current = leaflet.map(mapRef.current, { 
        center: [location.lat, location.lng],
        zoom: 13,
        zoomControl: true,
        markerZoomAnimation: true,
        });

    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMapRef.current);

    // Add marker
    const marker = leaflet.marker([location.lat, location.lng]).addTo(leafletMapRef.current);
    marker.bindPopup('You').openPopup();
    

    // Add clinic markers
clinics
  .filter((clinic) => 
    (clinic.lat ?? clinic.center?.lat) !== undefined && 
    (clinic.lon ?? clinic.center?.lon) !== undefined
  )
  .forEach((clinic) => {
    const lat = clinic.lat ?? clinic.center?.lat;
    const lon = clinic.lon ?? clinic.center?.lon;

    const name = clinic.tags?.name ?? "Unnamed Clinic";
    const addr = clinic.tags?.["addr:full"] ?? "No address";

    const marker = leaflet.marker([lat, lon]).addTo(leafletMapRef.current!);
    marker.bindPopup(`<b>${name}</b><br>${addr}`);
  });


    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, []);
  return <div ref={mapRef} id="map" 
   style={{
        height: '600px', // ✅ required
        width: '100%',   // ✅ required
      }} 
  />;
};

export default Map;
