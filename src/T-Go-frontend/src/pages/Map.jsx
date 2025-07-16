import React, { useEffect, useRef, useState } from "react";

function Map({ mintingPartners = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [error, setError] = useState(null);
  const [partners, setPartners] = useState([]);
  // TODO: Replace with the actual partners
  // Sample data for when no partners are provided
  const mockPartners = [
    {
      id: 1,
      name: "Downtown Mint Hub",
      address: "123 Main St, New York, NY 10001",
      lat: 40.7128,
      lng: -74.0060,
    },
    {
      id: 2,
      name: "Brooklyn Creative Space",
      address: "456 Brooklyn Ave, Brooklyn, NY 11201",
      lat: 40.6892,
      lng: -73.9442,
    },
    {
      id: 3,
      name: "Queens Tech Center",
      address: "789 Queens Blvd, Queens, NY 11373",
      lat: 40.7282,
      lng: -73.7949,
    }
  ];

  useEffect(() => {
    // TODO: Initialize partners with the actual data
    setPartners(mockPartners);
  }, [mintingPartners]);

  // Check for Leaflet availability with proper loading detection
  useEffect(() => {
    let mounted = true;
    let pollInterval;
    let timeoutId;

    const checkLeaflet = () => {
      if (!mounted) return;

      if (window.L && typeof window.L.map === 'function') {
        setLeafletReady(true);
        setIsLoading(false);
        return;
      }

      // Poll every 100ms for Leaflet
      pollInterval = setInterval(() => {
        if (!mounted) return;
        
        if (window.L && typeof window.L.map === 'function') {
          setLeafletReady(true);
          setIsLoading(false);
          clearInterval(pollInterval);
        }
      }, 100);

      // Timeout after 15 seconds
      timeoutId = setTimeout(() => {
        if (!mounted) return;
        
        clearInterval(pollInterval);
        setError("Failed to load map library. Please refresh the page.");
        setIsLoading(false);
      }, 15000);
    };

    checkLeaflet();

    return () => {
      mounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Initialize map when Leaflet is ready
  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstanceRef.current) {
      return;
    }

    try {
      // Initialize map
      mapInstanceRef.current = window.L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true
      }).setView([40.7128, -74.006], 10);

      // Add tile layer
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Force map to resize (fixes common display issues)
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Failed to initialize map: " + error.message);
    }
  }, [leafletReady]);

  // Add markers when partners data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletReady) {
      return;
    }

    try {
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add markers for partners
      if (partners && partners.length > 0) {
        const markers = [];

        partners.forEach((partner) => {
          if (partner.lat && partner.lng) {
            const marker = window.L.marker([partner.lat, partner.lng])
              .addTo(mapInstanceRef.current)
              .bindPopup(`
                <div style="padding: 10px; min-width: 200px;">
                  <h3 style="margin: 0 0 10px 0; color: #333;">${partner.name}</h3>
                  <p style="margin: 0; color: #666; font-size: 0.9em;">${partner.address || "Address not available"}</p>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 0.8em;">Click to view details</p>
                </div>
              `);

            marker.on("click", () => {
              setSelectedPartner(partner);
            });

            markers.push(marker);
          }
        });

        // Fit map to show all markers
        if (markers.length > 0) {
          const group = new window.L.featureGroup(markers);
          mapInstanceRef.current.fitBounds(group.getBounds(), {
            padding: [20, 20]
          });
        }
      }
    } catch (error) {
      console.error("Error adding markers:", error);
      setError("Failed to add markers: " + error.message);
    }
  }, [partners, leafletReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const closeModal = () => {
    setSelectedPartner(null);
  };

  // Error state
  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        color: "white",
        fontSize: "1.2rem",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <p style={{ color: "#ff7f50" }}>❌ {error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: "linear-gradient(to right, #40e0d0, #ff7f50)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading || !leafletReady) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        color: "white",
        fontSize: "1.2rem",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255, 255, 255, 0.3)",
          borderTop: "4px solid #40e0d0",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p>Loading map...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
      color: "white",
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: "center",
        marginBottom: "2rem",
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          background: "linear-gradient(to right, #40e0d0, #ff7f50)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
        }}>
          Minting Partners Map
        </h1>
        <p style={{
          fontSize: "1.1rem",
          color: "rgba(255, 255, 255, 0.8)",
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          Discover authorized minting locations near you. Click on any marker to view partner details.
        </p>
      </div>

      {/* Stats Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: "1.5rem",
          textAlign: "center",
        }}>
          <h3 style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#40e0d0",
            margin: "0 0 0.5rem 0",
          }}>
            {partners.length}
          </h3>
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            margin: 0,
          }}>
            Active Partners
          </p>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: "1.5rem",
          textAlign: "center",
        }}>
          <h3 style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#ff7f50",
            margin: "0 0 0.5rem 0",
          }}>
            24/7
          </h3>
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            margin: 0,
          }}>
            Availability
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "2rem",
      }}>
        <div
          ref={mapRef}
          style={{
            height: "500px",
            borderRadius: "8px",
            overflow: "hidden",
            width: "100%",
          }}
        />
      </div>

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "2rem",
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "500px",
            width: "100%",
            position: "relative",
          }}>
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0.5rem",
                lineHeight: 1,
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "white",
              marginBottom: "1rem",
            }}>
              {selectedPartner.name}
            </h2>

            <div style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              <p><strong>Address:</strong> {selectedPartner.address || "Not available"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
