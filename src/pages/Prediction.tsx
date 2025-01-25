import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";

interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  temperature: number;
  humidity: number;
}

const locations = [
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

const parameters = [
  { id: "aqi", name: "AQI", unit: "", threshold: { good: 50, moderate: 100, poor: 150 } },
  { id: "pm25", name: "PM2.5", unit: "µg/m³", threshold: { good: 12, moderate: 35.4, poor: 55.4 } },
  { id: "pm10", name: "PM10", unit: "µg/m³", threshold: { good: 54, moderate: 154, poor: 254 } },
  { id: "no2", name: "NO2", unit: "ppb", threshold: { good: 53, moderate: 100, poor: 360 } },
  { id: "o3", name: "O3", unit: "ppb", threshold: { good: 54, moderate: 70, poor: 85 } },
  { id: "so2", name: "SO2", unit: "ppb", threshold: { good: 35, moderate: 75, poor: 185 } },
  { id: "co", name: "CO", unit: "ppm", threshold: { good: 4.4, moderate: 9.4, poor: 12.4 } },
  { id: "temperature", name: "Temperature", unit: "°C", threshold: { good: 25, moderate: 30, poor: 35 } },
  { id: "humidity", name: "Humidity", unit: "%", threshold: { good: 60, moderate: 70, poor: 80 } }
];

const Prediction = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].stationId);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trendPercentage, setTrendPercentage] = useState(0);

  // Fetch real-time data
  const { data: currentData, isLoading } = useQuery({
    queryKey: ['aqiData', selectedLocation],
    queryFn: async () => {
      try {
        console.log(`Fetching data for station: ${selectedLocation}`);
        const response = await fetch(`https://api.waqi.info/feed/@${selectedLocation}/?token=demo`);
        const data = await response.json();
        console.log("API Response:", data);

        if (data.status === "ok") {
          const result: AQIData = {
            aqi: data.data.aqi || 0,
            pm25: data.data.iaqi.pm25?.v || 0,
            pm10: data.data.iaqi.pm10?.v || 0,
            no2: data.data.iaqi.no2?.v || 0,
            o3: data.data.iaqi.o3?.v || 0,
            so2: data.data.iaqi.so2?.v || 0,
            co: data.data.iaqi.co?.v || 0,
            temperature: data.data.iaqi.t?.v || 0,
            humidity: data.data.iaqi.h?.v || 0
          };
          return result;
        }
        throw new Error("Failed to fetch data");
      } catch (error) {
        console.error("Error fetching AQI data:", error);
        // Return default values if API fails
        return {
          aqi: 50,
          pm25: 25,
          pm10: 45,
          no2: 30,
          o3: 40,
          so2: 20,
          co: 2,
          temperature: 28,
          humidity: 65
        };
      }
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const calculatePredictedValue = (currentValue: number, months: number, parameter: string) => {
    const trend = 1 + (trendPercentage / 100);
    const predictedValue = currentValue * Math.pow(trend, months);
    
    // Apply seasonal variations for temperature and humidity
    if (parameter === "temperature" || parameter === "humidity") {
      const seasonalFactor = Math.sin((months + new Date().getMonth()) * Math.PI / 6);
      return parameter === "temperature" 
        ? predictedValue + seasonalFactor * 5 // ±5°C seasonal variation
        : predictedValue + seasonalFactor * 10; // ±10% humidity variation
    }
    
    return predictedValue;
  };

  const generatePredictionData = (parameter: string, currentValue: number) => {
    const dataPoints = [];
    const months = 12;

    for (let i = 0; i < months; i++) {
      const date = new Date(selectedDate);
      date.setMonth(date.getMonth() + i);
      
      dataPoints.push({
        date: format(date, 'MMM yyyy'),
        value: Math.round(calculatePredictedValue(currentValue, i, parameter)),
      });
    }

    return dataPoints;
  };

  const getCardBackground = (paramId: string, value: number) => {
    const param = parameters.find(p => p.id === paramId);
    if (!param?.threshold) return "from-green-300 to-blue-300";

    if (value <= param.threshold.good) return "from-green-300 to-blue-300";
    if (value <= param.threshold.moderate) return "from-yellow-300 to-orange-300";
    return "from-red-300 to-pink-300";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AQI Prediction Tool</h1>
      
      <Card className="p-6 space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.stationId} value={location.stationId}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Future Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) =>
                    date < new Date() || date > addYears(new Date(), 30)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Trend Change (%)</label>
            <Input
              type="number"
              value={trendPercentage}
              onChange={(e) => setTrendPercentage(Number(e.target.value))}
              placeholder="Enter percentage"
              min="-100"
              max="1000"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parameters.map((param) => (
          <Card 
            key={param.id} 
            className={`transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden`}
            style={{
              background: `linear-gradient(225deg, ${getCardBackground(param.id, currentData?.[param.id as keyof AQIData] || 0)})`,
              borderRadius: '1rem',
              perspective: '1000px'
            }}
          >
            <CardHeader>
              <CardTitle className="text-white">
                {param.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-white">
                  <p className="text-sm opacity-80">Current Value</p>
                  <p className="text-2xl font-bold">
                    {currentData?.[param.id as keyof AQIData]} {param.unit}
                  </p>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generatePredictionData(param.id, currentData?.[param.id as keyof AQIData] || 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis 
                        dataKey="date"
                        stroke="white"
                        tick={{ fill: 'white' }}
                      />
                      <YAxis 
                        stroke="white"
                        tick={{ fill: 'white' }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#ffffff" 
                        strokeWidth={2}
                        dot={{ fill: "#ffffff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-white">
                  <p className="text-sm opacity-80">Predicted Value (End of Period)</p>
                  <p className="text-2xl font-bold">
                    {generatePredictionData(param.id, currentData?.[param.id as keyof AQIData] || 0).slice(-1)[0]?.value} {param.unit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Prediction;