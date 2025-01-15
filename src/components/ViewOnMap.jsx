import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import AddEvent from "./AddEvent"; 

const ViewOnMap = ({ events, onMarkerClick, onEventAdded, isAdmin }) => {
  const mapRef = useRef(null); // Reference to the map container
  const mapInstance = useRef(null); // Reference to the Leaflet map instance
  const [showAddEventModal, setShowAddEventModal] = useState(false); // Control modal visibility
  const [newEventPosition, setNewEventPosition] = useState(null); 

  useEffect(() => {
    // Initialize the Leaflet map
    mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for events
    events.forEach((event) => {
      const marker = L.marker([event.latitude, event.longitude])
        .addTo(map)
        .bindPopup(`<strong>${event.title}</strong><br>${event.location}`);

      marker.on("click", () => onMarkerClick(event));
    });

    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    };
  }, [events, onMarkerClick]);

  useEffect(() => {
    const map = mapInstance.current;

    if (isAdmin) {
      // Attach map click listener for adding events only for admins
      map.on("click", (e) => {
        console.log("Map clicked at:", e.latlng);
        setNewEventPosition(e.latlng); // Store the clicked position
        setShowAddEventModal(true); // Show the modal
      });
    }

    return () => {
      // Remove map click listener on cleanup
      if (isAdmin) {
        map.off("click");
      }
    };
  }, [isAdmin]);

  return (
    <>
      <div ref={mapRef} style={{ height: "600px", width: "100%" }} />
      {isAdmin && showAddEventModal && newEventPosition && (
        <AddEvent
          event={{
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            latitude: newEventPosition.lat,
            longitude: newEventPosition.lng,
            imageURL: "",
            eventType: "",
            availability: "",
          }}
          onClose={() => setShowAddEventModal(false)} // Close the modal
          onEventAdded={(newEvent) => {
            setShowAddEventModal(false); 
            setNewEventPosition(null); 
            onEventAdded(newEvent); 
          }}
        />
      )}
    </>
  );
};

export default ViewOnMap;
