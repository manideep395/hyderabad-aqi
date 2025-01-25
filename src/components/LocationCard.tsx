import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface LocationCardProps {
  name: string;
  onViewDetails: () => void;
}

const LocationCard = ({ name, onViewDetails }: LocationCardProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["location-aqi", name],
    queryFn: async () => {
      const response = await fetch(
        `https://api.waqi.info/feed/${name}/?token=demo`
      );
      return response.json();
    },
  });

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-aqi-good";
    if (aqi <= 100) return "bg-aqi-moderate";
    if (aqi <= 150) return "bg-aqi-unhealthy";
    return "bg-aqi-hazardous";
  };

  const aqi = data?.data?.aqi || 0;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{name}</h3>
      <div className="flex items-center justify-between mb-4">
        <div className={`${getAQIColor(aqi)} text-white px-3 py-1 rounded-full text-sm`}>
          AQI: {isLoading ? "..." : aqi}
        </div>
      </div>
      <Button onClick={onViewDetails} className="w-full">
        View Details
      </Button>
    </Card>
  );
};

export default LocationCard;