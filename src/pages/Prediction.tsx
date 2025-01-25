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
  { id: "aqi", name: "AQI", unit: "" },
  { id: "pm25", name: "PM2.5", unit: "µg/m³" },
  { id: "pm10", name: "PM10", unit: "µg/m³" },
  { id: "no2", name: "NO2", unit: "ppb" },
  { id: "o3", name: "O3", unit: "ppb" },
  { id: "so2", name: "SO2", unit: "ppb" },
  { id: "co", name: "CO", unit: "ppm" },
  { id: "temperature", name: "Temperature", unit: "°C" },
  { id: "humidity", name: "Humidity", unit: "%" }
];

const Prediction = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].name);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trendPercentage, setTrendPercentage] = useState(0);

  // Fetch real-time data
  const { data: currentData, isLoading } = useQuery({
    queryKey: ['aqiData', selectedLocation],
    queryFn: async () => {
      // Simulated API call - replace with actual API endpoint
      const response = await fetch(`https://api.example.com/aqi/${selectedLocation}`);
      const data = await response.json();
      console.log("Fetched AQI data:", data);
      return data as AQIData;
    },
  });

  const calculatePredictedValue = (currentValue: number, months: number) => {
    const trend = 1 + (trendPercentage / 100);
    return Math.round(currentValue * Math.pow(trend, months));
  };

  const generatePredictionData = (parameter: string, currentValue: number) => {
    const dataPoints = [];
    const months = 12;

    for (let i = 0; i < months; i++) {
      const date = new Date(selectedDate);
      date.setMonth(date.getMonth() + i);
      
      dataPoints.push({
        date: format(date, 'MMM yyyy'),
        value: calculatePredictedValue(currentValue, i),
      });
    }

    return dataPoints;
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
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
                  <SelectItem key={location.name} value={location.name}>
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
            className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
              perspective: "1000px"
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
                    {calculatePredictedValue(currentData?.[param.id as keyof AQIData] || 0, 12)} {param.unit}
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