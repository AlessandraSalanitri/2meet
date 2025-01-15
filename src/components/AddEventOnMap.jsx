import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AddEvent from "./AddEvent";

const AddEventOnMap = ({ onEventAdded }) => {
  const [isAddEventMode, setIsAddEventMode] = useState(false);
  const [newEventPosition, setNewEventPosition] = useState(null);

  const handleMapClick = (latlng) => {
    setNewEventPosition(latlng);
  };

  const handleAddEvent = async (eventData) => {
    try {
      const eventDoc = await addDoc(collection(db, "events"), eventData);
      const newEvent = { id: eventDoc.id, ...eventData };
      onEventAdded(newEvent); // Notify parent
      setNewEventPosition(null); // Reset
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <div>
      {/* Add Event Form */}
      {newEventPosition && (
        <AddEvent
          event={{
            latitude: newEventPosition.lat,
            longitude: newEventPosition.lng,
          }}
          onClose={() => setNewEventPosition(null)}
          onEventAdded={handleAddEvent}
        />
      )}
    </div>
  );
};


export default AddEventOnMap;
