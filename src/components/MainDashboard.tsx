import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Wind, Thermometer, Droplets, Gauge, Activity, Cloud, CloudRain } from "lucide-react";

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

interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  temperature: number;
  humidity: number;
  pressure: number;
}

const defaultData: AQIData = {
  aqi: 0,
  pm25: 0,
  pm10: 0,
  no2: 0,
  o3: 0,
  co: 0,
  temperature: 0,
  humidity: 0,
  pressure: 0
};

const MainDashboard = () => {
  const { data: aqiData, isLoading } = useQuery({
    queryKey: ["telangana-aqi"],
    queryFn: async () => {
      const responses = await Promise.all(
        locations.map(loc => 
          fetch(`https://api.waqi.info/feed/@${loc.id}/?token=demo`)
            .then(res => res.json())
            .catch(() => ({ data: { aqi: 0 } }))
        )
      );
      
      const validData = responses.filter(res => res.data?.aqi && typeof res.data.aqi === 'number');
      
      const averages: AQIData = {
        aqi: 0,
        pm25: 0,
        pm10: 0,
        no2: 0,
        o3: 0,
        co: 0,
        temperature: 0,
        humidity: 0,
        pressure: 0
      };

      validData.forEach(res => {
        averages.aqi += res.data.aqi;
        averages.pm25 += res.data.iaqi?.pm25?.v || 0;
        averages.pm10 += res.data.iaqi?.pm10?.v || 0;
        averages.no2 += res.data.iaqi?.no2?.v || 0;
        averages.o3 += res.data.iaqi?.o3?.v || 0;
        averages.co += res.data.iaqi?.co?.v || 0;
        averages.temperature += res.data.iaqi?.t?.v || 0;
        averages.humidity += res.data.iaqi?.h?.v || 0;
        averages.pressure += res.data.iaqi?.p?.v || 0;
      });

      const count = validData.length || 1;
      Object.keys(averages).forEach(key => {
        averages[key as keyof AQIData] = Math.round((averages[key as keyof AQIData] / count) * 10) / 10;
      });

      return averages;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  const data = aqiData || defaultData;

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Telangana Average Air Quality</h2>
          <div className="flex justify-center items-center space-x-4">
            <div className={`text-5xl font-bold ${getAQIColor(data.aqi)} bg-opacity-90 rounded-full p-8 shadow-lg transform hover:scale-110 transition-transform duration-300 animate-float`}>
              {data.aqi}
            </div>
            <div className="text-left text-white">
              <p className="text-xl font-semibold">{getAQIText(data.aqi)}</p>
              <p className="text-gray-200">Average across 12 locations</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="PM2.5" value={data.pm25} unit="µg/m³" icon={Cloud} gradient="from-purple-500 to-purple-700" />
        <MetricCard title="PM10" value={data.pm10} unit="µg/m³" icon={CloudRain} gradient="from-blue-500 to-blue-700" />
        <MetricCard title="NO₂" value={data.no2} unit="ppb" icon={Activity} gradient="from-yellow-500 to-yellow-700" />
        <MetricCard title="O₃" value={data.o3} unit="ppb" icon={Wind} gradient="from-green-500 to-green-700" />
        <MetricCard title="CO" value={data.co} unit="ppm" icon={Activity} gradient="from-red-500 to-red-700" />
        <MetricCard title="Temperature" value={data.temperature} unit="°C" icon={Thermometer} gradient="from-orange-500 to-orange-700" />
        <MetricCard title="Humidity" value={data.humidity} unit="%" icon={Droplets} gradient="from-teal-500 to-teal-700" />
        <MetricCard title="Pressure" value={data.pressure} unit="hPa" icon={Gauge} gradient="from-indigo-500 to-indigo-700" />
      </div>
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon,
  gradient 
}: { 
  title: string; 
  value: number; 
  unit: string;
  icon: React.ElementType;
  gradient: string;
}) => (
  <Card className={`p-4 bg-gradient-to-br ${gradient} text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6" />
      <h3 className="text-sm font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-bold mt-2">
      {value} <span className="text-sm font-normal opacity-75">{unit}</span>
    </p>
  </Card>
);

export default MainDashboard;