import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CircularityLocation } from '../types';
import { MARKER_CATEGORY_CONFIG } from '../data/circularityLocations';

interface CircularityMapProps {
  locations: CircularityLocation[];
  selectedLocation: CircularityLocation | null;
  onSelectLocation: (location: CircularityLocation) => void;
  userCoords: { lat: number; lng: number } | null;
  centerCoords: { lat: number; lng: number; zoom: number };
}

export const CircularityMap: React.FC<CircularityMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  userCoords,
  centerCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerCoords.lat, centerCoords.lng],
        zoom: centerCoords.zoom,
        zoomControl: true,
        attributionControl: true
      });

      // Modern clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Invalidate size after render to prevent partial tile loading
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan to centerCoords when changed
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([centerCoords.lat, centerCoords.lng], centerCoords.zoom, {
        animate: true
      });
    }
  }, [centerCoords.lat, centerCoords.lng, centerCoords.zoom]);

  // Handle User Geolocation Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userCoords) {
      const userHtml = `
        <div style="background-color: #19B5A5; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 0 6px rgba(25, 181, 165, 0.35); position: relative;">
          <div style="position: absolute; width: 8px; height: 8px; background: #ffffff; border-radius: 50%; top: 4px; left: 4px;"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        className: 'user-geo-marker',
        html: userHtml,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      } else {
        const marker = L.marker([userCoords.lat, userCoords.lng], {
          icon: userIcon,
          zIndexOffset: 1000
        }).bindPopup(`
          <div style="padding: 10px; font-family: inherit;">
            <p style="font-size: 13px; font-weight: 700; color: #111C2E; margin: 0 0 2px 0;">Your Current Location</p>
            <p style="font-size: 11px; color: #718096; margin: 0;">Sorting nearby facilities by distance</p>
          </div>
        `);
        marker.addTo(mapInstanceRef.current);
        userMarkerRef.current = marker;
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userCoords]);

  // Render Category Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    locations.forEach((loc) => {
      const catConfig = MARKER_CATEGORY_CONFIG[loc.category] || MARKER_CATEGORY_CONFIG.recycling_centre;
      const isSelected = selectedLocation?.id === loc.id;

      const markerHtml = `
        <div class="custom-map-marker" style="
          background-color: ${isSelected ? '#111C2E' : catConfig.color};
          width: ${isSelected ? '38px' : '30px'};
          height: ${isSelected ? '38px' : '30px'};
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 10px rgba(17, 28, 46, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          font-size: ${isSelected ? '14px' : '11px'};
          font-weight: 700;
        ">
          ${loc.sourceType === 'hotspot' ? '!' : loc.name.charAt(0)}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'prithvex-map-pin',
        html: markerHtml,
        iconSize: isSelected ? [38, 38] : [30, 30],
        iconAnchor: isSelected ? [19, 19] : [15, 15]
      });

      const marker = L.marker([loc.lat, loc.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : 100
      });

      // Quick Popup
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
      const distanceText = loc.distanceKm !== undefined ? `• <span style="color: #19B5A5; font-weight: 600;">${loc.distanceKm} km away</span>` : '';

      const popupContent = `
        <div style="padding: 14px; font-family: inherit; min-width: 230px; max-width: 280px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; background: ${catConfig.badgeBg}; color: ${catConfig.textDark};">
              ${catConfig.label}
            </span>
            ${loc.isVerified ? '<span style="font-size: 10px; color: #19B5A5; font-weight: 700;">✓ Verified</span>' : ''}
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #111C2E; margin: 0 0 4px 0; line-height: 1.25;">
            ${loc.name}
          </h4>
          <p style="font-size: 11px; color: #718096; margin: 0 0 8px 0;">
            ${loc.locality ? loc.locality + ', ' : ''}${loc.city} ${distanceText}
          </p>
          ${loc.operatingHours ? `<p style="font-size: 11px; color: #253247; margin: 0 0 10px 0;">🕒 ${loc.operatingHours}</p>` : ''}
          <div style="display: flex; gap: 6px; margin-top: 10px;">
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #19B5A5; color: #ffffff; padding: 6px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; text-decoration: none;">
              Open in Google Maps ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      markersLayerRef.current?.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [locations, selectedLocation]);

  // If a location is selected from the sidebar, center the map on it
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 14, {
        animate: true
      });
    }
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-full min-h-[440px] rounded-xl overflow-hidden shadow-sm border border-[#E3E8EF] bg-[#F4F6F8]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[440px]" />
    </div>
  );
};
