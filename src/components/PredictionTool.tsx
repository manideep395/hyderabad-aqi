import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { locations } from "../data/locations";
import { ArrowRight } from "lucide-react";
import PredictionReport from "./PredictionReport";
import { Slider } from "@/components/ui/slider";

interface PredictionInputs {
  location: string;
  month: string;
  timeSlot: "morning" | "evening";
  specificTime: string;
  year: number;
  trend: "present" | "increase" | "decrease";
  trendPercentage: number;
}

interface Prediction {
  current: {
    aqi: number;
    no2: number;
    o3: number;
    co: number;
    pm10: number;
    pm25: number;
  };
  predicted: {
    aqi: number;
    no2: number;
    o3: number;
    co: number;
    pm10: number;
    pm25: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
  };
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
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);

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
    const currentAQI = currentData.data.aqi;
    const currentPM25 = currentData.data.iaqi.pm25?.v || 0;
    const currentPM10 = currentData.data.iaqi.pm10?.v || 0;
    const currentO3 = currentData.data.iaqi.o3?.v || 0;
    const currentNO2 = currentData.data.iaqi.no2?.v || 0;
    const currentCO = currentData.data.iaqi.co?.v || 0;

    // Average rates of change (example values, should be adjusted based on historical data)
    const avgRateChangePM25 = 0.5; // μg/m³ per year
    const avgRateChangePM10 = 0.8; // μg/m³ per year

    // Calculate predicted values based on trend
    let predictedPM25, predictedPM10;

    if (inputs.trend === "present") {
      predictedPM25 = currentPM25 + (avgRateChangePM25 * yearDifference);
      predictedPM10 = currentPM10 + (avgRateChangePM10 * yearDifference);
    } else if (inputs.trend === "increase") {
      predictedPM25 = currentPM25 * Math.pow(1 + (inputs.trendPercentage / 100), yearDifference);
      predictedPM10 = currentPM10 * Math.pow(1 + (inputs.trendPercentage / 100), yearDifference);
    } else {
      predictedPM25 = currentPM25 * Math.pow(1 - (inputs.trendPercentage / 100), yearDifference);
      predictedPM10 = currentPM10 * Math.pow(1 - (inputs.trendPercentage / 100), yearDifference);
    }

    // Calculate weather conditions based on time
    const hour = parseInt(inputs.specificTime.split(':')[0]);
    const avgTempMonth = getMonthlyAvgTemp(inputs.month);
    const tempRange = 10; // Temperature range in degrees
    const tMaxHour = 14; // 2 PM peak temperature

    const temperature = avgTempMonth + 
      (tempRange / 2) * 
      Math.sin((2 * Math.PI * (hour - tMaxHour)) / 24);

    const humidity = 65 + 
      (20 / 2) * 
      Math.cos((2 * Math.PI * (hour - 6)) / 24);

    const pressure = 1013 + 
      (10 / 2) * 
      Math.sin((2 * Math.PI * (hour - 10)) / 24);

    const windSpeed = 12 + 
      (8 / 2) * 
      Math.sin((2 * Math.PI * (hour - 16)) / 24);

    return {
      current: {
        aqi: currentAQI,
        no2: currentNO2,
        o3: currentO3,
        co: currentCO,
        pm10: currentPM10,
        pm25: currentPM25,
      },
      predicted: {
        aqi: Math.round(currentAQI * (1 + yearDifference * 0.02)),
        no2: Math.round(currentNO2 * (1 + yearDifference * 0.015)),
        o3: Math.round(currentO3 * (1 + yearDifference * 0.018)),
        co: Math.round(currentCO * (1 + yearDifference * 0.01)),
        pm10: Math.round(predictedPM10),
        pm25: Math.round(predictedPM25),
      },
      weather: {
        temperature: Math.round(temperature),
        humidity: Math.round(humidity),
        pressure: Math.round(pressure),
        windSpeed: Math.round(windSpeed),
      }
    };
  };

  const getMonthlyAvgTemp = (month: string) => {
    const monthTemps: { [key: string]: number } = {
      "January": 20,
      "February": 22,
      "March": 25,
      "April": 28,
      "May": 32,
      "June": 33,
      "July": 30,
      "August": 29,
      "September": 28,
      "October": 26,
      "November": 23,
      "December": 21
    };
    return monthTemps[month] || 25;
  };

  const handleGeneratePrediction = () => {
    const newPrediction = calculatePrediction();
    setCurrentPrediction(newPrediction);
    setShowPrediction(true);
  };

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
              <Slider
                value={[inputs.trendPercentage]}
                onValueChange={(value) => setInputs(prev => ({ ...prev, trendPercentage: value[0] }))}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-gray-500 text-center">
                {inputs.trendPercentage}%
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleGeneratePrediction}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            Generate Prediction
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {showPrediction && currentPrediction && (
        <PredictionReport 
          prediction={currentPrediction}
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