import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertTriangle, 
  ThumbsUp, 
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  CloudRain,
  ThermometerSun,
  ThermometerSnowflake,
  Sun
} from "lucide-react";

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

  const getWeatherIcon = (temp: number) => {
    if (temp <= 15) return ThermometerSnowflake;
    if (temp >= 30) return ThermometerSun;
    return Thermometer;
  };

  const getBackgroundAnimation = (temp: number, humidity: number) => {
    if (humidity > 80) return "bg-gradient-to-r from-blue-400/20 to-blue-500/20 animate-pulse";
    if (temp <= 15) return "bg-gradient-to-r from-blue-100/20 to-blue-200/20";
    if (temp >= 30) return "bg-gradient-to-r from-orange-100/20 to-red-200/20";
    return "bg-gradient-to-r from-green-100/20 to-blue-100/20";
  };

  const aqi = data?.data?.aqi || 0;
  const status = getAQIStatus(aqi);
  const StatusIcon = status.icon;
  
  const temp = data?.data?.iaqi?.t?.v;
  const humidity = data?.data?.iaqi?.h?.v;
  const pressure = data?.data?.iaqi?.p?.v;
  const windSpeed = data?.data?.iaqi?.w?.v;
  
  const WeatherIcon = temp ? getWeatherIcon(temp) : Thermometer;
  const backgroundClass = temp && humidity ? getBackgroundAnimation(temp, humidity) : "";

  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-300 overflow-hidden relative ${backgroundClass}`}>
      <div className="absolute inset-0 opacity-30">
        {humidity > 80 && (
          <div className="absolute inset-0 animate-float">
            <CloudRain className="w-full h-full text-blue-300 opacity-20" />
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="font-semibold text-lg mb-4">{name}</h3>
        
        <div className="flex flex-col space-y-4">
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
            <div className="grid grid-cols-2 gap-3">
              {temp && (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <WeatherIcon className="w-5 h-5 text-blue-500" />
                  <span>{temp}°C</span>
                </div>
              )}
              {humidity && (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span>{humidity}%</span>
                </div>
              )}
              {pressure && (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <Gauge className="w-5 h-5 text-blue-500" />
                  <span>{pressure} hPa</span>
                </div>
              )}
              {windSpeed && (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <Wind className="w-5 h-5 text-blue-500" />
                  <span>{windSpeed} m/s</span>
                </div>
              )}
              {data.data.iaqi.co && (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <span className="font-semibold text-blue-500">CO</span>
                  <span>{data.data.iaqi.co.v}</span>
                </div>
              )}
              {data.data.iaqi.so2 && (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <span className="font-semibold text-blue-500">SO₂</span>
                  <span>{data.data.iaqi.so2.v}</span>
                </div>
              )}
              {data.data.iaqi.o3 && (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <span className="font-semibold text-blue-500">O₃</span>
                  <span>{data.data.iaqi.o3.v}</span>
                </div>
              )}
              {data.data.iaqi.no2 && (
                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                  <span className="font-semibold text-blue-500">NO₂</span>
                  <span>{data.data.iaqi.no2.v}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <Button onClick={onViewDetails} className="w-full mt-6 bg-primary hover:bg-primary/90">
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default LocationCard;