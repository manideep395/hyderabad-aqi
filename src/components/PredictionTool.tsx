import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { locations } from "../data/locations";
import { ArrowRight, Activity, Wind, Thermometer, Droplets, Calendar } from "lucide-react";
import PredictionReport from "./PredictionReport";

interface PredictionInputs {
  location: string;
  month: string;
  timeSlot: "morning" | "evening";
  specificTime: string;
  year: number;
  trend: "present" | "increase" | "decrease";
  trendPercentage: number;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PredictionTool = () => {
  const [inputs, setInputs] = useState<PredictionInputs>({
    location: locations[0].stationId || "",
    month: new Date().toLocaleString('default', { month: 'long' }),
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
      console.log("Fetching AQI data for location:", inputs.location);
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

    // Seasonal adjustment factors
    const seasonalFactors: { [key: string]: number } = {
      "December": 1.2, "January": 1.2, "February": 1.2, // Winter
      "March": 1.0, "April": 0.9, "May": 0.8, // Spring
      "June": 0.7, "July": 0.7, "August": 0.7, // Summer
      "September": 0.8, "October": 0.9, "November": 1.1 // Fall
    };

    const seasonalFactor = seasonalFactors[inputs.month] || 1;
    let predictedAQI = currentAQI * (1 + (yearDifference / predictionFactor)) * seasonalFactor;

    if (inputs.trend === "increase") {
      predictedAQI *= (1 + (inputs.trendPercentage / 100));
    } else if (inputs.trend === "decrease") {
      predictedAQI *= (1 - (inputs.trendPercentage / 100));
    }

    // Time of day adjustment
    const timeAdjustment = inputs.timeSlot === "morning" ? 0.9 : 1.1;
    predictedAQI *= timeAdjustment;

    return {
      current: {
        aqi: currentAQI,
        no2: currentData.data.iaqi.no2?.v || 0,
        o3: currentData.data.iaqi.o3?.v || 0,
        co: currentData.data.iaqi.co?.v || 0,
        pm10: currentData.data.iaqi.pm10?.v || 0,
        pm25: currentData.data.iaqi.pm25?.v || 0,
      },
      predicted: {
        aqi: Math.round(predictedAQI),
        no2: Math.round((currentData.data.iaqi.no2?.v || 0) * (1 + (yearDifference / predictionFactor)) * seasonalFactor),
        o3: Math.round((currentData.data.iaqi.o3?.v || 0) * (1 + (yearDifference / predictionFactor)) * seasonalFactor),
        co: Math.round((currentData.data.iaqi.co?.v || 0) * (1 + (yearDifference / predictionFactor)) * seasonalFactor),
        pm10: Math.round((currentData.data.iaqi.pm10?.v || 0) * (1 + (yearDifference / predictionFactor)) * seasonalFactor),
        pm25: Math.round((currentData.data.iaqi.pm25?.v || 0) * (1 + (yearDifference / predictionFactor)) * seasonalFactor),
      }
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
  const aqiStatus = prediction ? getAQIStatus(prediction.predicted.aqi) : null;

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
            <label className="text-sm font-medium">Month</label>
            <Select 
              value={inputs.month}
              onValueChange={(value) => setInputs(prev => ({ ...prev, month: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
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
        <PredictionReport 
          prediction={prediction}
          year={inputs.year}
          month={inputs.month}
          timeSlot={inputs.timeSlot}
          specificTime={inputs.specificTime}
          location={locations.find(loc => loc.stationId === inputs.location)?.name || "Unknown Location"}
        />
      )}
    </div>
  );
};

export default PredictionTool;
