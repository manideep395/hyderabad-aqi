import { useState } from "react";
import LocationCard from "./LocationCard";
import LocationModal from "./LocationModal";

const locations = [
  "New Malakpet",
  "Nacharam",
  "ECIL",
  "Hyderabad US",
  "Bahadurpura Zoo Park",
  "Somajiguda",
  "Sanathnagar",
  "Kokapet",
  "Central University Hyderabad",
  "Patancheruvu",
  "IDA Pashamylaram",
  "IITH Kandi",
];

const LocationGrid = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {locations.map((location) => (
          <LocationCard
            key={location}
            name={location}
            onViewDetails={() => setSelectedLocation(location)}
          />
        ))}
      </div>
      
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default LocationGrid;