import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { locations } from "../data/locations";
import { ArrowRight, Activity, Wind, Thermometer, Droplets } from "lucide-react";
import PredictionReport from "./PredictionReport";

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

  const [showPrediction, setShowPrediction] = useState(false);

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
    const predictionFactor = 12;
    const currentAQI = currentData.data.aqi;

    let predictedAQI = currentAQI * (1 + (yearDifference / predictionFactor));

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

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { status: "Good", color: "bg-aqi-good" };
    if (aqi <= 100) return { status: "Moderate", color: "bg-aqi-moderate" };
    if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "bg-aqi-unhealthy" };
    return { status: "Hazardous", color: "bg-aqi-hazardous" };
  };

  const handlePredict = () => {
    setShowPrediction(true);
  };

  const prediction = calculatePrediction();
  const aqiStatus = prediction ? getAQIStatus(prediction.aqi) : null;

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

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handlePredict}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            Generate Prediction
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {showPrediction && prediction && (
        <>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold mb-6 text-center">Prediction Results for {inputs.year}</h3>
          
          <div className="mb-8">
            <div className={`${aqiStatus?.color} text-white p-6 rounded-lg text-center transform hover:scale-105 transition-all`}>
              <p className="text-4xl font-bold mb-2">{prediction.aqi}</p>
              <p className="text-xl">{aqiStatus?.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                <Activity className="w-5 h-5" />
                <p className="font-semibold">NO₂</p>
              </div>
              <p className="text-2xl font-bold">{prediction.no2}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2 text-green-600">
                <Wind className="w-5 h-5" />
                <p className="font-semibold">O₃</p>
              </div>
              <p className="text-2xl font-bold">{prediction.o3}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2 text-yellow-600">
                <Thermometer className="w-5 h-5" />
                <p className="font-semibold">CO</p>
              </div>
              <p className="text-2xl font-bold">{prediction.co}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2 text-purple-600">
                <Droplets className="w-5 h-5" />
                <p className="font-semibold">PM10</p>
              </div>
              <p className="text-2xl font-bold">{prediction.pm10}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2 text-indigo-600">
                <Droplets className="w-5 h-5" />
                <p className="font-semibold">PM2.5</p>
              </div>
              <p className="text-2xl font-bold">{prediction.pm25}</p>
            </div>
          </div>
          </Card>
          
          <PredictionReport 
            prediction={prediction}
            year={inputs.year}
            location={locations.find(loc => loc.stationId === inputs.location)?.name || "Unknown Location"}
          />
        </>
      )}
    </div>
  );
};

export default PredictionTool;
