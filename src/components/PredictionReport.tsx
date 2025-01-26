import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, ThermometerSun, Droplets, Wind, CloudRain } from "lucide-react";
import { jsPDF } from "jspdf";

interface PredictionReportProps {
  prediction: {
    aqi: number;
    no2: number;
    o3: number;
    co: number;
    pm10: number;
    pm25: number;
  };
  year: number;
  location: string;
}

const PredictionReport: React.FC<PredictionReportProps> = ({ prediction, year, location }) => {
  const getHealthRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return {
        status: "Good",
        recommendations: [
          "Air quality is satisfactory",
          "Outdoor activities are safe",
          "Continue monitoring air quality"
        ],
        causes: "Current pollution control measures are effective",
        impact: "Maintaining these levels will ensure public health safety"
      };
    } else if (aqi <= 100) {
      return {
        status: "Moderate",
        recommendations: [
          "Sensitive individuals should limit prolonged outdoor exposure",
          "Consider indoor activities during peak pollution hours",
          "Keep windows closed during high pollution periods"
        ],
        causes: "Increased vehicular emissions and industrial activities",
        impact: "May lead to respiratory issues for sensitive groups"
      };
    } else if (aqi <= 150) {
      return {
        status: "Unhealthy for Sensitive Groups",
        recommendations: [
          "Avoid prolonged outdoor activities",
          "Wear masks when outdoors",
          "Use air purifiers indoors"
        ],
        causes: "Heavy industrial emissions, vehicle pollution, and construction activities",
        impact: "Increased risk of respiratory diseases and cardiovascular problems"
      };
    }
    return {
      status: "Hazardous",
      recommendations: [
        "Stay indoors",
        "Keep all windows closed",
        "Use air purifiers",
        "Wear N95 masks if outdoors is necessary"
      ],
      causes: "Severe industrial pollution, vehicle emissions, and adverse weather conditions",
      impact: "Serious health risks for all population groups"
    };
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Air Quality Prediction Report - ${location}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Prediction for Year: ${year}`, 20, 30);
    doc.text(`AQI: ${prediction.aqi}`, 20, 40);
    doc.text(`Health Status: ${getHealthRecommendations(prediction.aqi).status}`, 20, 50);
    
    doc.text("Pollutant Levels:", 20, 70);
    doc.text(`NO₂: ${prediction.no2}`, 30, 80);
    doc.text(`O₃: ${prediction.o3}`, 30, 90);
    doc.text(`CO: ${prediction.co}`, 30, 100);
    doc.text(`PM10: ${prediction.pm10}`, 30, 110);
    doc.text(`PM2.5: ${prediction.pm25}`, 30, 120);
    
    const recommendations = getHealthRecommendations(prediction.aqi).recommendations;
    doc.text("Health Recommendations:", 20, 140);
    recommendations.forEach((rec, index) => {
      doc.text(`• ${rec}`, 30, 150 + (index * 10));
    });
    
    doc.save(`aqi-prediction-${location}-${year}.pdf`);
  };

  const shareReport = async () => {
    try {
      await navigator.share({
        title: `AQI Prediction Report - ${location}`,
        text: `Air Quality Prediction for ${location} in ${year}: AQI ${prediction.aqi}`,
        url: window.location.href
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const healthInfo = getHealthRecommendations(prediction.aqi);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Detailed Prediction Report</h3>
          <div className="flex gap-2">
            <Button
              onClick={generatePDF}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              onClick={shareReport}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Weather Conditions</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <ThermometerSun className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="font-medium">28°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="font-medium">65%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-teal-500" />
                <div>
                  <p className="text-sm text-gray-600">Wind Speed</p>
                  <p className="font-medium">12 km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Weather</p>
                  <p className="font-medium">Partly Cloudy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Health Status</h4>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="font-medium text-lg mb-2">{healthInfo.status}</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {healthInfo.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-lg">Impact Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-2">Causes of Change</h5>
              <p className="text-gray-600">{healthInfo.causes}</p>
            </div>
            <div>
              <h5 className="font-medium mb-2">Long-term Impact</h5>
              <p className="text-gray-600">{healthInfo.impact}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PredictionReport;