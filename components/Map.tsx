'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';

interface Umbral {
  id: string;
  position: { lat: number; lng: number };
  type: 'umbra' | 'sigilum';
  pacing_value: number;
  experience_config?: { ciclo?: number };
}

// Colores por ciclo (duotone gradient)
const CICLO_COLORS: Record<number, string> = {
  1: 'linear-gradient(135deg, #8b5cf6, #ec4899)',  // Violeta→Rosa
  2: 'linear-gradient(135deg, #3b82f6, #06b6d4)',  // Azul→Cyan
  3: 'linear-gradient(135deg, #22c55e, #14b8a6)',  // Verde→Teal
  4: 'linear-gradient(135deg, #f97316, #eab308)',  // Naranja→Ambar
  5: 'linear-gradient(135deg, #ef4444, #f43f5e)',  // Rojo→Rosa
};

function MapCenter({ lat, lng, centerKey }: { lat: number; lng: number; centerKey: number }) {
  const map = useMap();
  const prevCoords = useRef({ lat, lng });
  
  useEffect(() => {
    if (prevCoords.current.lat !== lat || prevCoords.current.lng !== lng) {
      map.flyTo([lat, lng], 19, { duration: 1.5 });
      prevCoords.current = { lat, lng };
    }
  }, [lat, lng, map, centerKey]);
  
  return null;
}

interface MapProps {
  center: { lat: number; lng: number };
  umbrales?: Umbral[];
  floorPlanUrl?: string;
  height?: string;
  showUserLocation?: boolean;
}

export default function MapComponent({ center, umbrales = [], floorPlanUrl = '', height = '100%', showUserLocation = true }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [centerKey, setCenterKey] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    
    // Custom numbered icons with ciclo color (duotone)
    const createNumberIcon = (num: number, ciclo: number = 1) => {
      const gradient = CICLO_COLORS[ciclo] || CICLO_COLORS[1];
      
      return L.divIcon({
        html: `<div style="
          background: ${gradient};
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${num}</div>`,
        className: 'numbered-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });
    };
    
    (window as any).createNumberIcon = createNumberIcon;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    setCenterKey(k => k + 1);
  }, [center.lat, center.lng]);

  if (!isMounted) {
    return (
      <div style={{ height, width: '100%', backgroundColor: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
        Cargando mapa...
      </div>
    );
  }

  const latDelta = 0.0005;
  const lngDelta = 0.0005;
  const imageBounds: [[number, number], [number, number]] = [
    [center.lat - latDelta, center.lng - lngDelta],
    [center.lat + latDelta, center.lng + lngDelta]
  ];

  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <MapContainer
        key={centerKey}
        center={[center.lat, center.lng]}
        zoom={19}
        style={{ height, width: '100%', minHeight: '250px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OSM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={floorPlanUrl ? 0.3 : 1}
        />
        
        {floorPlanUrl && (
          <ImageOverlay
            url={floorPlanUrl}
            bounds={imageBounds}
            opacity={0.8}
          />
        )}
        
        <MapCenter lat={center.lat} lng={center.lng} centerKey={centerKey} />

        {/* User position - only show if enabled */}
        {showUserLocation && (
          <Marker position={[center.lat, center.lng]}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '5px' }}>
                <strong>📍 Tu posición</strong><br/>
                <span style={{ fontSize: '10px' }}>{center.lat.toFixed(5)}, {center.lng.toFixed(5)}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Umbral markers with ciclo colors */}
        {umbrales.map((u, i) => {
          const nodeNumber = i + 1;
          const ciclo = u.experience_config?.ciclo || 1;
          const icon = (window as any).createNumberIcon 
            ? (window as any).createNumberIcon(nodeNumber, ciclo)
            : undefined;
          return (
            <Marker 
              key={u.id} 
              position={[u.position.lat, u.position.lng]}
              icon={icon}
            >
              <Popup>
                <div style={{ textAlign: 'center', padding: '5px' }}>
                  <strong>🌑 Nodo {nodeNumber}</strong><br/>
                  <span style={{ fontSize: '10px' }}>🌀 Ciclo {ciclo}</span><br/>
                  <span style={{ fontSize: '10px' }}>Pacing: {u.pacing_value}/10</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}