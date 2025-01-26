import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LocationModal from "@/components/LocationModal";

const locations = [
  { id: "14135", name: "New Malakpet" },
  { id: "14155", name: "Nacharam" },
  { id: "14156", name: "ECIL" },
  { id: "7022", name: "Hyderabad US" },
  { id: "8677", name: "Bahadurpura Zoo Park" },
  { id: "14125", name: "Somajiguda" },
  { id: "8182", name: "Sanathnagar" },
  { id: "14127", name: "Kokapet" },
  { id: "11284", name: "Central University Hyderabad" },
  { id: "11305", name: "Patancheruvu" },
  { id: "9144", name: "IDA Pashamylaram" },
  { id: "14126", name: "IITH Kandi" }
];

const About = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="space-y-4 bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">About Us</h1>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to our Air Quality Monitoring Platform – dedicated to enhancing the quality of life through real-time environmental data. We are focused on providing timely, accurate, and easily accessible air quality insights, empowering citizens, organizations, and policymakers to make informed decisions for a healthier tomorrow.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Our Vision</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                Our vision is to become a leading platform for real-time air quality monitoring in Hyderabad, providing critical insights that drive positive change in urban environments. By offering accurate data from multiple locations, we aim to raise awareness about air pollution and help mitigate its effects.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Our Monitoring Stations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                >
                  <p className="text-gray-800 font-medium">{location.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      
      {selectedLocation && (
        <LocationModal
          location={selectedLocation.name}
          stationId={selectedLocation.id}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default About;
