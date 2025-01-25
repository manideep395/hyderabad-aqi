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

const locations = [
  { id: "14135", name: "New Malakpet" },
  { id: "14155", name: "Nacharam" },
  { id: "14156", name: "ECIL" },
  { id: "7022", name: "Hyderabad US" },
  { id: "8677", name: "Bahadurpura Zoo Park" },
  { id: "14125", name: "Somajiguda" },
  { id: "8182", name: "Sanathnagar" },
  { id: "14127", name: "Kokapet" },
  { id: "11284", name: "Central University Hyderabad" },
  { id: "11305", name: "Patancheruvu" },
  { id: "9144", name: "IDA Pashamylaram" },
  { id: "14126", name: "IITH Kandi" }
];

const MainDashboard = () => {
  const { data: aqiData, isLoading } = useQuery({
    queryKey: ["telangana-aqi"],
    queryFn: async () => {
      // Fetch AQI data for all locations
      const responses = await Promise.all(
        locations.map(loc => 
          fetch(`https://api.waqi.info/feed/@${loc.id}/?token=demo`)
            .then(res => res.json())
            .catch(() => ({ data: { aqi: 0 } }))
        )
      );
      
      // Calculate average AQI
      const validAqis = responses
        .map(res => res.data?.aqi)
        .filter(aqi => aqi && typeof aqi === 'number');
      
      const averageAqi = Math.round(
        validAqis.reduce((sum, aqi) => sum + aqi, 0) / validAqis.length
      );
      
      return averageAqi || 0;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  const aqi = aqiData || 0;

  return (
    <Card className="p-6 shadow-lg bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Telangana Average Air Quality</h2>
        <div className="flex justify-center items-center space-x-4">
          <div className={`text-6xl font-bold ${getAQIColor(aqi)} bg-opacity-20 rounded-full p-8 shadow-lg transform hover:scale-105 transition-transform duration-300`}>
            {aqi}
          </div>
          <div className="text-left">
            <p className="text-xl font-semibold">{getAQIText(aqi)}</p>
            <p className="text-gray-600">Average across 12 locations</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MainDashboard;