import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "bg-aqi-good";
  if (aqi <= 100) return "bg-aqi-moderate";
  if (aqi <= 150) return "bg-aqi-unhealthy";
  return "bg-aqi-hazardous";
};

const getAQIText = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  return "Unhealthy";
};

const MainDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["hyderabad-aqi"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.waqi.info/feed/hyderabad/?token=demo"
      );
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  const aqi = data?.data?.aqi || 0;

  return (
    <Card className="p-6 shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Hyderabad Air Quality</h2>
        <div className="flex justify-center items-center space-x-4">
          <div className={`text-6xl font-bold ${getAQIColor(aqi)} bg-opacity-20 rounded-full p-8`}>
            {aqi}
          </div>
          <div className="text-left">
            <p className="text-xl font-semibold">{getAQIText(aqi)}</p>
            <p className="text-gray-600">Main Pollutant: PM2.5</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MainDashboard;