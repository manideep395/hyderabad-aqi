import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, ThermometerSun, Droplets, Wind, CloudRain, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { jsPDF } from "jspdf";

interface PredictionReportProps {
  prediction: {
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
  };
  year: number;
  month: string;
  timeSlot: string;
  specificTime: string;
  location: string;
}

const PredictionReport: React.FC<PredictionReportProps> = ({ prediction, year, month, timeSlot, specificTime, location }) => {
  const getHealthRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return {
        status: "Good",
        recommendations: [
          "Continue outdoor activities normally",
          "Keep windows open for ventilation",
          "Perfect conditions for exercise",
          "Ideal for sensitive groups to be outdoors"
        ],
        causes: "Effective pollution control and favorable weather conditions",
        impact: "Maintaining these levels ensures optimal public health",
        preventiveMeasures: [
          "Continue supporting green initiatives",
          "Maintain current emission controls",
          "Monitor and report any sudden changes"
        ]
      };
    } else if (aqi <= 100) {
      return {
        status: "Moderate",
        recommendations: [
          "Sensitive individuals should limit prolonged outdoor exposure",
          "Consider indoor activities during peak hours",
          "Keep windows closed during high pollution periods",
          "Use air purifiers if available"
        ],
        causes: "Moderate increase in vehicular emissions and industrial activities",
        impact: "May cause respiratory issues for sensitive groups",
        preventiveMeasures: [
          "Use public transportation when possible",
          "Avoid burning materials outdoors",
          "Regular maintenance of air purification systems"
        ]
      };
    } else if (aqi <= 150) {
      return {
        status: "Unhealthy for Sensitive Groups",
        recommendations: [
          "Avoid prolonged outdoor activities",
          "Wear N95 masks when outdoors",
          "Use air purifiers indoors",
          "Keep all windows closed",
          "Stay updated with local air quality alerts"
        ],
        causes: "High industrial emissions, vehicle pollution, and unfavorable weather",
        impact: "Increased risk of respiratory and cardiovascular issues",
        preventiveMeasures: [
          "Implement stricter emission controls",
          "Increase use of public transportation",
          "Consider work-from-home options",
          "Regular health check-ups"
        ]
      };
    }
    return {
      status: "Hazardous",
      recommendations: [
        "Stay indoors as much as possible",
        "Seal windows and doors",
        "Use air purifiers on maximum setting",
        "Wear N95 masks if outdoors is necessary",
        "Consider temporary relocation if persistent"
      ],
      causes: "Severe industrial pollution, adverse weather conditions, and possible environmental emergencies",
      impact: "Serious health risks for all population groups",
      preventiveMeasures: [
        "Immediate implementation of emergency pollution controls",
        "Restrict non-essential outdoor activities",
        "Enhanced monitoring of vulnerable populations",
        "Emergency healthcare preparedness"
      ]
    };
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Air Quality Prediction Report - ${location}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Prediction for ${month} ${year}`, 20, 30);
    doc.text(`Time: ${specificTime} (${timeSlot})`, 20, 40);
    
    doc.text("Current vs Predicted Values:", 20, 60);
    doc.text(`AQI: ${prediction.current.aqi} → ${prediction.predicted.aqi}`, 30, 70);
    doc.text(`NO₂: ${prediction.current.no2} → ${prediction.predicted.no2}`, 30, 80);
    doc.text(`O₃: ${prediction.current.o3} → ${prediction.predicted.o3}`, 30, 90);
    doc.text(`CO: ${prediction.current.co} → ${prediction.predicted.co}`, 30, 100);
    doc.text(`PM10: ${prediction.current.pm10} → ${prediction.predicted.pm10}`, 30, 110);
    doc.text(`PM2.5: ${prediction.current.pm25} → ${prediction.predicted.pm25}`, 30, 120);
    
    const healthInfo = getHealthRecommendations(prediction.predicted.aqi);
    doc.text("Health Status:", 20, 140);
    doc.text(healthInfo.status, 30, 150);
    
    doc.text("Recommendations:", 20, 170);
    healthInfo.recommendations.forEach((rec, index) => {
      doc.text(`• ${rec}`, 30, 180 + (index * 10));
    });
    
    doc.save(`aqi-prediction-${location}-${month}-${year}.pdf`);
  };

  const shareReport = async () => {
    try {
      await navigator.share({
        title: `AQI Prediction Report - ${location}`,
        text: `Air Quality Prediction for ${location} in ${month} ${year}: Current AQI ${prediction.current.aqi} → Predicted AQI ${prediction.predicted.aqi}`,
        url: window.location.href
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const healthInfo = getHealthRecommendations(prediction.predicted.aqi);
  const getChangeIndicator = (current: number, predicted: number) => {
    const diff = predicted - current;
    const percentage = ((diff / current) * 100).toFixed(1);
    return {
      icon: diff > 0 ? ArrowUpRight : ArrowDownRight,
      color: diff > 0 ? "text-red-500" : "text-green-500",
      value: `${Math.abs(Number(percentage))}%`
    };
  };

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
            <h4 className="font-semibold text-lg">Current vs Predicted Values</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(prediction.current).map(([key, currentValue]) => {
                const predictedValue = prediction.predicted[key as keyof typeof prediction.predicted];
                const change = getChangeIndicator(currentValue, predictedValue);
                const ChangeIcon = change.icon;
                
                return (
                  <div key={key} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 uppercase">{key}</span>
                      <ChangeIcon className={`w-4 h-4 ${change.color}`} />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold">{currentValue}</span>
                      <span className="text-lg text-gray-500">→</span>
                      <span className="text-2xl font-bold">{predictedValue}</span>
                    </div>
                    <span className={`text-sm ${change.color}`}>{change.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

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
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-lg">Health Status & Recommendations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-gray-50">
              <h5 className="font-medium mb-2">Status</h5>
              <p className="text-lg font-semibold mb-2">{healthInfo.status}</p>
              <div className="space-y-2">
                {healthInfo.recommendations.map((rec, index) => (
                  <p key={index} className="text-sm text-gray-600">• {rec}</p>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Causes of Change</h5>
                <p className="text-sm text-gray-600">{healthInfo.causes}</p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Preventive Measures</h5>
                <div className="space-y-1">
                  {healthInfo.preventiveMeasures.map((measure, index) => (
                    <p key={index} className="text-sm text-gray-600">• {measure}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PredictionReport;