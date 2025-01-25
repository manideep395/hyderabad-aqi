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
      const responses = await Promise.all(
        locations.map(loc => 
          fetch(`https://api.waqi.info/feed/@${loc.id}/?token=demo`)
            .then(res => res.json())
            .catch(() => ({ data: { aqi: 0 } }))
        )
      );
      
      const validData = responses.filter(res => res.data?.aqi && typeof res.data.aqi === 'number');
      
      const averages = {
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
        averages[key] = Math.round((averages[key] / count) * 10) / 10;
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

  const data = aqiData || { aqi: 0 };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Telangana Average Air Quality</h2>
          <div className="flex justify-center items-center space-x-4">
            <div className={`text-5xl font-bold ${getAQIColor(data.aqi)} bg-opacity-20 rounded-full p-6 shadow-lg`}>
              {data.aqi}
            </div>
            <div className="text-left">
              <p className="text-xl font-semibold">{getAQIText(data.aqi)}</p>
              <p className="text-gray-600">Average across 12 locations</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="PM2.5" value={data.pm25} unit="µg/m³" />
        <MetricCard title="PM10" value={data.pm10} unit="µg/m³" />
        <MetricCard title="NO₂" value={data.no2} unit="ppb" />
        <MetricCard title="O₃" value={data.o3} unit="ppb" />
        <MetricCard title="CO" value={data.co} unit="ppm" />
        <MetricCard title="Temperature" value={data.temperature} unit="°C" />
        <MetricCard title="Humidity" value={data.humidity} unit="%" />
        <MetricCard title="Pressure" value={data.pressure} unit="hPa" />
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, unit }: { title: string; value: number; unit: string }) => (
  <Card className="p-4 bg-white">
    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    <p className="text-2xl font-bold mt-1">
      {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
    </p>
  </Card>
);

export default MainDashboard;