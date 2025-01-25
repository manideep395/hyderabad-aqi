import { useState } from "react";
import LocationCard from "./LocationCard";
import LocationModal from "./LocationModal";

interface LocationConfig {
  name: string;
  stationId?: string;
}

const locations: LocationConfig[] = [
  { name: "New Malakpet", stationId: "14135" },
  { name: "Nacharam", stationId: "14155" },
  { name: "ECIL", stationId: "14156" },
  { name: "Hyderabad US", stationId: "7022" },
  { name: "Bahadurpura Zoo Park", stationId: "8677" },
  { name: "Somajiguda", stationId: "14125" },
  { name: "Sanathnagar", stationId: "8182" },
  { name: "Kokapet", stationId: "14127" },
  { name: "Central University Hyderabad", stationId: "11284" },
  { name: "Patancheruvu", stationId: "11305" },
  { name: "IDA Pashamylaram", stationId: "9144" },
  { name: "IITH Kandi", stationId: "14126" },
];

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