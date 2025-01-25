import { useState } from "react";
import LocationCard from "./LocationCard";
import LocationModal from "./LocationModal";

interface LocationConfig {
  name: string;
  stationId?: string;
}

const locations: LocationConfig[] = [
  "New Malakpet",
  "Nacharam",
  "ECIL",
  { name: "Hyderabad US", stationId: "7022" },
  { name: "Bahadurpura Zoo Park", stationId: "8677" },
  "Somajiguda",
  { name: "Sanathnagar", stationId: "8182" },
  "Kokapet",
  "Central University Hyderabad",
  "Patancheruvu",
  "IDA Pashamylaram",
  "IITH Kandi",
].map(loc => typeof loc === 'string' ? { name: loc } : loc);

const LocationGrid = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {locations.map((location) => (
          <LocationCard
            key={location.name}
            name={location.name}
            stationId={location.stationId}
            onViewDetails={() => setSelectedLocation(location.name)}
          />
        ))}
      </div>
      
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          stationId={locations.find(loc => loc.name === selectedLocation)?.stationId}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default LocationGrid;