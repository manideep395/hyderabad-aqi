import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  "AQI",
  "PM2.5",
  "PM10",
  "NO2",
  "O3",
  "SO2",
  "CO",
  "Temperature",
  "Humidity"
];

const Prediction = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].name);
  const [selectedParameter, setSelectedParameter] = useState(parameters[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trendPercentage, setTrendPercentage] = useState(0);

  const generatePredictionData = () => {
    const baseValue = 100; // Example base value
    const dataPoints = [];
    const months = 12;

    for (let i = 0; i < months; i++) {
      const date = new Date(selectedDate);
      date.setMonth(date.getMonth() + i);
      
      const trend = 1 + (trendPercentage / 100);
      const predictedValue = baseValue * Math.pow(trend, i);
      
      dataPoints.push({
        date: format(date, 'MMM yyyy'),
        value: Math.round(predictedValue),
      });
    }

    return dataPoints;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AQI Prediction Tool</h1>
      
      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label className="text-sm font-medium">Parameter</label>
            <Select value={selectedParameter} onValueChange={setSelectedParameter}>
              <SelectTrigger>
                <SelectValue placeholder="Select parameter" />
              </SelectTrigger>
              <SelectContent>
                {parameters.map((param) => (
                  <SelectItem key={param} value={param}>
                    {param}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
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

        <div className="h-[400px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={generatePredictionData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                label={{ 
                  value: 'Time',
                  position: 'insideBottom',
                  offset: -5 
                }}
              />
              <YAxis 
                label={{ 
                  value: selectedParameter,
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0EA5E9" 
                strokeWidth={2}
                dot={{ fill: "#0EA5E9" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Prediction;