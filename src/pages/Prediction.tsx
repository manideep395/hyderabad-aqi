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
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  { id: "aqi", name: "AQI", unit: "", threshold: { good: 50, moderate: 100, poor: 150 }, baseValue: 75 },
  { id: "pm25", name: "PM2.5", unit: "µg/m³", threshold: { good: 12, moderate: 35.4, poor: 55.4 }, baseValue: 25 },
  { id: "pm10", name: "PM10", unit: "µg/m³", threshold: { good: 54, moderate: 154, poor: 254 }, baseValue: 45 },
  { id: "no2", name: "NO2", unit: "ppb", threshold: { good: 53, moderate: 100, poor: 360 }, baseValue: 30 },
  { id: "o3", name: "O3", unit: "ppb", threshold: { good: 54, moderate: 70, poor: 85 }, baseValue: 40 },
  { id: "so2", name: "SO2", unit: "ppb", threshold: { good: 35, moderate: 75, poor: 185 }, baseValue: 20 },
  { id: "co", name: "CO", unit: "ppm", threshold: { good: 4.4, moderate: 9.4, poor: 12.4 }, baseValue: 2 },
  { id: "temperature", name: "Temperature", unit: "°C", threshold: { good: 25, moderate: 30, poor: 35 }, baseValue: 28 },
  { id: "humidity", name: "Humidity", unit: "%", threshold: { good: 60, moderate: 70, poor: 80 }, baseValue: 65 }
];

const Prediction = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].stationId);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trendPercentage, setTrendPercentage] = useState(0);

  const generatePredictionData = (parameter: string, baseValue: number) => {
    const dataPoints = [];
    const months = 12;
    const trend = 1 + (trendPercentage / 100);

    for (let i = 0; i < months; i++) {
      const date = new Date(selectedDate);
      date.setMonth(date.getMonth() + i);
      
      // Add seasonal variations for temperature and humidity
      let seasonalFactor = 0;
      if (parameter === "temperature") {
        // Temperature varies by ±5°C seasonally
        seasonalFactor = Math.sin((i + date.getMonth()) * Math.PI / 6) * 5;
      } else if (parameter === "humidity") {
        // Humidity varies by ±10% seasonally
        seasonalFactor = Math.sin((i + date.getMonth()) * Math.PI / 6) * 10;
      }
      
      const predictedValue = baseValue * Math.pow(trend, i) + seasonalFactor;
      
      dataPoints.push({
        date: format(date, 'MMM yyyy'),
        value: Math.round(predictedValue * 10) / 10,
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Add padding-top to account for fixed header */}
      <main className="flex-grow pt-48">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">AQI Prediction Simulator</h1>
          
          <Card className="p-6 space-y-6 mb-8 bg-white shadow-lg">
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
            {parameters.map((param) => {
              const predictionData = generatePredictionData(param.id, param.baseValue);
              const currentValue = param.baseValue;
              const finalValue = predictionData[predictionData.length - 1].value;

              return (
                <Card 
                  key={param.id} 
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden bg-white"
                  style={{
                    background: `linear-gradient(225deg, ${getCardBackground(param.id, currentValue)})`,
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
                          {currentValue} {param.unit}
                        </p>
                      </div>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={predictionData}>
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
                          {finalValue} {param.unit}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Prediction;
