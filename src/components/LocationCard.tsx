import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, ThumbsUp, Wind } from "lucide-react";

interface LocationCardProps {
  name: string;
  stationId?: string;
  onViewDetails: () => void;
}

const LocationCard = ({ name, stationId, onViewDetails }: LocationCardProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["location-aqi", name],
    queryFn: async () => {
      const response = await fetch(
        stationId
          ? `https://api.waqi.info/feed/@${stationId}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`
          : `https://api.waqi.info/feed/${name}/?token=demo`
      );
      return response.json();
    },
  });

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { color: "bg-aqi-good", status: "Good", icon: ThumbsUp };
    if (aqi <= 100) return { color: "bg-aqi-moderate", status: "Moderate", icon: Wind };
    if (aqi <= 150) return { color: "bg-aqi-unhealthy", status: "Unhealthy", icon: Activity };
    return { color: "bg-aqi-hazardous", status: "Hazardous", icon: AlertTriangle };
  };

  const aqi = data?.data?.aqi || 0;
  const status = getAQIStatus(aqi);
  const StatusIcon = status.icon;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow space-y-4">
      <h3 className="font-semibold text-lg">{name}</h3>
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className={`${status.color} text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-float`}>
            <StatusIcon className="w-4 h-4" />
            <span>AQI: {isLoading ? "..." : aqi}</span>
          </div>
          <Badge variant="outline" className="text-sm">
            {status.status}
          </Badge>
        </div>

        {!isLoading && data?.data?.iaqi && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {data.data.iaqi.pm25 && (
              <div className="bg-gray-50 p-2 rounded">
                PM2.5: {data.data.iaqi.pm25.v}
              </div>
            )}
            {data.data.iaqi.pm10 && (
              <div className="bg-gray-50 p-2 rounded">
                PM10: {data.data.iaqi.pm10.v}
              </div>
            )}
          </div>
        )}
      </div>

      <Button onClick={onViewDetails} className="w-full mt-4">
        View Details
      </Button>
    </Card>
  );
};

export default LocationCard;