import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { locations } from "../data/locations";

interface PredictionInputs {
  location: string;
  timeSlot: "morning" | "evening";
  specificTime: string;
  year: number;
  trend: "present" | "increase" | "decrease";
  trendPercentage: number;
}

const PredictionTool = () => {
  const [inputs, setInputs] = useState<PredictionInputs>({
    location: locations[0].stationId || "",
    timeSlot: "morning",
    specificTime: "08:00",
    year: 2025,
    trend: "present",
    trendPercentage: 0
  });

  const { data: currentData } = useQuery({
    queryKey: ["location-aqi", inputs.location],
    queryFn: async () => {
      const response = await fetch(
        `https://api.waqi.info/feed/@${inputs.location}/?token=272ccb02f78daa795dae785ea823e1e39ab01971`
      );
      return response.json();
    },
  });

  const calculatePrediction = () => {
    if (!currentData?.data) return null;

    const yearDifference = inputs.year - new Date().getFullYear();
    const predictionFactor = 12; // Based on historical data
    const currentAQI = currentData.data.aqi;

    // Calculate base prediction using present trend
    let predictedAQI = currentAQI * (1 + (yearDifference / predictionFactor));

    // Adjust based on selected trend
    if (inputs.trend === "increase") {
      predictedAQI *= (1 + (inputs.trendPercentage / 100));
    } else if (inputs.trend === "decrease") {
      predictedAQI *= (1 - (inputs.trendPercentage / 100));
    }

    return {
      aqi: Math.round(predictedAQI),
      no2: Math.round(currentData.data.iaqi.no2?.v * (1 + (yearDifference / predictionFactor)) || 0),
      o3: Math.round(currentData.data.iaqi.o3?.v * (1 + (yearDifference / predictionFactor)) || 0),
      co: Math.round(currentData.data.iaqi.co?.v * (1 + (yearDifference / predictionFactor)) || 0),
      pm10: Math.round(currentData.data.iaqi.pm10?.v * (1 + (yearDifference / predictionFactor)) || 0),
      pm25: Math.round(currentData.data.iaqi.pm25?.v * (1 + (yearDifference / predictionFactor)) || 0),
    };
  };

  const prediction = calculatePrediction();

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">AQI Prediction Tool</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Select 
              value={inputs.location}
              onValueChange={(value) => setInputs(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.stationId} value={location.stationId || ""}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time Slot</label>
            <Select 
              value={inputs.timeSlot}
              onValueChange={(value: "morning" | "evening") => setInputs(prev => ({ ...prev, timeSlot: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8 AM - 8 PM)</SelectItem>
                <SelectItem value="evening">Evening (8 PM - 8 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Specific Time</label>
            <Input
              type="time"
              value={inputs.specificTime}
              onChange={(e) => setInputs(prev => ({ ...prev, specificTime: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Input
              type="number"
              min={2025}
              max={2050}
              value={inputs.year}
              onChange={(e) => setInputs(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Trend</label>
            <Select 
              value={inputs.trend}
              onValueChange={(value: "present" | "increase" | "decrease") => setInputs(prev => ({ ...prev, trend: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present Trend</SelectItem>
                <SelectItem value="increase">Increase in Trend</SelectItem>
                <SelectItem value="decrease">Decrease in Trend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inputs.trend !== "present" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Trend Percentage</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={inputs.trendPercentage}
                onChange={(e) => setInputs(prev => ({ ...prev, trendPercentage: parseInt(e.target.value) }))}
              />
            </div>
          )}
        </div>
      </Card>

      {prediction && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Prediction Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Predicted AQI</p>
              <p className="text-2xl font-semibold">{prediction.aqi}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Predicted NO₂</p>
              <p className="text-2xl font-semibold">{prediction.no2}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Predicted O₃</p>
              <p className="text-2xl font-semibold">{prediction.o3}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Predicted CO</p>
              <p className="text-2xl font-semibold">{prediction.co}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Predicted PM10</p>
              <p className="text-2xl font-semibold">{prediction.pm10}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Predicted PM2.5</p>
              <p className="text-2xl font-semibold">{prediction.pm25}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PredictionTool;
