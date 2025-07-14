import React, { useEffect, useRef } from 'react';


function Map({mintingPartners}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  console.log("Minting Partners:", mintingPartners);
  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 10);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add markers for minting partners
    if (mintingPartners && mintingPartners.length > 0) {
      mintingPartners.forEach((partner) => {
        if (partner.lat && partner.lng) {
          L.marker([partner.lat, partner.lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(`<strong>${partner.name}</strong>`);
        }
      });

      // Fit map to show all markers
      const group = new L.featureGroup(
        mintingPartners.map(partner => 
          L.marker([partner.lat, partner.lng])
        )
      );
      mapInstanceRef.current.fitBounds(group.getBounds());
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mintingPartners]);

  return (
    <div>
      <h2>Minting Partners Map!</h2>
      <div 
        ref={mapRef} 
        style={{ height: '500px', border: '1px solid #ccc' }}
      />
    </div>
  );
}

export default Map;